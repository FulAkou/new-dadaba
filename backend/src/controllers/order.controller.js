import { randomUUID } from "crypto";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "../lib/db.js";
import {
  sendOrderConfirmedNotificationToAdmins,
  sendOrderNotificationToAdmins,
} from "../lib/mailer.js";
import {
  dishes,
  notifications,
  orderItems,
  orders,
  users,
} from "../lib/schema.js";

const generateSecretCode = () => {
  return `FF-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;
};

export const getMyOrders = async (req, res, next) => {
  req.query.userId = req.user.id;
  return getOrders(req, res, next);
};

export const getOrders = async (req, res, next) => {
  try {
    const { userId, status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};

    // Regular users can only see their own orders
    if (req.user.role === "USER") {
      where.userId = req.user.id;
    } else if (userId) {
      where.userId = userId;
    }

    if (status) where.status = status;

    const whereClause =
      Object.keys(where).length > 0
        ? and(
            ...Object.entries(where).map(([key, value]) =>
              eq(orders[key], value)
            )
          )
        : undefined;

    const [ordersResult, countResult] = await Promise.all([
      db.query.orders.findMany({
        where: whereClause,
        offset: parseInt(skip),
        limit: parseInt(limit),
        orderBy: desc(orders.createdAt),
        with: {
          user: {
            columns: { id: true, name: true, email: true },
          },
          items: {
            with: {
              dish: {
                columns: {
                  id: true,
                  name: true,
                  imageUrl: true,
                  price: true,
                },
              },
            },
          },
        },
      }),
      db
        .select({ count: sql`count(*)::int` })
        .from(orders)
        .where(whereClause),
    ]);

    const total = countResult?.[0]?.count || 0;

    res.json({
      orders: ordersResult,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        user: { columns: { id: true, name: true, email: true } },
        items: {
          with: {
            dish: {
              columns: { id: true, name: true, imageUrl: true, price: true },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    // Regular users can only see their own orders
    if (req.user.role === "USER" && order.userId !== req.user.id) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrderBySecretCode = async (req, res, next) => {
  try {
    const { secretCode } = req.params;

    const order = await db.query.orders.findFirst({
      where: eq(orders.secretCode, secretCode),
      with: {
        user: { columns: { id: true, name: true, email: true } },
        items: {
          with: {
            dish: {
              columns: { id: true, name: true, imageUrl: true, price: true },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      seats,
      paymentMethod,
      deliveryName,
      deliveryPhone,
      deliveryLocation,
    } = req.body;
    const userId = req.user.id;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Au moins un article est requis" });
    }

    // Validate delivery details
    if (!deliveryName || !deliveryPhone || !deliveryLocation) {
      return res
        .status(400)
        .json({ error: "Nom, numéro et lieu de livraison requis" });
    }

    // Fetch dishes and calculate total
    const dishIds = items.map((item) => item.dishId);
    const dishesDb = await db
      .select()
      .from(dishes)
      .where(inArray(dishes.id, dishIds));

    if (dishesDb.length !== dishIds.length) {
      return res
        .status(400)
        .json({ error: "Un ou plusieurs plats sont invalides" });
    }

    let total = 0;
    const orderItemsData = items.map((item) => {
      const dish = dishesDb.find((d) => d.id === item.dishId);
      const itemTotal = dish.price * item.quantity;
      total += itemTotal;

      return {
        dishId: item.dishId,
        quantity: item.quantity,
        price: dish.price,
      };
    });

    // Generate unique secret code
    let secretCode = generateSecretCode();
    let codeExists = await db.query.orders.findFirst({
      where: eq(orders.secretCode, secretCode),
    });

    // Ensure uniqueness
    while (codeExists) {
      secretCode = generateSecretCode();
      codeExists = await db.query.orders.findFirst({
        where: eq(orders.secretCode, secretCode),
      });
    }

    // Create order
    const orderId = randomUUID();
    await db.insert(orders).values({
      id: orderId,
      userId,
      secretCode,
      total,
      seats: seats || 1,
      paymentMethod,
      status: "PENDING",
      deliveryName,
      deliveryPhone,
      deliveryLocation,
    });

    await db.insert(orderItems).values(
      orderItemsData.map((item) => ({
        id: randomUUID(),
        orderId,
        dishId: item.dishId,
        quantity: item.quantity,
        price: item.price,
      }))
    );

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        user: {
          columns: { id: true, name: true, email: true },
        },
        items: {
          with: {
            dish: {
              columns: { id: true, name: true, imageUrl: true, price: true },
            },
          },
        },
      },
    });

    // Create notifications for admins so they are informed of the new order
    try {
      const admins = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
        })
        .from(users)
        .where(inArray(users.role, ["ADMIN", "SUPER_ADMIN"]));

      if (admins.length) {
        // Create and emit notifications per admin so the emitted object contains the DB `id`
        try {
          const { emitNotificationToAdmins } = await import("../lib/socket.js");
          for (const a of admins) {
            const [notif] = await db
              .insert(notifications)
              .values({
                id: randomUUID(),
                userId: a.id,
                type: "ORDER_CREATED",
                title: "Nouvelle commande",
                message: `Nouvelle commande ${order.secretCode} par ${order.user.name}`,
                orderId: order.id,
              })
              .returning();

            // Emit the created notification (contains id, timestamps)
            try {
              emitNotificationToAdmins(notif);
            } catch (emitErr) {
              console.error("Failed to emit notification to admins:", emitErr);
            }
          }
        } catch (errNotif) {
          // Don't block order creation if notification fails
          console.error(
            "Failed to create/emit notifications for admins:",
            errNotif
          );
        }

        // Send email notifications to admins (best-effort)
        try {
          await sendOrderNotificationToAdmins(order);
        } catch (mailErr) {
          console.error(
            "Failed to send email notifications to admins:",
            mailErr
          );
        }
      }
    } catch (err) {
      // Don't block order creation if notification fails
      console.error("Failed to create notifications for admins:", err);
    }

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const confirmOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the order
    const existingOrder = await db.query.orders.findFirst({
      where: eq(orders.id, id),
    });

    if (!existingOrder) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    // Only the order owner can confirm their order
    if (req.user.id !== existingOrder.userId) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    // Only pending orders can be confirmed by the user
    if (existingOrder.status !== "PENDING") {
      return res
        .status(400)
        .json({ error: "La commande ne peut pas être confirmée" });
    }

    await db
      .update(orders)
      .set({ status: "CONFIRMED" })
      .where(eq(orders.id, id));

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        user: { columns: { id: true, name: true, email: true } },
        items: {
          with: {
            dish: {
              columns: { id: true, name: true, imageUrl: true, price: true },
            },
          },
        },
      },
    });

    // Notify admins (DB + socket + email)
    try {
      const admins = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
        })
        .from(users)
        .where(inArray(users.role, ["ADMIN", "SUPER_ADMIN"]));

      if (admins.length) {
        try {
          const { emitNotificationToAdmins } = await import("../lib/socket.js");

          for (const a of admins) {
            const [notif] = await db
              .insert(notifications)
              .values({
                id: randomUUID(),
                userId: a.id,
                type: "ORDER_CONFIRMED",
                title: "Commande confirmée",
                message: `Commande ${order.secretCode} confirmée par ${order.user.name}`,
                orderId: order.id,
              })
              .returning();

            try {
              emitNotificationToAdmins(notif);
            } catch (emitErr) {
              console.error("Failed to emit notification to admins:", emitErr);
            }
          }
        } catch (errNotif) {
          console.error(
            "Failed to create/emit order confirmed notifications:",
            errNotif
          );
        }

        // Send email notifications to admins (best-effort)
        try {
          await sendOrderConfirmedNotificationToAdmins(order);
        } catch (mailErr) {
          console.error(
            "Failed to send order-confirmed email notifications to admins:",
            mailErr
          );
        }
      }
    } catch (err) {
      console.error("Failed to notify admins for order confirmation:", err);
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if order exists
    const existingOrder = await db.query.orders.findFirst({
      where: eq(orders.id, id),
    });

    if (!existingOrder) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    // Only admins and staff can update order status
    if (
      req.user.role !== "ADMIN" &&
      req.user.role !== "SUPER_ADMIN" &&
      req.user.role !== "STAFF"
    ) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    await db
      .update(orders)
      .set({ ...(status && { status }) })
      .where(eq(orders.id, id));

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        user: {
          columns: { id: true, name: true, email: true },
        },
        items: {
          with: {
            dish: {
              columns: {
                id: true,
                name: true,
                imageUrl: true,
                price: true,
              },
            },
          },
        },
      },
    });

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
    });

    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    // Only admins can delete orders
    if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ error: "Accès refusé" });
    }

    await db.delete(orders).where(eq(orders.id, id));

    res.json({ message: "Commande supprimée avec succès" });
  } catch (error) {
    next(error);
  }
};
