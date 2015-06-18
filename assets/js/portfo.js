$(document).ready(function () {
	console.log('DOM READY');

		$().prettyEmbed();

	$('.listCatProj li').click(function (e) {
		$('.listCatProj li').removeClass('active')
		var $this= $(this);
		$this.addClass('active')
		var cat = $this.attr('rel')
		console.log(cat);
		// $('#main').find('.box.container').hide()
		if(cat=='all'){
			$('#main').find('.box.container').fadeIn()
		}else{
			$('#main').find('.box.container[rel!="'+cat+'"]').fadeOut()
			$('#main').find('.box.container[rel="'+cat+'"]').fadeIn()
		}
	})

})
