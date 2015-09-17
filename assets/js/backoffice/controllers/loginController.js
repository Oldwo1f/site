app.controller('loginCtrl',['$scope', '$auth','accountService','$http','$state','messageCenterService', function($scope, $auth,accountService,$http,$state,messageCenterService) {
  $scope.errormessage='';
    $scope.login = function() {
      $auth.login({ email: $scope.email, password: $scope.password })
        .then(function() {
          // $state.go('/.dashboard')
        })
        .catch(function(response) {
          $scope.errormessage=response.data.message;

        });
    };
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
        })
        .catch(function(response) {
        });
    };
    $scope.recup = function() {
      console.log('recupPassword');
      console.log($scope.recupmail);
        // var deferred = $q.defer();
        $http.get('/recupPassword/'+$scope.recupmail).success(function (data,status) {
            // service.box =data;
            messageCenterService.add('success', 'Veuillez vérifier vos email', { status: messageCenterService.status.unseen, timeout: 4000 });

            console.log(data);
            // deferred.resolve(data);
        }).error(function (data,status) {
          console.log('err data');
          console.log(data);
            messageCenterService.add('danger', 'Erreur : Email invalide', { status: messageCenterService.status.unseen, timeout: 4000 });

            // deferred.reject('error perso');
        })
        // return deferred.promise;

    };
  }]);