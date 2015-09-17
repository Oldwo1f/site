app.controller('goldenbookCtrl',['$scope','filterFilter','goldenbookService','$filter','$state','goldenbooks',
function goldenbookCtrl($scope,filterFilter,goldenbookService,$filter,$state,goldenbooks) {

	$scope.goldenbooks= goldenbooks;
	$scope.order='date';
	$scope.reverse=true;
	$scope.filterActif = true;
	$scope.filterInactif = true;
	$scope.filterNew = true;
	$scope.totalChecked = function()
	{
		if(filterFilter($scope.goldenbooks,{checked : true}).length == $scope.goldenbooks.length)
	 		$scope.allChecked = true;
	 	else
	 		$scope.allChecked = false;
	 	return filterFilter($scope.goldenbooks,{checked : true}).length;
	}
	$scope.toggleAllcheck = function()
	{
		allchecked = !$scope.allChecked;
		$scope.goldenbooks.forEach(function(goldenbook) {
			goldenbook.checked = allchecked;
		});
	}
	
	$scope.removeselected =function(){
			goldenbookService.remove(filterFilter($scope.goldenbooks,{checked : true}))
	}
	$scope.changestatus = function(status) {
		goldenbookService.changeStatusGoldenbook(filterFilter($scope.goldenbooks,{checked : true}),status)
		
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
	$scope.goldenbookfilter =function(val){
		var patt = new RegExp($scope.slug,'i');
		
		if(patt.test(val.content))
			return true;
		// if(patt.test(val.article.title))
			// return true;
		if(patt.test(val.author))
			return true;
		if(patt.test($filter('date')(val.createdAt,'dd MMMM')))
			return true;

		val.checked=false;
		return false;
	}




	
	

}]);