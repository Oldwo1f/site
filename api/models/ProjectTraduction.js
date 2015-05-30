/**
* ArticleTraduction.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  	schema: true,
    attributes: {
  		lang : {type:'string',required:true},
  		title : {type:'string',required:true},
      	content : {type:'text',defaultsTo:null},
      	description : {type:'text',defaultTso:null},
      	rewriteurl : {type:'string',defaultsTo:null},
      	keyword : {type:'string',defaultsTo:null},
  		  video:{type:'text',defaultsTo:null},
        description : {type:'text',defaultTso:null},
        project:{model:'project'},
       
    },
};

