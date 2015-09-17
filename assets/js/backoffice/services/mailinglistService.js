app.factory('mailingListsService',['$http','$q','messageCenterService',function ($http,$q,messageCenterService) {
    var service = {};
    service.mailingLists=[];
    service.currentList=[];


    service.fetchmailingLists= function() {
        var deferred = $q.defer();

        $http.get('/mailingList').success(function (data,status) {
            service.mailingLists =data;
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Erreur de récupération des listes d\'emails', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    


    service.fetchmailingList= function(id) {
        var deferred = $q.defer();

        $http.get('/mailingList/'+id).success(function (data,status) {
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Impossible de récupérer la liste d\'emails', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    



    service.addNew=function(mailingList){
        var deferred = $q.defer();

        $http.post('/mailingList',mailingList).success(function (data2,status2) {
            $http.get('/mailingList/'+data2.id).success(function (data,status) {
                service.mailingLists.unshift(data);
                messageCenterService.add('success', 'Liste ajouté', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
            })
        }).error(function (data,status) {
             deferred.reject(data);
        })
        
        return deferred.promise;      
    }

    service.addNewabonne=function(abonne,list){
        var deferred = $q.defer();

        $http.post('/abonne/'+list,abonne).success(function (data2,status2) {
            // $http.get('/abonne/'+data2.id).success(function (data,status) {
                service.mailingLists[getIndexInBy(service.mailingLists,'id',list)].abonnes.unshift(data2);
                messageCenterService.add('success', 'Abonné ajouté', { status: messageCenterService.status.unseen, timeout: 4000 });
                
                deferred.resolve(service.mailingLists[getIndexInBy(service.mailingLists,'id',list)]);
            // })
        }).error(function (data,status) {
             deferred.reject(data);
        })
        
        return deferred.promise;      
    }

    
    
    service.remove=function(abonnes, list,cb){
        for(var i in abonnes)
        {
            $http.delete('/abonne/'+abonnes[i].id).success(function (mailingList,status) {
                service.mailingLists[getIndexInBy(service.mailingLists,'id',list)].abonnes.splice(getIndexInBy(service.mailingLists[getIndexInBy(service.mailingLists,'id',list)].abonnes,'id',mailingList.id),1)
                messageCenterService.add('success', 'Abonné supprimé', { status: messageCenterService.status.unseen, timeout: 4000 });
                cb(service.mailingLists[getIndexInBy(service.mailingLists,'id',list)].abonnes)

            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
            })
        }
         
    }
    service.removeList=function(listId,cb){
            $http.delete('/mailinglist/'+listId).success(function (mailingList,status) {
                service.mailingLists.splice(getIndexInBy(service.mailingLists,'id',mailingList.id),1)
                messageCenterService.add('success', 'Liste supprimée', { status: messageCenterService.status.unseen, timeout: 4000 });
                cb();
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
            })
         
    }
    service.addSeriesMails=function(listId,mailsList){
        	var deferred = $q.defer();

            $http.post('/mailinglist/'+listId+'/addList',mailsList).success(function (results,status) {
                 service.currentList.join(results)
                messageCenterService.add('success', 'Vos email sont importés', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(results);
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur d\'envoi', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.reject(data);
            })
         return deferred.promise; 
    }
   


    return service;
}]);