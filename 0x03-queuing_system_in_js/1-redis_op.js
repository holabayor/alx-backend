import redis from 'redis';

redis.createClient()
  .on('error', (err) => console.log('Redis client not connected to the server:', err))
  .on('connect', () => console.log('Redis client connected to the server'));

function setNewSchool(schoolName, value) {
    redis.set(`${schoolName}`, value);
    redis.print();
}

function displaySchoolValue(schoolName) {
    console.log(redis.get(schoolName));
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');