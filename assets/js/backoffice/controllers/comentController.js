app.controller('comentsCtrl',['$scope','filterFilter','comentsService','$filter','$state','coments',
function comentsCtrl($scope,filterFilter,comentsService,$filter,$state,coments) {

	$scope.coments= coments;
	console.log($scope.coments);
	$scope.order='date';
	$scope.reverse=true;
	$scope.filterActif = true;
	$scope.filterInactif = true;
	$scope.filterNew = true;
	$scope.totalChecked = function()
	{
		if(filterFilter($scope.coments,{checked : true}).length == $scope.coments.length)
	 		$scope.allChecked = true;
	 	else
	 		$scope.allChecked = false;
	 	return filterFilter($scope.coments,{checked : true}).length;
	}
	$scope.toggleAllcheck = function()
	{
		allchecked = !$scope.allChecked;
		$scope.coments.forEach(function(coment) {
			coment.checked = allchecked;
		});
	}
	$scope.linkedit=function(id){
		if(id){
			clearSelection()
			$state.go('/.coments.coments.edit',{id: id})
		}
		else
			$state.go('/.coments.coments.edit',{id: filterFilter($scope.coments,{checked : true})[0].id})
	}
	$scope.linkeditimages =function(id){
		if(id){
			clearSelection()
			$state.go('/.coments.coments.editimage',{id: id})
		}
		else
			$state.go('/.coments.coments.editimage',{id: filterFilter($scope.coments,{checked : true})[0].id})
	}
	$scope.linkadd =function(){
			$state.go('/.coments.coments.add')
	}


	$scope.removeselected =function(){
			comentsService.remove(filterFilter($scope.coments,{checked : true}))
	}
	$scope.changestatus = function(status) {
		comentsService.changeStatusComent(filterFilter($scope.coments,{checked : true}),status)
		
	};

	$scope.sortFunction =function(val){

		if($scope.order === 'article')
		{
			return val[$scope.order].title;
		}else
		{
			return val[$scope.order];
		}
	}
	$scope.getCat =function(val){
		if(!$scope.filterActif)
		{
			if(val.status ==='actif'){
				val.checked=false;
				return false;
			}
		}
		if(!$scope.filterInactif)
		{
			if(val.status ==='inactif'){
				val.checked=false;
				return false;
			}
		}
		if(!$scope.filterNew)
		{
			if(val.status ==='new'){
				val.checked=false;
				return false;
			}
		}
		return true;
	}
	$scope.comentfilter =function(val){
		var patt = new RegExp($scope.slug,'i');
		
		if(patt.test(val.content))
			return true;
		if(patt.test(val.article.title))
			return true;
		if(patt.test(val.author))
			return true;
		if(patt.test($filter('date')(val.createdAt,'dd MMMM')))
			return true;

		val.checked=false;
		return false;
	}




	
	

}]);