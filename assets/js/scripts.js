$(document).ready(function() {
	console.log('scripts');
 	var item = $('.bandoclient ul');
 	var width = $('.container').width()
 	var lastvalue = item.width()-width

 	item.css('left','0px')

 	
 	var direction = 'r'
 	if(direction=='r'){
 			direction = 'l'
 			item.animate({left:-lastvalue},3000)
 	}
 	var interval = setInterval(function() {
 		if(direction=='r'){
 			direction = 'l'
 			item.animate({left:-lastvalue},3000)
 		}
 		else if(direction=='l'){
 			direction = 'r'
 			item.animate({left:0},3000)
 			
 		}

 	},6000)


});