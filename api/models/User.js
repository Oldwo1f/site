/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt = require('bcrypt');
module.exports = {

  	attributes: {
  		role: {type:'string',required:true},
	    civ: {type:'string',required:true},
	    name: {type:'string',required:true},
	    pseudo: {type:'string',unique:true,required:true},
	    email: {type:'string',required:true,unique:true,email:true},
	    phone: {type:'string',required:true},
	    company: {type:'string',required:true},
	    fonction: {type:'string'},
	    usename: {type:'boolean',required:true},
	    publishEmail: {type:'boolean',required:true},
	    publishPhone: {type:'boolean',required:true},
	    password:{type:'string',required:true},
	    changepasswordcomfirm : {type:'string'},
	    dateMember : {type:'date'},
	    lastActivity : {type:'date'},
	    image: {
            
        },
	    comparePassword:function(password, done) {
		  bcrypt.compare(password, this.password, function(err, isMatch) {
		    done(err, isMatch);
		  });
		}
  	},
  	beforeCreate:function(values,cb) {

		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(values.password, salt);
		// console.log(values);
		values.password = hash;
		cb();

	},
	beforeUpdate:function(values,cb) {
		console.log('BEFORE UPDATE');
		
		if(values.comfirmpassword)
		{
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(values.password, salt);
		values.password = hash;
		}
		cb();

	}
};

