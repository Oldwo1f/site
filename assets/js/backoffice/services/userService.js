app.factory('userService', ['$http','$q','messageCenterService',function ($http,$q,messageCenterService) {
    var service = {};
    service.users=[];

    service.fetchUsers= function() {
        var deferred = $q.defer();

        $http.get('/intern').success(function (data,status) {
            service.users =data;
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Erreur dans la récupération des utilisateurs', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    service.fetchClients= function() {
        var deferred = $q.defer();

        $http.get('/client').success(function (data,status) {
            service.users =data;
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Erreur dans la récupération des clients', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    


    service.fetchUser= function(id) {
        var deferred = $q.defer();

        $http.get('/user/'+id).success(function (data,status) {
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Erreur dans la récupération de l\'utilisateur', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    



    service.addNew=function(user){
        var deferred = $q.defer();
        user.role = 'user'
        $http.post('/user',user).success(function (data2,status2) {
            console.log('SUCCESS');
            $http.get('/user/'+data2.id).success(function (data,status) {
                service.users.unshift(data);
                messageCenterService.add('success', 'Utilisateur ajouté', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
            })
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Email déjà utilisé', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject(data);
        })
        
        return deferred.promise;      
    }
    service.addClient=function(user){
        var deferred = $q.defer();
        user.role = 'client';
        $http.post('/user',user).success(function (data2,status2) {
            $http.get('/user/'+data2.id).success(function (data,status) {
                service.users.unshift(data);
                messageCenterService.add('success', 'Utilisateur ajouté', { status: messageCenterService.status.unseen, timeout: 4000 });

                deferred.resolve(data);
            })
        }).error(function (data,status) {
            // messageCenterService.add('danger', data, { status: messageCenterService.status.unseen, timeout: 4000 });
             deferred.reject(data);
        })
        
        return deferred.promise;      
    }

    service.edit=function(user){
        var deferred = $q.defer();
        $http.put('/user/'+user.id,user).success(function (data2,status) {
            $http.get('/user/'+user.id).success(function (data,status) {
                service.users.splice(getIndexInBy(service.users,'id',user.id),1,data)
                messageCenterService.add('success', 'Utilisateur enregirsté', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
            })
        }).error(function (data,status) {
            messageCenterService.add('danger', data, { status: messageCenterService.status.unseen, timeout: 4000 });

            deferred.reject(data);

        })
        return deferred.promise;
    }

    service.remove=function(catArray){

        for(var i in catArray)
        {
            $http.delete('/user/'+catArray[i].id).success(function (user,status) {
                service.users.splice(getIndexInBy(service.users,'id',user.id),1)
                messageCenterService.add('success', 'Suppréssion réussie', { status: messageCenterService.status.unseen, timeout: 4000 });

            }).error(function (data,status) {
                messageCenterService.add('danger', data, { status: messageCenterService.status.unseen, timeout: 4000 });

            })
        }
         
    }


    return service;
}]);