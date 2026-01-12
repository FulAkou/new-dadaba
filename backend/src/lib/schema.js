import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  doublePrecision,
  pgEnum,
  smallint,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("Role", ["USER", "STAFF", "ADMIN", "SUPER_ADMIN"]);
export const reviewStatusEnum = pgEnum("ReviewStatus", ["PENDING", "APPROVED", "REJECTED"]);
export const orderStatusEnum = pgEnum("OrderStatus", [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
]);
export const notificationTypeEnum = pgEnum("NotificationType", [
  "ORDER_CREATED",
  "ORDER_CONFIRMED",
  "ORDER_UPDATED",
  "GENERIC",
]);

export const users = pgTable("User", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  telephone: text("telephone").notNull().unique(),
  role: roleEnum("role").default("USER").notNull(),
  emailConfirmed: boolean("emailConfirmed").default(false).notNull(),
  confirmationToken: text("confirmationToken"),
  confirmationTokenExpires: timestamp("confirmationTokenExpires"),
  resetToken: text("resetToken"),
  resetTokenExpires: timestamp("resetTokenExpires"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const dishes = pgTable("Dish", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("imageUrl").notNull(),
  price: doublePrecision("price").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  userId: text("userId"),
});

export const reviews = pgTable("Review", {
  id: text("id").primaryKey(),
  rating: smallint("rating").notNull(),
  comment: text("comment").notNull(),
  status: reviewStatusEnum("status").default("PENDING").notNull(),
  featured: boolean("featured").default(false).notNull(),
  likes: integer("likes").default(0).notNull(),
  dislikes: integer("dislikes").default(0).notNull(),
  userId: text("userId").notNull(),
  dishId: text("dishId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const reviewReplies = pgTable("ReviewReply", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  reviewId: text("reviewId").notNull(),
  userId: text("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const orders = pgTable("Order", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  secretCode: text("secretCode").notNull().unique(),
  total: doublePrecision("total").notNull(),
  seats: integer("seats").default(1).notNull(),
  status: orderStatusEnum("status").default("PENDING").notNull(),
  paymentMethod: text("paymentMethod"),
  deliveryName: text("deliveryName"),
  deliveryPhone: text("deliveryPhone"),
  deliveryLocation: text("deliveryLocation"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const orderItems = pgTable("OrderItem", {
  id: text("id").primaryKey(),
  orderId: text("orderId").notNull(),
  dishId: text("dishId").notNull(),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
});

export const notifications = pgTable("Notification", {
  id: text("id").primaryKey(),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  userId: text("userId").notNull(),
  orderId: text("orderId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const jobApplications = pgTable("JobApplication", {
  id: text("id").primaryKey(),
  lastName: text("lastName").notNull(),
  firstName: text("firstName").notNull(),
  email: text("email").notNull(),
  telephone: text("telephone"),
  cvUrl: text("cvUrl").notNull(),
  position: text("position").default("Chef Cuisinier").notNull(),
  message: text("message"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  dishes: many(dishes),
  reviews: many(reviews),
  orders: many(orders),
  reviewReplies: many(reviewReplies),
  notifications: many(notifications),
}));

export const dishesRelations = relations(dishes, ({ one, many }) => ({
  user: one(users, { fields: [dishes.userId], references: [users.id] }),
  reviews: many(reviews),
  items: many(orderItems),
}));

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  dish: one(dishes, { fields: [reviews.dishId], references: [dishes.id] }),
  replies: many(reviewReplies),
}));

export const reviewRepliesRelations = relations(reviewReplies, ({ one }) => ({
  review: one(reviews, { fields: [reviewReplies.reviewId], references: [reviews.id] }),
  user: one(users, { fields: [reviewReplies.userId], references: [users.id] }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
  notifications: many(notifications),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  dish: one(dishes, { fields: [orderItems.dishId], references: [dishes.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
  order: one(orders, { fields: [notifications.orderId], references: [orders.id] }),
}));

