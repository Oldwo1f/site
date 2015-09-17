app.controller('loginCtrl',['$scope', '$auth','$http','accountService','$state','messageCenterService',
  function ($scope, $auth,$http,accountService,$state,messageCenterService) {
  $scope.errormessage='';
  $scope.recupmail='alexismomcilovic@gmail.com';
    $scope.login = function() {
      console.log('LOGIN');
      console.log($scope.email);
      $auth.login({ email: $scope.email, password: $scope.password })
        .then(function() {
          // $state.go('/.dashboard')
        })
        .catch(function(response) {
          $scope.errormessage=response.data.message;

        });
    };
    
    console.log('LOGIN CTRL22222');

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
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
        })
        .catch(function(response) {
        });
    };
  }]);