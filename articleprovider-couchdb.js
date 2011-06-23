var cradle = require('cradle');

ArticleProvider = function(host, port) {
  this.connection= new (cradle.Connection)(host, port, {
    cache: true,
    raw: false
  });
  this.db = this.connection.database('articles');
};

ArticleProvider.prototype.findAll = function(callback) {
    this.db.view('articles/all',function(error, result) {
      if( error ){
        callback(error)
      }else{
        var docs = [];
        result.forEach(function (row){
          docs.push(row);
        });
        callback(null, docs);
      } 
    });
};

ArticleProvider.prototype.findById = function(id, callback) {
    this.db.get(id, function(error, result) {
        if( error ) callback(error)
        else callback(null, result)
      });
};

ArticleProvider.prototype.save = function(articles, callback) {
    if( typeof(articles.length)=="undefined")
      articles = [articles];

    for( var i =0;i< articles.length;i++ ) {
      article = articles[i];
      article.created_at = new Date();
      if( article.comments === undefined ) article.comments = [];
      for(var j =0;j< article.comments.length; j++) {
        article.comments[j].created_at = new Date();
      }
    }

    this.db.save(articles, function(error, result) {
      if( error ) callback(error)
      else callback(null, articles);
    });
};

exports.ArticleProvider = ArticleProvider;