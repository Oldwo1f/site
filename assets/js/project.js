$(document).ready(function () {




	if(project.publishVideo==true && project.video){ 
		$().prettyEmbed();
    }

    
    $('#twitter').sharrre({
	  share: {
	    twitter: true
	  },
	  template: '<a class="icon fa-twitter" href="#"><span class="count" href="#">{total}</span></a>',
	  enableHover: false,
	  enableTracking: true,
	  buttons: { twitter: {}},
	  click: function(api, options){
	    api.simulateClick();
	    api.openPopup('twitter');
	  }
	});
    $('#facebook').sharrre({
	  share: {
	    facebook: true
	  },
	  template: '<a class="icon fa-facebook" href="#"><span class="count" href="#">{total}</span></a>',
	  enableHover: false,
	  enableTracking: true,
	  click: function(api, options){
	    api.simulateClick();
	    api.openPopup('facebook');
	  }
	});





	$('.commentform').submit(function (e) {
	console.log('commentform');
		e.preventDefault()
		console.log($(this));
		$this = $(this)
		var item = $this.attr('item')
		var rep = $this.attr('reponse')
		var itemid = $this.attr('itemid')
		var projid = $this.attr('projid')
		var name = $this.find('input[name="name"]').val()
		var email = $this.find('input[name="email"]').val()
		var message = $this.find('textarea[name="message"]').val()
		console.log(name);
		console.log(email);
		console.log(message);
		console.log(item);
		console.log(itemid);
		var postData = $this.serialize();


		console.log(postData);
		if(item == 'project')
		{
			if(rep){

			}else{

				$.ajax(
			    {
			        url : '/project/'+itemid+'/addComment',
			        type: "POST",
			        data : postData,
			        success:function(data, textStatus, jqXHR) 
			        {
			        	$this.find('.errorMessageRequired').hide()
			        	$this.find('.errorMessageError').hide()
			        	console.log('DATA',data);
			            $this.find('.cache').fadeIn()
			            console.log($this.parent());
			            setTimeout(function (argument) {
				            $this.parent().collapse('hide');
			            },2000)
			        },
			        error: function(jqXHR, textStatus, errorThrown) 
			        {
			            //if fails    
			            console.log('errorThrown');  
			            console.log(errorThrown);  
			            console.log(textStatus);  
			            console.log(JSON.parse(jqXHR.responseText).error);  
			            if(JSON.parse(jqXHR.responseText).error=="E_VALIDATION"){
			            	$this.find('.errorMessageRequired').fadeIn()
			            }else{
			            	$this.find('.errorMessageError').fadeIn()
			            }
			        }
			    });

			}
		}
		if(item == 'comment')
		{
			if(rep){

			}else{

				$.ajax(
			    {
			        url : '/project/addReponse/'+itemid+'/'+projid,
			        type: "POST",
			        data : postData,
			        success:function(data, textStatus, jqXHR) 
			        {
			        	$this.find('.errorMessageRequired').hide()
			        	$this.find('.errorMessageError').hide()
			        	console.log('DATA',data);
			            $this.find('.cache').fadeIn()
			            console.log($this.parent());
			            setTimeout(function (argument) {
				            $this.parent().collapse('hide');
			            },2000)
			        },
			        error: function(jqXHR, textStatus, errorThrown) 
			        {
			            //if fails    
			            console.log('errorThrown');  
			            console.log(errorThrown);  
			            console.log(textStatus);  
			            console.log(JSON.parse(jqXHR.responseText).error);  
			            if(JSON.parse(jqXHR.responseText).error=="E_VALIDATION"){
			            	$this.find('.errorMessageRequired').fadeIn()
			            }else{
			            	$this.find('.errorMessageError').fadeIn()
			            }
			        }
			    });

			}
		}
	})
})
