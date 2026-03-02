// src/controllers/activityController.js

const activityService = require('../services/activityService');

exports.getActivityFeed = async (req, res) => {
    try {
        const activities = await activityService.getActivityFeed(req.user, 20);

        res.render('activity/index', {
            title: 'Activity Feed',
            activities,
            user: req.user
        });
    } catch (err) {
        console.error('[ActivityController] error:', err.message);
        res.redirect('/dashboard');
    }
};
