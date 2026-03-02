// src/jobs/scheduledJobs.js

const cron = require('node-cron');
const Event = require('../models/Event');
const notificationService = require('../services/notificationService');

/**
 * Auto-complete past approved events.
 * Runs every hour.
 */
async function autoCompleteEvents() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Start of today

    const result = await Event.updateMany(
        {
            status: 'approved',
            date: { $lt: currentDate }
        },
        {
            $set: { status: 'completed' }
        }
    );

    return result;
}

/**
 * Format minutes-from-midnight to HH:MM string.
 */
function formatTime(minutes) {
    if (minutes == null || isNaN(minutes)) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Send reminders for events happening tomorrow.
 * Only sends once per event (checks reminderSent flag).
 * Runs every hour.
 */
async function sendEventReminders() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Set to start and end of tomorrow
    const startOfTomorrow = new Date(tomorrow);
    startOfTomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    // Find tomorrow's approved events that haven't been reminded yet
    const events = await Event.find({
        status: 'approved',
        date: { $gte: startOfTomorrow, $lte: endOfTomorrow },
        reminderSent: { $ne: true },
        attendees: { $exists: true, $ne: [] }
    }).select('name attendees startTime reminderSent');

    let totalReminders = 0;

    for (const event of events) {
        const timeStr = formatTime(event.startTime);
        const count = await notificationService.notifyEventReminders(event, timeStr);
        totalReminders += count;

        // Mark as reminded to avoid duplicates
        event.reminderSent = true;
        await event.save();
    }

    return { eventsProcessed: events.length, remindersSent: totalReminders };
}

function startScheduledJobs() {
    // Auto-complete past events — every hour at :00
    cron.schedule('0 * * * *', async () => {
        try {
            const result = await autoCompleteEvents();
            if (result.modifiedCount > 0) {
                process.stdout.write(`[CRON] Auto-completed ${result.modifiedCount} event(s)\n`);
            }
        } catch (err) {
            process.stderr.write(`[CRON] Error auto-completing events: ${err.message}\n`);
        }
    });

    // Event reminders — every hour at :05
    cron.schedule('5 * * * *', async () => {
        try {
            const result = await sendEventReminders();
            if (result.remindersSent > 0) {
                process.stdout.write(`[CRON] Sent ${result.remindersSent} reminder(s) for ${result.eventsProcessed} event(s)\n`);
            }
        } catch (err) {
            process.stderr.write(`[CRON] Error sending reminders: ${err.message}\n`);
        }
    });

    process.stdout.write('[CRON] Scheduled jobs started (auto-complete hourly, reminders hourly)\n');

    // Run auto-complete once immediately on startup
    autoCompleteEvents().catch((err) => {
        process.stderr.write(`[CRON] Initial auto-complete failed: ${err.message}\n`);
    });
}

module.exports = { startScheduledJobs };
