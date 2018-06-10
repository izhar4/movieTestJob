import * as express from 'express';
import { MovieController }from './../controllers/movies';
import { Router } from 'express';

export class MovieRouter {
  private movieController : MovieController;
  router: Router;

  constructor() {
    this.router = express.Router();
    this.movieController = new MovieController();
    this.initRoutes();
  }

  initRoutes(){
    this.router.put("/updateMovie", this.movieController.updateMovieData);
    this.router.post("/findByReleasedDate", this.movieController.searchMovieByDate);
    this.router.post("/findByRating", this.movieController.searchMovieByRating);
    this.router.post("/findMovieByGenres", this.movieController.searchMovieByGenres);
    this.router.get("/movieByTitle", this.movieController.getMovieByTitle);
    this.router.get("/movieById/:id", this.movieController.getMovieById);
    
  }
}
