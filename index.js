// requirements
const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const _ = require('lodash');

// local requirements
const constants = require('./constants');

// setup express, body-parser, and dotenv
const app = express();
app.use(bodyParser.json());

app.listen(3000, () => {
    console.log("Server is listening on port 3000...");
});

// enviroment variables
dotenv.config()
const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;
const superSpecialKey = process.env.SUPER_SPECIAL_KEY;

// setup push notification service
webpush.setVapidDetails('mailto:contact@doyourchores.com', 
                        publicVapidKey, 
                        privateVapidKey);


// temporary subscriptions variable (will use database in future)
let subscriptions = [];

// setup static client site
app.use(express.static(path.join(__dirname, 'static')))
// use ejs view engine to render example site
app.set('view engine','ejs')

// default route
app.get("/", (req, res) => {
    res.render("index");
});

// subscribe route
app.post('/subscribe', (req, res) => {
    // subscription object
    const subscription = JSON.stringify(req.body);
    let payload;

    // if our subscription is already there, return message DB_TODO
    if (_.includes(subscriptions, subscription)) {
        payload = constants.messages.SUBSCRIPTION_ALREADY_STORED;
    } else {
        // otherwise update subscriptions with subscriber DB_TODO
        subscriptions.push(subscription);
        payload = constants.messages.SUBSCRIPTION_STORED;
    }
    res.send(payload);
});

// example push route
app.post('/push', (req, res, next) => {
    // form the message
    
    const notificationMessage = req.body.notificationMessage;
    const notificationTitle = req.body.notificationTitle;
    const notificationLink = req.body.notificationLink;
    const clientPushKey = req.body.pushKey;

    // loop through and notify all device subscriptions in subscriptions array
    if (subscriptions.length && clientPushKey == superSpecialKey) {
        subscriptions.map((subscription, index) => {
            let subJson = JSON.parse(subscription);
            webpush.sendNotification(subJson, JSON.stringify({
                notificationMessage: notificationMessage,
                notificationTitle: notificationTitle,
                notificationLink: notificationLink
            }))
            .then((success) => handleSuccess(success, index))
            .catch((error) => handleError(error, index));
        });
    } else {
        res.send(constants.messages.NO_SUBSCRIBERS_MESSAGE);
    }

    function handleSuccess(success, index) {
        res.send(constants.messages.SINGLE_PUBLISH_SUCCESS_MESSAGE);
    }

    function handleError(error, index) {
        console.log('Push send error: ', error);
    }

});

