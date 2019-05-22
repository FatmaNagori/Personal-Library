/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var Book=require('../routes/issue')

var create=function(done,title,cb){
  var book=new Book({title:title,comments:[]})
  book.save((err,data)=>{
    if(err){ console.log(err);done();}
    else{if (cb){cb(data._id)};
        done();}
  })
}
var deleteBook=function(done,filter){
  const filterKey = Object.keys(filter)[0];
  Book.findOneAndDelete(filter,(err,data)=>{
    if(err){console.log(err);done();}
    else{done();}
  })
}

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      after(function(done){
        deleteBook(done,{title:'Maths'})
      })
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title:'Maths'})
          .end(function(err,res){
             assert.equal(res.status, 200);
             assert.equal(res.body.title, "Maths")
             done();
          })
        
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .end(function(err,res){
             assert.equal(res.status,200);
             assert.equal(res.text,'title required')
             done();
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err,res){
            assert.equal(res.status,200)
            assert.isArray(res.body)
            done();
        })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      var title="chemistry"
      var testId;
      before(function(done){
        create(done,title,function(id){
          testId=id
          return;
        })
      })
      after(function(done){
        deleteBook(done,{_id:testId})
      })
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/000000000000000000000000')
          .end(function(err,res){
              assert.equal(res.status,200)
              assert.equal(res.text,'null')
              done();
          }) 
        
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        var url='/api/books/'+testId;
        chai.request(server)
          .get(url)
          .end(function(err,res){
            assert.equal(res.status,200)
            assert.equal(res.body._id,testId)
            done();
        })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      var title="Physics";
        var testId;
        before(function(done){
         create(done,title,function(id){
          testId=id
          return;
        })
        }) 
        after(function(done){
         deleteBook(done,{_id:testId})
        })
      test('Test POST /api/books/[id] with comment', function(done){
        var url='/api/books/'+testId
        chai.request(server)
          .post(url)
          .send({comment:'Nice Explaination'})
          .end(function(err,res){
             assert.equal(res.status,200)
             assert.equal(res.body.comments[0],'Nice Explaination')
             assert.equal(res.body._id,testId)
             done();
          })       
      });
      
    });

  });

});
