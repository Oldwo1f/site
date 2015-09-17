app.factory('boxService',['$http','$q','messageCenterService', function($http,$q,messageCenterService) {
    var service = {};
    service.box={};

    service.getbox= function () {
        var deferred = $q.defer();
        $http.get('/mybox').success(function (data,status) {
            service.box =data;
            console.log(data);
            deferred.resolve(data);
        }).error(function (data,status) {
            // messageCenterService.add('danger', 'Erreur de récupération du profile', { status: messageCenterService.status.unseen, timeout: 4000 });

            deferred.reject('error perso');
        })
        return deferred.promise;
    };

    service.removeFavoris=function(contentId){
        // console.log(meid);
        var deferred = $q.defer();
        console.log(this);
        $http.get('/flux/'+service.box.id+'/removeFavoris/'+contentId).success(function (data,status2) {
                // service.flux.contents.unshift(data);
                service.box.contents.splice(getIndexInBy(service.box.contents,'id',contentId),1)
                messageCenterService.add('success', 'Favoris supprimé', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
        }).error(function (data,status) {
            console.log(data);
             deferred.reject(data);
        })
        
        return deferred.promise;      
    }

    return service;
  }]);