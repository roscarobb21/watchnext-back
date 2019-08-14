const Sequelize= require('sequelize');
const db= require('../db/db');
const bcrypt = require('bcrypt');
const Category=require('./Categories');
const MovieCategory=require('./MovieCategory');

const Model = Sequelize.Model;

/* Movie Model
{ 
    id: <autoincrement>, 
    title: < string, required > , 
    trailerUrl: < string, url validation, required > , 
    originalSourceUrl: < string, url validation, required > , 
    coverUrl: < string, url validation, required > , 
    imdbId: < string , required > , 
    imdbScore: < number > , 
    description: < string > , 
    releaseDate: < Datetime, required > 
}   */

class Movie extends Model{}

Movie.init({
    // attributes
    title: {
      type: Sequelize.STRING,
      require: true,
      allowNull: false
    },
    trailerUrl: {
        type: Sequelize.STRING, 
        require: true,
        isUrl: true
      }, 
      originalSourceUrl: {
        type: Sequelize.STRING, 
        isUrl: true
      }, 
      coverUrl: {
        type: Sequelize.STRING, 
        isUrl: true
      },
      imdbId: {
        type: Sequelize.STRING,
        require: true, 
      },

      imdbScore: {
        type: Sequelize.STRING, 
      },
      
      description: {
        type: Sequelize.STRING, 
      },
      duration:{
        type: Sequelize.STRING,
      },
      director:{
        type: Sequelize.STRING,
      },
      stars:{
        type: Sequelize.STRING,
      },
      category:{
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
      },
      releaseDate: {
        type: Sequelize.DATEONLY,
        require: true 
      }
  }, {
      sequelize: db,
      modelName: 'Movie'
    // options
  }
  );
  

  Movie.insert_default= async ()=>{

    const empt = await Movie.count().then((c)=>{return c});
    let datearray=[];
   
    if(empt==0)
    {
      
    let s1= await Movie.create({title: 'Spider-Man: Far from Home', trailerUrl: 'https://www.youtube.com/watch?v=Nt9L1jCKGnE', originalSourceUrl:'https://www.imdb.com/title/tt6320628/?ref_=inth_ov_tt', coverUrl:'https://m.media-amazon.com/images/M/MV5BMGZlNTY1ZWUtYTMzNC00ZjUyLWE0MjQtMTMxN2E3ODYxMWVmXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SY1000_CR0,0,674,1000_AL_.jpg', imdbId:'Default',
    imdbScore:'7.9', description:'Default', duration : '2:30', director: 'Default', stars: 'Default', category:['Action', 'Adventure', 'Sci-Fi'] , releaseDate: '2019-07-02'});
   await for_default(s1, s1.category);
   let s2= await Movie.create({title: 'Crawl', trailerUrl: 'https://www.youtube.com/watch?v=H6MLJG0RdDE', originalSourceUrl:'https://www.imdb.com/title/tt8364368/?ref_=inth_ov_tt', coverUrl:'https://m.media-amazon.com/images/M/MV5BNjQxMzYyMDItZmUyNy00MGE0LWIwYmItMTMxYmZlOGZlMTlhXkEyXkFqcGdeQXVyNjg2NjQwMDQ@._V1_SY1000_CR0,0,675,1000_AL_.jpg', imdbId:'Default',
    imdbScore:'6.8', description:'A young woman, while attempting to save her father during a category 5 hurricane, finds herself trapped in a flooding house and must fight for her life against alligators.', duration : '1:27', director: 'Default', stars: 'Default', category:['Action', 'Adventure', 'Drama'] , releaseDate: '2019-07-12'});
    await for_default(s2, s2.category);
   
  let s3= await Movie.create({title: 'The Secret Life of Pets 2 ', trailerUrl: 'https://www.youtube.com/watch?v=mYocfuqu2A8', originalSourceUrl:'https://www.imdb.com/title/tt5113040/?ref_=inth_ov_tt', coverUrl:'https://m.media-amazon.com/images/M/MV5BMzdlMWQzZmItMDA5Ny00MGFjLTk0MDAtYjgzMmMyNTEwMzdhXkEyXkFqcGdeQXVyODQzNTE3ODc@._V1_SY1000_CR0,0,631,1000_AL_.jpg', imdbId:'Default',
    imdbScore:'6.6', description:'Continuing the story of Max and his pet friends, following their secret lives after their owners leave them for work or school each day.', duration : '1:26', director: 'Default', stars: 'Default', category:['Action', 'Adventure', 'Comedy'] , releaseDate: '2019-07-07'});
    await for_default(s3, s3.category);
    let s4= await Movie.create({title: 'Inception', trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0', originalSourceUrl:'https://www.imdb.com/title/tt1375666/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=e31d89dd-322d-4646-8962-327b42fe94b1&pf_rd_r=M9EW3V2ZVXZE45K3MSVQ&pf_rd_s=center-1&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_tt_13', coverUrl:'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SY1000_CR0,0,675,1000_AL_.jpg', imdbId:'Default',
    imdbScore:'8.8', description:'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', duration : '2:28', director: 'Default', stars: 'Default', category:['Action', 'Adventure', 'Sci-Fi'] , releaseDate: '2010-07-16'});
    await for_default(s4, s4.category);
    let s5= await Movie.create({title: 'The Dark Knight', trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY', originalSourceUrl:'https://www.imdb.com/title/tt0468569/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=e31d89dd-322d-4646-8962-327b42fe94b1&pf_rd_r=M9EW3V2ZVXZE45K3MSVQ&pf_rd_s=center-1&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_tt_4', coverUrl:'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SY1000_CR0,0,675,1000_AL_.jpg', imdbId:'Default',
    imdbScore:'9.0', description:'When the menace known as The Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham. The Dark Knight must accept one of the greatest psychological and physical tests of his ability to fight injustice.', duration : '2:28', director: 'Default', stars: 'Default', category:['Action', 'Crime', 'Drama'] , releaseDate: '2008-07-18'});
    await for_default(s5, s5.category);


    }else {console.log('\n *** USER DEJA ARE DEFAULT *** \n ')}
  
  }


async function for_default(mov, categ)
{

  for(let i=0; i<categ.length; i++)
  {
  let  catID=await Category.findOne({where: {name: categ[i]}});
  let k =  await Category.increment('numberOfMovies', {where: {name: categ[i]}}).then((result)=>{return result});
  let newM=await MovieCategory.create({MovieId: mov.id, CategoryId: catID.id}).then((result)=>{return result});
  }


}





module.exports= Movie;