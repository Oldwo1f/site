/**
* Article.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  	schema: true,
    attributes: {
  		lang : {type:'string',defaultsTo:'fr'},
  		title : {type:'string',required:true},
      	content : {type:'text',defaultsTo:null},
      	shortcontent : {type:'text',defaultsTo:null},
      	description : {type:'text',defaultTso:null},
      	rewriteurl : {type:'string',defaultsTo:null},
      	keyword : {type:'string',defaultsTo:null},
  		date : {type:'datetime',required:true},
  		nbView : {type:'int',defaultsTo:0},
  		status : {type:'string',required:true},
  		tags:{collection:'tag'},
      publishVideo:{type:'boolean',defaultsTo:false},
  		activeComent:{type:'boolean',defaultsTo:true},
  		video:{type:'text',defaultsTo:null},
  		category: {
            model: 'categoryBlog'
        },
        author: {
    			model: 'user'
    		},
        images: {
            collection: 'imagearticle',
            via:'article'
        },
        documents: {
            collection: 'documentarticle',
            via:'article'
        },
        comments: {
          collection: 'comment',
          via:'article'
        },
        translations: {
          collection: 'articletraduction',
          via:'article'
        }
    },
    beforeDestroy: function (values, cb) {
      Article.findOne(values.where.id).populateAll().exec(function(err,item) {
        async.parallel({
          comment:function(callb) {
              async.map(item.comments,
              function(rep, callback){
                      if(rep){
                        Comment.destroy(rep.id,function(err,data) {
                          callback(null)
                        })
                      }
                      else{
                        callback(null)
                      }
              },
              function(err, results){
                if (err) {
                  console.log('ERRRRRRRROR');
                  sails.log(err)
                  return callb(err)
                }else
                {
                  return callb(null)
                }
              });
          },
          imagearticle:function(callb) {
              async.map(item.images,
              function(rep, callback){
                      if(rep){
                        Imagearticle.destroy(rep.id,function(err,data) {
                          console.log('DESTROY Img',data);
                          callback(null)
                        })
                      }
                      else{
                        callback(null)
                      }
              },
              function(err, results){
                if (err) {
                  console.log('ERRRRRRRROR');
                  sails.log(err)
                  return callb(err)
                }else
                {
                  return callb(null)
                }
              });
          },
          documentarticle:function(callb) {
              async.map(item.documents,
              function(rep, callback){
                      if(rep){
                        Documentarticle.destroy(rep.id,function(err,data) {
                          callback(null)
                        })
                      }
                      else{
                        callback(null)
                      }
              },
              function(err, results){
                if (err) {
                  console.log('ERRRRRRRROR');
                  sails.log(err)
                  return callb(err)
                }else
                {
                  return callb(null)
                }
              });
          },
          tags:function(callb) {
              async.map(item.tags,
              function(rep, callback){
                      if(rep){
                        Tag.findOne(rep.id,function(err,data) {
                          if(data){
                            data.nbArticles=Number(data.nbArticles)-1
                            data.save(function() {
                              callback(null)
                            })
                          }
                        })
                      }
                      else{
                        callback(null)
                      }
              },
              function(err, results){
                if (err) {
                  console.log('ERRRRRRRROR');
                  sails.log(err)
                  return callb(err)
                }else
                {
                  return callb(null)
                }
              });
          },
          trads:function(callb) {
              async.map(item.translations,
              function(rep, callback){
                      if(rep){
                        ArticleTraduction.destroy(rep.id,function(err,data) {
                          callback(null)
                        })
                      }
                      else{
                        callback(null)
                      }
              },
              function(err, results){
                if (err) {
                  console.log('ERRRRRRRROR');
                  sails.log(err)
                  return callb(err)
                }else
                {
                  return callb(null)
                }
              });
          },
          cat:function(callb) {
              
                      if(item.category){
                        console.log(item.category);
                        CategoryBlog.findOne(item.category.id).exec(function(err,data) {
                          console.log(data);
                          data.nbArticles= data.nbArticles-1;
                          data.save().then(function (err,res) {
                             callb(null)
                          })
                        })
                      }
                      else{
                        callb(null)
                      }
              
          }
        },function(err,results) {
          return cb();
        })
      

      });
    }
};

