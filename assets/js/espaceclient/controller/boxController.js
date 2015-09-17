app.controller('boxCtrl',['$scope','$stateParams','$timeout','box','boxService','filterFilter','configService','$state','$filter','messageCenterService','accountService',
    function boxCtrl($scope,$stateParams,$timeout,box,boxService,filterFilter,configService  ,$state,$filter,messageCenterService,accountService) {
    
    $scope.slug='';
    $scope.flux = box;
    
    
    $scope.linkForum =function(){
            $state.go('/.fluxs.fluxs');
    }

    $scope.removeFavoris = function(contentid)
    {
    	console.log('here');
        boxService.removeFavoris(contentid);
    }

   	$scope.boxfilter =function(val){
        var patt = new RegExp($scope.slug,'i');
        switch(val.type){
        	case 'ingredient':
        		if(patt.test(val.ingredient.name))
            		return true;
        	break;
        	case 'fichier':
        		if(patt.test(val.fichier.title))
            		return true;
        	break;
        	case 'prez':
        		if(patt.test(val.prez.title))
            		return true;
        	break;
        	case 'link':
        		if(patt.test(val.link.title))
            		return true;
        	break;
        	case 'privatearticle':
            //     if (val.privatearticle) {
        		  if(patt.test(val.privatearticle.title))
            	   return true;
                // }
        	break;
        }
        
        
        // if(patt.test($filter('date')(val.createdAt,'dd MMMM')))
        //     return true;

        // val.checked=false;
        return false;
    }

}]);