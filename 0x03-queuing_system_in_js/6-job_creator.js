import kue from 'kue';

const objectData = {
  phoneNumber: '+234801234567',
  message: 'Na testing we dey do o',
};

const queue = kue.createQueue();

const job = queue.create('push_notification_code', objectData).save();

job.on('enqueue', () => {
  console.log(`Notification job created: ${job.id}`);
}).on('complete', () => {
  console.log('Notification job completed');
}).on('failed', () => {
  console.log('Notification job failed');
});
