app.factory('fabricansService', ['$http','$q','messageCenterService',function ($http,$q,messageCenterService) {
    var service = {};
    service.fabricans=[];


    service.fetchFabricans= function() {
        var deferred = $q.defer();

        $http.get('/fabrican').success(function (data,status) {
            service.fabricans =data;
            deferred.resolve(data);
        }).error(function (data,status) {
            deferred.reject('error perso');
            messageCenterService.add('danger', 'Erreur de récupération des fabricans', { status: messageCenterService.status.unseen, timeout: 4000 });

        })

        return deferred.promise;
    };
    


    service.fetchFabrican= function(id) {
        var deferred = $q.defer();

        $http.get('/fabrican/'+id).success(function (data,status) {
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Impossible de récupérer le fabrican', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    



    service.addNew=function(fabrican){
        var deferred = $q.defer();
console.log(fabrican);
        $http.post('/fabrican',fabrican).success(function (data2,status2) {

        	console.log(data2);
            // $http.get('/fabrican/'+data2.id).success(function (data,status) {
            service.fabricans.unshift(data2);
            messageCenterService.add('success', 'Fabrican ajouté', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.resolve(data2);
            // })
        }).error(function (data,status) {
             deferred.reject(data);
        })
        
        return deferred.promise;      
    }

    service.edit=function(fabrican){
        var deferred = $q.defer();
        $http.put('/fabrican/'+fabrican.id,fabrican).success(function (data2,status) {
            $http.get('/fabrican/'+fabrican.id).success(function (data,status) {
                service.fabricans.splice(getIndexInBy(service.fabricans,'id',fabrican.id),1,data)
                messageCenterService.add('success', 'Fabrican enregistré', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
            })
        }).error(function (data,status) {
            deferred.reject(data);
        })
        return deferred.promise;
    }
    // service.changeStatusFabrican=function(array,status){
    //     var deferred = $q.defer();
    //     for(var i in array)
    //     {
    //         array[i].status =status;
    //         $http.put('/fabrican/'+array[i].id,array[i]).success(function (fabrican,status) {
    //             service.fabricans.splice(getIndexInBy(service.fabricans,'id',fabrican.id),1,fabrican)
    //         }).error(function (data,status) {
    //             messageCenterService.add('danger', 'Erreur dans le changement de status', { status: messageCenterService.status.unseen, timeout: 4000 });
    //             deferred.reject(data);
    //         })
    //     }
    //     messageCenterService.add('success', 'Status enregistré', { status: messageCenterService.status.unseen, timeout: 4000 });
    // }
    service.remove=function(catArray){

        for(var i in catArray)
        {
            $http.delete('/fabrican/'+catArray[i].id).success(function (fabrican,status) {
                 service.fabricans.splice(getIndexInBy(service.fabricans,'id',fabrican.id),1)
                 messageCenterService.add('success', 'Fabrican supprimé', { status: messageCenterService.status.unseen, timeout: 4000 });
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });

            })
        }
         
    }
    service.removeimage=function(fabrican,image){
        $http.delete('/image/'+image.id).success(function (data,status) {

            fabrican.images.splice(getIndexInBy(fabrican.images,'id',image.id),1);
            service.fabricans.splice(getIndexInBy(service.fabricans,'id',fabrican.id),1,fabrican)
            messageCenterService.add('success', 'Image supprimée', { status: messageCenterService.status.unseen, timeout: 4000 });

        }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
        })
    }

    service.replace=function(fabrican){
        
        service.fabricans.splice(getIndexInBy(service.fabricans,'id',fabrican.id),1,fabrican)
        return;
    }
    service.updateImgIndex=function(image,fabrican){
        var deferred = $q.defer();
        $http.put('/image/'+image.id,image).success(function (image,status) {
            image.fabrican = image.fabrican.id;
            fabrican.images.splice(getIndexInBy(fabrican.images,'id',image.id),1,image);
            service.fabricans.splice(getIndexInBy(service.fabricans,'id',fabrican.id),1,fabrican)
            deferred.resolve(image);
        }).error(function (data,status) {
            deferred.reject(data);
        })
        return deferred.promise;
    }


    return service;
}]);