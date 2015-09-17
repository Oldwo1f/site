app.factory('ingredientsService', ['$http','$q','messageCenterService',function ($http,$q,messageCenterService) {
    var service = {};
    service.ingredients=[];


    service.fetchIngredients= function() {
        var deferred = $q.defer();

        $http.get('/ingredient').success(function (data,status) {
            service.ingredients =data;
            console.log('FETCHINGREDIENTS');
            console.log(data);
            deferred.resolve(data);
        }).error(function (data,status) {
            deferred.reject('error perso');
            messageCenterService.add('danger', 'Erreur de récupération des ingredients', { status: messageCenterService.status.unseen, timeout: 4000 });

        })

        return deferred.promise;
    };
    


    service.fetchIngredient= function(id) {
        var deferred = $q.defer();
console.log('Fetching');
        $http.get('/ingredient/'+id).success(function (data,status) {
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Impossible de récupérer le ingredient', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    



    service.addNew=function(ingredient){
        var deferred = $q.defer();

        $http.post('/ingredient',ingredient).success(function (data2,status2) {
            $http.get('/ingredient/'+data2.id).success(function (data,status) {
                service.ingredients.unshift(data);
            messageCenterService.add('success', 'Ingredient ajouté', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
            })
        }).error(function (data,status) {
             deferred.reject(data);
        })
        
        return deferred.promise;      
    }

    service.edit=function(ingredient){
        var deferred = $q.defer();
        $http.put('/ingredient/'+ingredient.id,ingredient).success(function (data2,status) {
            $http.get('/ingredient/'+ingredient.id).success(function (data,status) {
                service.ingredients.splice(getIndexInBy(service.ingredients,'id',ingredient.id),1,data)
                messageCenterService.add('success', 'Ingredient enregistré', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
            })
        }).error(function (data,status) {
            deferred.reject(data);
        })
        return deferred.promise;
    }
    // service.changeStatusIngredient=function(array,status){
    //     var deferred = $q.defer();
    //     for(var i in array)
    //     {
    //         array[i].status =status;
    //         $http.put('/ingredient/'+array[i].id,array[i]).success(function (ingredient,status) {
    //             service.ingredients.splice(getIndexInBy(service.ingredients,'id',ingredient.id),1,ingredient)
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
            $http.delete('/ingredient/'+catArray[i].id).success(function (ingredient,status) {
                 service.ingredients.splice(getIndexInBy(service.ingredients,'id',ingredient.id),1)
                 messageCenterService.add('success', 'Ingredient supprimé', { status: messageCenterService.status.unseen, timeout: 4000 });
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });

            })
        }
         
    }
    service.removeimage=function(ingredient,image){
        $http.delete('/image/'+image.id).success(function (data,status) {

            ingredient.images.splice(getIndexInBy(ingredient.images,'id',image.id),1);
            service.ingredients.splice(getIndexInBy(service.ingredients,'id',ingredient.id),1,ingredient)
            messageCenterService.add('success', 'Image supprimée', { status: messageCenterService.status.unseen, timeout: 4000 });

        }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
        })
    }

    service.replace=function(ingredient){
        
        service.ingredients.splice(getIndexInBy(service.ingredients,'id',ingredient.id),1,ingredient)
        return;
    }
    service.updateImgIndex=function(image,ingredient){
        var deferred = $q.defer();
        $http.put('/image/'+image.id,image).success(function (image,status) {
            image.ingredient = image.ingredient.id;
            ingredient.images.splice(getIndexInBy(ingredient.images,'id',image.id),1,image);
            service.ingredients.splice(getIndexInBy(service.ingredients,'id',ingredient.id),1,ingredient)
            deferred.resolve(image);
        }).error(function (data,status) {
            deferred.reject(data);
        })
        return deferred.promise;
    }


    return service;
}]);