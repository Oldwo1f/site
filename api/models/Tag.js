/**
* Tag.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  	schema: true,
  	attributes: {
  		text:{type:'string',required:true},
  		nbDocuments:{type:'int',defaultsTo:0},
  		nbArticles:{type:'int',defaultsTo:0},
  		nbProjects:{type:'int',defaultsTo:0},
	}
};

