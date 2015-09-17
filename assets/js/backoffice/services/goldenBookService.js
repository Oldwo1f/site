app.factory('goldenbookService',['$http','$q','messageCenterService',function ($http,$q,messageCenterService) {
    var service = {};
    service.goldenbook=[];


    service.fetchGoldenbooks= function() {
        var deferred = $q.defer();
        $http.get('/goldenbook').success(function (data,status) {
            service.goldenbook =data;
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Erreur de récupération des avis', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    


    service.fetchGoldenbook= function(id) {
        var deferred = $q.defer();

        $http.get('/goldenbook/'+id).success(function (data,status) {
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Impossible de récupérer cet avis', { status: messageCenterService.status.unseen, timeout: 4000 });

            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    



    // service.addNew=function(goldenbook){
    //     var deferred = $q.defer();

    //     $http.post('/goldenbook',goldenbook).success(function (data2,status2) {
    //         $http.get('/goldenbook/'+data2.id).success(function (data,status) {
    //             service.goldenbook.unshift(data);
    //             deferred.resolve(data);
    //         })
    //     }).error(function (data,status) {
    //          deferred.reject(data);
    //     })
        
    //     return deferred.promise;      
    // }

    // service.edit=function(goldenbook){
    //     var deferred = $q.defer();
    //     $http.put('/goldenbook/'+goldenbook.id,goldenbook).success(function (data2,status) {
    //         $http.get('/goldenbook/'+goldenbook.id).success(function (data,status) {
    //             service.goldenbook.splice(getIndexInBy(service.goldenbook,'id',goldenbook.id),1,data)
    //             deferred.resolve(data);
    //         })
    //     }).error(function (data,status) {
    //         deferred.reject(data);
    //     })
    //     return deferred.promise;
    // }
    service.changeStatusGoldenbook=function(array,status){
        var deferred = $q.defer();
        for(var i in array)
        {
            array[i].status =status;
            $http.put('/goldenbook/'+array[i].id,array[i]).success(function (goldenbook,status) {
                service.goldenbook.splice(getIndexInBy(service.goldenbook,'id',goldenbook.id),1,goldenbook)
            }).error(function (data,status) {
                deferred.reject(data);
            })
        }
    }
    service.remove=function(catArray){

        for(var i in catArray)
        {
            $http.delete('/goldenbook/'+catArray[i].id).success(function (goldenbook,status) {
                 service.goldenbook.splice(getIndexInBy(service.goldenbook,'id',goldenbook.id),1)
                messageCenterService.add('success', 'Avis supprimé', { status: messageCenterService.status.unseen, timeout: 4000 });
            }).error(function (data,status) {

                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
            })
        }
         
    }
    // service.removeimage=function(goldenbook,image){
    //     $http.delete('/image/'+image.id).success(function (data,status) {

    //         goldenbook.images.splice(getIndexInBy(goldenbook.images,'id',image.id),1);
    //         service.goldenbook.splice(getIndexInBy(service.goldenbook,'id',goldenbook.id),1,goldenbook)


    //     }).error(function (data,status) {
    //         .log('ERROR');
    //     })
    // }

    service.replace=function(goldenbook){
        
        service.goldenbook.splice(getIndexInBy(service.goldenbook,'id',goldenbook.id),1,goldenbook)
        return;
    }
    // service.updateImgIndex=function(image,goldenbook){
    //     var deferred = $q.defer();
    //     console.log(image);
    //     $http.put('/image/'+image.id,image).success(function (image,status) {
    //         image.goldenbookgoldenbook = image.goldenbookgoldenbook.id;
    //         goldenbook.images.splice(getIndexInBy(goldenbook.images,'id',image.id),1,image);
    //         service.goldenbook.splice(getIndexInBy(service.goldenbook,'id',goldenbook.id),1,goldenbook)
    //         deferred.resolve(image);
    //     }).error(function (data,status) {
    //         console.log('ERROR');
    //         deferred.reject(data);
    //     })
    //     return deferred.promise;
    // }


    return service;
}]);