/**
 * TagController
 *
 * @description :: Server-side logic for managing tags
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	fetchAll:function(req,res,next) {
		var filter = {}
		filter.page = req.query.page || 1;
		filter.perPage = req.query.perPage || 10;
		filter.order = req.query.order || 'date DESC';

		// console.log(filter.order);
		// filter.role=[]
		// console.log(req.query.membre);
		// if(req.query.member=='false'){

		// }else{
		// 	filter.role.push('member')
		// }if(req.query.admin=='false'){

		// }else{
		// 	filter.role.push('admin')
		// }if(req.query.user=='false'){

		// }else{
		// 	filter.role.push('user')
		// }
		// console.log(filter.role);
		filter.slug = req.query.slug || '';
		// var nbPerPage = 30;

		async.parallel({
		    data:function(callback){
		    	// callback(null, 'emailOk');
		    		console.log('filterPage========================>' +filter.page);
		    		// {filename:{'contains':filter.slug}}
		    		// .sort(filter.order).limit(filter.perPage).skip(filter.perPage*filter.page-filter.perPage)
				Tag.find({text:{'contains':filter.slug}}).sort(filter.order).limit(filter.perPage).skip(filter.perPage*filter.page-filter.perPage).exec(function (err,users){
					
					console.log('err==',err);
						if(err)
							callback(err)
						callback(null,users)
						// res.status(200).send({users:users,total:})
						
				});
		    },
		    count:function(callback){

		    	console.log('FIND DOCUMENTS');
		            Tag.count({text:{'contains':filter.slug}}).exec(function (err,count){
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
		  
				Tag.find({text:{'contains':req.params.slug}}).sort('text ASC').exec(function (err,users){
					
					if(err){
						res.status(401).send(err);
					}
					else{
						var datas = _.pluck(users,'text')
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

			Tag.create(req.body).exec(function (err,data) {
				if(err)
					res.status(400).send(err)
				res.status(200).send(data);
			})
		}
	},
	delete:function  (req,res,next) {
		sails.log('delete');
		Tag.destroy(req.params.id,function (err) {
				if(err) 
					res.status(400).send(err)
				else
					res.status(200).send({deleted:req.params.id})
		})
	},
	fixture:function  (req,res,next) {
		sails.log('fixture');

		var list= ['jsTag', 'c#', 'java', 'javascript', 'jquery', 'android' , 'php', 'c++', 'python', 'ios', 'mysql', 'iphone', 'sql', 'html', 'css', 'objective-c', 'ruby-on-rails', 'c', 'sql-server', 'ajax', 'xml', '.net', 'ruby', 'regex', 'database', 'vb.net', 'arrays', 'eclipse', 'json', 'django', 'linux', 'xcode', 'windows', 'html5', 'winforms', 'r', 'wcf', 'visual-studio-2010', 'forms', 'performance', 'excel', 'spring', 'node.js', 'git', 'apache', 'entity-framework', 'asp.net', 'web-services', 'linq', 'perl', 'oracle', 'action-script', 'wordpress', 'delphi', 'jquery-ui', 'tsql', 'mongodb', 'neo4j', 'angularJS', 'unit-testing', 'postgresql', 'scala', 'xaml', 'http', 'validation', 'rest', 'bash', 'django', 'silverlight', 'cake-php', 'elgg', 'oracle', 'cocoa', 'swing', 'mocha', 'amazon-web-services'];
		for(var i in list)
		{

			Tag.create({text:list[i]}).exec(function (err,data) {
				console.log(data);
			})
		}
		
	}
};

