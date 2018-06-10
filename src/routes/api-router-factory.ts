import * as express from 'express';
import { Router } from 'express';

import { MovieRouter } from './movieRoute';


export class ApiRouterFactory {
    private constructor() {}

  static getApiRouter () {
    const router: Router = express.Router();
    
    const movieRouter: Router = new MovieRouter().router;
    
    router.use('/movie', movieRouter);

    return router;
  }
}
