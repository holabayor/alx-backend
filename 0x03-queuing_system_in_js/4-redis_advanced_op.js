import redis from 'redis';

const client = redis.createClient()
  .on('error', (err) => console.log('Redis client not connected to the server:', err))
  .on('connect', () => console.log('Redis client connected to the server'));

const redisStore = {
  Portland: 50,
  Seattle: 80,
  'New York': 20,
  Bogota: 20,
  Cali: 40,
  Paris: 2,
};

const schoolName = 'HolbertonSchools';

Object.entries(redisStore).forEach(([key, value]) => {
  client.hset(schoolName, `${key}`, `${value}`, redis.print);
});

client.hgetall(schoolName, (err, result) => {
  if (result) console.log(result);
});
