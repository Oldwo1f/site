/**
 * CategoryProjectController
 *
 * @description :: Server-side logic for managing categoryblogs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 var Promise = require('bluebird');
module.exports = {
	fetchAll:function(req,res,next) {
		var filter = {}
		filter.page = req.query.page || 1;
		filter.perPage = req.query.perPage || 10;
		filter.order = req.query.order || 'createdAt DESC';

		
		filter.slug = req.query.slug || '';

		async.parallel({
		    data:function(callback){
		    	// callback(null, 'emailOk');
		    		console.log('filterPage========================>' +filter.page);
		    		// {filename:{'contains':filter.slug}}
		    		// .sort(filter.order).limit(filter.perPage).skip(filter.perPage*filter.page-filter.perPage)
				CategoryProject.find({name:{'contains':filter.slug}}).sort(filter.order).limit(filter.perPage).skip(filter.perPage*filter.page-filter.perPage).populateAll().exec(function (err,users){
					
					console.log('err==',err);
						if(err)
							callback(err)
						callback(null,users)
						// res.status(200).send({users:users,total:})
						
				});
		    },
		    count:function(callback){

		    	console.log('FIND DOCUMENTS');
		            CategoryProject.count({name:{'contains':filter.slug}}).exec(function (err,count){
						if(err)
							callback(err)
						callback(null,count)
						// res.status(200).send({users:users,total:})
						
				});
		    }
		},
		function(err, results){
				
				// console.log(results);
			if(err){

				res.status(401).send(err);
			}
			else{

				res.status(200).send({data:results.data,total:results.count})
			}

			

		});

	},
	list:function(req,res,next) {
		  console.log('LIST');
				CategoryProject.find().sort('name ASC').exec(function (err,datas){
					
					if(err){
						res.status(400).send(err);
					}
					else{
						console.log(datas);
						res.status(200).send(datas)
					}
						
				});
		   
		
	},
	add:function  (req,res,next) {
		console.log('ADDTAG');
		if(req.body)
		{
			console.log(req.body);

			CategoryProject.create(req.body).exec(function (err,data) {
				if(err)
					res.status(400).send(err)
				res.status(200).send(data);
			})
		}
	},
	update:function (req,res,next) {
		
		if(req.body)
		{
			// var tags = req.body.tags;
			// var imagesTab = req.body.images;
			// var documentsTab = req.body.documents;
			// var commentsTab = req.body.comments;
			var translations = req.body.translations;
			// var oldcategory = '';
			// console.log(req.body);
			console.log(translations);

			return Promise.bind({})
			.then(function find_article(){
			    return CategoryProject.findOne(req.body.id).populateAll()
			})
			.then(function save_article(cat){
				this.cat = cat
			    // oldcategory=cat.category.id
			    cat.name= req.body.name;
			    cat.color= req.body.color;
			    cat.textColor= req.body.textColor;
			    
			    return cat.save()
			    
			})
			
			.then(function() {
				var oldtrans = this.cat.translations
				return Promise.map(translations,function(translation) {
					// console.log(translation.id);
					// console.log(translation);
					if(translation.id){
						return CategoryProjectTraduction.findOne(translation.id).then(function(founded) {
							return CategoryProjectTraduction.update(translation.id,translation)
						})
					}else{
						translation.article = req.body.id;
						// console.log('translation = this.article.id;',req.body.id);
						return CategoryProjectTraduction.create(translation).then(function(founded) {
							// console.log('founded',founded);
							founded.categoryblog = req.body.id
							return founded.save().then(function(toto) {
								// console.log('toto',toto);
							})

						})
					}
					
				}).then(function() {
					return Promise.map(oldtrans,function(trans) {
						console.log('trans',trans);
					if(!_.contains(_.pluck(translations,'id'),trans.id))
					{
						// console.log('NOT CONTAINT reponse');
						return CategoryProjectTraduction.destroy(trans.id)
					}else
					{
						return true
					}
					})
					
				})
			})
			.then(function (thisArticle){
				return CategoryProject.findOne(req.body.id).populateAll()
			})
			.done(function(cat) {
				console.log('DONE');
				// console.log(this.article);
				res.status(200).send(cat)
				// this.article.save(function(err,data) {
				// 	console.log('SAVED');
				// })
			},function(e) {
				console.log('ERROR FUNCTION');
				console.log(e);
				res.status(400).send(e)
			});
			


		}
		else{
			return res.status(400).send('no body');
		}
	
		
			// CategoryProject.update(req.body.id,req.body).exec(function (err,user2){
			// 	console.log('update');
			// 	if(err) res.status(400).send({error:err})
			// 	user = user2[0]
				
			// 		res.status(200).send(user)
			// });
	},
	delete:function  (req,res,next) {
		sails.log('delete');
		CategoryProject.destroy(req.params.id,function (err) {
				if(err) 
					res.status(400).send(err)
				else
					res.status(200).send({deleted:req.params.id})
		})
	},
	fixture:function  (req,res,next) {
		sails.log('fixture');

		var list= ['jsCategoryProject', 'c#', 'java', 'javascript', 'jquery', 'android' , 'php', 'c++', 'python', 'ios', 'mysql', 'iphone', 'sql', 'html', 'css', 'objective-c', 'ruby-on-rails', 'c', 'sql-server', 'ajax', 'xml', '.net', 'ruby', 'regex', 'database', 'vb.net', 'arrays', 'eclipse', 'json', 'django', 'linux', 'xcode', 'windows', 'html5', 'winforms', 'r', 'wcf', 'visual-studio-2010', 'forms', 'performance', 'excel', 'spring', 'node.js', 'git', 'apache', 'entity-framework', 'asp.net', 'web-services', 'linq', 'perl', 'oracle', 'action-script', 'wordpress', 'delphi', 'jquery-ui', 'tsql', 'mongodb', 'neo4j', 'angularJS', 'unit-testing', 'postgresql', 'scala', 'xaml', 'http', 'validation', 'rest', 'bash', 'django', 'silverlight', 'cake-php', 'elgg', 'oracle', 'cocoa', 'swing', 'mocha', 'amazon-web-services'];
		for(var i in list)
		{

			CategoryProject.create({text:list[i]}).exec(function (err,data) {
				console.log(data);
			})
		}
		
	}
};

