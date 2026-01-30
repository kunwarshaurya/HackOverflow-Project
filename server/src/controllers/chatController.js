const Message = require('../models/Message');
const Event = require('../models/Event');


exports.sendMessage = async (req, res) => {
  try {
    const { content, eventId, clubId } = req.body;

    if (!content || (!eventId && !clubId)) {
      return res.status(400).json({ message: 'Message must have content and a target' });
    }

 //Security
    if (eventId) {
      const event = await Event.findById(eventId);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

  
      if (new Date() > new Date(event.endTime)) {
        return res.status(403).json({ 
          message: 'This event has ended. Chat is now Read-Only.' 
        });
      }
    }
 

    const message = await Message.create({
      sender: req.user.id,
      content,
      event: eventId || null,
      club: clubId || null
    });

    await message.populate('sender', 'name role');

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getEventMessages = async (req, res) => {
  try {
    const messages = await Message.find({ event: req.params.eventId })
      .populate('sender', 'name role') 
      .sort({ createdAt: 1 }); 

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getClubMessages = async (req, res) => {
  try {
    const messages = await Message.find({ club: req.params.clubId })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};