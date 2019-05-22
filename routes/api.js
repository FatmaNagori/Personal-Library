/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var Book=require('../routes/issue.js')
module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      Book.find({},(err,data)=>{
        if(err){res.send(err)}
        else{
          var result=[];
          data.forEach(a=>{
           var obj={};
           obj._id=a._id
           obj.title=a.title
           obj.commentcount=a.comments.length
            result.push(obj)
          })
          res.json(result)
        }
      })
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      var title = req.body.title;
      if(title){
      var book=new Book({
        title:title,
        comments:[]
      })
      
      book.save((err,data)=>{
        if(err){console.log("Error "+err)}
        else{
         res.json({title:data.title,comments:data.comments,_id:data._id})}
      })}else{res.send('title required')}
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({},(err,data)=>{
        if(err){console.log(err)}
        else{res.send('complete delete successful')}
      })  
  });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
       Book.findById(bookid,(err,doc)=>{
         if(err){console.log(err)}
         else{if(doc==null){res.send('null')}
             else{res.json({_id:doc.id,title:doc.title,comments:doc.comments})}
             }
       })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      Book.findByIdAndUpdate(bookid,{$push:{comments:comment}},{new:true},(err,doc)=>{
        if(err){res.send(err)}
        else{if(doc==null){res.send('null')}
          else{res.json({_id:doc._id,title:doc.title,comments:doc.comments})}}
      })
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      Book.findByIdAndDelete(bookid,(err,doc)=>{
        if(err){console.log(err)}
        else{if(doc==null){res.send('could not delete')}
             else{res.send('delete successful')}
            }
      })
      //if successful response will be 'delete successful'
    });
  
};
