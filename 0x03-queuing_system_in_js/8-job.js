const createPushNotificationsJobs = (jobs, queue) => {
  if (!(jobs instanceof Array)) {
    throw new Error('Jobs is not an array');
  }
  jobs.forEach((objectData) => {
    const job = queue.create('push_notification_code_3', objectData).save();

    job.on('enqueue', () => {
      console.log(`Notification job created: ${job.id}`);
    }).on('complete', () => {
      console.log(`Notification job ${job.id} completed`);
    }).on('failed', (error) => {
      console.log(`Notification job ${job.id} failed: ${error}`);
    }).on('progress', (progress) => {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });
  });
};

export default createPushNotificationsJobs;
