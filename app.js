
/**
 * Couchblog Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.logger());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var ArticleProvider = require('./articleprovider-memory').ArticleProvider;
var articleProvider = new ArticleProvider();

// Routes

//app.get('/', function(req, res){
//  res.render('index', {
//    title: 'CouchBlog'
//  });
//});

app.get('/', function(req, res){
  articleProvider.findAll(function(error, docs){
    res.render('index.jade', {
      locals: {
        title: 'Blog',
        articles: docs
      }
    });
  })
});

app.get('/blog/new', function(req,res){
  res.render('blog_new', {
	locals: {
	title: 'New Post'
    }
  });
});

app.post('/blog/new', function(req,res){
  articleProvider.save({
    title: req.param('title'),
    body: req.param('body')
  }, function(error, docs) {
    res.redirect('/')
  });
});

app.listen(3000);
console.log("Express server listening on port %d", app.address().port);
