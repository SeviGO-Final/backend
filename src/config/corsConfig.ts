import { CorsOptions } from 'cors';

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Jika origin tidak ada (misalnya request dari tools seperti Postman) atau termasuk dalam allowedOrigins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`CORS error: Origin ${origin} is not allowed by CORS policy`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true, 
  optionsSuccessStatus: 200, 
};

export default corsOptions;
