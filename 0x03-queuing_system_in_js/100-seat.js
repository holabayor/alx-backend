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
    const seats = await getCurrentAvailableSeats();

    res.json(seats);
});
