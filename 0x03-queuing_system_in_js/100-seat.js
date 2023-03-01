import express from 'express';
import { promisify } from 'util';
import redis from 'redis';
import kue from 'kue';

const queue = kue.createQueue();

const app = express();
const port = 1245;
const client = redis.createClient();
app.listen(port, () => console.log(`Server listening on port ${port}`));
let reservationEnabled;

function reserveSeat(number) {
  client.set('available_seats', number);
}

client.on('error', (err) => console.log('Redis client not connected to the server:', err))
  .on('connect', () => {
    console.log('Redis client connected to the server');
    reserveSeat(20);
    reservationEnabled = true;
  });
const redisGet = promisify(client.get).bind(client);

async function getCurrentAvailableSeats() {
  const availableSeats = await redisGet('available_seats');
  return availableSeats;
}

app.get('/available_seats', async (req, res) => {
  const availableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: availableSeats });
});

app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
    return;
  }
  const job = queue.create('reserve_seat', {}).save((err) => {
    if (err) {
      res.json({ status: 'Reservation failed' });
      return;
    }
    res.json({ status: 'Reservation in process' });
  });
  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  }).on('failed', (error) => {
    console.log(`Seat reservation job ${job.id} failed: ${error}`);
  });
});

app.get('/process', async (req, res) => {
  queue.process('reserve_seat', async (job, done) => {
    let availableSeats = await getCurrentAvailableSeats();

    if (availableSeats === 0) {
      done(Error('Not enough seats available'));
    }
    availableSeats -= 1;
    reserveSeat(availableSeats);
    if (availableSeats <= 0) {
      reservationEnabled = false;
    }
    done();
  });
  res.json({ status: 'Queue processing' });
});
