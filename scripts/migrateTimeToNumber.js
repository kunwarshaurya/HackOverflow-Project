/**
 * Migration Script: Convert Event startTime/endTime from String to Number
 *
 * This script converts existing events that have HH:MM string times
 * to minutes-from-midnight integers.
 *
 * Usage: node scripts/migrateTimeToNumber.js
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    process.stderr.write('MONGO_URI not found in .env\n');
    process.exit(1);
}

function timeStringToMinutes(timeStr) {
    if (typeof timeStr === 'number') return timeStr;
    if (typeof timeStr !== 'string') return null;

    const parts = timeStr.trim().split(':');
    if (parts.length !== 2) return null;

    const hours = parseInt(parts[0], 10);
    const mins = parseInt(parts[1], 10);

    if (isNaN(hours) || isNaN(mins)) return null;
    if (hours < 0 || hours > 23 || mins < 0 || mins > 59) return null;

    return hours * 60 + mins;
}

async function migrate() {
    await mongoose.connect(MONGO_URI);
    process.stdout.write('Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const collection = db.collection('events');

    const events = await collection.find({}).toArray();
    process.stdout.write(`Found ${events.length} event(s) to check\n`);

    let migrated = 0;
    let skipped = 0;
    let failed = 0;

    for (const event of events) {
        const startIsString = typeof event.startTime === 'string';
        const endIsString = typeof event.endTime === 'string';

        if (!startIsString && !endIsString) {
            skipped++;
            continue;
        }

        const startMinutes = timeStringToMinutes(event.startTime);
        const endMinutes = timeStringToMinutes(event.endTime);

        if (startMinutes === null || endMinutes === null) {
            process.stderr.write(
                `FAILED: Event "${event.name}" (${event._id}) — could not parse startTime="${event.startTime}" endTime="${event.endTime}"\n`
            );
            failed++;
            continue;
        }

        await collection.updateOne(
            { _id: event._id },
            { $set: { startTime: startMinutes, endTime: endMinutes } }
        );

        process.stdout.write(
            `MIGRATED: "${event.name}" — ${event.startTime} → ${startMinutes}, ${event.endTime} → ${endMinutes}\n`
        );
        migrated++;
    }

    process.stdout.write(`\nMigration complete: ${migrated} migrated, ${skipped} already numeric, ${failed} failed\n`);

    await mongoose.disconnect();
    process.exit(failed > 0 ? 1 : 0);
}

migrate().catch((err) => {
    process.stderr.write(`Migration error: ${err.message}\n`);
    process.exit(1);
});
