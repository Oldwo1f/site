app.factory('comentsService', ['$http','$q','messageCenterService',function ($http,$q,messageCenterService) {
    var service = {};
    service.coments=[];


    service.fetchComents= function() {
        var deferred = $q.defer();

        $http.get('/coment').success(function (data,status) {
            service.coments =data;
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Erreur de récupération des commentaires', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    


    service.fetchComent= function(id) {
        var deferred = $q.defer();

        $http.get('/coment/'+id).success(function (data,status) {
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Impossible de récupérer l\'envoi', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    



    // service.addNew=function(coment){
    //     var deferred = $q.defer();

    //     $http.post('/coment',coment).success(function (data2,status2) {
    //         $http.get('/coment/'+data2.id).success(function (data,status) {
    //             service.coments.unshift(data);
    //             deferred.resolve(data);
    //         })
    //     }).error(function (data,status) {
    //          deferred.reject(data);
    //     })
        
    //     return deferred.promise;      
    // }

    // service.edit=function(coment){
    //     var deferred = $q.defer();
    //     $http.put('/coment/'+coment.id,coment).success(function (data2,status) {
    //         $http.get('/coment/'+coment.id).success(function (data,status) {
    //             service.coments.splice(getIndexInBy(service.coments,'id',coment.id),1,data)
    //             messageCenterService.add('success', 'Projet enregistré', { status: messageCenterService.status.unseen, timeout: 4000 });
    //             deferred.resolve(data);
    //         })
    //     }).error(function (data,status) {
    //         deferred.reject(data);
    //     })
    //     return deferred.promise;
    // }
    service.changeStatusComent=function(array,status){
        var deferred = $q.defer();
        for(var i in array)
        {
            array[i].status =status;
            $http.put('/coment/changeStatus/'+array[i].id,array[i]).success(function (coment,status) {
                service.coments.splice(getIndexInBy(service.coments,'id',coment.id),1,coment)
                messageCenterService.add('success', 'Status enregistré', { status: messageCenterService.status.unseen, timeout: 4000 });
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans le changement de status', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.reject(data);
            })
        }
    }
    service.remove=function(catArray){

        for(var i in catArray)
        {
            $http.delete('/coment/'+catArray[i].id).success(function (coment,status) {
                 service.coments.splice(getIndexInBy(service.coments,'id',coment.id),1)
                messageCenterService.add('success', 'Commentaire supprimé', { status: messageCenterService.status.unseen, timeout: 4000 });
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
            })
        }
         
    }
    // service.removeimage=function(coment,image){
    //     $http.delete('/image/'+image.id).success(function (data,status) {

    //         coment.images.splice(getIndexInBy(coment.images,'id',image.id),1);
    //         service.coments.splice(getIndexInBy(service.coments,'id',coment.id),1,coment)


    //     }).error(function (data,status) {
    //     })
    // }

    service.replace=function(coment){
        
        service.coments.splice(getIndexInBy(service.coments,'id',coment.id),1,coment)
        return;
    }
    service.updateImgIndex=function(image,coment){
        var deferred = $q.defer();
        $http.put('/image/'+image.id,image).success(function (image,status) {
            image.comentcoment = image.comentcoment.id;
            coment.images.splice(getIndexInBy(coment.images,'id',image.id),1,image);
            service.coments.splice(getIndexInBy(service.coments,'id',coment.id),1,coment)
            deferred.resolve(image);
        }).error(function (data,status) {
            deferred.reject(data);
        })
        return deferred.promise;
    }


    return service;
}]);