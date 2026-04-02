import express from 'express';
import {
  HttpError,
  createSupplier,
  createStockIncome,
  createCustomerOrder,
  deleteSupplier,
  deleteStockIncome,
  getCustomerOrder,
  getCustomerOrders,
  getAdminProfile,
  getCustomerProfile,
  getDashboard,
  getProducts,
  getStockIncomes,
  getReports,
  getStorefrontLanding,
  getSuppliers,
  loginAdmin,
  loginCustomer,
  updateCustomerProfile,
  updateSupplier,
  updateStockIncome,
} from './demoStore.js';
import { closeMongoBackedStore, initializeMongoBackedStore, persistStoreState } from './mongoPersistence.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(express.json());
app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');

  if (request.method === 'OPTIONS') {
    response.sendStatus(204);
    return;
  }

  next();
});

const handleError = (response, error) => {
  if (error instanceof HttpError) {
    response.status(error.status).json({ message: error.message });
    return;
  }

  console.error(error);
  response.status(500).json({ message: 'Unexpected server error.' });
};

const runHandler = (handler) => async (request, response) => {
  try {
    await handler(request, response);
  } catch (error) {
    handleError(response, error);
  }
};

const getBearerToken = (request, loginRequiredMessage) => {
  const authorization = request.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new HttpError(401, loginRequiredMessage);
  }

  return authorization.slice(7).trim();
};

const getCustomerBearerToken = (request) => getBearerToken(request, 'Customer login required.');
const getAdminBearerToken = (request) => getBearerToken(request, 'Admin login required.');

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'denim-garment-api',
  });
});

app.get('/api/storefront/landing', (_request, response) => {
  response.json(getStorefrontLanding());
});

app.post(
  '/api/admin/login',
  runHandler((request, response) => {
    response.json(loginAdmin(request.body));
  }),
);

app.get(
  '/api/admin/me',
  runHandler((request, response) => {
    response.json({
      admin: getAdminProfile(getAdminBearerToken(request)),
    });
  }),
);

const ensureAdminSession = (request) => {
  getAdminProfile(getAdminBearerToken(request));
};

app.get(
  '/api/dashboard',
  runHandler((request, response) => {
    ensureAdminSession(request);
    response.json(getDashboard());
  }),
);

app.get(
  '/api/stock-incomes',
  runHandler((request, response) => {
    ensureAdminSession(request);
    const { query, status } = request.query;

    response.json(
      getStockIncomes({
        query: typeof query === 'string' ? query : '',
        status: typeof status === 'string' ? status : undefined,
      }),
    );
  }),
);

app.post(
  '/api/stock-incomes',
  runHandler(async (request, response) => {
    ensureAdminSession(request);
    const createdStockIncome = createStockIncome(request.body);
    await persistStoreState();
    response.status(201).json(createdStockIncome);
  }),
);

app.patch(
  '/api/stock-incomes/:incomeId',
  runHandler(async (request, response) => {
    ensureAdminSession(request);
    const updatedStockIncome = updateStockIncome(request.params.incomeId, request.body);
    await persistStoreState();
    response.json(updatedStockIncome);
  }),
);

app.delete(
  '/api/stock-incomes/:incomeId',
  runHandler(async (request, response) => {
    ensureAdminSession(request);
    deleteStockIncome(request.params.incomeId);
    await persistStoreState();
    response.sendStatus(204);
  }),
);

app.get(
  '/api/purchases',
  runHandler((request, response) => {
    ensureAdminSession(request);
    const { query, status } = request.query;

    response.json(
      getStockIncomes({
        query: typeof query === 'string' ? query : '',
        status: typeof status === 'string' ? status : undefined,
      }),
    );
  }),
);

app.post(
  '/api/purchases',
  runHandler(async (request, response) => {
    ensureAdminSession(request);
    const createdStockIncome = createStockIncome(request.body);
    await persistStoreState();
    response.status(201).json(createdStockIncome);
  }),
);

app.patch(
  '/api/purchases/:orderId',
  runHandler(async (request, response) => {
    ensureAdminSession(request);
    const updatedStockIncome = updateStockIncome(request.params.orderId, request.body);
    await persistStoreState();
    response.json(updatedStockIncome);
  }),
);

app.delete(
  '/api/purchases/:orderId',
  runHandler(async (request, response) => {
    ensureAdminSession(request);
    deleteStockIncome(request.params.orderId);
    await persistStoreState();
    response.sendStatus(204);
  }),
);

app.get(
  '/api/suppliers',
  runHandler((request, response) => {
    ensureAdminSession(request);
    const { query } = request.query;

    response.json(
      getSuppliers({
        query: typeof query === 'string' ? query : '',
      }),
    );
  }),
);

app.post(
  '/api/suppliers',
  runHandler(async (request, response) => {
    ensureAdminSession(request);
    const createdSupplier = createSupplier(request.body);
    await persistStoreState();
    response.status(201).json(createdSupplier);
  }),
);

app.patch(
  '/api/suppliers/:supplierId',
  runHandler(async (request, response) => {
    ensureAdminSession(request);
    const updatedSupplier = updateSupplier(request.params.supplierId, request.body);
    await persistStoreState();
    response.json(updatedSupplier);
  }),
);

app.delete(
  '/api/suppliers/:supplierId',
  runHandler(async (request, response) => {
    ensureAdminSession(request);
    deleteSupplier(request.params.supplierId);
    await persistStoreState();
    response.sendStatus(204);
  }),
);

app.get(
  '/api/reports',
  runHandler((request, response) => {
    ensureAdminSession(request);
    const { from, to, supplier } = request.query;

    response.json(
      getReports({
        from: typeof from === 'string' ? from : undefined,
        to: typeof to === 'string' ? to : undefined,
        supplier: typeof supplier === 'string' ? supplier : undefined,
      }),
    );
  }),
);

app.post(
  '/api/customer/login',
  runHandler((request, response) => {
    response.json(loginCustomer(request.body));
  }),
);

app.get(
  '/api/customer/me',
  runHandler((request, response) => {
    response.json({
      customer: getCustomerProfile(getCustomerBearerToken(request)),
    });
  }),
);

app.patch(
  '/api/customer/profile',
  runHandler(async (request, response) => {
    const updatedCustomer = updateCustomerProfile({
      token: getCustomerBearerToken(request),
      payload: request.body,
    });

    await persistStoreState();
    response.json(updatedCustomer);
  }),
);

app.get(
  '/api/products',
  runHandler((request, response) => {
    const { query, category } = request.query;

    response.json(
      getProducts({
        token: getCustomerBearerToken(request),
        query: typeof query === 'string' ? query : '',
        category: typeof category === 'string' ? category : undefined,
      }),
    );
  }),
);

app.get(
  '/api/customer/orders',
  runHandler((request, response) => {
    response.json(
      getCustomerOrders({
        token: getCustomerBearerToken(request),
      }),
    );
  }),
);

app.get(
  '/api/customer/orders/:orderId',
  runHandler((request, response) => {
    response.json(
      getCustomerOrder({
        token: getCustomerBearerToken(request),
        orderId: request.params.orderId,
      }),
    );
  }),
);

app.post(
  '/api/customer/orders',
  runHandler(async (request, response) => {
    const createdCustomerOrder = createCustomerOrder({
      token: getCustomerBearerToken(request),
      payload: request.body,
    });

    await persistStoreState();
    response.status(201).json(createdCustomerOrder);
  }),
);

const startServer = async () => {
  await initializeMongoBackedStore();

  app.listen(port, () => {
    console.log(`denim-garment-api listening on http://localhost:${port}`);
  });
};

const shutdownServer = async () => {
  try {
    await closeMongoBackedStore();
  } catch (error) {
    console.error('Failed to close MongoDB connection cleanly.', error);
  }
};

process.on('SIGINT', () => {
  shutdownServer().finally(() => process.exit(0));
});

process.on('SIGTERM', () => {
  shutdownServer().finally(() => process.exit(0));
});

startServer().catch((error) => {
  console.error('Failed to initialize MongoDB-backed API server.', error);
  process.exit(1);
});
