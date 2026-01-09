import { query } from "../db/postgres.js";

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await query("SELECT * FROM notifications WHERE recipient_id = $1 ORDER BY created_at DESC", [userId]);

    res.status(200).json({ success: true, notifications: result.rows });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  const recipientId = req.params.id;

  try {
    const result = await query(`
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE recipient_id = $1 AND is_read = FALSE
    `, [recipientId]);

    res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
      modifiedCount: result.rowCount,
    });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read.",
      error: error.message,
    });
  }
};

export const markSingleNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const result = await query(`
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE id = $1
      RETURNING *
    `, [notificationId]);

    const updated = result.rows[0];

    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Marked as read", notification: updated });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server error" });
  }
};