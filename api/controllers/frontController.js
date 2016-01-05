var Promise = require('bluebird');
var nodemailer = require('nodemailer');
var moment = require('moment');
var marked = require('marked');
var truncate = require('html-truncate');

module.exports={
	home:function(req,res,next) {

		console.log('home');
		
			var query = {status:'actif'};
				Article.find(query).populateAll().sort('date DESC').limit(2).exec(function (err,projects) {
			
						return Promise.map(projects,function  (project) {
							// console.log('---------------------------');
							return new Promise(function(resolve,rej){
								if(project.translations.length && req.locale!= 'fr'){
									// console.log('we got Trad');
									_.map(project.translations,function  (trad) {
										// console.log('---------------------------');
										if(trad.lang == req.locale){
											project.title = (trad.title) ? trad.title : project.title;
											project.content = (trad.content) ? trad.content : project.content;
											project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											project.description = (trad.description) ? trad.description : project.description;
										}
									})
								}
								project.content = truncate(marked(project.content), 450)
								if(project.images.length)
								{
									project.images = _.sortBy(project.images, 'rank')
									
									return Promise.map(project.images,function(image) {

										return Image.findOne(image.image).exec(function (err,datas) {
											// console.log('datas',datas);
											image.img = datas
											console.log(project);
											// return image;
											resolve(project)
										})
									})
								}else
								{
									resolve(project)
								}
							})
							
						}).then(function (projectss) {

							res.status(200).view('homepage',{
								baseurl : '/',
								articles: projectss,
								// articles:articles,
								// marked:marked,
								title: req.__('SEO_HOME_title'),
								keyword: req.__('SEO_HOME_keyword'),
								description:req.__('SEO_HOME_description'),
								// scripturl:'script.js',
								menu:'home',
							})
						})
					
				})



					
			




	},	
	blog:function(req,res,next) {


		req.locale = req.locale || 'fr'
		moment.locale(req.locale)
		var query = {status:'actif'};
		var baseurl = "";
		if(req.params.catid){
			baseurl = '../';	
			query = {status:'actif',category : req.params.catid}
		}

		console.log(query);
		console.log('blog');
		async.parallel({
			projs:function  (cb) {
				Article.find(query).populateAll().sort('date DESC').limit(20).exec(function (err,projects) {
			
						return Promise.map(projects,function  (project) {
							// console.log('---------------------------');
							return new Promise(function(resolve,rej){
								if(project.translations.length && req.locale!= 'fr'){
									// console.log('we got Trad');
									_.map(project.translations,function  (trad) {
										// console.log('---------------------------');
										if(trad.lang == req.locale){
											project.title = (trad.title) ? trad.title : project.title;
											project.content = (trad.content) ? trad.content : project.content;
											project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											project.description = (trad.description) ? trad.description : project.description;
										}
									})
								}
								project.content = truncate(marked(project.content), 450)
								if(project.images.length)
								{
									project.images = _.sortBy(project.images, 'rank')
									
									return Promise.map(project.images,function(image) {

										return Image.findOne(image.image).exec(function (err,datas) {
											// console.log('datas',datas);
											image.img = datas
											console.log(project);
											// return image;
											resolve(project)
										})
									})
								}else
								{
									resolve(project)
								}
							})
							
						}).then(function (projectss) {
							// console.log(projectss);
							cb(null,projects)
						})
					
				})
			},
			recent:function  (cb) {
				Article.find({status:'actif'}).populateAll().sort('date DESC').limit(3).exec(function (err,projects) {
			
						return Promise.map(projects,function  (project) {
							// console.log('---------------------------');
							return new Promise(function(resolve,rej){
								if(project.translations.length && req.locale!= 'fr'){
									// console.log('we got Trad');
									_.map(project.translations,function  (trad) {
										// console.log('---------------------------');
										if(trad.lang == req.locale){
											project.title = (trad.title) ? trad.title : project.title;
											project.content = (trad.content) ? trad.content : project.content;
											project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											project.description = (trad.description) ? trad.description : project.description;
										}
									})
								}
								project.content = truncate(marked(project.content), 450)
								if(project.images.length)
								{
									project.images = _.sortBy(project.images, 'rank')
									
									return Promise.map(project.images,function(image) {

										return Image.findOne(image.image).exec(function (err,datas) {
											// console.log('datas',datas);
											image.img = datas
											console.log(project);
											// return image;
											resolve(project)
										})
									})
								}else
								{
									resolve(project)
								}
							})
							
						}).then(function (projectss) {
							// console.log(projectss);
							cb(null,projects)
						})
					
				})
			},
			popular:function  (cb) {
				Article.find({status:'actif'}).populateAll().sort('nbView DESC').limit(3).exec(function (err,projects) {
			
						return Promise.map(projects,function  (project) {
							// console.log('---------------------------');
							return new Promise(function(resolve,rej){
								if(project.translations.length && req.locale!= 'fr'){
									// console.log('we got Trad');
									_.map(project.translations,function  (trad) {
										// console.log('---------------------------');
										if(trad.lang == req.locale){
											project.title = (trad.title) ? trad.title : project.title;
											project.content = (trad.content) ? trad.content : project.content;
											project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											project.description = (trad.description) ? trad.description : project.description;
										}
									})
								}
								project.content = truncate(marked(project.content), 450)
								if(project.images.length)
								{
									project.images = _.sortBy(project.images, 'rank')
									
									return Promise.map(project.images,function(image) {

										return Image.findOne(image.image).exec(function (err,datas) {
											// console.log('datas',datas);
											image.img = datas
											console.log(project);
											// return image;
											resolve(project)
										})
									})
								}else
								{
									resolve(project)
								}
							})
							
						}).then(function (projectss) {
							// console.log(projectss);
							cb(null,projects)
						})
					
				})
			},
			cats:function  (cb) {
				CategoryBlog.find().populateAll().sort('name DESC').exec(function (err,cats) {
			console.log(err);
			console.log(cats);
			 _.remove(cats,function (n) {
				return n.nbArticles <=0;
			})
						return Promise.map(cats,function  (cat) {
							console.log('---------------------------');
							return new Promise(function(resolve,rej){
								console.log(cat.translations.length);
								if(cat.translations.length && req.locale!= 'fr'){
									console.log('we got Trad');
									_.map(cat.translations,function  (trad) {
										console.log('---------------------------');
										if(trad.lang == req.locale){
											console.log('local cool');
											cat.name = (trad.name) ? trad.name : cat.name;
											// project.content = (trad.content) ? trad.content : project.content;
											// project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											// project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											// project.description = (trad.description) ? trad.description : project.description;
										}
									})

									resolve(cat)
								}else
								{
									resolve(cat)
								}
							})
							
						}).then(function (projectss) {
							cb(null,cats)
						})
					
				})
			}
		},function  (err,results) {
			console.log(err);
			console.log('results');
			console.log(results.cats);
			// console.log(results);
			res.status(200).view('blog',{
				baseurl : baseurl,
				articles:results.projs,
				categories:results.cats,
				popular:results.popular,
				recent:results.recent,
				title: req.__('SEO_BLOG_title'),
				keyword: req.__('SEO_BLOG_keyword'),
				description:req.__('SEO_BLOG_description'),
				menu:'blog',
				marked:marked,
				moment:moment
			})
		})
		

	},				
	article:function(req,res,next) {

		console.log('article');
		
				console.log(req.locale);
		req.locale = req.locale || 'fr'
		moment.locale(req.locale)
		console.log("FETCH ONE Article");
		
				Article.find(req.params.id).populateAll().exec(function (err,items){
						
				
						
						if(err)
							callback(err)

						// callback(null,items)
						if(items.length>0)
						{
								// items[0].nbView= Number(items[0].nbView) + 1;
								items[0].nbView= Number(items[0].nbView) + 1

								Article.update({id: items[0].id}, {nbView: items[0].nbView})
								.exec(function(err, updatedProject){
								var project= items[0];
								// console.log('item',item);
								async.series({
								image:function(cbparalelle) {
									project.images = _.sortBy(project.images, 'rank')

									async.map(project.images,
									function(item1,cb1) {
										// console.log('item1',item1);

										Image.findOne(item1.image).exec(function(err,data) {
											item1.img=data
											cb1(null,item1)
										})

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								document:function(cbparalelle) {
									async.map(project.documents,
									function(item1,cb1) {
										// console.log('item1',item1);
										Document.findOne(item1.document).exec(function(err,data) {
											item1.document=data
											cb1(null,item1)
										})

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								translations:function(cbparalelle) {
									async.map(project.translations,
									function(trad,cb1) {
										console.log(trad);
										if(trad.lang == req.locale){
											console.log('locale');
											project.title = (trad.title) ? trad.title : project.title;
											project.content = (trad.content) ? trad.content : project.content;
											project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											project.description = (trad.description) ? trad.description : project.description;
										}
										cb1(null,project)

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								comment:function(cbparalelle) {
											console.log('------------------------------');
											// console.log(project.comments);
											_.remove(project.comments,function (n) {
												return n.status != 'success'
											})
											var allcomments = [];
										// _.sortBy(project.comments,function (n) {
										// 	return new Date(n.createdAt)
										// })
											project.comments = project.comments.reverse()

									async.mapSeries(project.comments,
									function(item1,cb1) {
										// console.log('item1',item1);
										Comment.find(item1.id).populate('reponses',{ where:{status:'success'}}).exec(function(err,data) {
											// item1.comment=data
											// console.log(data);
											console.log('------------------------------');
											// console.log(project.comments.indexOf(item1));
											// item1=data
											// project.comments.splice(project.comments.indexOf(item1),1,data[0])
											allcomments.push(data[0])
											// console.log(data);
											cb1(null,item1)
										})

									},function(err, results) {
										
										project.comments=allcomments;
										// console.log('allcomments',allcomments);
										cbparalelle(null,allcomments)
									})
								},
								popular:function  (cb) {
									Article.find({status:'actif'}).populateAll().sort('nbView DESC').limit(6).exec(function (err,projects) {
								
											return Promise.map(projects,function  (project) {
												// console.log('---------------------------');
												return new Promise(function(resolve,rej){
													if(project.translations.length && req.locale!= 'fr'){
														// console.log('we got Trad');
														_.map(project.translations,function  (trad) {
															// console.log('---------------------------');
															if(trad.lang == req.locale){
																project.title = (trad.title) ? trad.title : project.title;
																project.content = (trad.content) ? trad.content : project.content;
																project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
																project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
																project.description = (trad.description) ? trad.description : project.description;
															}
														})
													}
													project.content = truncate(marked(project.content), 450)
													if(project.images.length)
													{
														project.images = _.sortBy(project.images, 'rank')
														
														return Promise.map(project.images,function(image) {

															return Image.findOne(image.image).exec(function (err,datas) {
																// console.log('datas',datas);
																image.img = datas
																console.log(project);
																// return image;
																resolve(project)
															})
														})
													}else
													{
														resolve(project)
													}
												})
												
											}).then(function (projectss) {
												// console.log(projectss);
												cb(null,projects)
											})
										
									})
								
								},
								prev:function(cbparalelle) {
									
									Article.find({date:{'lt':project.date}}).sort('date DESC').limit(1).exec(function(err, results) {
										if(results.length == 0 ){
											cbparalelle(err,null)
										}
										else{
										urltowrite=""
										if(results[0].rewriteurl)
											urltowrite = results[0].rewriteurl;
										cbparalelle(err,{url:'article/'+results[0].id+'/'+urltowrite,title:results[0].title})
										}
									})
								},
								next:function(cbparalelle) {
									
									Article.find({date:{'gt':project.date}}).sort('date ASC').limit(1).exec(function(err, results) {
										if(results.length == 0 ){

											cbparalelle(err,null)
										}
										else{

										urltowrite=""
										if(results[0].rewriteurl)
											urltowrite = results[0].rewriteurl;
										cbparalelle(err,{url:'article/'+results[0].id+'/'+urltowrite,title:results[0].title})
										}
									})
								},
								cats:function  (cb) {
								CategoryBlog.find().populateAll().sort('name DESC').exec(function (err,cats) {
									console.log(err);
									console.log(cats);
								 	_.remove(cats,function (n) {
										return n.nbArticles <=0;
									})
									return Promise.map(cats,function  (cat) {
										console.log('---------------------------');
										return new Promise(function(resolve,rej){
											console.log(cat.translations.length);
											if(cat.translations.length && req.locale!= 'fr'){
												console.log('we got Trad');
												_.map(cat.translations,function  (trad) {
													console.log('---------------------------');
													if(trad.lang == req.locale){
														console.log('local cool');
														cat.name = (trad.name) ? trad.name : cat.name;
														// project.content = (trad.content) ? trad.content : project.content;
														// project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
														// project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
														// project.description = (trad.description) ? trad.description : project.description;
													}
												})

												resolve(cat)
											}else
											{
												resolve(cat)
											}
										})
										
									}).then(function (projectss) {
										cb(null,cats)
									})
										
								})
								}
							},function(err,ress) {

 										console.log('DELETE');
									if(project.category)
										project.category=project.category.id;
									

									var projecttogo = _.clone(project)

									delete projecttogo.comments
									projecttogo.comments=ress.comment
									// console.log(projecttogo.comments);
									// console.log(projecttogo);
									console.log('Final Data');

									var pathtoshare ='';
									pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/';
									if(projecttogo.urlrewrite)
									pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/'+projecttogo.urlrewrite;



									console.log('fetch ONE Project');
									// res.status(200).send(projecttogo)
									res.status(200).view('article',{
										baseurl : '../../',
										categories:ress.cats,
										next:ress.next,
										prev:ress.prev,
										popular:ress.popular,
										article:projecttogo,
										moment: moment,
										pathtoshare:pathtoshare,
										title: projecttogo.title +' - BLOG - '+ sails.config.COMPANY_NAME,
										keyword: projecttogo.keyword,
										description:projecttogo.description,
										menu:'blog',
										marked:marked
									})
								})
							});		
						}
							
								
								// callback(null,items);

	
						
				});			
					
			




	},	
	contact:function(req,res,next) {

		console.log('contact');
					res.status(200).view('contact',{
						baseurl : '/',
						// articles:articles,
						// marked:marked,
						title: req.__('SEO_contact_title'),
						keyword: req.__('SEO_contact_keyword'),
						description:req.__('SEO_contact_description'),
						// scripturl:'script.js',
						menu:'contact',
					})
	},
	infos:function(req,res,next) {

		console.log('infos');
					res.status(200).view('infos',{
						baseurl : '/',
						// articles:articles,
						// marked:marked,
						title: req.__('SEO_infos_title'),
						keyword: req.__('SEO_infos_keyword'),
						description:req.__('SEO_infos_description'),
						// scripturl:'script.js',
						menu:'infos',
					})
	},
	about:function(req,res,next) {

		console.log('about');
					res.status(200).view('about',{
						baseurl : '/',
						// articles:articles,
						// marked:marked,
						title: req.__('SEO_about_title'),
						keyword: req.__('SEO_about_keyword'),
						description:req.__('SEO_about_description'),
						// scripturl:'script.js',
						menu:'about',
					})
	},	
	icons:function(req,res,next) {

		console.log('icons');
					res.status(200).view('icon',{
						// articles:articles,
						// marked:marked,
						// title: req.__('SEO_HOME_title'),
						// keyword: req.__('SEO_HOME_keyword'),
						// description:req.__('SEO_HOME_description'),
						// scripturl:'script.js',
						menu:'icons',
					})
	},	
	poussin:function(req,res,next) {

		console.log('poussin');
					Project.find('568b8ed7f8fd854966949b86').populateAll().exec(function (err,items){
					
						if(err)
							callback(err)

						// callback(null,items)
						if(items.length>0)
						{
								items[0].nbView= Number(items[0].nbView) + 1;
								Article.update({id: items[0].id}, {nbView: items[0].nbView})
								.exec(function(err, updatedProject){
								var project= items[0];
								// console.log('item',item);
								async.series({
								image:function(cbparalelle) {
									async.map(project.images,
									function(item1,cb1) {
										// console.log('item1',item1);
										Image.findOne(item1.image).exec(function(err,data) {
											item1.image=data
											cb1(null,item1)
										})

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								document:function(cbparalelle) {
									async.map(project.documents,
									function(item1,cb1) {
										// console.log('item1',item1);
										Document.findOne(item1.document).exec(function(err,data) {
											item1.document=data
											cb1(null,item1)
										})

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								translations:function(cbparalelle) {
									async.map(project.translations,
									function(trad,cb1) {
										console.log(trad);
										if(trad.lang == req.locale){
											console.log('locale');
											project.title = (trad.title) ? trad.title : project.title;
											project.content = (trad.content) ? trad.content : project.content;
											project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											project.description = (trad.description) ? trad.description : project.description;
										}
										cb1(null,project)

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								comment:function(cbparalelle) {
											console.log('------------------------------');
											// console.log(project.comments);
											_.remove(project.comments,function (n) {
												return n.status != 'success'
											})
											var allcomments = [];
										// _.sortBy(project.comments,function (n) {
										// 	return new Date(n.createdAt)
										// })
											project.comments = project.comments.reverse()

									async.mapSeries(project.comments,
									function(item1,cb1) {
										// console.log('item1',item1);
										Comment.find(item1.id).populate('reponses',{ where:{status:'success'}}).exec(function(err,data) {
											// item1.comment=data
											// console.log(data);
											console.log('------------------------------');
											// console.log(project.comments.indexOf(item1));
											// item1=data
											// project.comments.splice(project.comments.indexOf(item1),1,data[0])
											allcomments.push(data[0])
											// console.log(data);
											cb1(null,item1)
										})

									},function(err, results) {
										
										project.comments=allcomments;
										// console.log('allcomments',allcomments);
										cbparalelle(null,allcomments)
									})
								}},function(err,ress) {

 										console.log('DELETE');
									if(project.category)
										project.category=project.category.id;
									if(project.author)
										project.author=project.author.id;

									var projecttogo = _.clone(project)

									delete projecttogo.comments
									projecttogo.comments=ress.comment
									// console.log(projecttogo.comments);
									// console.log(projecttogo);
									console.log('Final Data');
									var pathtoshare ='';
									pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/';
									if(projecttogo.urlrewrite)
									pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/'+projecttogo.urlrewrite;
									// console.log('fetch ONE Project', projecttogo);
									// res.status(200).send(projecttogo)
									res.status(200).view('poussin',{
										baseurl : '/',
										project:projecttogo,
										marked:marked,
										title: req.__('SEO_poussin_title'),
										keyword: req.__('SEO_poussin_keyword'),
										description:req.__('SEO_poussin_description'),
										// scripturl:'script.js',
										menu:'poussin',
									})
								})
							})
							
						}
							
								

	
						
				});
	}	,	
	seniorf:function(req,res,next) {

		console.log('poussin');
					Project.find('56893c4cf4af8d5a551ce5b4').populateAll().exec(function (err,items){
					
						if(err)
							callback(err)

						// callback(null,items)
						if(items.length>0)
						{
								items[0].nbView= Number(items[0].nbView) + 1;
								Article.update({id: items[0].id}, {nbView: items[0].nbView})
								.exec(function(err, updatedProject){
								var project= items[0];
								// console.log('item',item);
								async.series({
								image:function(cbparalelle) {
									async.map(project.images,
									function(item1,cb1) {
										// console.log('item1',item1);
										Image.findOne(item1.image).exec(function(err,data) {
											item1.image=data
											cb1(null,item1)
										})

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								document:function(cbparalelle) {
									async.map(project.documents,
									function(item1,cb1) {
										// console.log('item1',item1);
										Document.findOne(item1.document).exec(function(err,data) {
											item1.document=data
											cb1(null,item1)
										})

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								translations:function(cbparalelle) {
									async.map(project.translations,
									function(trad,cb1) {
										console.log(trad);
										if(trad.lang == req.locale){
											console.log('locale');
											project.title = (trad.title) ? trad.title : project.title;
											project.content = (trad.content) ? trad.content : project.content;
											project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											project.description = (trad.description) ? trad.description : project.description;
										}
										cb1(null,project)

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								comment:function(cbparalelle) {
											console.log('------------------------------');
											// console.log(project.comments);
											_.remove(project.comments,function (n) {
												return n.status != 'success'
											})
											var allcomments = [];
										// _.sortBy(project.comments,function (n) {
										// 	return new Date(n.createdAt)
										// })
											project.comments = project.comments.reverse()

									async.mapSeries(project.comments,
									function(item1,cb1) {
										// console.log('item1',item1);
										Comment.find(item1.id).populate('reponses',{ where:{status:'success'}}).exec(function(err,data) {
											// item1.comment=data
											// console.log(data);
											console.log('------------------------------');
											// console.log(project.comments.indexOf(item1));
											// item1=data
											// project.comments.splice(project.comments.indexOf(item1),1,data[0])
											allcomments.push(data[0])
											// console.log(data);
											cb1(null,item1)
										})

									},function(err, results) {
										
										project.comments=allcomments;
										// console.log('allcomments',allcomments);
										cbparalelle(null,allcomments)
									})
								}},function(err,ress) {

 										console.log('DELETE');
									if(project.category)
										project.category=project.category.id;
									if(project.author)
										project.author=project.author.id;

									var projecttogo = _.clone(project)

									delete projecttogo.comments
									projecttogo.comments=ress.comment
									// console.log(projecttogo.comments);
									// console.log(projecttogo);
									console.log('Final Data');
									var pathtoshare ='';
									pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/';
									if(projecttogo.urlrewrite)
									pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/'+projecttogo.urlrewrite;
									// console.log('fetch ONE Project', projecttogo);
									// res.status(200).send(projecttogo)
									res.status(200).view('seniorf',{
										baseurl : '/',
										project:projecttogo,
										marked:marked,
										title: req.__('SEO_seniorf_title'),
										keyword: req.__('SEO_seniorf_keyword'),
										description:req.__('SEO_seniorf_description'),
										// scripturl:'script.js',
										menu:'seniorf',
									})
								})
							})
							
						}
							
								

	
						
				});
	}	,	
	seniorm:function(req,res,next) {

		console.log('seniorm');
					Project.find('56893c62f4af8d5a551ce5b7').populateAll().exec(function (err,items){
					
						if(err)
							callback(err)

						// callback(null,items)
						if(items.length>0)
						{
								items[0].nbView= Number(items[0].nbView) + 1;
								Article.update({id: items[0].id}, {nbView: items[0].nbView})
								.exec(function(err, updatedProject){
								var project= items[0];
								// console.log('item',item);
								async.series({
								image:function(cbparalelle) {
									async.map(project.images,
									function(item1,cb1) {
										// console.log('item1',item1);
										Image.findOne(item1.image).exec(function(err,data) {
											item1.image=data
											cb1(null,item1)
										})

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								document:function(cbparalelle) {
									async.map(project.documents,
									function(item1,cb1) {
										// console.log('item1',item1);
										Document.findOne(item1.document).exec(function(err,data) {
											item1.document=data
											cb1(null,item1)
										})

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								translations:function(cbparalelle) {
									async.map(project.translations,
									function(trad,cb1) {
										console.log(trad);
										if(trad.lang == req.locale){
											console.log('locale');
											project.title = (trad.title) ? trad.title : project.title;
											project.content = (trad.content) ? trad.content : project.content;
											project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											project.description = (trad.description) ? trad.description : project.description;
										}
										cb1(null,project)

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								comment:function(cbparalelle) {
											console.log('------------------------------');
											// console.log(project.comments);
											_.remove(project.comments,function (n) {
												return n.status != 'success'
											})
											var allcomments = [];
										// _.sortBy(project.comments,function (n) {
										// 	return new Date(n.createdAt)
										// })
											project.comments = project.comments.reverse()

									async.mapSeries(project.comments,
									function(item1,cb1) {
										// console.log('item1',item1);
										Comment.find(item1.id).populate('reponses',{ where:{status:'success'}}).exec(function(err,data) {
											// item1.comment=data
											// console.log(data);
											console.log('------------------------------');
											// console.log(project.comments.indexOf(item1));
											// item1=data
											// project.comments.splice(project.comments.indexOf(item1),1,data[0])
											allcomments.push(data[0])
											// console.log(data);
											cb1(null,item1)
										})

									},function(err, results) {
										
										project.comments=allcomments;
										// console.log('allcomments',allcomments);
										cbparalelle(null,allcomments)
									})
								}},function(err,ress) {

 										console.log('DELETE');
									if(project.category)
										project.category=project.category.id;
									if(project.author)
										project.author=project.author.id;

									var projecttogo = _.clone(project)

									delete projecttogo.comments
									projecttogo.comments=ress.comment
									// console.log(projecttogo.comments);
									// console.log(projecttogo);
									console.log('Final Data');
									var pathtoshare ='';
									pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/';
									if(projecttogo.urlrewrite)
									pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/'+projecttogo.urlrewrite;
									// console.log('fetch ONE Project', projecttogo);
									// res.status(200).send(projecttogo)
									res.status(200).view('seniorm',{
										baseurl : '/',
										project:projecttogo,
										marked:marked,
										title: req.__('SEO_seniorm_title'),
										keyword: req.__('SEO_seniorm_keyword'),
										description:req.__('SEO_seniorm_description'),
										// scripturl:'script.js',
										menu:'seniorm',
									})
								})
							})
							
						}
							
								

	
						
				});
	}	,		
	loisir:function(req,res,next) {

		console.log('loisir');
	Project.find('568b8eecf8fd854966949b89').populateAll().exec(function (err,items){
					
						if(err)
							callback(err)

						// callback(null,items)
						if(items.length>0)
						{
								items[0].nbView= Number(items[0].nbView) + 1;
								Article.update({id: items[0].id}, {nbView: items[0].nbView})
								.exec(function(err, updatedProject){
								var project= items[0];
								// console.log('item',item);
								async.series({
								image:function(cbparalelle) {
									async.map(project.images,
									function(item1,cb1) {
										// console.log('item1',item1);
										Image.findOne(item1.image).exec(function(err,data) {
											item1.image=data
											cb1(null,item1)
										})

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								document:function(cbparalelle) {
									async.map(project.documents,
									function(item1,cb1) {
										// console.log('item1',item1);
										Document.findOne(item1.document).exec(function(err,data) {
											item1.document=data
											cb1(null,item1)
										})

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								translations:function(cbparalelle) {
									async.map(project.translations,
									function(trad,cb1) {
										console.log(trad);
										if(trad.lang == req.locale){
											console.log('locale');
											project.title = (trad.title) ? trad.title : project.title;
											project.content = (trad.content) ? trad.content : project.content;
											project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											project.description = (trad.description) ? trad.description : project.description;
										}
										cb1(null,project)

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								comment:function(cbparalelle) {
											console.log('------------------------------');
											// console.log(project.comments);
											_.remove(project.comments,function (n) {
												return n.status != 'success'
											})
											var allcomments = [];
										// _.sortBy(project.comments,function (n) {
										// 	return new Date(n.createdAt)
										// })
											project.comments = project.comments.reverse()

									async.mapSeries(project.comments,
									function(item1,cb1) {
										// console.log('item1',item1);
										Comment.find(item1.id).populate('reponses',{ where:{status:'success'}}).exec(function(err,data) {
											// item1.comment=data
											// console.log(data);
											console.log('------------------------------');
											// console.log(project.comments.indexOf(item1));
											// item1=data
											// project.comments.splice(project.comments.indexOf(item1),1,data[0])
											allcomments.push(data[0])
											// console.log(data);
											cb1(null,item1)
										})

									},function(err, results) {
										
										project.comments=allcomments;
										// console.log('allcomments',allcomments);
										cbparalelle(null,allcomments)
									})
								}},function(err,ress) {

 										console.log('DELETE');
									if(project.category)
										project.category=project.category.id;
									if(project.author)
										project.author=project.author.id;

									var projecttogo = _.clone(project)

									delete projecttogo.comments
									projecttogo.comments=ress.comment
									// console.log(projecttogo.comments);
									// console.log(projecttogo);
									console.log('Final Data');
									var pathtoshare ='';
									pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/';
									if(projecttogo.urlrewrite)
									pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/'+projecttogo.urlrewrite;
									// console.log('fetch ONE Project', projecttogo);
									// res.status(200).send(projecttogo)
									res.status(200).view('loisir',{
										baseurl : '/',
										project:projecttogo,
										marked:marked,
										title: req.__('SEO_loisir_title'),
										keyword: req.__('SEO_loisir_keyword'),
										description:req.__('SEO_loisir_description'),
										// scripturl:'script.js',
										menu:'loisir',
									})
								})
							})
							
						}
							
								

	
						
				});
	}	,	
	juniorf:function(req,res,next) {

		console.log('juniorf');
		//56893c6ff4af8d5a551ce5ba
		Project.find('56893c6ff4af8d5a551ce5ba').populateAll().exec(function (err,items){
					
						if(err)
							callback(err)

						// callback(null,items)
						if(items.length>0)
						{
								items[0].nbView= Number(items[0].nbView) + 1;
								Article.update({id: items[0].id}, {nbView: items[0].nbView})
								.exec(function(err, updatedProject){
								var project= items[0];
								// console.log('item',item);
								async.series({
								image:function(cbparalelle) {
									async.map(project.images,
									function(item1,cb1) {
										// console.log('item1',item1);
										Image.findOne(item1.image).exec(function(err,data) {
											item1.image=data
											cb1(null,item1)
										})

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								document:function(cbparalelle) {
									async.map(project.documents,
									function(item1,cb1) {
										// console.log('item1',item1);
										Document.findOne(item1.document).exec(function(err,data) {
											item1.document=data
											cb1(null,item1)
										})

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								translations:function(cbparalelle) {
									async.map(project.translations,
									function(trad,cb1) {
										console.log(trad);
										if(trad.lang == req.locale){
											console.log('locale');
											project.title = (trad.title) ? trad.title : project.title;
											project.content = (trad.content) ? trad.content : project.content;
											project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											project.description = (trad.description) ? trad.description : project.description;
										}
										cb1(null,project)

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								comment:function(cbparalelle) {
											console.log('------------------------------');
											// console.log(project.comments);
											_.remove(project.comments,function (n) {
												return n.status != 'success'
											})
											var allcomments = [];
										// _.sortBy(project.comments,function (n) {
										// 	return new Date(n.createdAt)
										// })
											project.comments = project.comments.reverse()

									async.mapSeries(project.comments,
									function(item1,cb1) {
										// console.log('item1',item1);
										Comment.find(item1.id).populate('reponses',{ where:{status:'success'}}).exec(function(err,data) {
											// item1.comment=data
											// console.log(data);
											console.log('------------------------------');
											// console.log(project.comments.indexOf(item1));
											// item1=data
											// project.comments.splice(project.comments.indexOf(item1),1,data[0])
											allcomments.push(data[0])
											// console.log(data);
											cb1(null,item1)
										})

									},function(err, results) {
										
										project.comments=allcomments;
										// console.log('allcomments',allcomments);
										cbparalelle(null,allcomments)
									})
								}},function(err,ress) {

 										console.log('DELETE');
									if(project.category)
										project.category=project.category.id;
									if(project.author)
										project.author=project.author.id;

									var projecttogo = _.clone(project)

									delete projecttogo.comments
									projecttogo.comments=ress.comment
									// console.log(projecttogo.comments);
									// console.log(projecttogo);
									console.log('Final Data');
									var pathtoshare ='';
									pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/';
									if(projecttogo.urlrewrite)
									pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/'+projecttogo.urlrewrite;
									// console.log('fetch ONE Project', projecttogo);
									// res.status(200).send(projecttogo)
									res.status(200).view('juniorf',{
										baseurl : '/',
										project:projecttogo,
										marked:marked,
										title: req.__('SEO_juniorf_title'),
										keyword: req.__('SEO_juniorf_keyword'),
										description:req.__('SEO_juniorf_description'),
										// scripturl:'script.js',
										menu:'juniorf',
									})
								})
							})
							
						}
							
								

	
						
				});


					
	}	,	
	minimef:function(req,res,next) {

		console.log('minimef');
					Project.find('568b9103f8fd854966949b8e').populateAll().exec(function (err,items){
					
						if(err)
							callback(err)

						// callback(null,items)
						if(items.length>0)
						{
								items[0].nbView= Number(items[0].nbView) + 1;
								Article.update({id: items[0].id}, {nbView: items[0].nbView})
								.exec(function(err, updatedProject){
								var project= items[0];
								// console.log('item',item);
								async.series({
								image:function(cbparalelle) {
									async.map(project.images,
									function(item1,cb1) {
										// console.log('item1',item1);
										Image.findOne(item1.image).exec(function(err,data) {
											item1.image=data
											cb1(null,item1)
										})

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								document:function(cbparalelle) {
									async.map(project.documents,
									function(item1,cb1) {
										// console.log('item1',item1);
										Document.findOne(item1.document).exec(function(err,data) {
											item1.document=data
											cb1(null,item1)
										})

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								translations:function(cbparalelle) {
									async.map(project.translations,
									function(trad,cb1) {
										console.log(trad);
										if(trad.lang == req.locale){
											console.log('locale');
											project.title = (trad.title) ? trad.title : project.title;
											project.content = (trad.content) ? trad.content : project.content;
											project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											project.description = (trad.description) ? trad.description : project.description;
										}
										cb1(null,project)

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								comment:function(cbparalelle) {
											console.log('------------------------------');
											// console.log(project.comments);
											_.remove(project.comments,function (n) {
												return n.status != 'success'
											})
											var allcomments = [];
										// _.sortBy(project.comments,function (n) {
										// 	return new Date(n.createdAt)
										// })
											project.comments = project.comments.reverse()

									async.mapSeries(project.comments,
									function(item1,cb1) {
										// console.log('item1',item1);
										Comment.find(item1.id).populate('reponses',{ where:{status:'success'}}).exec(function(err,data) {
											// item1.comment=data
											// console.log(data);
											console.log('------------------------------');
											// console.log(project.comments.indexOf(item1));
											// item1=data
											// project.comments.splice(project.comments.indexOf(item1),1,data[0])
											allcomments.push(data[0])
											// console.log(data);
											cb1(null,item1)
										})

									},function(err, results) {
										
										project.comments=allcomments;
										// console.log('allcomments',allcomments);
										cbparalelle(null,allcomments)
									})
								}},function(err,ress) {

 										console.log('DELETE');
									if(project.category)
										project.category=project.category.id;
									if(project.author)
										project.author=project.author.id;

									var projecttogo = _.clone(project)

									delete projecttogo.comments
									projecttogo.comments=ress.comment
									// console.log(projecttogo.comments);
									// console.log(projecttogo);
									console.log('Final Data');
									var pathtoshare ='';
									pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/';
									if(projecttogo.urlrewrite)
									pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/'+projecttogo.urlrewrite;
									// console.log('fetch ONE Project', projecttogo);
									// res.status(200).send(projecttogo)
									res.status(200).view('minimef',{
										baseurl : '/',
										project:projecttogo,
										marked:marked,
										title: req.__('SEO_minimef_title'),
										keyword: req.__('SEO_minimef_keyword'),
										description:req.__('SEO_minimef_description'),
										// scripturl:'script.js',
										menu:'minimef',
									})
								})
							})
							
						}
							
								

	
						
				});
	}	,	
	minimem:function(req,res,next) {

		console.log('minimem');
					Project.find('56893c7ff4af8d5a551ce5bd').populateAll().exec(function (err,items){
					
						if(err)
							callback(err)

						// callback(null,items)
						if(items.length>0)
						{
								items[0].nbView= Number(items[0].nbView) + 1;
								Article.update({id: items[0].id}, {nbView: items[0].nbView})
								.exec(function(err, updatedProject){
								var project= items[0];
								// console.log('item',item);
								async.series({
								image:function(cbparalelle) {
									async.map(project.images,
									function(item1,cb1) {
										// console.log('item1',item1);
										Image.findOne(item1.image).exec(function(err,data) {
											item1.image=data
											cb1(null,item1)
										})

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								document:function(cbparalelle) {
									async.map(project.documents,
									function(item1,cb1) {
										// console.log('item1',item1);
										Document.findOne(item1.document).exec(function(err,data) {
											item1.document=data
											cb1(null,item1)
										})

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								translations:function(cbparalelle) {
									async.map(project.translations,
									function(trad,cb1) {
										console.log(trad);
										if(trad.lang == req.locale){
											console.log('locale');
											project.title = (trad.title) ? trad.title : project.title;
											project.content = (trad.content) ? trad.content : project.content;
											project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
											project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
											project.description = (trad.description) ? trad.description : project.description;
										}
										cb1(null,project)

									},function(err, results) {
										// console.log('results',results);
										cbparalelle(null,results)
									})
								},
								comment:function(cbparalelle) {
											console.log('------------------------------');
											// console.log(project.comments);
											_.remove(project.comments,function (n) {
												return n.status != 'success'
											})
											var allcomments = [];
										// _.sortBy(project.comments,function (n) {
										// 	return new Date(n.createdAt)
										// })
											project.comments = project.comments.reverse()

									async.mapSeries(project.comments,
									function(item1,cb1) {
										// console.log('item1',item1);
										Comment.find(item1.id).populate('reponses',{ where:{status:'success'}}).exec(function(err,data) {
											// item1.comment=data
											// console.log(data);
											console.log('------------------------------');
											// console.log(project.comments.indexOf(item1));
											// item1=data
											// project.comments.splice(project.comments.indexOf(item1),1,data[0])
											allcomments.push(data[0])
											// console.log(data);
											cb1(null,item1)
										})

									},function(err, results) {
										
										project.comments=allcomments;
										// console.log('allcomments',allcomments);
										cbparalelle(null,allcomments)
									})
								}},function(err,ress) {

 										console.log('DELETE');
									if(project.category)
										project.category=project.category.id;
									if(project.author)
										project.author=project.author.id;

									var projecttogo = _.clone(project)

									delete projecttogo.comments
									projecttogo.comments=ress.comment
									// console.log(projecttogo.comments);
									// console.log(projecttogo);
									console.log('Final Data');
									var pathtoshare ='';
									pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/';
									if(projecttogo.urlrewrite)
									pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/'+projecttogo.urlrewrite;
									// console.log('fetch ONE Project', projecttogo);
									// res.status(200).send(projecttogo)
									res.status(200).view('minimem',{
										baseurl : '/',
										project:projecttogo,
										marked:marked,
										title: req.__('SEO_minimem_title'),
										keyword: req.__('SEO_minimem_keyword'),
										description:req.__('SEO_minimem_description'),
										// scripturl:'script.js',
										menu:'minimem',
									})
								})
							})
							
						}
							
								

	
						
				});
	}
	// portfolio:function(req,res,next) {

	// 	console.log('portfolio');
	// 	async.parallel({
	// 		projs:function  (cb) {
	// 			Project.find({status:'actif'}).populateAll().sort('createdAt DESC').exec(function (err,projects) {
			
	// 					return Promise.map(projects,function  (project) {
	// 						console.log('---------------------------');
	// 						return new Promise(function(resolve,rej){
	// 							if(project.translations.length && req.locale!= 'fr'){
	// 								// console.log('we got Trad');
	// 								_.map(project.translations,function  (trad) {
	// 									// console.log('---------------------------');
	// 									if(trad.lang == req.locale){
	// 										project.title = (trad.title) ? trad.title : project.title;
	// 										project.content = (trad.content) ? trad.content : project.content;
	// 										project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
	// 										project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
	// 										project.description = (trad.description) ? trad.description : project.description;
	// 									}
	// 								})
	// 							}
	// 							project.content = truncate(marked(project.content), 450)
	// 							if(project.images.length)
	// 							{
	// 								console.log("IMG.LENGTH");
	// 								var img0 = _.find(project.images, function(chr) {
	// 								  return chr.rank == 0;
	// 								})
	// 								Image.findOne(img0.image).exec(function (err,datas) {
	// 									// console.log('datas',datas);
	// 									project.img = datas
	// 									console.log(project);
	// 									resolve(project)
	// 								})
	// 							}else
	// 							{
	// 								console.log("IMG.NOT NOT");
	// 								console.log(project);
	// 								resolve(project)
	// 							}
	// 						})
							
	// 					}).then(function (projectss) {
	// 						// console.log(projectss);
	// 						cb(null,projects)
	// 					})
					
	// 			})
	// 		},
	// 		cats:function  (cb) {
	// 			CategoryProject.find().populateAll().sort('name DESC').exec(function (err,cats) {
	// 		 _.remove(cats,function (n) {
	// 			return n.nbProjects <=0;
	// 		})
	// 					return Promise.map(cats,function  (cat) {
	// 						return new Promise(function(resolve,rej){
	// 							if(cat.translations.length && req.locale!= 'fr'){
	// 								_.map(cat.translations,function  (trad) {
	// 									if(trad.lang == req.locale){
	// 										cat.name = (trad.name) ? trad.name : cat.name;
	// 										// project.content = (trad.content) ? trad.content : project.content;
	// 										// project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
	// 										// project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
	// 										// project.description = (trad.description) ? trad.description : project.description;
	// 									}
	// 								})

	// 								resolve(cat)
	// 							}else
	// 							{
	// 								resolve(cat)
	// 							}
	// 						})
							
	// 					}).then(function (projectss) {
	// 						cb(null,cats)
	// 					})
					
	// 			})
	// 		}
	// 	},function  (err,results) {
	// 		// res.send(JSON.stringify(results,null, 10));
	// 		res.status(200).view('portfolio',{
	// 			'projects':results.projs,
	// 			'categories':results.cats,
	// 			title: req.__('SEO_PORTFO_title'),
	// 			keyword: req.__('SEO_PORTFO_keyword'),
	// 			description:req.__('SEO_PORTFO_description'),
	// 			scripturl:'portfo.js',
	// 			menu:'portfo',
	// 			marked:marked
	// 		})
	// 	})
		




	// },
	// projet:function(req,res,next) {
	// 	console.log(req.locale);
	// 	req.locale = req.locale || 'en'
	// 	moment.locale(req.locale)
	// 	console.log("FETCH ONE project");
		
	// 			Project.find(req.params.id).populateAll().exec(function (err,items){
					
	// 					if(err)
	// 						callback(err)

	// 					// callback(null,items)
	// 					if(items.length>0)
	// 					{
	// 							items[0].nbView= Number(items[0].nbView) + 1;
	// 							Article.update({id: items[0].id}, {nbView: items[0].nbView})
	// 							.exec(function(err, updatedProject){
	// 							var project= items[0];
	// 							// console.log('item',item);
	// 							async.series({
	// 							image:function(cbparalelle) {
	// 								async.map(project.images,
	// 								function(item1,cb1) {
	// 									// console.log('item1',item1);
	// 									Image.findOne(item1.image).exec(function(err,data) {
	// 										item1.image=data
	// 										cb1(null,item1)
	// 									})

	// 								},function(err, results) {
	// 									// console.log('results',results);
	// 									cbparalelle(null,results)
	// 								})
	// 							},
	// 							document:function(cbparalelle) {
	// 								async.map(project.documents,
	// 								function(item1,cb1) {
	// 									// console.log('item1',item1);
	// 									Document.findOne(item1.document).exec(function(err,data) {
	// 										item1.document=data
	// 										cb1(null,item1)
	// 									})

	// 								},function(err, results) {
	// 									// console.log('results',results);
	// 									cbparalelle(null,results)
	// 								})
	// 							},
	// 							translations:function(cbparalelle) {
	// 								async.map(project.translations,
	// 								function(trad,cb1) {
	// 									console.log(trad);
	// 									if(trad.lang == req.locale){
	// 										console.log('locale');
	// 										project.title = (trad.title) ? trad.title : project.title;
	// 										project.content = (trad.content) ? trad.content : project.content;
	// 										project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
	// 										project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
	// 										project.description = (trad.description) ? trad.description : project.description;
	// 									}
	// 									cb1(null,project)

	// 								},function(err, results) {
	// 									// console.log('results',results);
	// 									cbparalelle(null,results)
	// 								})
	// 							},
	// 							comment:function(cbparalelle) {
	// 										console.log('------------------------------');
	// 										// console.log(project.comments);
	// 										_.remove(project.comments,function (n) {
	// 											return n.status != 'success'
	// 										})
	// 										var allcomments = [];
	// 									// _.sortBy(project.comments,function (n) {
	// 									// 	return new Date(n.createdAt)
	// 									// })
	// 										project.comments = project.comments.reverse()

	// 								async.mapSeries(project.comments,
	// 								function(item1,cb1) {
	// 									// console.log('item1',item1);
	// 									Comment.find(item1.id).populate('reponses',{ where:{status:'success'}}).exec(function(err,data) {
	// 										// item1.comment=data
	// 										// console.log(data);
	// 										console.log('------------------------------');
	// 										// console.log(project.comments.indexOf(item1));
	// 										// item1=data
	// 										// project.comments.splice(project.comments.indexOf(item1),1,data[0])
	// 										allcomments.push(data[0])
	// 										// console.log(data);
	// 										cb1(null,item1)
	// 									})

	// 								},function(err, results) {
										
	// 									project.comments=allcomments;
	// 									// console.log('allcomments',allcomments);
	// 									cbparalelle(null,allcomments)
	// 								})
	// 							}},function(err,ress) {

 // 										console.log('DELETE');
	// 								if(project.category)
	// 									project.category=project.category.id;
	// 								if(project.author)
	// 									project.author=project.author.id;

	// 								var projecttogo = _.clone(project)

	// 								delete projecttogo.comments
	// 								projecttogo.comments=ress.comment
	// 								// console.log(projecttogo.comments);
	// 								// console.log(projecttogo);
	// 								console.log('Final Data');
	// 								var pathtoshare ='';
	// 								pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/';
	// 								if(projecttogo.urlrewrite)
	// 								pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/'+projecttogo.urlrewrite;
	// 								// console.log('fetch ONE Project', projecttogo);
	// 								// res.status(200).send(projecttogo)
	// 								res.status(200).view('project',{
	// 									'project':projecttogo,
	// 									moment: moment,
	// 									pathtoshare: pathtoshare,
	// 									'title': projecttogo.title +' - AAVO',
	// 									keyword: projecttogo.keyword,
	// 									description:projecttogo.description,
	// 									scripturl:'project.js',
	// 									menu:'portfo',
	// 									marked:marked
	// 								})
	// 							})
	// 						})
							
	// 					}
							
								
	// 							// callback(null,items);

	
						
	// 			});
		
		   
	// },
	// addCommentProj:function(req,res,next) {

	// 	Project.findOne(req.params.itemid).exec(function (err,project) {
	// 		Comment.create({
	// 			author:req.body.name,
	// 	  		email:req.body.email,
	// 	  		content:req.body.message,
	// 	  		status:'new',
	// 	  		project:req.params.itemid
	//   		}).exec(function (err,coment){
	// 								console.log(err)
	// 			if(err)
	// 				res.status(400).send(err)
	// 			else{

	// 			Notification.create({type:'projectcomment',status:'todo',info1:project.title,info2:'par '+coment.author,item:'project',itemid:req.params.itemid}).exec(function (err,notif){
	// 					console.log(err)
	// 					console.log(notif)
	// 					 Notification.publishCreate(notif);
	// 		    	res.status(200).send(coment)
	// 			});
	// 			}
	// 		});
	// 	})
	// },
	// test:function(req,res,next) {

		
	// 		    	res.status(200).view('test',{title: req.__('SEO_PORTFO_title'),
	// 			keyword: req.__('SEO_PORTFO_keyword'),
	// 			description:req.__('SEO_PORTFO_description'),
	// 			scripturl:'portfo.js',
	// 			menu:'portfo',
	// 			marked:marked
	// 		})
		
	// },
	// addReponseProj:function(req,res,next) {

	// 	console.log('addCommentProj');
	// 	console.log(req.params.itemid);
	// 	console.log(req.params.projid);
		
		
	// 	console.log('projid',req.params.projid);
		

	// 	Project.findOne(req.params.projid).exec(function (err,article) {
	// 		Comment.findOne(req.params.itemid).exec(function (err,comment) {

	// 			console.log(comment);
	// 			Reponse.create({author:req.body.name,
	// 	  		email:req.body.email,
	// 	  		content:req.body.message,
	// 	  		status:'new',
	// 	  		comment:req.params.itemid
	// 	  		}).exec(function (err,coment){
	// 									console.log(err)
	// 				if(err)
	// 					res.status(400).send(err)
	// 				else{

	// 				Notification.create({type:'projectcomment',status:'todo',info1:article.title,info2:'par '+coment.author,item:'project',itemid:req.params.projid}).exec(function (err,notif){
	// 						console.log(err)
	// 						console.log(notif)
	// 						 Notification.publishCreate(notif);
	// 			    		// res.status(200).send(created);
	// 			    	res.status(200).send(coment)
	// 				});
	// 				}
	// 			});
	// 		})
	// 	})
		
		

	// },
	// blog:function(req,res,next) {

	// 	console.log('blog');
	// 	async.parallel({
	// 		projs:function  (cb) {
	// 			Article.find({status:'actif'}).populateAll().sort('createdAt DESC').limit(20).exec(function (err,projects) {
			
	// 					return Promise.map(projects,function  (project) {
	// 						// console.log('---------------------------');
	// 						return new Promise(function(resolve,rej){
	// 							if(project.translations.length && req.locale!= 'fr'){
	// 								// console.log('we got Trad');
	// 								_.map(project.translations,function  (trad) {
	// 									// console.log('---------------------------');
	// 									if(trad.lang == req.locale){
	// 										project.title = (trad.title) ? trad.title : project.title;
	// 										project.content = (trad.content) ? trad.content : project.content;
	// 										project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
	// 										project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
	// 										project.description = (trad.description) ? trad.description : project.description;
	// 									}
	// 								})
	// 							}
	// 							project.content = truncate(marked(project.content), 450)
	// 							if(project.images.length)
	// 							{
	// 								var img0 = _.find(project.images, function(chr) {
	// 								  return chr.rank == 0;
	// 								})
	// 								Image.findOne(img0.image).exec(function (err,datas) {
	// 									// console.log('datas',datas);
	// 									project.img = datas

	// 									resolve(project)
	// 								})
	// 							}else
	// 							{
	// 								resolve(project)
	// 							}
	// 						})
							
	// 					}).then(function (projectss) {
	// 						// console.log(projectss);
	// 						cb(null,projects)
	// 					})
					
	// 			})
	// 		},
	// 		cats:function  (cb) {
	// 			CategoryBlog.find().populateAll().sort('name DESC').exec(function (err,cats) {
	// 		console.log(err);
	// 		console.log(cats);
	// 		 _.remove(cats,function (n) {
	// 			return n.nbArticles <=0;
	// 		})
	// 					return Promise.map(cats,function  (cat) {
	// 						console.log('---------------------------');
	// 						return new Promise(function(resolve,rej){
	// 							console.log(cat.translations.length);
	// 							if(cat.translations.length && req.locale!= 'fr'){
	// 								console.log('we got Trad');
	// 								_.map(cat.translations,function  (trad) {
	// 									console.log('---------------------------');
	// 									if(trad.lang == req.locale){
	// 										console.log('local cool');
	// 										cat.name = (trad.name) ? trad.name : cat.name;
	// 										// project.content = (trad.content) ? trad.content : project.content;
	// 										// project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
	// 										// project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
	// 										// project.description = (trad.description) ? trad.description : project.description;
	// 									}
	// 								})

	// 								resolve(cat)
	// 							}else
	// 							{
	// 								resolve(cat)
	// 							}
	// 						})
							
	// 					}).then(function (projectss) {
	// 						cb(null,cats)
	// 					})
					
	// 			})
	// 		}
	// 	},function  (err,results) {
	// 		console.log(err);
	// 		console.log('results');
	// 		console.log(results.cats);
	// 		// console.log(results);
	// 		res.status(200).view('blog',{
	// 			'articles':results.projs,
	// 			'categories':results.cats,
	// 			title: req.__('SEO_BLOG_title'),
	// 			keyword: req.__('SEO_BLOG_keyword'),
	// 			description:req.__('SEO_BLOG_description'),
	// 			scripturl:'portfo.js',
	// 			menu:'blog',
	// 			marked:marked
	// 		})
	// 	})
		




	// },
	// article:function(req,res,next) {
	// 	console.log(req.locale);
	// 	req.locale = req.locale || 'en'
	// 	moment.locale(req.locale)
	// 	console.log("FETCH ONE Article");
		
	// 			Article.find(req.params.id).populateAll().exec(function (err,items){
						

						
	// 					if(err)
	// 						callback(err)

	// 					// callback(null,items)
	// 					if(items.length>0)
	// 					{
	// 							// items[0].nbView= Number(items[0].nbView) + 1;
	// 							items[0].nbView= Number(items[0].nbView) + 1

	// 							Article.update({id: items[0].id}, {nbView: items[0].nbView})
	// 							.exec(function(err, updatedProject){
	// 							var project= items[0];
	// 							// console.log('item',item);
	// 							async.series({
	// 							image:function(cbparalelle) {
	// 								async.map(project.images,
	// 								function(item1,cb1) {
	// 									// console.log('item1',item1);
	// 									Image.findOne(item1.image).exec(function(err,data) {
	// 										item1.image=data
	// 										cb1(null,item1)
	// 									})

	// 								},function(err, results) {
	// 									// console.log('results',results);
	// 									cbparalelle(null,results)
	// 								})
	// 							},
	// 							document:function(cbparalelle) {
	// 								async.map(project.documents,
	// 								function(item1,cb1) {
	// 									// console.log('item1',item1);
	// 									Document.findOne(item1.document).exec(function(err,data) {
	// 										item1.document=data
	// 										cb1(null,item1)
	// 									})

	// 								},function(err, results) {
	// 									// console.log('results',results);
	// 									cbparalelle(null,results)
	// 								})
	// 							},
	// 							translations:function(cbparalelle) {
	// 								async.map(project.translations,
	// 								function(trad,cb1) {
	// 									console.log(trad);
	// 									if(trad.lang == req.locale){
	// 										console.log('locale');
	// 										project.title = (trad.title) ? trad.title : project.title;
	// 										project.content = (trad.content) ? trad.content : project.content;
	// 										project.rewriteurl = (trad.rewriteurl) ? trad.rewriteurl : project.rewriteurl;
	// 										project.keyword = (trad.keyword) ? trad.keyword : project.keyword;
	// 										project.description = (trad.description) ? trad.description : project.description;
	// 									}
	// 									cb1(null,project)

	// 								},function(err, results) {
	// 									// console.log('results',results);
	// 									cbparalelle(null,results)
	// 								})
	// 							},
	// 							comment:function(cbparalelle) {
	// 										console.log('------------------------------');
	// 										// console.log(project.comments);
	// 										_.remove(project.comments,function (n) {
	// 											return n.status != 'success'
	// 										})
	// 										var allcomments = [];
	// 									// _.sortBy(project.comments,function (n) {
	// 									// 	return new Date(n.createdAt)
	// 									// })
	// 										project.comments = project.comments.reverse()

	// 								async.mapSeries(project.comments,
	// 								function(item1,cb1) {
	// 									// console.log('item1',item1);
	// 									Comment.find(item1.id).populate('reponses',{ where:{status:'success'}}).exec(function(err,data) {
	// 										// item1.comment=data
	// 										// console.log(data);
	// 										console.log('------------------------------');
	// 										// console.log(project.comments.indexOf(item1));
	// 										// item1=data
	// 										// project.comments.splice(project.comments.indexOf(item1),1,data[0])
	// 										allcomments.push(data[0])
	// 										// console.log(data);
	// 										cb1(null,item1)
	// 									})

	// 								},function(err, results) {
										
	// 									project.comments=allcomments;
	// 									// console.log('allcomments',allcomments);
	// 									cbparalelle(null,allcomments)
	// 								})
	// 							}
	// 						},function(err,ress) {

 // 										console.log('DELETE');
	// 								if(project.category)
	// 									project.category=project.category.id;
									

	// 								var projecttogo = _.clone(project)

	// 								delete projecttogo.comments
	// 								projecttogo.comments=ress.comment
	// 								// console.log(projecttogo.comments);
	// 								// console.log(projecttogo);
	// 								console.log('Final Data');

	// 								var pathtoshare ='';
	// 								pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/';
	// 								if(projecttogo.urlrewrite)
	// 								pathtoshare = sails.config.URL_HOME +'article/'+ projecttogo.id +'/'+projecttogo.urlrewrite;



	// 								// console.log('fetch ONE Project', projecttogo);
	// 								// res.status(200).send(projecttogo)
	// 								res.status(200).view('article',{
	// 									'article':projecttogo,
	// 									moment: moment,
	// 									pathtoshare:pathtoshare,
	// 									'title': projecttogo.title +' - BLOG - AAVO',
	// 									keyword: projecttogo.keyword,
	// 									description:projecttogo.description,
	// 									scripturl:'article.js',
	// 									menu:'blog',
	// 									marked:marked
	// 								})
	// 							})
	// 						});		
	// 					}
							
								
	// 							// callback(null,items);

	
						
	// 			});
		
		   
	// }
	,
	addCommentArticle:function(req,res,next) {

		console.log('addCommentProj');
		console.log(req.params.itemid);
		

		Article.findOne(req.params.itemid).exec(function (err,article) {
			console.log(article);
			Comment.create({author:req.body.name,
	  		email:req.body.email,
	  		content:req.body.message,
	  		status:'new',
	  		article:req.params.itemid
	  		}).exec(function (err,coment){
									console.log(err)
				if(err)
					res.status(400).send(err)
				else{

				Notification.create({type:'articlecomment',status:'todo',info1:article.title,info2:'par '+coment.author,item:'article',itemid:req.params.itemid}).exec(function (err,notif){
						console.log(err)
						console.log(notif)
						 Notification.publishCreate(notif);
			    		// res.status(200).send(created);
			    	res.status(200).send(coment)
				});
				}
			});
		})
		
		

	},
	addReponseArticle:function(req,res,next) {

		console.log('addCommentProj');
		console.log(req.params.itemid);
		console.log('projid',req.params.projid);
		

		Article.findOne(req.params.projid).exec(function (err,article) {
			Comment.findOne(req.params.itemid).exec(function (err,comment) {
				console.log(comment);
				Reponse.create({author:req.body.name,
		  		email:req.body.email,
		  		content:req.body.message,
		  		status:'new',
		  		comment:req.params.itemid
		  		}).exec(function (err,coment){
										console.log(err)
					if(err)
						res.status(400).send(err)
					else{

					Notification.create({type:'articlecomment',status:'todo',info1:article.title,info2:'par '+coment.author,item:'article',itemid:req.params.projid}).exec(function (err,notif){
							console.log(err)
							console.log(notif)
							 Notification.publishCreate(notif);
				    		// res.status(200).send(created);
				    	res.status(200).send(coment)
					});
					}
				});
			})
		})
		
		

	},
	contactEmail:function(req,res,next) {

		console.log('contactEmailcontactEmailcontactEmailcontactEmailcontactEmailcontactEmail');
		console.log(req.body.message);
		console.log(req.body.name);
		console.log(req.body.email);
		if(req.body.message && req.body.name && req.body.email)
		{
			console.log('contactEmail ----> true');
			var transporter = nodemailer.createTransport({
				    service: 'Gmail',
				    auth: {
				        user: sails.config.MAIN_EMAIL_GOOGLE,
						pass: sails.config.MAIN_EMAIL_GOOGLE_PWD
				    }
				})
			
			var mailOptions = {
			    from: req.body.name+' <'+req.body.email+'>', // sender address
			    to: sails.config.MAIN_EMAIL, // list of receivers
			    subject: 'Site - '+ sails.config.COMPANY_NAME +' - contact : '+ req.body.name, // Subject line
			    text: req.body.message // html body
			};
			// send mail with defined transport object
			transporter.sendMail(mailOptions, function(error, info){

				console.log('here');
				console.log(error);
				console.log(info);
			    if(error){
			        res.status(400).send('Une erreur est survenu');
			    }else{

					res.status(200).send('Votre email a été envoyé.');

			    }
			});
		}else{
			res.status(400).send('Une erreur est survenu');
		}
	}
	
}
