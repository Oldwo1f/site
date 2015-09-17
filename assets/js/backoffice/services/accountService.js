app.factory('accountService',['$http','$q','messageCenterService', function($http,$q,messageCenterService) {
    var service = {};
    service.me={};

      service.getProfile= function () {
        var deferred = $q.defer();
        $http.get('/api/me').success(function (data,status) {
            service.me =data;
            deferred.resolve(data);
        }).error(function (data,status) {
            // messageCenterService.add('danger', 'Erreur de récupération du profile', { status: messageCenterService.status.unseen, timeout: 4000 });

            deferred.reject('error perso');
        })
        return deferred.promise;
      };
      service.updateProfile= function(profileData) {
        var deferred = $q.defer();
        $http.put('/edit/me',profileData).success(function (data,status) {
            // $http.get('/api/me').success(function (data,status) {
            service.me = data[0]
            messageCenterService.add('success', 'Profile enregistré', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.resolve(data[0]);
            // })
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Erreur d\'enregistrement du profile', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject(data);
        })
        return deferred.promise;
      }
      service.editpasswordMe= function(profileData) {
        var deferred = $q.defer();
        $http.put('/editpassword/me',profileData).success(function (data,status) {
                service.me = data[0]
                messageCenterService.add('success', 'Veuillez vous reconnecté', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data[0]);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Erreur dans le changement de mot de passe', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject(data);
        })
        return deferred.promise;
      }
    service.removeimage=function(user,image){
        $http.delete('/image/'+image.id).success(function (data,status) {
            user.images.splice(getIndexInBy(user.images,'id',image.id),1);
            service.me.splice(getIndexInBy(service.me,'id',user.id),1,user)
            messageCenterService.add('success', 'Image supprimée', { status: messageCenterService.status.unseen, timeout: 4000 });
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
        })
    }

    return service;
  }]);