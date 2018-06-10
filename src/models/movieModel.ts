import * as mongoose from 'mongoose';
import * as fs from 'fs';
var Schema = mongoose.Schema;

var movieSchema = new Schema({
    title:{type:String, required: true},
    released:{type:Number, required: true},
    rating:{type:Number, required: true},
    imdbid:{type:String, required: true},
    genres:{type:String, required: true}
    
});
movieSchema.index({ title: 'text', genres: 'text' });
//movieSchema.index({ genres: 'text' });
var movieModel = mongoose.model('movie', movieSchema);

export class  MovieModel {
    constructor(){
       

    }

    updateMovieData(condition, data, options){
        return new Promise((resolve, reject) =>{
            movieModel.findOneAndUpdate(condition, data, options).then(data=>{
                resolve(data);
            }).catch(error =>{
                reject(error);
            })
        });
    }

    findOneMovie(condition, params){
        return new Promise((resolve, reject)=>{
            movieModel.findOne(condition, params).then(data =>{
                resolve(data);
            }).catch(error=>{
                reject(error);
            })
        });
    }

    findMovies(condition, params){
        return new Promise((resolve, reject)=>{
            movieModel.find(condition, params).then(data =>{
                resolve(data);
            }).catch(error=>{
                reject(error);
            })
        })
    }
    
}
