import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
const app: Application = express();
// const port = 3000;

//parser
app.use(express.json());
app.use(cookieParser())
app.use(cors({ origin: ['http://localhost:5173'] }));

// application routes

app.use('/api/v1',router)


/**
 * Handles GET requests to the root endpoint.
 *
 * @param req - The request object.
 * @param res - The response object.
 */
const test = async (req: Request, res: Response) => {
  const a = 10;
  res.send(a);
  // Promise.reject()
};

app.get('/', test);

app.use(globalErrorHandler)
app.use(notFound)
export default app;
