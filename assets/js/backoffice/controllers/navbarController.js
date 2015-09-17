app.controller('navbarCtrl',['$scope','configService','$state','$location','$auth','accountService','me',
function navbarCtrl($scope,configService,$state,$location,$auth,accountService,me) {
	$scope.me= me;
	
	$scope.profile=function() {
		$location.path('/profile')
	};

	$scope.logout=function() {
		$auth.logout();
		$state.go('/login')
	};

}]);