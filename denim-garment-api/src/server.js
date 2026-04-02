import express from 'express';
import {
  HttpError,
  createStockIncome,
  createCustomerOrder,
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
  updateStockIncome,
} from './demoStore.js';

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

const runHandler = (handler) => (request, response) => {
  try {
    handler(request, response);
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
  runHandler((request, response) => {
    ensureAdminSession(request);
    response.status(201).json(createStockIncome(request.body));
  }),
);

app.patch(
  '/api/stock-incomes/:incomeId',
  runHandler((request, response) => {
    ensureAdminSession(request);
    response.json(updateStockIncome(request.params.incomeId, request.body));
  }),
);

app.delete(
  '/api/stock-incomes/:incomeId',
  runHandler((request, response) => {
    ensureAdminSession(request);
    deleteStockIncome(request.params.incomeId);
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
  runHandler((request, response) => {
    ensureAdminSession(request);
    response.status(201).json(createStockIncome(request.body));
  }),
);

app.patch(
  '/api/purchases/:orderId',
  runHandler((request, response) => {
    ensureAdminSession(request);
    response.json(updateStockIncome(request.params.orderId, request.body));
  }),
);

app.delete(
  '/api/purchases/:orderId',
  runHandler((request, response) => {
    ensureAdminSession(request);
    deleteStockIncome(request.params.orderId);
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
  runHandler((request, response) => {
    response.json(
      updateCustomerProfile({
        token: getCustomerBearerToken(request),
        payload: request.body,
      }),
    );
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
  runHandler((request, response) => {
    response.status(201).json(
      createCustomerOrder({
        token: getCustomerBearerToken(request),
        payload: request.body,
      }),
    );
  }),
);

app.listen(port, () => {
  console.log(`denim-garment-api listening on http://localhost:${port}`);
});
