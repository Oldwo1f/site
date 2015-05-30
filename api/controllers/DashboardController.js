var nodemailer = require('nodemailer');
var moment = require('moment');
var http = require('http');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));
var request = require('request');
var GA = require('googleanalytics'),
config = {
        "user": "alexismomcilovic@gmail.com",
        "password": "Alexis09"
    },
ga = new GA.GA(config);

module.exports={

	analytics:function(req,res) {

		console.log(req.params.metrics);
		if(!req.params.metrics || !sails.config.GOOGLE_ANALYTICS_ID)
		{
			return res.status(400).send('error')
		}else{

			var dateStart = '',dateEnd='';
			switch(req.params.period){
				case 'month':
					dateStart= moment().startOf(req.params.period).format('YYYY-MM-DD')
					dateEnd= moment().format('YYYY-MM-DD')
				break;
				case 'lastmonth':
				console.log('HEHEHEHEHEHEHEHEHEhe');
					dateStart= moment().subtract(1,'M').startOf('month').format('YYYY-MM-DD')
					dateEnd= moment().subtract(1,'month').endOf('month').format('YYYY-MM-DD')

				break;
				case 'year':
					dateStart= moment().startOf(req.params.period).format('YYYY-MM-DD')
					dateEnd= moment().format('YYYY-MM-DD')
				break;
				case 'week':
					dateStart= moment().startOf(req.params.period).format('YYYY-MM-DD')
					dateEnd= moment().format('YYYY-MM-DD')
				break;
				case 'lastweek':
					dateStart= moment().subtract(1,'weeks').startOf('week').format('YYYY-MM-DD')
					dateEnd= moment().subtract(1,'weeks').endOf('week').format('YYYY-MM-DD')

				break;
			}

			console.log(dateStart);
			console.log(dateEnd);
			ga.login(function(err, token) {

				async.parallel({
					count:function (cb) {
						ga.login(function(err, token) {
						    var options = {
						        'ids': 'ga:'+sails.config.GOOGLE_ANALYTICS_ID,
						        'start-date': dateStart,
						        'end-date': dateEnd,
						        'metrics': 'ga:sessions,ga:pageviews,ga:users,ga:percentNewSessions,ga:avgSessionDuration,ga:bounceRate,ga:pageviewsPerSession',
						    };

						    ga.get(options, function(err, entries) {
						       cb(null,entries[0].metrics[0])
						    });
						});
					},
					graph:function (cb) {
							var	dimention = 'ga:date';
							if(req.params.period=='year')
								dimention = 'ga:month';
						    var options = {
						        'ids': 'ga:'+sails.config.GOOGLE_ANALYTICS_ID,
						        'start-date': dateStart,
						        'end-date': dateEnd,
						        'metrics': req.params.metrics,
						        'dimensions': dimention,
						    };

						    ga.get(options, function(err, entries) {
						       cb(null,entries)
						    });
					}
				},function  (err, results) {
					res.send(results)
				})

			});
	
		}
		
	},
	countAll:function(req,res) {
		return Promise.bind({})
			.then(function (){
				this.results={};
			    return Article.count()
			})
			.then(function (previousCount){
				this.results.articles=previousCount
			    return Project.count()
			})
			.then(function (previousCount){
				this.results.projects=previousCount
			    return Document.count()
			})
			.then(function (previousCount){
				this.results.documents=previousCount
			    return Comment.count()
			})
			.then(function (previousCount){
				this.results.comments=previousCount
			    return Reponse.count()
			})
			.then(function (previousCount){
				this.results.comments= this.results.comments + previousCount
			    return Tag.count()
			})
			.then(function (previousCount){
				this.results.tags=previousCount
			    return Image.count()
			})
			.done(function (previousCount) {
				this.results.images=previousCount
				res.status(200).send(this.results)
			},function(e) {
				res.status(400).send(e)
			});
	},
	getBestBlogger:function(req,res) {
		
			Article.native(function(err,collection) {

			    collection.aggregate(
			        [
			        	
			            { "$group": {
			                "_id": "$author",
			                "count": { "$sum": 1 },
			            	}
			        	}
			        ],
			        function(err,results) {
			        	async.map(results,function (item,cb) {
			        	
			        	console.log(item);
			        		User.findOne(String(item._id)).exec(function (err,data) {


			        			console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
			        			console.log(err);
			        			console.log(data);
			        			if(err){

			        				cb(err)
			        			}
			        			else{

				            	item.label = data.pseudo;
				            	item.value = item.count;
				            	delete item.count;
				            	delete item._id;
				            	cb(null,item)
			        			}
			            	})
			        	},function (err,results2) {
			            	res.send(JSON.stringify(results2))
			        	})
			            
			            
					}
				)

		    })




	},
	getNewComments:function(req,res) {
		console.log('getNewComments');

			
			            
			async.parallel({
				count:function (cb) {
				   	Comment.count({status:'new'},function(err,results) {
			        	
					   	Reponse.count({status:'new'},function(err,results2) {
				        	console.log(err);
				        	console.log(results);
				            cb(null,results+results2)
						})
					})
				},
				lastitem:function (cb) {
					Comment.find({status:'new'}).sort('createdAt ASC').limit(1).populateAll().exec(function(err,results) {
			        	console.log(err);
			        	console.log(results);
			            Reponse.find({status:'new'}).sort('createdAt ASC').limit(1).populateAll().exec(function(err,results2) {
				        	console.log(err);
				        	console.log(results);
				        	if(results.length && results2.length)
				        	{
				        		if(results[0].createdAt < results2[0].createdAt){
				        			console.log('inferior');
				            		cb(null,results[0])
				        		}else {
				        			console.log('inferior');
				            		cb(null,results2[0])
				        		}
				        	}
				        	if(results.length && !results2.length)
				        	{
				            		cb(null,results[0])
				        	}
				        	if(!results.length && results2.length)
				        	{
				            		cb(null,results2[0])
				        	}
				        	if(!results.length && !results2.length)
				        	{
				            		cb(null,null)
				        	}
						})
					})
				}
			},function  (err, results) {
				res.send(results)
			})            


	},
	getSocials:function(req,res) {
		console.log('getSocials');

			
			            
			async.parallel({
				tw:function (cb) {
				   	
				   	http.get('http://cdn.api.twitter.com/1/urls/count.json?url='+sails.config.URL_HOME, function(resp) {
					   var str='';
						resp.on('data', function (chunk) {
				              str += chunk;
				        });
				        resp.on('end', function () {
				           var obj = JSON.parse(str)
				        	if(typeof(obj.count!='undefined'))
				            	cb(null,JSON.parse(str).count)
				        	else
				            	cb(null,0)
				        });
					})
					
				},
				fb:function (cb) {
					
				    http.get('http://graph.facebook.com/?id='+sails.config.URL_HOME, function(resp) {

				    	// console.log(resp.statusCode);
					   var str='';
						resp.on('data', function (chunk) {
				              str += chunk;
				        });
				        resp.on('end', function () {
				        	var obj = JSON.parse(str)
				        	if(typeof(obj.shares!='undefined'))
				            	cb(null,JSON.parse(str).shares)
				        	else
				            	cb(null,0)
				        });
					})
				   
				},
				gplus:function (cb) {
					console.log('here');
				    	console.log('https://plusone.google.com/_/+1/fastbutton?url='+sails.config.URL_HOME);
				   
					var rem = request('https://plusone.google.com/_/+1/fastbutton?url='+sails.config.URL_HOME);
					var str='';
				   	rem.on('data', function(chunk) {
					    str += chunk;
					  });
					  rem.on('end', function() {

					  	if(new RegExp('window\.__SSR').test(str)){
					  		
					  		var cutstring = str.substr(str.indexOf('window\.__SSR')+19,100)
					  		cutstring = cutstring.substring(0,cutstring.indexOf(',')-1)
					  		console.log(cutstring);
					  		if(new RegExp('[\d.]+').test(cutstring)){
					  			console.log('testOK');
					  			console.log('cutstring');	
					  			console.log(cutstring);
					  			cb(null,Number(cutstring))
					  		}
					  		else{
					  		console.log('not testOK');
					  			cb(null,0)
					  		}
					  	}else{

					  		cb(null,Number(0))
					  	}
					  });
				},
				
			},function  (err, results) {

				// console.log(results);
				res.send(results)
			})            


	},
	getNotifications:function  (req,res) {
		var page = req.params.page;

		Notification.find().sort('createdAt DESC').skip(page*10).limit(10).exec(function (err,results) {
			if(err)
				res.status(400).send(err)
			res.send(results)
		})
	}
	
	
}
