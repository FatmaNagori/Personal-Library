var mongoose=require('mongoose');
mongoose.connect(process.env.DB,{useNewUrlParser:true,useFindAndModify:false});
var Schema=mongoose.Schema;
var BookSchema=new Schema({title:String,comments:Array});
var Book=mongoose.model('book',BookSchema);

module.exports=Book;
