import express from 'express';
import { promisify } from 'util';
import redis from 'redis';
import kue from 'kue';

const queue = kue.createQueue();

const app = express();
const port = 1245;

app.listen(port, () => console.log(`Server listening on port ${port}`));

const client = redis.createClient()
  .on('error', (err) => console.log('Redis client not connected to the server:', err))
  .on('connect', () => console.log('Redis client connected to the server'));
const redisGet = promisify(client.get).bind(client);

function reserveSeat(number) {
  client.set('available_seats', number);
}

async function getCurrentAvailableSeats() {
  const seats = await redisGet('available_seats');
  return seats;
}

reserveSeat(50);
let reservationEnabled = true;

app.get('/available_seats', async (req, res) => {
  const { params } = req;
  console.log(params);
  const availableSeats = await getCurrentAvailableSeats();
  if (availableSeats < 1) {
    reservationEnabled = false;
  }
  res.json({ numberOfAvailableSeats: availableSeats });
});

app.get('/reserve_seat', async (req, res) => {
  const availableSeats = await getCurrentAvailableSeats();
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
    return;
  }
  const job = queue.create('reserve_seat', { numberOfAvailableSeats: availableSeats }).save((err) => {
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
  const availableSeats = await getCurrentAvailableSeats();
  reserveSeat(availableSeats - 1);

  if (availableSeats === 0) {
    reservationEnabled = false;
  } else if (availableSeats >= 0) {
    queue.process('reserve_seat', (job) => {
      
    });
  } else {
    throw new Error('Not enough seats available');
  }
});
