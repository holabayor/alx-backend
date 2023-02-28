import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

const app = express();
const port = 1245;

const client = redis.createClient()
  .on('error', (err) => console.log('Redis client not connected to the server:', err))
  .on('connect', () => console.log('Redis client connected to the server'));
const redisGet = promisify(client.get).bind(client);

const listProducts = [
  {
    itemId: 1,
    itemName: 'Suitcase 250',
    price: 50,
    initialAvailabilityQuantity: 4,
  },
  {
    itemId: 2,
    itemName: 'Suitcase 450',
    price: 100,
    initialAvailabilityQuantity: 10,
  },
  {
    itemId: 3,
    itemName: 'Suitcase 650',
    price: 350,
    initialAvailabilityQuantity: 2,
  },
  {
    itemId: 4,
    itemName: 'Suitcase 1050',
    price: 550,
    initialAvailabilityQuantity: 5,
  },
];

function getItemById(id) {
  return listProducts.filter((item) => item.itemId === id)[0];
}

function reserveStockById(itemId, stock) {
  client.set(`item.${itemId}`, stock);
}

async function getCurrentReservedStockById(itemId) {
  const item = await redisGet(`item.${itemId}`);
  return item;
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const itemId = Number(req.params.itemId);
  const item = getItemById(itemId);
  if (!item) {
    res.json({ status: 'Product not found' });
    return;
  }
  const currentStock = await getCurrentReservedStockById(itemId);
  if (!currentStock) {
    await reserveStockById(itemId, item.initialAvailabilityQuantity);
    item.currentQuantity = item.initialAvailabilityQuantity;
  } else {
    item.currentQuantity = currentStock;
  }
  res.json(item);
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = Number(req.params.itemId);
  const item = getItemById(itemId);
  if (!item) {
    res.json({ status: 'Product not found' });
    return;
  }
  let currentStock = await getCurrentReservedStockById(itemId);

  if (currentStock < 1) {
    res.json({ status: 'Not enough stock available', 'itemId': itemId });
    return;
  }
  reserveStockById(itemId, Number(currentStock) - 1)
  res.json({ status: 'Reservation confirmed', 'itemId': itemId});
});
