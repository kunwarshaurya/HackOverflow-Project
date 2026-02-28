const Notification = require('../models/Notification');

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 });
    res.render('notifications/index', { title: 'Notifications', notifications, user: req.user });
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.redirect('/dashboard');
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.redirect('/notifications'); // Item not found
    }

    // Security Check: Ensure only the recipient can mark it read
    if (notification.recipient.toString() !== req.user.id) {
      return res.redirect('/notifications'); // Not authorized
    }

    notification.isRead = true;
    await notification.save();

    res.redirect('/notifications');
  } catch (error) {
    console.error('Error marking notification read:', error.message);
    res.redirect('/notifications');
  }
};