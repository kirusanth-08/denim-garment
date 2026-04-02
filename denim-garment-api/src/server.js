import express from 'express';
import { HttpError, createPurchase, deletePurchase, getDashboard, getPurchases, getReports, getSuppliers, updatePurchase } from './demoStore.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(express.json());
app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'denim-garment-api',
  });
});

app.get('/api/dashboard', (_request, response) => {
  response.json(getDashboard());
});

app.get('/api/purchases', (request, response) => {
  const { query, status } = request.query;
  response.json(
    getPurchases({
      query: typeof query === 'string' ? query : '',
      status: typeof status === 'string' ? status : undefined,
    }),
  );
});

app.post(
  '/api/purchases',
  runHandler((request, response) => {
    response.status(201).json(createPurchase(request.body));
  }),
);

app.patch(
  '/api/purchases/:orderId',
  runHandler((request, response) => {
    response.json(updatePurchase(request.params.orderId, request.body));
  }),
);

app.delete(
  '/api/purchases/:orderId',
  runHandler((request, response) => {
    deletePurchase(request.params.orderId);
    response.sendStatus(204);
  }),
);

app.get('/api/suppliers', (request, response) => {
  const { query } = request.query;
  response.json(
    getSuppliers({
      query: typeof query === 'string' ? query : '',
    }),
  );
});

app.get('/api/reports', (request, response) => {
  const { from, to, supplier } = request.query;
  response.json(
    getReports({
      from: typeof from === 'string' ? from : undefined,
      to: typeof to === 'string' ? to : undefined,
      supplier: typeof supplier === 'string' ? supplier : undefined,
    }),
  );
});

app.listen(port, () => {
  console.log(`denim-garment-api listening on http://localhost:${port}`);
});
