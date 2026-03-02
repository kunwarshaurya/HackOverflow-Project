const Notification = require('../models/Notification');

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.render('notifications/index', {
      title: 'Notifications',
      notifications,
      unreadCount,
      user: req.user
    });
  } catch (error) {
    res.redirect('/dashboard');
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.redirect('/notifications');
    }

    // Security Check: Ensure only the recipient can mark it read
    if (notification.recipient.toString() !== req.user.id) {
      return res.redirect('/notifications');
    }

    notification.isRead = true;
    await notification.save();

    res.redirect('/notifications');
  } catch (error) {
    res.redirect('/notifications');
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    res.redirect('/notifications');
  } catch (error) {
    res.redirect('/notifications');
  }
};