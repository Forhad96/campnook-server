import express, { Application } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
const app: Application = express();
// const port = 3000;

//parser
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['https://campnook-client.vercel.app', 'http://localhost:5173'],
    credentials: true,
  }),
);

// application routes

app.use('/api/v1', router);

// const test = async (req: Request, res: Response) => {
//   const a = 10;
//   res.send(a);
//   // Promise.reject()
// };

// app.get('/', test);

app.use(globalErrorHandler);
app.use(notFound);
export default app;
