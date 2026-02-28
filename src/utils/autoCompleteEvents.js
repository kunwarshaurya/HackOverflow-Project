const Event = require('../models/Event');

async function autoCompleteEvents() {
  const currentDate = new Date();

  await Event.updateMany(
    {
      status: 'approved',
      date: { $lt: currentDate }
    },
    {
      $set: { status: 'completed' }
    }
  );
}

module.exports = autoCompleteEvents;