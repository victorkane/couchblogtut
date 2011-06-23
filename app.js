
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

var ArticleProvider = require('./articleprovider-couchdb').ArticleProvider;
var articleProvider = new ArticleProvider();

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

app.get('/blog/view/:id', function(req,res){
  articleProvider.findById(req.params.id,
    function(error, doc){
      res.render('blog_view', {
      locals: {
        title: 'New Post',
        article: doc
      }
	});
  });
});

app.listen(3000);
console.log("Express server listening on port %d", app.address().port);
