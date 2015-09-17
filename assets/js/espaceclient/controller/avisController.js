app.controller('avisCtrl',['$http','$scope','$stateParams','$timeout','filterFilter','configService','$state','$filter','messageCenterService',
function avisCtrl($http,$scope,$stateParams,$timeout,filterFilter,configService ,$state,$filter,messageCenterService) {

	$scope.newAvis={};
	$scope.newAvis.content="";
	$scope.newAvis.author=$scope.me.name || $scope.me.email;
	
	$scope.submit=function() {
		$http.post('/api/livredor',$scope.newAvis).success(function (data,status) {
	            $scope.newAvis.content="";
	        	messageCenterService.add('success', 'Votre avis à été posté', { status: messageCenterService.status.unseen, timeout: 4000 });

	    }).error(function (data,status) {
	        messageCenterService.add('danger', 'Erreur de récupération des fluxs', { status: messageCenterService.status.unseen, timeout: 4000 });

	    })
	};

}])