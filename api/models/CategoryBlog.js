/**
* CategoryBlog.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  	schema: true,
  	attributes: {
  		name:{type:'string',required:true},
  		textColor:{type:'string',required:true},
  		color:{type:'string',required:true},
  		nbArticles:{type:'int',defaultsTo:0},
        translations: {
          collection: 'categoryblogtraduction',
          via:'categoryblog'
        }
	},
    beforeDestroy: function (values, cb) {
      	CategoryBlog.findOne(values.where.id).populateAll().exec(function(err,item) {
        
              async.map(item.translations,
              function(rep, callback){
                      if(rep){
                        CategoryBlogTraduction.destroy(rep.id,function(err,data) {
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
                  return cb(err)
                }else
                {
                  return cb(null)
                }
              });
          
      

      });
    }
};

