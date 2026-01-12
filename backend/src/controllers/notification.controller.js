import { eq, desc } from "drizzle-orm";
import { db } from "../lib/db.js";
import { notifications } from "../lib/schema.js";

export const getNotifications = async (req, res, next) => {
  try {
    const rows = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, req.user.id))
      .orderBy(desc(notifications.createdAt));

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notificationRows = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, id))
      .limit(1);

    const notif = notificationRows[0];
    if (!notif || notif.userId !== req.user.id) {
      return res.status(404).json({ error: "Notification non trouvée" });
    }

    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id));

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
