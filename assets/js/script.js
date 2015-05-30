$(document).ready(function () {
	console.log('DOM READY');
	$(".img1").backstretch("images/pic01.jpg");
	$(".img2").backstretch("images/pic02.jpg");
	$(".img3").backstretch("images/pic03.jpg");
	// (function($){
	// $.backstretch("http://dl.dropbox.com/u/515046/www/garfield-interior.jpg");
	// })(jQuery);
	$('#contactForm').submit(function (e) {
	console.log('contactForm');
		e.preventDefault()
		console.log($(this));
		$this = $(this)
		var postData = $this.serialize();

		
				$.ajax(
			    {
			        url : '/contactEmail',
			        type: "POST",
			        data : postData,
			        success:function(data, textStatus, jqXHR) 
			        {
			        	$this.find('.errorMessageRequired').hide()
			        	$this.find('.errorMessageError').hide()
			        	console.log('DATA',data);
			            $this.find('.cache').show()
			            console.log($this.parent());
			            // setTimeout(function (argument) {
				            // $this.parent().collapse('hide');
			            // },2000)
			        },
			        error: function(jqXHR, textStatus, errorThrown) 
			        {
			            //if fails    
			            console.log('errorThrown');  
			            console.log(errorThrown);  
			            console.log(textStatus);  
			            console.log(jqXHR.responseText);  
			            if(jqXHR.responseText=="field error"){
			            	$this.find('.errorMessageRequired').fadeIn()
			            }else{
			            	$this.find('.errorMessageError').fadeIn()
			            }
			        }
			   	});
		
	})
})
