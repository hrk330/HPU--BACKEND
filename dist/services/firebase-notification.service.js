"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const tslib_1 = require("tslib");
const firebase_admin_1 = require("firebase-admin");
const app_1 = require("firebase-admin/app");
const path_1 = tslib_1.__importDefault(require("path"));
(0, app_1.initializeApp)({
    credential: (0, app_1.cert)(path_1.default.join(__dirname, '../../hpu-notify-firebase-adminsdk.json')),
});
const notification_options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24,
};
const sendMessage = async (messages) => {
    console.log(messages);
    try {
        (0, firebase_admin_1.messaging)()
            .send(messages)
            .then(response => {
            console.log(`Successfully sent notification`);
            console.log(response);
        })
            .catch(err => {
            console.log('Notification could not be sent ');
            console.log(err);
        });
    }
    catch (e) {
        console.log(e.message);
    }
};
exports.sendMessage = sendMessage;
//# sourceMappingURL=firebase-notification.service.js.map