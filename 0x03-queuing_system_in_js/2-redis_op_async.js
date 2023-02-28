import redis from 'redis';
import util from 'util';

const client = redis.createClient()
  .on('error', (err) => console.log('Redis client not connected to the server:', err))
  .on('connect', () => console.log('Redis client connected to the server'));

function setNewSchool(schoolName, value) {
  client.set(schoolName, value, redis.print);
}

const redisGet = util.promisify(client.get).bind(client);

async function displaySchoolValue(schoolName) {
  const value = await redisGet(schoolName);
  console.log(value);
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
