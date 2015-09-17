app.controller('newslettersCtrl',['$scope','filterFilter','$filter','$state','mailingLists','mailingListsService','abonnes','$stateParams','messageCenterService',
function newslettersCtrl($scope,filterFilter,$filter,$state,mailingLists,mailingListsService,abonnes,$stateParams,messageCenterService) {
	 $scope.csv = {
    	content: null,
    	header: true,
    	separator: ',',
    	result: null
    };
    $scope.order='createdAt';
    $scope.reverse=false;
	$scope.mailingLists = mailingLists;
	$scope.currentList=$stateParams.id;
	$scope.abonnes=[];
	if(abonnes)
		$scope.abonnes=abonnes.abonnes

	$scope.linkaddList =function(){
        $state.go('/.newsletters.list.add');
    }
    $scope.linkadd =function(){
        $state.go('/.newsletters.list.addabonne');
    }

    $scope.totalChecked = function()
    {
        if(filterFilter($scope.abonnes,{checked : true}).length == $scope.abonnes.length)
            $scope.allChecked = true;
        else
            $scope.allChecked = false;
        return filterFilter($scope.abonnes,{checked : true}).length;
    }
    $scope.toggleAllcheck = function()
    {
        allchecked = !$scope.allChecked;
        $scope.abonnes.forEach(function(abonne) {
            abonne.checked = allchecked;
        });
    }

    $scope.changeList=function() {

    	$state.go('/.newsletters.list',{id:$scope.currentList});
    	
    };
    $scope.removeselected =function(){
        mailingListsService.remove(filterFilter($scope.abonnes,{checked : true}),$scope.currentList,function(abonnes) {
            $scope.abonnes=[];
        	$scope.abonnes=abonnes;
        })

    }
    $scope.removeList =function(){
            mailingListsService.removeList($scope.currentList,function() {
            	$state.go('/.newsletters.list',{id:null});
            })
    }

    $scope.finishImport =function(t){
            var emailTab=[];
            for(i in t){
            	row = t[i][0].split(',');
            	for(j in row)
            	{
            		var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            		if(pattern.test(row[j]))
            		{
            			emailTab.push(row[j])
            		}
            	}
            }

            if(emailTab.length>0)
            {
            	mailingListsService.addSeriesMails($scope.currentList,emailTab).then(function(datas) {
            		$scope.abonnes = $scope.abonnes.concat(datas)
            	});
            }

    }
    $scope.sortFunction =function(val){

        
            return val[$scope.order];
    }
    $scope.listfilter =function(val){
        var patt = new RegExp($scope.slug,'i');
        
        if(patt.test(val.email))
            return true;
        if(patt.test($filter('date')(val.createdAt,'dd MMMM')))
            return true;
        val.checked=false;
        return false;
    }



}]);


app.controller('addmailinglistCtrl',['$scope','filterFilter','$filter','$state','mailingListsService',
function addmailinglistCtrl($scope,filterFilter,$filter,$state,mailingListsService) {
	$scope.newList={};
	$('.newModal').modal();
    $('.newModal').on('hidden.bs.modal',function(e) {
        $state.go('/.newsletters.list');
    });

    $scope.submitNew=function() {
        
        if($scope.newList.title)
        {

	        mailingListsService.addNew($scope.newList).then(function() {
	            $scope.newList.title='';
	            $state.go('/.newsletters.list');
	        },function(err) {
	            if(err.error.invalidAttributes)
	            {
                    messageCenterService.add('danger', 'Veuillez revoir votre saisie', { status: messageCenterService.status.unseen, timeout: 4000 });
	                invalAttrs = err.error.invalidAttributes;
	                for(var i in invalAttrs)
	                {
	                    $('[name="'+i+'"]').parent().addClass('has-error');
	                }
	            }
	        })
        }
        
    };

}]);
app.controller('addabonneCtrl',['$scope','filterFilter','$filter','$state','mailingListsService',
function addabonneCtrl($scope,filterFilter,$filter,$state,mailingListsService) {
	$scope.newAbonne={};
	$('.newModal').modal();
    $('.newModal').on('hidden.bs.modal',function(e) {
        $state.go('/.newsletters.list');
    });

    $scope.submitNew=function() {
        if($scope.newAbonne.email && $scope.currentList != null)
        {

	        mailingListsService.addNewabonne($scope.newAbonne,$scope.currentList).then(function(data) {
	            $scope.newAbonne.email='';
	            $scope.$parent.abonnes= data.abonnes;
	            $state.go('/.newsletters.list');
	        },function(err) {
	            if(err.error.invalidAttributes)
	            {
                    messageCenterService.add('danger', 'Veuillez revoir votre saisie', { status: messageCenterService.status.unseen, timeout: 4000 });
	                invalAttrs = err.error.invalidAttributes;
	                for(var i in invalAttrs)
	                {
	                    $('[name="'+i+'"]').parent().addClass('has-error');
	                }
	            }
	        })
        }
        
    };

}]);