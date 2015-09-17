app.controller('dashboardCtrl',['$scope','$stateParams','filterFilter','$state','$filter','count',
function dashboardCtrl($scope,$stateParams,filterFilter ,$state,$filter,count) {
	$scope.count=count;
	$scope.showProject = (typeof(getIndexInBy($scope.maintabs,'name','projects')) === 'undefined') ? false : true;
	$scope.showAvis= (typeof(getIndexInBy($scope.maintabs,'name','newsletters')) === 'undefined') ? false : true;
	$scope.showClient= (typeof(getIndexInBy($scope.userstabs,'name','client')) === 'undefined') ? false : true;

}]);