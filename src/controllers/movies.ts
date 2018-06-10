import * as express from 'express';
import * as imdb from 'imdb-api';
import * as config from './../../config/config';

import { MovieModel } from './../models/movieModel';

var movieModel = new MovieModel();

export class MovieController{
    constructor() {
    }

    getMovieById= async (req, res)=>{
        try{
            if(req.params.id){
                let condition:any = {imdbid: req.params.id};
                let params = {};
                let resp = await movieModel.findOneMovie(condition,params);
                if(resp && Object.keys(resp).length > 0){
                    res.status(200).json(resp);
                }else{
                    let movie:any = await imdb.getById(req.params.id, {apiKey:config.apiKey , timeout: 3000})
                    let options ={upsert: true, new: true};
                    condition = {imdbid: movie.imdbid};
                    movie['released'] = new Date(movie.released).getTime();
                    let moviesResp = await movieModel.updateMovieData(condition, movie, options);
                    res.status(200).json(moviesResp);
                }
            }else throw new Error('Please provide id');
            
        }catch(error){
            let resp = (<Error>error).message;
            res.status(404).json(resp || error);
        }
    }
    
    getMovieByTitle = async (req, res)=>{
        try{
            if(req.query.title){
                let title = req.query.title;
                let condition:any = {$text:{$search:'"\"'+title+'\""'}};
                let params ={};
                let resp = await movieModel.findOneMovie(condition,params);
                if(resp && Object.keys(resp).length > 0){
                    res.status(200).json(resp);
                }else{
                    let movie:any = await imdb.get(title, {apiKey: config.apiKey});
                    if(movie && Object.keys(movie).length > 0){
                        let options = { new: true, upsert: true };
                        let condition = {imdbid: movie.imdbid};
                        movie['released'] = new Date(movie.released).getTime();
                        let moviesResp = await movieModel.updateMovieData(condition, movie, options);
                        res.status(200).json(moviesResp);
                    }else throw new Error("Error while fetching movie");
                }
            }else throw new Error("Please provide title");
        }catch(error){
            let resp = (<Error>error).message;
            res.status(404).json(resp || error);
        }
    }

    updateMovieData= async (req, res)=>{
        try{
            if(req.body && req.body.genres && req.body.rating && req.body.id){
                let updateObj = {$set:{genres: req.body.genres , rating: parseInt(req.body.rating)}};
                let condition = {imdbid: req.body.id};
                let options = {new : true};
                let resp = await movieModel.updateMovieData(condition, updateObj,options);
                res.status(200).json(resp);
            }else throw new Error("Please provide complete data")

        }catch(error){
            let resp = (<Error>error).message;
            res.status(404).json(resp || error);
        }
    }

    searchMovieByDate = async(req, res)=>{
        try{
            if(req.body && req.body.fromDate){
                let condition = {};
                let params ={};
                if(req.body.toDate) condition = {released:{$gte: new Date(req.body.fromDate).getTime(), $lte:new Date(req.body.toDate).getTime()}}
                else condition = {released: {$eq:new Date(req.body.fromDate).getTime() }};
                let movieData = await movieModel.findMovies(condition, params);
                res.status(200).json(movieData)
            }else throw new Error("Please provide complete data")
        }catch(error){
           let resp = (<Error>error).message;
            res.status(404).json(resp || error);
        }
    }

    searchMovieByRating = async(req, res)=>{
        try{
            if(req.body && req.body.fromRating && req.body.toRating){
                let condition = {rating: {$gte: parseInt(req.body.fromRating), $lt: parseInt(req.body.toRating)}};
                let params = {};
                let respData = await movieModel.findMovies(condition, params);
                res.status(200).json(respData);
            }else throw new Error("please provide complete data");
            
        }catch(error){
            let resp = (<Error>error).message;
            res.status(404).json(resp || error);
        }
    }

    searchMovieByGenres= async(req, res)=>{
        try{
            if(req.body && req.body.genres){
                let condition = { $text: { $search: req.body.genres } }
                let params = {};
                let respObj = await movieModel.findMovies(condition, params);
                res.status(200).json(respObj);
            }else throw new Error("Please provide complete data");
            
        }catch(error){
            let resp = (<Error>error).message;
            res.status(404).json(resp || error);
        }
    }
}
