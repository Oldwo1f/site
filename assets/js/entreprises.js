$(document).ready(function() {

	var menuCount = 1;
	var menuMax = 2;
	if(menuMax>1){
		$('.nextBtn').show();
	}

	$('.mainContainer').load('templates/employeur.html')
	$('a.ajax').click(function(e){
		e.preventDefault();
		console.log();
		$('.maincontainer').addClass('mainContainer').removeClass('maincontainer');
		$('.mainContainer').load($(this).attr('href'))
	});

	$('.nextBtn').click(function(e){
		console.log('click');
		menuCount ++;
		if(menuCount>= menuMax)
		{	
			$('.nextBtn').hide();
		}else{
			$('.nextBtn').show();
		}
		if(menuCount> 1)
		{
			$('.prevBtn').show();
		}else{
			$('.prevBtn').hide();
		}

		$('.navSecondaire .row > div').addClass('hide');
		for(var i=menuCount; i<menuCount+4 ; i++)
		{
			$('.navSecondaire .row > div[rel="'+i+'"]').removeClass('hide');
		}

	})
	$('.prevBtn').click(function(e){
		console.log('click');
		menuCount --;
		if(menuCount<= menuMax)
		{	
			$('.nextBtn').show();
		}else{
			$('.nextBtn').hide();
		}
		if(menuCount> 1)
		{
			$('.prevBtn').show();
		}
		else
		{
			$('.prevBtn').hide();
		}
		$('.navSecondaire .row > div').addClass('hide');
		for(var i=menuCount; i<menuCount+4 ; i++)
		{
			$('.navSecondaire .row > div[rel="'+i+'"]').removeClass('hide');
		}
	})

	$('a.ajax2').click(function(e){
        $('.mainContainer').addClass('maincontainer').removeClass('mainContainer').html()
        e.preventDefault();
        console.log();
        var H = $('.refheight').height() - $('.refheight2').height();
        console.log(H);
        console.log($(this).attr('href'));
        $('.maincontainer').load($(this).attr('href')).css('height', H-14)
    });


});