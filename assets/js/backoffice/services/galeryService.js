app.factory('galeryService', ['$http','$q','messageCenterService',function ($http,$q,messageCenterService) {
    var service = {};
    service.galeries=[];


    service.fetchGaleries= function() {
        var deferred = $q.defer();

        $http.get('/galery').success(function (data,status) {
            service.galeries =data;
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Erreur de récupération des galeries d\'images', { status: messageCenterService.status.unseen, timeout: 4000 });

            deferred.reject('error perso');
        })

        return deferred.promise;
    };

    service.fetchHomeGalery= function() {
        var deferred = $q.defer();
        console.log('OTOTOTOTOTOTOT');
        $http.get('/galery?where={"title":"home"}').success(function (data,status) {
            console.log(data);
            service.galery =data[0];
            deferred.resolve(data[0]);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Impossible de récupérer la galerie d\'images', { status: messageCenterService.status.unseen, timeout: 4000 });

            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    


    service.fetchGalery= function(id) {
        var deferred = $q.defer();

        $http.get('/galery/'+id).success(function (data,status) {
            deferred.resolve(data);
        }).error(function (data,status) {
            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    



    service.addNew=function(galery){
        var deferred = $q.defer();

        $http.post('/galery',galery).success(function (data2,status2) {
            $http.get('/galery/'+data2.id).success(function (data,status) {
                service.galeries.unshift(data);
                messageCenterService.add('success', 'Galerie ajouté', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
            })
        }).error(function (data,status) {
             deferred.reject(data);
        })
        
        return deferred.promise;      
    }

    service.edit=function(galery){
        var deferred = $q.defer();
        $http.put('/galery/'+galery.id,galery).success(function (data2,status) {
            $http.get('/galery/'+galery.id).success(function (data,status) {
                service.galeries.splice(getIndexInBy(service.galeries,'id',galery.id),1,data)
                deferred.resolve(data);
            })
        }).error(function (data,status) {
            deferred.reject(data);
        })
        return deferred.promise;
    }
    service.changeStatusGalery=function(array,status){
        var deferred = $q.defer();
        for(var i in array)
        {
            array[i].status =status;
            $http.put('/galery/'+array[i].id,array[i]).success(function (galery,status) {
                service.galeries.splice(getIndexInBy(service.galeries,'id',galery.id),1,galery)
            }).error(function (data,status) {
                deferred.reject(data);
            })
        }
    }
    service.remove=function(catArray){

        for(var i in catArray)
        {
            $http.delete('/galery/'+catArray[i].id).success(function (galery,status) {
                 service.galeries.splice(getIndexInBy(service.galeries,'id',galery.id),1)
                messageCenterService.add('success', 'Galerie supprimé', { status: messageCenterService.status.unseen, timeout: 4000 });
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
            })
        }
         
    }
    service.removeimage=function(galery,image){
        $http.delete('/image/'+image.id).success(function (data,status) {

            galery.images.splice(getIndexInBy(galery.images,'id',image.id),1);
            service.galeries.splice(getIndexInBy(service.galeries,'id',galery.id),1,galery)
            messageCenterService.add('success', 'Image supprimée', { status: messageCenterService.status.unseen, timeout: 4000 });
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
        })
    }

    service.replace=function(galery){
        
        service.galeries.splice(getIndexInBy(service.galeries,'id',galery.id),1,galery)
        return;
    }
    service.updateImgIndex=function(image,galery){
        var deferred = $q.defer();
        $http.put('/image/'+image.id,image).success(function (image,status) {
            image.galery = image.galery;
            galery.images.splice(getIndexInBy(galery.images,'id',image.id),1,image);
            service.galeries.splice(getIndexInBy(service.galeries,'id',galery.id),1,galery)
            deferred.resolve(image);
        }).error(function (data,status) {
            deferred.reject(data);
        })
        return deferred.promise;
    }


    return service;
}]);