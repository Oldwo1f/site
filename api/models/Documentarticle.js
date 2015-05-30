
/**
* Imagearticle.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  	schema: true,
    attributes: {
  		rank : {type:'int'},
  		document:{model:'document'},
  		article:{model:'article'},
  		project:{model:'project'},
  		
    },
};

