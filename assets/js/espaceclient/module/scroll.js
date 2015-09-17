app.directive('whenScrolled', function() {
    return {

	    restrict: 'A',
	    template: '<button type="button"  class="btn btn-danger btn-xs">' +
                    '<span class="glyphicon glyphicon-trash"></span>Supprimer' +
                  '</button>',
	    link:function(scope, elm, attr) {
	        var raw = elm[0];
	        console.log('directive');
	        console.log(raw);
	        // $(raw).waypoint(function(direction) {
	            
	        //     if(direction==='up')
	        //     {
	        //         console.log('up');
	        //     }else if(direction==='down')
	        //     {
	        //         console.log('down');
	        //         // if(currentArticle>99)
	        //         // {
	        //         //     $('.articles').waypoint('disable')
	        //         // }else
	        //         //     fetchONEarticle();
	                

	        //     }
	        // },{offset:'bottom-in-view'});
	        // elm.bind('scroll', function() {
	        //     if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
	        //         scope.$apply(attr.whenScrolled);
	        //     }
	        // });
	    }
    }
});