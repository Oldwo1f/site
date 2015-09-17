app.factory('dashboardService', ['$http','$q',function ($http,$q) {
    var service = {};
    service.projects=[];


    service.fetchStats= function() {
        var deferred = $q.defer();

        $http.get('/dashboardcount').success(function (data,status) {
            service.projects =data;
            deferred.resolve(data);
        }).error(function (data,status) {
            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    


    return service;
}]);