/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var jwt = require('jwt-simple');
// var moment = require('moment');
// var bcrypt = require('bcryptjs');
var passgen = require('password-generator');
var moment = require('moment');
var directTransport = require('nodemailer-direct-transport');
moment.locale('fr', {
    months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
    monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
    weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
    weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
    weekdaysMin : "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
    longDateFormat : {
        LT : "HH:mm",
        LTS : "HH:mm:ss",
        L : "DD/MM/YYYY",
        LL : "D MMMM YYYY",
        LLL : "D MMMM YYYY LT",
        LLLL : "dddd D MMMM YYYY LT"
    },
    calendar : {
        sameDay: "[Aujourd'hui à] LT",
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: 'L'
    },
    relativeTime : {
        future : "dans %s",
        past : "il y a %s",
        s : "quelques secondes",
        m : "une minute",
        mm : "%d minutes",
        h : "une heure",
        hh : "%d heures",
        d : "un jour",
        dd : "%d jours",
        M : "un mois",
        MM : "%d mois",
        y : "une année",
        yy : "%d années"
    },
    ordinalParse : /\d{1,2}(er|ème)/,
    ordinal : function (number) {
        return number + (number === 1 ? 'er' : 'ème');
    },
    meridiemParse: /PD|MD/,
    isPM: function (input) {
        return input.charAt(0) === 'M';
    },
    // in case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example)
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */
    // },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});
// var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
// var directTransport = require('nodemailer-direct-transport');
module.exports = {
	login:function(req,res) {
		function createToken(req, user,data) {
		  var payload = {
		    iss: req.hostname,
		    data:data,
		    sub: user.id,
		    iat: moment().valueOf(),
		    exp: moment().add(14, 'days').valueOf()
		  };
		  return jwt.encode(payload, sails.config.TOKEN_SECRET);
		}
		var errormes = res.__('Erreur d\'email ou de mots de passe');
 		User.findOne({ email: req.body.email }).exec(function(err, user) {
		    if (!user) {
		      return res.status(401).send({ message: errormes});
		    }
		    user.comparePassword(req.body.password, function(err, isMatch) {
		      if (!isMatch) {
		        return res.status(401).send({ message: errormes});
		      }
		      var d={};
		      if(user.role=='admin')
		      		d.intern=true;

		      d.role=user.role;
		      res.send({ token: createToken(req, user,d) });
		    });
	  	});
	},
	add : function(req,res,next) {
		console.log('ADDUSER');
		var user=req.body;
	    var salt = passgen();
	    sails.log('salt='+salt)
	    user.password = salt;
		// });
				if(user.role=="member")
					user.dateMember= new Date();
				console.log('CREATE USER ____');
				console.log(user);
				console.log('____');
				User.create(user).exec(function (err,created){

			    	console.log(created);
					if(err)
					{
						console.log('create err -->');
						console.log(err);
						res.status(400).send({error:err})
					}else{

				  	//ENVOI DU MDP PAR EMAIL
						var transporter = nodemailer.createTransport({
							    service: 'Gmail',
							    auth: {
							        user: sails.config.MAIN_EMAIL_GOOGLE,
							        pass: sails.config.MAIN_EMAIL_GOOGLE_PWD
							    }
						})

					

						var mailOptions = {
						    from: sails.config.COMPANY_NAME+' <'+sails.config.MAIN_EMAIL+'>', // sender address
						    to: created.email, // list of receivers
						    subject: 'Votre mot de passe est arrivé', // Subject line
						    text: 'Voici le mot de passe qui vous servira pour vots premières connexions.Pensez à le changer rapidement \n \nMot de passe: '+ salt+'\n \nCordialement, l\'équipe '+sails.config.COMPANY_NAME+' \n'// html body
						};

						// send mail with defined transport object
						transporter.sendMail(mailOptions, function(error, info){
						    if(error){
						        res.status(200).send(created);
						    }else{



								Notification.create({type:'usercreated',status:'ok',info1:created.name,info2:created.email}).exec(function (err,notif){
									
									console.log('Notification created',notif);
									Notification.publishCreate(notif,req)
						    		res.status(200).send(created);
						    	
						    	});
						    }
						});

					  	
					  }
				});

	}, 
	testmail:function (req,res) {

		console.log("testMAIl");
		  			// var transporter = nodemailer.createTransport(directTransport());
					
	},
	fetchMe:function(req,res) {
		console.log('fetchMe');
		console.log(req.user);
		User.findOne({id:req.user}).exec(function (err, user) {
			if(err)
				res.status(401).send(err)
			console.log(err);
			console.log('founded',user);
		    res.send(user);
		});
	},
	update:function (req,res,next) {
		
		
		User.findOne(req.body.id).exec(function (err,user){
			if(err) res.status(400).send({error:err})
			var prevuser = user;
			console.log(prevuser);
			if(prevuser.role == 'user' && req.body.role == 'member')
			{
					req.body.dateMember= new Date();
			}
			if(prevuser.role == 'member' && req.body.role == 'user')
			{
					req.body.dateMember= null;
			}
			User.update(req.body.id,req.body).exec(function (err,user2){
				console.log('update');
				if(err) res.status(400).send({error:err})
				user = user2[0]
				console.log(user);
			console.log(prevuser.role);
			console.log(user.role);
				if(prevuser.role == 'user' && user.role == 'member')
				{
					
					Notification.create({type:'newmember',content:'Nouveau membre'}).exec(function (err,notif){
								console.log(notif)
								Notification.publishCreate(notif,req)
					    		// res.status(200).send(created);
					    	// res.status(200).send(user)
					});
				}
				
					res.status(200).send(user)
			});
		});
	},
	editProfile:function (req,res,next) {
			delete req.body.role;
			if(!req.body.image)
			delete req.body.image;

			User.update(req.body.id,req.body).exec(function (err,user2){
				if(err) res.status(400).send({error:err})
				user = user2[0]
					res.status(200).send(user)
			});
	},
	changePass:function (req,res,next) {

		console.log('changePass');
		console.log(req.body);

		if(req.body.newpwd != req.body.comfirm){
			console.log('this');
			res.status(400).send({err:'comfirm'});
		}else{


		User.findOne(req.user).exec(function(err,user) {

			
			if(err)
				res.status(200).send(err);

			user.comparePassword(req.body.pwd, function(err, isMatch) {
		      	if (!isMatch) {
		        	return res.status(400).send({ message: 'password'});
		      	}else{
			      	user.comfirmpassword = req.body.comfirm
			      	user.password = req.body.comfirm
			      	user.save(function(err,u) {
			      		console.log(err);
			      		res.send({message:'ok'})
			      	})
		      	}
		     	
		    });

		})
		}
			// delete req.body.role;
			// if(!req.body.image)
			// delete req.body.image;

			// User.update(req.body.id,req.body).exec(function (err,user2){
			// 	if(err) res.status(400).send({error:err})
			// 	user = user2[0]
			// 		res.status(200).send(user)
			// });
	},
	recupPassword: function(req,res) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!re.test(req.params.email))
		{
			return res.status(400).send({error:'Invalid mail'})
		}
			// var transporter = nodemailer.createTransport({
			//     service: 'Mailgun',
			//     auth: {
			//         user: sails.config.MG_LOGIN,
			//         pass: sails.config.MG_PASS
			//     },
			// });
		var salt = passgen();

		User.findOne({email:req.params.email}).exec(function(err,user) {
			if (err || typeof(user)!='object')
			{
				return res.status(400).send({error:'Invalid mail'})
			}
			console.log(user);
			console.log('-------------');
			console.log(sails.config.COMPANY_DOMAIN);
			var link = sails.config.COMPANY_DOMAIN+'/changepassword/'+salt
			var transporter = nodemailer.createTransport({
						    service: 'Gmail',
						    auth: {
						        user: sails.config.MAIN_EMAIL_GOOGLE,
						        pass: sails.config.MAIN_EMAIL_GOOGLE_PWD
						    }
			})
			console.log(link);
			console.log(salt);
			user.changepasswordcomfirm = salt;
			
			user.save(function() {
				if (err)
					return res.status(400).send({error:'erreur'})

				var mailOptions = {
				    from: sails.config.COMPANY_NAME+' <'+sails.config.MAIN_EMAIL+'>', // sender address
				    to: req.params.email, // list of receivers
				    subject: 'Demande de récupération de mot de passe', // Subject line
				    html: 'Vous avez demander un récupération de mot de passe. \n'+
				    '<br>Pour recevoir un nouveau mots de passe par email, veuillez cliquer sur le lien suivant: <a href="'+link+'">'+link+'</a> \n'+ 
				    '<br>Si vous n\'êtes pas à l\'origine de cette demande de récupération, ignorez simplement cet email \n\n\n'+
				    '<br>Cordialement, l\'équipe '+sails.config.COMPANY_NAME+' \n'
				};

				// send mail with defined transport object
				transporter.sendMail(mailOptions, function(error, info){
					console.log(error);
					console.log(info);
				    if(error){
				        res.status(400).send(error);
				    }else{
				    	res.status(200).send(info);
				    }
				});
			})
			// NB! No need to recreate the transporter object. You can use
			// the same transporter object for all e-mails

			// setup e-mail data with unicode symbols
			
		})
		  	
	},
	changepassword: function(req,res) {

		User.findOne({changepasswordcomfirm:req.params.comfirm}).exec(function(err,user) {
			
			console.log(user);

			var salt = passgen();
	    	sails.log(salt)
	    	user.changepasswordcomfirm='';
	    	user.password = salt;
	    	user.comfirmpassword = salt;

	    	user.save(function() {
	    		console.log('errSaveuser');


			  	//ENVOI DU MDP PAR EMAIL
			  	var transporter = nodemailer.createTransport({
						    service: 'Gmail',
						    auth: {
						        user: sails.config.MAIN_EMAIL_GOOGLE,
						        pass: sails.config.MAIN_EMAIL_GOOGLE_PWD
						    }
				})
			 
				var mailOptions = {
				    from: sails.config.COMPANY_NAME+' <'+sails.config.MAIN_EMAIL+'>', // sender address
				    to: user.email, // list of receivers
				    subject: 'Votre nouveau mot de passe est arrivé', // Subject line
				    text: '\n \nMot de passe: '+ salt+'\n \nCordialement, l\'équipe '+sails.config.COMPANY_NAME// html body
				};

				// send mail with defined transport object
				transporter.sendMail(mailOptions, function(error, info){
				    if(error){
				        res.status(400).send('Veuillez contacter l\'administrateur');
				    }else{
				    	res.status(200).send('Votre nouveau mots de passe va arriver par email');
				    }
				});
		
	    	})
		})
		  	
	},
	verifyUniqueEmail:function(req,res,next) {

		console.log("HERE VErify Email");
		User.findOne({email: req.params.email }).exec(function (err,user){
			console.log(user);
			setTimeout(function() {
			console.log(typeof(user));
			if(err){
				console.log(err);
				res.status(404).send({exist:false})
			}
			if(typeof(user) !='undefined')
			{	
				console.log("oktoGo");
				res.status(200).send()
			}else{

				res.status(410).send({exist2:false})
			}

			},1000)
		});
	},
	verifyUniquePseudo:function(req,res,next) {

		console.log("HERE VErify Pseudo");
		User.findOne({pseudo: req.params.pseudo }).exec(function (err,user){
			console.log(user);
			console.log('start');
			setTimeout(function() {
				console.log('delay');
				if(err){
					console.log(err);
					res.status(404).send({exist1:false})
				}

				if(typeof(user) !='undefined')
				{
					res.status(200).send()
				}else{

					res.status(410).send({exist2:false})
				}
			},1000)
		});
	},
	getauthorlist:function(req,res,next) {
		console.log("HERE fetchUsers");

		
		
				User.find({role:'admin'}).sort("pseudo DESC").exec(function (err,users){
					console.log('FINDUSER');
					if(err){
						res.status(401).send(err);
					}
					else{
						res.status(200).send(users)
					}
						
				});
		   

	},
	fetchUsers:function(req,res,next) {
		console.log("HERE fetchUsers");

		console.log(req.params);
		console.log(req.query);
		var filter = {}
		console.log('req.params');
		console.log();
		filter.page = req.query.page || 1;
		filter.perPage = req.query.perPage || 10;
		filter.order = req.query.order || 'date DESC';

		console.log(filter.order);
		filter.role=[]
		console.log(req.query.membre);
		if(req.query.member=='false'){

		}else{
			filter.role.push('member')
		}if(req.query.admin=='false'){

		}else{
			filter.role.push('admin')
		}if(req.query.user=='false'){

		}else{
			filter.role.push('user')
		}
		console.log(filter.role);
		filter.slug = req.query.slug || '';
		// var nbPerPage = 30;

		async.parallel({
		    users:function(callback){
		    	// callback(null, 'emailOk');
		    		console.log('filterPage========================>' +filter.page);
				User.find({role:filter.role, or : [{name:{'contains':filter.slug}},{email:{'contains':filter.slug}},{pseudo:{'contains':filter.slug}}]}).sort(filter.order).limit(filter.perPage).skip(filter.perPage*filter.page-filter.perPage).exec(function (err,users){
					console.log('FINDUSER');
					sails.log(err);
						if(err)
							callback(err)
						callback(null,users)
						// res.status(200).send({users:users,total:})
						
				});
		    },
		    countuser:function(callback){

		    	console.log('COUNTUSER');
		            User.count({role:filter.role, or : [{name:{'contains':filter.slug}},{email:{'contains':filter.slug}},{pseudo:{'contains':filter.slug}}]}).exec(function (err,count){
		            	sails.log(err);
						if(err)
							callback(err)
						callback(null,count)
						// res.status(200).send({users:users,total:})
						
				});
		    }
		},
		function(err, results){
				console.log('parrarell error');
				sails.log(err);
				// console.log(results);
			if(err){

				res.status(401).send(err);
			}
			else{

				res.status(200).send({users:results.users,total:results.countuser})
			}

			

		});

	},
	graphUsers:function(req,res) {
		console.log('GRAPH USERS');
		var now = moment(new Date())

		// console.log(now.subtract(1, 'w').toDate());
		// console.log(now.subtract(1, 'M').toDate());
		// console.log(now.subtract(2, 'M').toDate());
		User.find().sort('createdAt ASC').limit(1).exec(function(err, data) {
			if(err)
				res.send(err)
			console.log(data);
			var dateStart = moment(data[0].createdAt);
			
			if(req.params.period=="month")
			{
				var datearray=[];
				datearray[0]={label : now.format("D MMMM"),time:now.clone().toDate()};
				now.subtract(1, 'w')
				datearray[1]={label : now.format("D MMMM"),time:now.clone().toDate()};
				now.subtract(1, 'w')
				datearray[2]={label : now.format("D MMMM"),time:now.clone().toDate()};
				now.subtract(1, 'w')
				datearray[3]={label : now.format("D MMMM"),time:now.clone().toDate()};
				now.subtract(1, 'w')
				datearray[4]={label : now.format("D MMMM"),time:now.clone().toDate()};
				now.subtract(1, 'w')
				datearray[5]={label : now.format("D MMMM"),time:now.clone().toDate()};
				now.subtract(1, 'w')
				datearray[6]={label : now.format("D MMMM"),time:now.clone().toDate()};
				now.subtract(1, 'w')
				datearray[7]={label : now.format("D MMMM"),time:now.clone().toDate()};
			}
			if(req.params.period=="week")
			{
				var datearray=[];
				datearray[0]={label : now.format("dddd D"),time:now.clone().toDate()};
				now.subtract(1, 'd')
				datearray[1]={label : now.format("dddd D"),time:now.clone().toDate()};
				now.subtract(1, 'd')
				datearray[2]={label : now.format("dddd D"),time:now.clone().toDate()};
				now.subtract(1, 'd')
				datearray[3]={label : now.format("dddd D"),time:now.clone().toDate()};
				now.subtract(1, 'd')
				datearray[4]={label : now.format("dddd D"),time:now.clone().toDate()};
				now.subtract(1, 'd')
				datearray[5]={label : now.format("dddd D"),time:now.clone().toDate()};
				now.subtract(1, 'd')
				datearray[6]={label : now.format("dddd D"),time:now.clone().toDate()};
				now.subtract(1, 'd')
				datearray[7]={label : now.format("dddd D"),time:now.clone().toDate()};
			}
			if(req.params.period=="year")
			{
				var datearray=[];
				datearray[0]={label : now.format("MMMM"),time:now.clone().toDate()};
				now.subtract(1, 'M')
				datearray[1]={label : now.format("MMMM"),time:now.clone().toDate()};
				now.subtract(1, 'M')
				datearray[2]={label : now.format("MMMM"),time:now.clone().toDate()};
				now.subtract(1, 'M')
				datearray[3]={label : now.format("MMMM"),time:now.clone().toDate()};
				now.subtract(1, 'M')
				datearray[4]={label : now.format("MMMM"),time:now.clone().toDate()};
				now.subtract(1, 'M')
				datearray[5]={label : now.format("MMMM"),time:now.clone().toDate()};
				now.subtract(1, 'M')
				datearray[6]={label : now.format("MMMM"),time:now.clone().toDate()};
				now.subtract(1, 'M')
				datearray[7]={label : now.format("MMMM"),time:now.clone().toDate()};
				now.subtract(1, 'M')
				datearray[8]={label : now.format("MMMM"),time:now.clone().toDate()};
				now.subtract(1, 'M')
				datearray[9]={label : now.format("MMMM"),time:now.clone().toDate()};
				now.subtract(1, 'M')
				datearray[10]={label : now.format("MMMM"),time:now.clone().toDate()};
				now.subtract(1, 'M')
				datearray[11]={label : now.format("MMMM"),time:now.clone().toDate()};
			}
			if(req.params.period=="full")
			{

				var diff=now.diff(dateStart);
				var section = diff/10;
				var datearray=[];
				datearray[0]={label : now.format("DD/MM/YYYY"),time:now.clone().toDate()};
				now.subtract(section, 'ms')
				datearray[1]={label : now.format("DD/MM/YYYY"),time:now.clone().toDate()};
				now.subtract(section, 'ms')
				datearray[2]={label : now.format("DD/MM/YYYY"),time:now.clone().toDate()};
				now.subtract(section, 'ms')
				datearray[3]={label : now.format("DD/MM/YYYY"),time:now.clone().toDate()};
				now.subtract(section, 'ms')
				datearray[4]={label : now.format("DD/MM/YYYY"),time:now.clone().toDate()};
				now.subtract(section, 'ms')
				datearray[5]={label : now.format("DD/MM/YYYY"),time:now.clone().toDate()};
				now.subtract(section, 'ms')
				datearray[6]={label : now.format("DD/MM/YYYY"),time:now.clone().toDate()};
				now.subtract(section, 'ms')
				datearray[7]={label : now.format("DD/MM/YYYY"),time:now.clone().toDate()};
				now.subtract(section, 'ms')
				datearray[8]={label : now.format("DD/MM/YYYY"),time:now.clone().toDate()};
				now.subtract(section, 'ms')
				datearray[9]={label : now.format("DD/MM/YYYY"),time:now.clone().toDate()};
				
			}






			async.each(datearray,
			    function(item, callback){
			        	User.count({where:{'role':'member',dateMember:{'<':item.time}}}).exec(function (err,datas) {
			        		if(err) callback(err);
			    			datearray[datearray.indexOf(item)].memberData = datas;
			            	callback();
			        	})
			    }
			,
			function(err){
				async.each(datearray,
			    function(item, callback){
			        	User.count({where:{'role':'user',createdAt:{'<':item.time}}}).exec(function (err,datas) {
			        		if(err) callback(err);
			    			datearray[datearray.indexOf(item)].userData = datas;
			            	callback();
			        	})
			    }
				,
				function(err){
					res.send(datearray)
				});
			});
			



		});
		
		
	},
	graphUsers2:function(req,res) {
		console.log('GRAPH USERS2');
		var now = moment(new Date())
		console.log(req.params.role);
		// console.log(now.subtract(1, 'w').toDate());
		// console.log(now.subtract(1, 'M').toDate());
		// console.log(now.subtract(2, 'M').toDate());
		
				var datearray=[];
				now.subtract(1, 'd')
				datearray[0]= now.clone().toDate();
				now.add(1, 'd')
				now.subtract(1, 'w')
				datearray[1]= now.clone().toDate();
				now.add(1, 'w')
				now.subtract(1, 'M')
				datearray[2]= now.clone().toDate();
				now.add(1, 'M')
				now.subtract(6, 'M')
				datearray[3]= now.clone().toDate();
				// now.add(6, 'M')

				console.log(datearray);

						
				if(req.params.role=="all")
					req.params.role=['user','member'];

				var datasFinal=[];
				async.parallel([
						function(callback){
				        	User.count({where:{role:req.params.role,lastActivity:{'>':datearray[0]}}}).exec(function (err,datas) {
				        		if(err) callback(err);
				            	callback(err,datas);
				        	})
			    		},
						function(callback){
				        	User.count({where:{role:req.params.role,lastActivity:{'>':datearray[1]}}}).exec(function (err,datas) {
				        		if(err) callback(err);
				            	callback(err,datas);
				        	})
			    		},
						function(callback){
				        	User.count({where:{role:req.params.role,lastActivity:{'>':datearray[2]}}}).exec(function (err,datas) {
				        		if(err) callback(err);
				            	callback(err,datas);
				        	})
			    		},
						function(callback){
				        	User.count({where:{role:req.params.role,lastActivity:{'>':datearray[3]}}}).exec(function (err,datas) {
				        		if(err) callback(err);
				            	callback(err,datas);
				        	})
			    		},
						function(callback){
				        	User.count({where:{role:req.params.role,lastActivity:{'<':datearray[3]}}}).exec(function (err,datas) {
				        		if(err) callback(err);
				            	callback(err,datas);
				        	})
			    		}
					]
			    ,
				function(err,results){
					
					res.send(results)
				});
			
			



		
		
		
	},
	fixtureUser:function(req,res) {
		console.log('fixtureUser');
		// var dataUsers = {"cols":["name","pseudo","email","phone","company","role","publishEmail","publishPhone","usename","password","civ","dateMember","createdAt","lastActivity"],"data":[["Casey Mcmillan","Jemima","vitae@Duisacarcu.co.uk","08 96 76 10 61","Enim Curabitur Consulting","user","true","true","false","a","M.","1404863135","1412204193","1425337208"],["Erasmus Hicks","Miranda","turpis.vitae.purus@massa.ca","05 52 85 76 37","Orci In Consequat PC","member","true","false","false","a","Mlle","1414364614","1418292973","1399296285"],["Constance Terry","Jacob","interdum.Curabitur.dictum@morbi.org","01 82 42 77 38","Ornare Sagittis Felis Industries","member","false","true","false","a","Mlle","1404809535","1396419673","1420372103"],["Orlando Oconnor","Ina","rutrum@eu.org","02 56 15 50 87","Mi Pede Corp.","member","true","false","false","a","Mme","1397106473","1407640512","1398685882"],["Oleg Castro","Evangeline","per@volutpatNullafacilisis.net","08 02 72 33 74","Est Nunc Laoreet Incorporated","user","true","false","true","a","Mlle","1417209502","1422680857","1403275058"],["Zane Alston","Cameron","sit.amet@variuseteuismod.net","05 05 47 64 01","Nisi Ltd","user","false","false","true","a","Mlle","1425678559","1397388378","1409726555"],["Vivien Massey","Raphael","Donec.fringilla.Donec@quam.net","04 37 43 05 42","Mauris Blandit Enim Foundation","member","false","true","true","a","Mlle","1397201635","1419536973","1416665051"],["Callie Allison","Damon","elementum.at.egestas@pharetraut.org","07 23 64 15 08","Dolor Inc.","member","true","true","true","a","Mlle","1411499494","1403150562","1413081396"],["Carlos Taylor","Eaton","vulputate.posuere@risus.net","04 19 94 59 33","Dapibus Limited","user","true","true","false","a","Mme","1411202893","1396689023","1401502448"],["Veda Hammond","Yoko","Fusce@temporbibendum.ca","02 98 52 54 23","Ac Associates","member","false","false","true","a","Mme","1398015921","1398213292","1402756510"],["Octavius Weiss","Azalia","auctor.quis.tristique@loremDonec.org","01 31 29 39 27","Condimentum Donec At Institute","member","true","false","false","a","Mme","1406171053","1396490716","1397013142"],["Dane Roth","Urielle","orci.consectetuer.euismod@arcuvelquam.edu","03 89 31 15 21","Vehicula Et Limited","user","false","false","false","a","Mlle","1407590621","1420208247","1421044488"],["John Garcia","Bert","sit.amet.faucibus@nec.org","06 73 53 62 53","Sodales Associates","member","false","true","false","a","M.","1423663450","1422193499","1394979526"],["Alexa Wilson","Blythe","ullamcorper.nisl.arcu@ettristiquepellentesque.edu","02 10 18 54 85","Duis A Mi Associates","member","false","true","false","a","M.","1402303285","1397729546","1417706855"],["Blossom Hill","Quinn","ac.tellus.Suspendisse@Integer.co.uk","01 77 65 29 51","Ultrices LLC","member","false","false","false","a","M.","1403632812","1408679028","1395263210"],["Dorothy Cortez","Tatum","tortor@Morbinonsapien.net","04 71 04 90 33","Eu Eros Foundation","member","false","true","false","a","Mlle","1399309873","1423423814","1417462778"],["Cara Clayton","Hall","ante.iaculis.nec@eunulla.edu","03 48 67 40 85","Nulla Associates","user","false","false","true","a","Mlle","1420780867","1400706002","1404021573"],["Jerry Odom","Zoe","mauris.Suspendisse@Morbinon.com","04 22 10 02 68","Urna Nullam Lobortis Company","user","false","true","false","a","Mme","1394463447","1421664900","1401680928"],["Rashad Hernandez","Jessamine","justo.nec.ante@famesacturpis.org","03 57 54 62 89","Ultrices LLP","user","false","false","true","a","M.","1398328223","1402957946","1399389074"],["Rina Sosa","Melissa","parturient@justo.ca","01 74 67 82 90","Faucibus PC","member","false","false","true","a","M.","1412465895","1398270872","1417301683"],["Wendy Jarvis","Josephine","quam@etrisus.co.uk","06 93 38 12 45","Ac Arcu LLP","member","false","true","true","a","Mlle","1425399633","1399274875","1401171079"],["Eaton Doyle","Leah","ultrices.mauris.ipsum@nonarcu.org","06 67 96 44 14","Elit Limited","user","false","false","false","a","M.","1410231621","1394717725","1401791938"],["Buffy Johnson","Lisandra","enim.Curabitur@lorem.co.uk","09 47 07 08 79","Pellentesque Habitant LLC","member","false","true","false","a","Mlle","1422134867","1424677504","1413687128"],["Uriah Britt","Griffith","malesuada@facilisis.co.uk","07 97 65 82 87","A Associates","user","false","false","true","a","Mlle","1400797888","1419827473","1399587938"],["Hu Boyle","Wallace","lacus.vestibulum.lorem@ornare.edu","05 57 41 50 36","Eu Accumsan Sed Consulting","member","true","false","false","a","M.","1410019057","1396165236","1424115047"],["Roanna Hooper","Shana","tincidunt.nibh.Phasellus@acturpisegestas.com","05 05 41 34 01","Aliquet Industries","member","false","false","false","a","Mme","1412573661","1407887999","1412967476"],["Patricia Patrick","Kathleen","magna@ante.ca","03 53 03 18 63","Eget Foundation","user","false","true","false","a","M.","1394917532","1419106940","1424669856"],["Joy Howe","Paki","at.pede.Cras@faucibusleoin.co.uk","05 87 69 68 04","Gravida Non Sollicitudin Limited","user","false","false","true","a","Mlle","1415857777","1401005245","1402580225"],["Keefe Morales","Bruce","Proin@semPellentesqueut.ca","05 80 35 06 76","Duis Elementum Dui Industries","user","true","true","false","a","Mme","1408381503","1405322373","1422743047"],["Hector Herrera","Mufutau","lectus.Cum@accumsanconvallis.com","07 59 81 11 35","Vestibulum Institute","member","true","false","false","a","M.","1413817096","1411924830","1395623303"],["Jeanette Edwards","Marshall","non.feugiat.nec@Vestibulum.org","08 36 51 41 71","Turpis PC","user","false","false","false","a","Mlle","1417762779","1421722369","1400469239"],["Rhiannon Hull","Jordan","gravida.Praesent@parturientmontes.edu","09 48 37 04 51","Sem Molestie Sodales Incorporated","member","true","false","true","a","Mme","1412980943","1394895891","1411088157"],["Gloria Mccarty","Raja","mattis.velit@montesnascetur.edu","08 23 15 05 34","Mauris A PC","member","false","false","true","a","Mlle","1412971199","1404261796","1412333673"],["Clare Allen","Camden","risus.odio@tinciduntvehicula.net","05 09 95 91 63","Donec Inc.","user","false","true","false","a","M.","1409543533","1404449778","1420090665"],["Hermione Nicholson","Rina","mauris.blandit.mattis@justoeu.net","06 86 07 23 73","Cubilia Curae; Donec Inc.","user","true","false","false","a","M.","1399553583","1419590163","1403421167"],["Bertha Blevins","Ruby","dolor@acturpisegestas.com","02 39 85 60 36","Sapien Imperdiet PC","member","true","false","true","a","Mlle","1421505017","1409627383","1416890366"],["Isaac Richardson","Bell","ut@elitCurabitur.co.uk","07 13 92 53 36","Nulla At Sem Inc.","member","false","true","false","a","M.","1404475395","1404103711","1399809481"],["Hedwig Joyce","Urielle","faucibus@purusgravida.net","07 35 98 42 55","Lacus Quisque Industries","user","false","false","true","a","Mme","1406301709","1418816753","1397176883"],["Taylor Morton","Kimberley","mi.pede@sollicitudin.ca","03 52 04 89 47","Nulla Limited","user","false","true","false","a","Mme","1406919633","1419143948","1396701577"],["Britanni Kidd","Kevyn","risus@sapienmolestie.net","02 66 93 32 17","Vel Pede Consulting","member","false","true","true","a","M.","1425539513","1400411718","1394866282"],["Lacota Cobb","Matthew","inceptos.hymenaeos@velitQuisquevarius.ca","03 25 34 48 79","Elit Dictum Corporation","user","false","true","true","a","M.","1418811642","1417202731","1398185718"],["Tanisha Case","Caesar","sodales@semmollis.org","07 47 79 98 34","Donec Egestas Inc.","user","true","false","true","a","Mlle","1412132812","1405969903","1406941594"],["Bruce Shaffer","Roanna","odio.semper@Nullaeget.com","03 82 68 13 70","Nec Cursus A Limited","member","false","false","true","a","Mme","1424978690","1416558039","1406754420"],["Emily Coffey","Clayton","tellus.Suspendisse@aliquameu.ca","01 90 16 75 29","Dolor Associates","user","false","false","true","a","Mlle","1401552677","1401215718","1417696649"],["Pearl Conner","Adrian","Donec.non@tempusmauriserat.co.uk","09 88 25 71 87","Elit LLC","user","true","false","true","a","M.","1405497263","1411884143","1395353631"],["Noel Alexander","Chaney","a.ultricies@at.edu","09 66 79 96 05","Tortor Incorporated","member","false","true","false","a","M.","1410557901","1405155985","1401745406"],["Nigel Ramirez","Kylan","amet.lorem.semper@mattissemper.edu","05 93 96 04 01","Nulla Semper Tellus Corp.","user","true","true","false","a","Mme","1412320981","1421299577","1395944800"],["Ivana Moon","Price","penatibus.et@molestieSed.com","05 81 64 19 44","Sit Institute","user","false","false","false","a","Mme","1400612609","1400676826","1416921615"],["Ingrid Edwards","Sylvester","urna.nec@acfermentum.net","02 46 49 69 07","Est Nunc LLP","user","true","true","true","a","Mme","1409221588","1410174368","1403115624"],["Dean Townsend","Maggie","Curae.Phasellus.ornare@tellusloremeu.co.uk","05 87 29 59 95","Sit Amet Company","member","true","false","false","a","M.","1402083454","1415941240","1401679504"],["Mira Manning","Robert","facilisis.vitae@nec.edu","03 95 52 32 08","Velit Sed Corp.","user","false","true","false","a","Mme","1416461412","1407342994","1400557121"],["John Bishop","Ocean","lorem.eu@ante.org","07 49 42 51 10","Semper Industries","user","true","false","true","a","Mme","1422955985","1422369942","1403430922"],["Irene Patel","Evangeline","nibh@duiinsodales.net","06 92 46 17 32","Mi LLC","member","false","false","false","a","Mlle","1396007506","1398538144","1421362967"],["Candice Espinoza","Martin","turpis.Nulla@Sedeget.com","08 86 07 36 81","Velit PC","member","true","false","true","a","Mlle","1417441873","1415907653","1396801549"],["Mary Wilkinson","Winter","velit@ullamcorpereueuismod.ca","07 96 20 98 99","Ornare Tortor Industries","member","false","true","true","a","Mlle","1418089451","1410057927","1425675192"],["Donovan Mcclure","Alan","nec@velitegestaslacinia.org","04 56 37 20 25","Vel Quam LLP","user","false","true","false","a","M.","1396555787","1420802121","1416420044"],["Shay Robinson","Montana","ante.Maecenas.mi@euismodetcommodo.org","07 85 19 71 05","Nullam Lobortis Institute","member","false","true","false","a","Mlle","1414925063","1402534740","1418295897"],["Nora Bond","Cairo","a.feugiat@Sedpharetrafelis.com","09 34 22 31 83","A Dui Cras Institute","user","false","true","false","a","Mlle","1419506071","1425744654","1416726340"],["Maggie Jordan","Abbot","nisl@auctorquis.org","06 30 55 86 65","Nec Diam Duis Corp.","member","false","false","true","a","Mme","1421311242","1395072912","1399510305"],["Wylie Curtis","Shafira","Pellentesque.tincidunt.tempus@nostra.edu","08 50 28 18 48","Aliquam Enim Inc.","member","true","false","true","a","Mlle","1408861751","1418358915","1407660465"],["Channing Guerrero","Eliana","erat.Sed@placeratCrasdictum.org","01 95 55 58 50","Donec Industries","user","true","false","true","a","Mlle","1423179772","1397322346","1409767885"],["Xanthus Mendoza","Wilma","Ut@risusDonecegestas.edu","04 56 67 30 26","Risus Incorporated","member","true","false","false","a","Mme","1419930004","1425131225","1411464806"],["Gay Robertson","Marcia","egestas@molestie.com","08 46 06 07 63","Id Risus Foundation","member","false","true","true","a","Mlle","1403858346","1421219517","1406338467"],["Alea Wall","Quynn","amet.luctus.vulputate@pede.org","06 71 83 93 62","Interdum Sed Corporation","member","false","true","true","a","Mme","1418126634","1419431153","1409890445"],["Fallon Wall","Ariel","Fusce.mi.lorem@mattisCras.co.uk","06 82 30 35 77","Vivamus Nibh Dolor Ltd","user","false","true","true","a","Mlle","1408440008","1404190946","1415075316"],["Wynne Woods","Hannah","Sed@pharetrafelis.co.uk","03 41 20 96 15","Vestibulum Industries","member","true","false","true","a","Mlle","1395079059","1418540374","1398452932"],["Shelby Abbott","Ulysses","dui@aliquetodioEtiam.ca","07 34 65 04 21","Massa Mauris Vestibulum Corp.","user","false","true","true","a","M.","1407716251","1425369534","1423235367"],["Courtney Moran","Jonah","et.malesuada.fames@iaculis.org","05 42 37 82 87","Pede LLP","member","false","true","true","a","Mme","1417073711","1411879788","1414911622"],["Leah Gutierrez","Tasha","lacinia.vitae.sodales@dictumsapien.edu","01 49 59 48 92","Dui Fusce Diam Corp.","member","true","true","false","a","M.","1405052072","1410413196","1418248596"],["Ezekiel Rocha","Azalia","Maecenas@euarcu.org","09 22 24 83 00","Varius Nam Porttitor Consulting","member","false","false","true","a","M.","1402723584","1418637482","1415357190"],["Serena Washington","September","at.auctor@Aeneanegestas.co.uk","03 97 38 79 62","Diam Pellentesque Habitant Corporation","member","true","false","true","a","Mme","1417762046","1422192823","1425381475"],["Yoshi Schmidt","Xerxes","dolor.sit@molestie.co.uk","02 77 21 71 70","Cubilia Curae; PC","user","true","false","false","a","Mlle","1421295389","1402937304","1415271020"],["Quinlan Delgado","Ifeoma","tristique.ac@miAliquam.co.uk","07 23 10 67 83","Ligula Nullam Corporation","member","false","true","true","a","M.","1418772939","1395282258","1425340568"],["Katell Hernandez","Briar","in.faucibus.orci@condimentum.ca","04 95 45 96 32","Mi Incorporated","user","false","true","true","a","M.","1418819845","1408302172","1421430181"],["Bevis Rose","Pandora","semper.egestas@eu.ca","05 69 28 02 16","Quis Consulting","member","false","true","true","a","Mlle","1394524531","1408159370","1398061827"],["Chandler Freeman","Maggie","inceptos@velconvallis.ca","02 13 57 46 03","A Ultricies Adipiscing Company","user","false","false","true","a","Mlle","1424486594","1408137342","1407129209"],["Scarlet Leon","Olivia","Curae@Loremipsumdolor.org","07 96 34 62 15","Cras Company","member","false","false","false","a","Mlle","1425879093","1424298287","1395918797"],["Alden Hogan","Fulton","augue.porttitor@Donecsollicitudinadipiscing.com","06 75 15 71 50","Congue Turpis Incorporated","member","false","true","true","a","Mme","1417361492","1419967994","1419672935"],["Flavia Vazquez","Mara","porttitor.vulputate@sempereratin.ca","07 84 05 35 93","Nunc Sed Pede Industries","member","true","true","false","a","M.","1424145360","1417802476","1395174893"],["Zachary Sparks","Noah","mus.Proin.vel@Nullatinciduntneque.net","05 65 81 10 96","Massa Non Ante Ltd","user","true","false","false","a","Mlle","1419940719","1402848267","1396935688"],["Quinn Deleon","Gareth","ac.mi@vitaeposuereat.ca","05 16 98 11 97","Odio A Purus Consulting","member","true","false","false","a","Mlle","1417266438","1418898944","1400322837"],["Ira Mcguire","Tara","ridiculus.mus.Donec@fermentumfermentumarcu.co.uk","03 59 66 33 59","A Arcu Foundation","member","false","true","false","a","M.","1397508588","1406367644","1402941243"],["Geraldine Bright","Stacey","risus.quis@vehiculaaliquetlibero.ca","09 79 20 79 93","Dui Suspendisse Institute","member","false","true","false","a","M.","1408106458","1404212696","1413388118"],["Galvin Anderson","Samuel","eu.odio.tristique@libero.com","06 70 29 26 34","Aliquet Magna A LLP","member","true","true","true","a","Mlle","1408815991","1406208434","1420535017"],["Phyllis Holland","Amity","Duis.sit@est.net","07 67 60 63 01","Egestas Consulting","user","false","false","true","a","Mlle","1398845086","1419759340","1412903158"],["Elijah Navarro","Doris","augue@quis.edu","03 71 20 68 20","Vulputate Risus A LLC","user","false","false","false","a","Mlle","1423388426","1414713498","1400626212"],["Fletcher Davenport","Abbot","orci@risus.com","01 01 72 07 28","Orci Institute","member","false","false","true","a","Mlle","1417919431","1397388606","1415153437"],["Mollie Hudson","Kato","nunc.sed@lobortis.org","03 48 87 09 64","Id Libero Donec Inc.","user","true","false","false","a","Mlle","1395275094","1416446427","1409530707"],["Oleg Salazar","Dacey","mollis.non.cursus@semper.ca","09 92 57 04 76","Vulputate Lacus Cras Inc.","user","false","true","true","a","Mlle","1406859663","1416010142","1413397148"],["Cora Hanson","Elizabeth","id.risus@Donec.co.uk","05 37 51 27 17","Elit Corporation","user","false","true","true","a","Mlle","1423828368","1415209308","1396708084"],["Allen Carson","Keelie","arcu@dictum.net","05 72 11 55 43","Fringilla Inc.","user","false","false","true","a","Mlle","1405704033","1421385243","1410358285"],["Beau Yates","Deanna","Integer.eu@ultrices.net","09 18 33 90 36","Malesuada Id Erat Incorporated","member","true","true","true","a","Mlle","1396421552","1408082370","1403034969"],["Cameron Bird","Rebecca","enim.Etiam.gravida@bibendum.com","03 65 12 08 45","Nullam Nisl Maecenas Foundation","member","true","true","true","a","Mme","1405659547","1423005903","1410954361"],["Jonas Howard","Dana","dictum.placerat@FuscefeugiatLorem.com","03 48 90 29 89","Sed PC","member","false","false","false","a","Mme","1396132832","1410108385","1423379688"],["Marsden Price","Dieter","Pellentesque.ut@id.ca","04 07 07 75 05","Sit Amet Institute","user","false","true","true","a","Mme","1409721900","1411758338","1406871361"],["Blair Holder","Clark","ipsum.leo@maurisipsum.org","02 17 22 85 62","Euismod Est Corporation","member","false","false","true","a","M.","1425887163","1411603498","1404891444"],["Cole Carson","Macon","et.nunc.Quisque@magnaCrasconvallis.org","01 55 95 78 70","Orci Associates","user","false","false","true","a","Mlle","1410049760","1403179266","1421280415"],["Morgan Pope","Trevor","lorem.ut.aliquam@semperauctorMauris.co.uk","09 21 77 44 86","Orci Corp.","member","true","false","true","a","Mme","1422663930","1394586057","1399405626"],["Cody Everett","Brenden","erat@nibh.co.uk","05 14 54 65 47","Vulputate Institute","member","true","false","false","a","Mme","1398147630","1394663174","1405933461"],["Colt Mcmahon","Samson","ut@loremut.co.uk","05 07 78 87 37","Sollicitudin Commodo Corp.","member","false","false","true","a","Mme","1398854037","1403264808","1418600775"]]}
		var data=[];
		// for(var i in dataUsers.data){
			var thisdata = {};
			console.log('-------------------------------------------------------------------');
			thisdata.name = 'Alexis Momcilovic';
			thisdata.pseudo = 'Alexis';
			thisdata.email = 'alexismomcilovic@gmail.com';
			thisdata.phone = '0637089871';
			thisdata.company = 'MOMCREATION';
			console.log('-------------------------------------------------------------------');
			thisdata.role = 'admin';
			thisdata.publishEmail = true;
			thisdata.publishPhone = true;
			thisdata.usename = true;
			thisdata.password = 'a';
			console.log('-------------------------------------------------------------------');
			thisdata.comfirmpassword = 'a';
			thisdata.civ = 'M.';
			console.log('-------------------------------------------------------------------');
			thisdata.createdAt = new Date();
			thisdata.lastActivity = new Date();
			
			console.log(thisdata);

			// data.push(thisdata)
		// }

		// console.log(data);
		console.log('-------------------------------------------------------------------');
		User.create(thisdata).exec(function (err,data2) {
				if(err)
				console.log(err);
			res.send(data2)
		})
		// var time1 = new Date('3/9/2015')
		// console.log(time1);
		// // console.log(req.user);
		// User.count({ dateMember:{ '>': time1 } }).exec(function (err, user) {
		// 	if(err)
		// 		console.log(err);
		// 	console.log(user);
		//     res.send(user);
		// });
	}
};

