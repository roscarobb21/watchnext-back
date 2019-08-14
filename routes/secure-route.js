const express = require('express');
const auth= require('../auth/auth');
const router = express.Router();
const passport= require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Category= require('../models/Categories');
const User= require('../models/User');
const Movie= require('../models/movie');
const MovieCategory=require('../models/MovieCategory');
const Sequelize=require('sequelize');
const Op= Sequelize.Op;

//options.jwtFromRequest = ExtractJWT.fromHeaderQueryParameter('secret_token')!=undefined?ExtractJWT.fromUrlQueryParameter('secret_token'):ExtractJWT.fromHeader('secret_token');
//options.secretOrKey = process.env.AUTH_SECRET;



//Secure Route /Profile for logged in users. GET
router.get('/profile', (req, res, next) => {
  //We'll just send back the user details and the token
  res.json({
    email: req.user.email,
    fullName: req.user.fullName,
    avatarUrl: req.user.avatarUrl,
    rol: req.user.rol
  })
});







//put route to edit a movie
router.put('/movie/edit/:id', async function (req, res, next){
  let user= req.user;
  let rol=1;
  let categories;
    //let id=req.body.id;
    let id=req.params.id;
    let body=req.body;
    let found=await  Movie.findOne({where: {id: id}});
    let OldCat=found.category;
    console.log('old cat ', OldCat);
    let OldCatFound= await MovieCategory.findAll({where:{MovieId: id}});
    let helpCateg=req.body.category;
    console.log('\n\n helpcateg', helpCateg);
    let check;
let arr_of_one=[];

if(helpCateg!=undefined)
{
  if(helpCateg.includes(',') ){
    // console.log('\n TRUE TRUE TRUE ')
     check=helpCateg.split(',')
     categories=check;
     console.log('ARE VIRGULA ', categories)
   }else 
   {
arr_of_one.push(helpCateg);
categories=arr_of_one;
console.log('UN SINGUR CUVANT', arr_of_one)
   }

}else {
  categories=OldCat;
console.log('OLDCAT ', categories);
}

     await MovieCategory.destroy({where: {MovieId: id}});
    
    console.log('\n Old cat found', OldCatFound);
    for(let i=0; i<OldCatFound.length; i++)
    {
      await Category.decrement('numberOfMovies', {where: { id: OldCatFound[i].CategoryId}});
      console.log('\n Decrement');
    }
    await MovieCategory.destroy({where:{MovieId: id}});
   
   console.log('\n help categ ', helpCateg);
      let newCat=[];
      
   
        
console.log('\n\n categories ', categories);

    for(let i=0; i<categories.length; i++)
    {
      newCat.push( await Category.findOne({where: {name: categories[i]}}));
    }
  

    for(let i=0; i<newCat.length; i++)
    {
    await MovieCategory.create({MovieId: id, CategoryId: newCat[i].id});
    await Category.increment('numberOfMovies', {where: {id : newCat[i].id}} );
    }
  
    console.log('\n newCat', newCat);
    console.log('\n found ', found);
    
    //console.log('\n MovcatId', movcatId);
    let title; let trailerUrl; let originalSourceUrl; 
    let coverUrl; let imdbId; let imdbScore;
    let description; let duration; let director;
    let stars; 
    let releaseDate;
    

    if(user.rol==1)
    {
    
    if(found){
     let oldMovie=found;
      body.title==undefined?title=found.title:title=body.title;
      body.trailerUrl==undefined?trailerUrl=found.trailerUrl:trailerUrl=body.trailerUrl;
      body.originalSourceUrl==undefined?originalSourceUrl=found.originalSourceUrl:originalSourceUrl=body.originalSourceUrl;
      body.coverUrl==undefined?coverUrl=found.coverUrl:coverUrl=body.coverUrl;
      body.imdbId==undefined?imdbId=found.imdbId:imdbId=body.imdbId;
      body.imdbScore==undefined?imdbScore=found.imdbScore:imdbScore=body.imdbScore;
      body.description==undefined?description=found.description:description=body.description;
      body.duration==undefined?duration=found.duration:duration=body.duration;
      body.director==undefined?director=found.director:director=body.director;
      body.stars==undefined?start=found.stars:stars=body.stars;
    
      body.releaseDate==undefined?releaseDate=found.releaseDate:releaseDate=body.releaseDate;
      let cat= await found.categories; 
    
    //update
    let how_many_changes= await Movie.update({title: title, trailerUrl: trailerUrl, originalSourceUrl: originalSourceUrl,
    coverUrl: coverUrl, imdbId: imdbId, imdbScore: imdbScore, description: description,
    duration: duration, director: director, stars: stars, category : categories, releaseDate: releaseDate} ,{where:{id: id}});
    let newMovie=await Movie.findOne({where: {id: found.id}});
    
    res.json({
      old: 'Old movie data : ',
      oldMovie: oldMovie,
      new: 'New movie data : ', 
      newMovie: newMovie
    })
    
    }else {
      res.json({message:'Movie was not found in database.Check the id and try again'})
    }
    }else {
    res.json({
      message: 'Unauthorized'
    })
    }
    
    })


  






///DELETE ROUTE FOR ADMIN ONLY
router.delete('/movies/:id', async (req, res, next)=>{
  let id= req.params;
  let user= req.user;
  id= id.id;
  console.log(' \n id ', id );
  let found = await Movie.findOne({where: {id: id}});
  console.log('\n found ', found);
  console.log('\n user ', user);
  let rol=1;
  if(user.rol==1){
  if(found)
  {
  let MC=await  MovieCategory.findAll({where: {MovieId: found.id}});
  console.log('\n \n\n MC', MC);
  let decrement;
  let check_how_many=0;
  for(let i=0; i<MC.length; i++)
  {
    decrement= await Category.decrement('numberOfMovies', {where:{id: MC[i].CategoryId}});
    console.log('\n \n mc ', MC[i]);
    check_how_many++;
  }
  console.log('\n check how many', check_how_many);
  let check;
  let copy=found;
  check=await found.destroy();
  console.log('\n\n Am Distrus');
  res.json({
    message:'Movie deleted',
    Movie: copy,
  })
  
  }else{
  res.json({
  message: 'Requested movie not found. Maybe it was deleted already?'
  })
  }
  }else {
    res.json({
      message: 'You are not authorized to make this change'
    })
  }
    //todo delete from MovieCategory
  })







//Get movie by id route. GET
//Is accessible to all logged in users 
router.get('/movie/:id', async(req, res, next)=>{
  let id= req.params.id;
  var found = await Movie.findOne({where: { id : id }});
if(found)
{
  //return movie data
  res.json({
    movie: found
  })
}else{
  //return error
res.json({
  message: 'ERR 404. Movie not found'
})
}
})

//Admin route
//For adding a new category to the database. POST
router.post('/category', async function(req, res, next){
  var user= req.user;
  var name= req.body.name;
  
  var found= await Category.findOne({where: { name : name }});

  if(user.rol==1)
  {
   //is Admin : true
           if(found)
           {
      console.log('\n Nu poate fi introdus aceasta categorie deoarece este deja introdus');
      res.json({message: 'error 100500 Nu poate fi introdus aceasta categorie deoarece este deja introdus',
      user:user
    })
             }else{
      Category.create({name: name});
      console.log('\n Categorie creata cu succes');
      res.json({message: 'AM CREAT', user: user})
            }

  }else if(user.rol==2)
  {
    console.log('\n Err. No access');
    res.json({
      message: 'error 400. No access.'
    })
  }else {
    res.json({
      message:'error 100500. Do you want to log in ?'
    })
    console.log('\n error 100500. Do you want to log in ?');
  }
  })



//Get movies from query 
//for all logged in users
router.get('/movie/query', async(req, res, next)=>{
  let {limit, skip, from, to}= req.query;
  if(from == undefined)
  from=date.now();
  if(to == undefined)
  to=date.now();
  console.log(limit, skip);
  const where = {
    releaseDate: {
        [Op.between]: [from, to]
    }
  };
  if(skip==undefined){
  skip=0;}
  if(limit==undefined){
  limit= 99;}
    let found= await Movie.findAll({where, offset: skip, limit: limit});
    return res.json({
      movie: found })})




/* Nu mai este nevoie de ele
//Get all categories route. GET
router.get('/category', function (req, res) {
  Category.findAll().then( function(categories) {
    res.json(categories);
  });
 });

//Get category by id route. GET
router.get('/category/:id', function(req,res) {
  Category.findByPk(req.params.id).then( (category) => { category!=null?res.json(category):res.status(404).send({message:'Category not found'})}  );
 });
*/



//Change password route
//for all logged in users
router.post('/change', async(req, res, next)=>{

  let email= req.user.email;
  let oldPassword= req.body.oldPassword;
  let newPassword= req.body.newPassword;
  let confirmNewPassword= req.body.confirmNewPassword;

  //console.log('new password  ', newPassword, '    confirm new ', confirmNewPassword);

  let FindUser=await User.findOne({where:{email: email}});
  if(FindUser)
  {
    //console.log('\n USER GASIT', FindUser, '\n si old password ', oldPassword);
    let k1 = await User.isValidPassword(oldPassword, FindUser);
  if(k1)
  {
   // console.log('\n IS VALID TRUE ');
    if(newPassword==confirmNewPassword)
    {
    //  console.log('\n HAsh');
      var hash= await bcrypt.hash(newPassword, 10);
      let k = await User.update({passwordHash: hash}, {where: {email: FindUser.email}} ).then((result)=>{console.log(result);});
return res.json({message:'Password changed successfully'});
    }else { return res.json({message: 'New password is not the same as Confirm new password'})}

  }else {
return res.json({message:'Old password provided is not correct'})
  }
  }else {
  console.log('\n Email provided was not found');
  req.json({
    message:'Email provided was not found'
  })
  }
  })













//Add movie route for admin 

router.post('/movies/add', async (req, res, next) => {
   let user = req.user;
  let body=req.body;
   let helpCateg=body.category;
  // console.log('\n\n category din post add', helpCateg);
   if(helpCateg.length>1)
   helpCateg=helpCateg.split(',')
   let categories= body.category.trim(' ').split(',');
   let stringDate=body.releaseDate.split('-');
  let dateFormatdate= new Date(stringDate[0], stringDate[1] - 1, stringDate[2]);
  console.log('\n \n help Categ ', helpCateg);
   let title= req.body.title;
   helpCateg=categories;
   let catID;let newm;
   var found = await Movie.findOne({where: { title : title }});
   let rol=1;
 if(user.rol==1)
 {
 //is Admin : true
 if(found)
 {
 console.log('Movie with the same name already exists');
 res.json({
 message: 'Movie with the same name already exists',
 movieUrl: found.originalSourceUrl
 });
 }else {
 let newMovie= await Movie.create({title: body.title,
  trailerUrl: body.trailerUrl, 
  originalSourceUrl: body.originalSourceUrl , 
   coverUrl:body.coverUrl, imdbId:body.imdbId,
 imdbScore:body.imdbScore,
  description:body.description,
 duration: body.duration,
 director: body.director,
 stars: body.stars,
 category: helpCateg,
  releaseDate:dateFormatdate});
 for(let i=0; i<categories.length; i++)
 {
  catID=await Category.findOne({where: {name: categories[i]}});
 let k =  await Category.increment('numberOfMovies', {where: {name: categories[i]}}).then((result)=>{return result});
 newM=await MovieCategory.create({MovieId: newMovie.id, CategoryId: catID.id}).then((result)=>{return result});
 }
 res.json({
 message: 'The created movie is : ',
 title: newMovie.title,
 MovieIdfromDatabase: newMovie.id
 });
 //console.log('\nNew Movie created, Movie properties : ', newMovie);
 }
 }else if(rol==2)
 {
 //is Admin : false
 res.json({
 message: 'No Admin'
 })
 }else {
 //Should be impossible
 res.json({
 message: 'error 100500. No logged in user. Do you want to log in ? '
 })
 }
 });




  


 



module.exports = router;