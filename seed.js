const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const User = require("./src/models/user");
const Club = require("./src/models/Club");
const Event = require("./src/models/Event");
const Venue = require("./src/models/Venue");
const Equipment = require("./src/models/Equipment");
const EquipmentBooking = require("./src/models/EquipmentBooking");
const Message = require("./src/models/Message");
const Notification = require("./src/models/Notification");

mongoose.connect("mongodb://127.0.0.1:27017/hackoverflow")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const seed = async () => {
  await Promise.all([
    User.deleteMany({}),
    Club.deleteMany({}),
    Event.deleteMany({}),
    Venue.deleteMany({}),
    Equipment.deleteMany({}),
    EquipmentBooking.deleteMany({}),
    Message.deleteMany({}),
    Notification.deleteMany({})
  ]);

  console.log("Old data cleared");

  // ======================
  // USERS (50)
  // ======================
  const users = [];

  for (let i = 0; i < 50; i++) {
    const user = await User.create({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: "123456", // auto hashed via pre-save
      role: i === 0 ? "admin" : (i < 10 ? "club_lead" : "student"),
      department: faker.helpers.arrayElement(["CSE", "IT", "ECE", "ME"]),
      year: faker.helpers.arrayElement(["1st", "2nd", "3rd", "4th"])
    });
    users.push(user);
  }

  console.log("50 Users created");

  // ======================
  // VENUES (50)
  // ======================
  const venues = [];

  for (let i = 0; i < 50; i++) {
    const venue = await Venue.create({
      name: `Venue-${i}`,
      location: faker.location.streetAddress(),
      capacity: faker.number.int({ min: 50, max: 500 }),
      resources: ["Projector", "Sound System", "AC"]
    });
    venues.push(venue);
  }

  console.log("50 Venues created");

  // ======================
  // EQUIPMENT (50)
  // ======================
  const equipments = [];

  for (let i = 0; i < 50; i++) {
    const equipment = await Equipment.create({
      name: `Equipment-${i}`,
      category: faker.helpers.arrayElement(["Electronics", "Furniture", "Sports"]),
      totalQuantity: faker.number.int({ min: 1, max: 20 }),
      description: faker.lorem.sentence()
    });
    equipments.push(equipment);
  }

  console.log("50 Equipment created");

  // ======================
  // CLUBS (50)
  // ======================
  const clubs = [];

  for (let i = 0; i < 50; i++) {
    const randomMembers = faker.helpers.arrayElements(users, 5);

    const club = await Club.create({
      name: `Club-${i}`,
      description: faker.lorem.paragraph(),
      admin: users[i % 10]._id, // first 10 are club_leads
      members: randomMembers.map(u => u._id)
    });

    clubs.push(club);
  }

  console.log("50 Clubs created");

  // ======================
  // EVENTS (50)
  // ======================
  const events = [];

  for (let i = 0; i < 50; i++) {
    const event = await Event.create({
      name: faker.company.catchPhrase(),
      description: faker.lorem.paragraph(),
      organizer: users[1]._id,
      club: faker.helpers.arrayElement(clubs)._id,
      venue: faker.helpers.arrayElement(venues)._id,
      date: faker.date.soon(),
      startTime: 600,
      endTime: 900,
      budget: faker.number.int({ min: 1000, max: 10000 }),
      capacity: faker.number.int({ min: 10, max: 200 }),
      status: faker.helpers.arrayElement(["pending", "approved", "completed"])
    });

    events.push(event);
  }

  console.log("50 Events created");

  // ======================
  // EQUIPMENT BOOKINGS (50)
  // ======================
  for (let i = 0; i < 50; i++) {
    await EquipmentBooking.create({
      equipment: faker.helpers.arrayElement(equipments)._id,
      event: faker.helpers.arrayElement(events)._id,
      bookedBy: faker.helpers.arrayElement(users)._id,
      date: faker.date.soon(),
      startTime: 600,
      endTime: 900,
      quantity: faker.number.int({ min: 1, max: 3 }),
      status: faker.helpers.arrayElement(["pending", "approved", "rejected"])
    });
  }

  console.log("50 EquipmentBookings created");

  // ======================
  // MESSAGES (50)
  // ======================
  for (let i = 0; i < 50; i++) {
    await Message.create({
      sender: faker.helpers.arrayElement(users)._id,
      content: faker.lorem.sentence(),
      event: faker.helpers.arrayElement(events)._id
    });
  }

  console.log("50 Messages created");

  // ======================
  // NOTIFICATIONS (50)
  // ======================
  for (let i = 0; i < 50; i++) {
    await Notification.create({
      recipient: faker.helpers.arrayElement(users)._id,
      message: faker.lorem.sentence(),
      type: faker.helpers.arrayElement(["info", "success", "warning", "error"]),
      relatedEvent: faker.helpers.arrayElement(events)._id,
      category: faker.helpers.arrayElement([
        "EVENT_CREATED",
        "EVENT_APPROVED",
        "BOOKING_CREATED",
        "GENERAL"
      ])
    });
  }

  console.log("50 Notifications created");

  console.log("🔥 DATABASE SEEDED WITH 50 RECORDS EACH 🔥");
};

seed().then(() => mongoose.connection.close());