import {messaging} from "firebase-admin";
import {cert, initializeApp} from "firebase-admin/app";
import path from 'path';

initializeApp({
  credential: cert(path.join(__dirname, '../../hpu-notify-firebase-adminsdk.json')),
})

export interface IPushNotificacion {
  data: {
    title: string,
    message: string
  },
  token: string
}

const notification_options = {
  priority: "high",
  timeToLive: 60 * 60 * 24
};

export const sendMessage = async (messages: IPushNotificacion) => {
  await messaging().send(messages)
    .then(response => {
      console.log(`Successfully sent notification`)
      console.log(response)
    })
    .catch(err => {
      console.log('Notification could not be sent ')
      console.log(err)
    })
}
