import kue from 'kue';
import createPushNotificationsJobs from "./8-job";

createPushNotificationsJobs
const queue = kue.createQueue();

queue.testMode