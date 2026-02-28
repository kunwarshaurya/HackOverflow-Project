const Message = require('../models/Message');
const Event = require('../models/Event');


exports.sendMessage = async (req, res) => {
  try {
    console.log("REQ USER:", req.user);
    console.log("SESSION USER:", req.session.user);

    const { content, eventId, clubId } = req.body;

    if (!content || (!eventId && !clubId)) {
      return res.json({ success: false });
    }

    await Message.create({
      sender: req.session.user._id,
      content,
      event: eventId || null,
      club: clubId || null
    });

    return res.json({ success: true });

  } catch (error) {
    console.error("MESSAGE ERROR:", error);
    return res.json({ success: false });
  }
};
exports.getEventMessages = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    // 1️⃣ Fetch event
    const event = await Event.findById(eventId)
      .populate('club')
      .populate('organizer')
      .populate('venue');

    if (!event) {
      return res.redirect('/student/dashboard');
    }

    // 2️⃣ Fetch messages
    const messages = await Message.find({ event: eventId })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 });

    // 3️⃣ Render and PASS event
    res.render('chat/event-chat', {
      title: `${event.name} Chat`,
      messages,
      event,
      user: req.user
    });

  } catch (error) {
    console.error('Error getting event messages:', error.message);
    res.redirect('/student/dashboard');
  }
};


exports.getClubMessages = async (req, res) => {
  try {
    const messages = await Message.find({ club: req.params.clubId })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 });

    res.render('chat/club-chat', { title: 'Club Chat', messages, clubId: req.params.clubId, user: req.user });
  } catch (error) {
    console.error('Error getting club messages:', error.message);
    res.redirect('/dashboard');
  }
};