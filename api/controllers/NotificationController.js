/**
 * NotificationController
 *
 * @description :: Server-side logic for managing notifications
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	subscribeNotif:function(req,res,next) {
		// 

		console.log('NOTIF');
		Notification.watch(req);
// console.log(req.user);
		Notification.find().populate('users').sort('createdAt DESC').exec(function (err,notifications) {
			

			// console.log(notifications);
			if(err)
				res.send(err)

			_.remove(notifications, function(val) { 

				// console.log('n',val);
				for(var i in val.users){
					if(val.users[i].id == req.user){
						return true; 
						// // delete notifications[key]
						// notifications.splice(key,1)
					}
				}
				return false;
			});

			
			Notification.subscribe(req.socket,notifications);



			// console.log('coooooooooooooool');
			// console.log(notifications);



			res.status(200).send(notifications);
			// body...
		})


	},
	validateNotifications:function (req,res,next) {
		console.log('validateNotifications');
		// console.log(req.body);
		// console.log(req.user);
		// console.log('--------------------------------');
		var arrayID = [];
		for(var i in req.body){
			arrayID.push(req.body[i].id)
		}
		console.log(arrayID);
		Notification.find(arrayID).exec(function (err,results) {

			var item =  results[0]
			// console.log(item);
			
			if(err)	
			{	
				console.log("err");
			}
			else{
				async.map(results,function (item,callback) {
					if(item.status=='ok'){
						item.users.add(req.user);
						item.save(function (err,r) {
							console.log(err);
							if(err)
							{
								callback(null,false)
							}else{
								callback(null,false)
							}
						})
					}else{
						callback(null,true)
					}
					
					
				},function cb (err, results) {
					console.log('MAP CB FINAL');
					console.log(err);
					console.log(results);
					console.log(_.compact(results).length);
					res.status(200).send({count:_.compact(results).length})
				})
			}
		})
		

	},
	createNotif:function (req,res,next) {
		
					Notification.create({type:'usercreated',status:'ok',info1:"Alexis Momcilovic",info2:'alexismomcilovic@gmail.com'}).exec(function (err,notif){
								console.log(err)
								console.log(notif)
								 // Notification.publishCreate(notif);
					    		// res.status(200).send(created);
					    	res.status(200).send(notif)
					});
		

	},
	createComment:function (req,res,next) {
		console.log('createComment');
		Project.findOne('5549e5742740841a36e71a40').exec(function (err,article) {
			Comment.create({author:'nom de l auteur',
	  		email:'totot@tttt.fr',
	  		content:'ceci est un commentaire',
	  		status:'new',
	  		project:'5549e5742740841a36e71a40'
	  		}).exec(function (err,coment){
									console.log(err)
									console.log(coment)
				Notification.create({type:'projectcomment',status:'todo',info1:article.title,info2:'par '+coment.author,item:'project',itemid:'5549e5742740841a36e71a40'}).exec(function (err,notif){
						console.log(err)
						console.log(notif)
						 // Notification.publishCreate(notif);
			    		// res.status(200).send(created);
			    	res.status(200).send(notif)
				});
			});
		})
		
		

	}
};

