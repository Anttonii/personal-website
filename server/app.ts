import express, { Application, Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';

const app: Application = express();
const port: number = 3000;

const corsOptions: CorsOptions = {
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});