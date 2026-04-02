import { MongoClient } from 'mongodb';
import { getSeedState, getStoreState, hydrateStoreState } from './demoStore.js';

const DEFAULT_MONGO_URI = 'mongodb://127.0.0.1:27017';
const DEFAULT_DB_NAME = 'denim_garment';

const STORE_KEYS = [
  'purchaseLedger',
  'supplierCatalog',
  'productCatalog',
  'adminAccounts',
  'customerAccounts',
  'customerOrderLedger',
];

const COLLECTION_BY_STORE_KEY = {
  purchaseLedger: 'stock_incomes',
  supplierCatalog: 'suppliers',
  productCatalog: 'products',
  adminAccounts: 'admins',
  customerAccounts: 'customers',
  customerOrderLedger: 'customer_orders',
};

const UNIQUE_INDEXES = [
  { storeKey: 'purchaseLedger', field: 'orderId' },
  { storeKey: 'supplierCatalog', field: 'id' },
  { storeKey: 'productCatalog', field: 'id' },
  { storeKey: 'adminAccounts', field: 'id' },
  { storeKey: 'adminAccounts', field: 'email' },
  { storeKey: 'customerAccounts', field: 'id' },
  { storeKey: 'customerAccounts', field: 'email' },
  { storeKey: 'customerOrderLedger', field: 'id' },
];

let mongoClient = null;
let mongoDb = null;
let persistQueue = Promise.resolve();

const collectionFor = (storeKey) => {
  if (!mongoDb) {
    throw new Error('MongoDB store has not been initialized.');
  }

  return mongoDb.collection(COLLECTION_BY_STORE_KEY[storeKey]);
};

const readStoreCollection = async (storeKey) =>
  collectionFor(storeKey)
    .find({}, { projection: { _id: 0 } })
    .toArray();

const replaceStoreCollection = async (storeKey, records) => {
  const collection = collectionFor(storeKey);

  await collection.deleteMany({});

  if (records.length > 0) {
    await collection.insertMany(records, { ordered: true });
  }
};

const ensureIndexes = async () => {
  await Promise.all(
    UNIQUE_INDEXES.map(({ storeKey, field }) =>
      collectionFor(storeKey).createIndex({ [field]: 1 }, { unique: true }),
    ),
  );
};

const loadOrSeedStoreState = async () => {
  const seedState = getSeedState();
  const hydratedState = {};

  for (const storeKey of STORE_KEYS) {
    const existingRecords = await readStoreCollection(storeKey);

    if (existingRecords.length > 0) {
      hydratedState[storeKey] = existingRecords;
      continue;
    }

    const seedRecords = Array.isArray(seedState[storeKey]) ? seedState[storeKey] : [];

    if (seedRecords.length > 0) {
      await collectionFor(storeKey).insertMany(seedRecords, { ordered: true });
    }

    hydratedState[storeKey] = seedRecords;
  }

  return hydratedState;
};

const writeRuntimeStateToMongo = async () => {
  const runtimeState = getStoreState();

  for (const storeKey of STORE_KEYS) {
    const records = Array.isArray(runtimeState[storeKey]) ? runtimeState[storeKey] : [];
    await replaceStoreCollection(storeKey, records);
  }
};

export const initializeMongoBackedStore = async () => {
  const mongoUri = process.env.MONGODB_URI ?? process.env.MONGO_URI ?? DEFAULT_MONGO_URI;
  const databaseName = process.env.MONGODB_DB_NAME ?? process.env.MONGO_DB_NAME ?? DEFAULT_DB_NAME;

  mongoClient = new MongoClient(mongoUri, {
    maxPoolSize: 10,
    ignoreUndefined: true,
    serverSelectionTimeoutMS: 5000,
  });

  await mongoClient.connect();
  mongoDb = mongoClient.db(databaseName);

  await ensureIndexes();

  const hydratedState = await loadOrSeedStoreState();
  hydrateStoreState(hydratedState);
};

export const persistStoreState = async () => {
  if (!mongoDb) {
    return;
  }

  persistQueue = persistQueue
    .catch(() => undefined)
    .then(() => writeRuntimeStateToMongo());

  return persistQueue;
};

export const closeMongoBackedStore = async () => {
  await persistQueue.catch(() => undefined);

  if (!mongoClient) {
    return;
  }

  await mongoClient.close();
  mongoClient = null;
  mongoDb = null;
};
