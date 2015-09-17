app.factory('projectscategoryService', ['$http','$q','messageCenterService',function ($http,$q,messageCenterService) {
    var service = {};
    service.categories=[];
    service.fetchCategories= function() {
        var deferred = $q.defer();
        $http.get('/categoryProject').success(function (data,status) {
            service.categories =data;
            deferred.resolve(data);
        }).error(function (data,status) {
            deferred.reject('error perso');
            messageCenterService.add('danger', 'Erreur de récupération des catégories', { status: messageCenterService.status.unseen, timeout: 4000 });

        })

        return deferred.promise;
    };
    


    service.fetchCategory= function(id) {
        var deferred = $q.defer();

        $http.get('/categoryProject/'+id).success(function (data,status) {
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Impossible de récuperer la catégorie', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    



    service.addNew=function(category){
        var deferred = $q.defer();
        // var working = category.working;
        // var checked = category.checked;
        // delete category.working;
        // delete category.checked;

        //POST ARTICLE TO SAVE IN DB
        $http.post('/categoryProject',category).success(function (data,status) {
            
            service.categories.unshift(data);
            messageCenterService.add('success', 'Catégorie ajoutée', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.resolve(data);
        }).error(function (data,status) {
             deferred.reject(data);
        })
        
        return deferred.promise;      
    }

    service.edit=function(category){
        var deferred = $q.defer();
        $http.put('/categoryProject/'+category.id,category).success(function (data,status) {
            service.categories.splice(getIndexInBy(service.categories,'id',category.id),1,category)
            messageCenterService.add('success', 'Catégorie enregistrée', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.resolve(data);
        }).error(function (data,status) {
            deferred.reject(data);
        })
        return deferred.promise;
    }
    service.remove=function(catArray){

        for(var i in catArray)
        {
            $http.delete('/categoryProject/'+catArray[i].id).success(function (category,status) {
                service.categories.splice(getIndexInBy(service.categories,'id',category.id),1)
                messageCenterService.add('success', 'Catégorie supprimée', { status: messageCenterService.status.unseen, timeout: 4000 });
                
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur lors de la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
            })
        }
         
    }
    service.removeimage=function(category,image){
        $http.delete('/image/'+image.id).success(function (data,status) {

            category.images.splice(getIndexInBy(category.images,'id',image.id),1);
            messageCenterService.add('success', 'Image supprimée', { status: messageCenterService.status.unseen, timeout: 4000 });
            
            service.categories.splice(getIndexInBy(service.categories,'id',category.id),1,category)


        }).error(function (data,status) {
            messageCenterService.add('danger', 'Erreur lors de la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
        })
    }

    service.replace=function(category){
        
        service.categories.splice(getIndexInBy(service.categories,'id',category.id),1,category)
        return;
    }
    service.updateImgIndex=function(image,category){
        var deferred = $q.defer();
        $http.put('/image/'+image.id,image).success(function (image,status) {
            image.projectcategory = image.projectcategory.id;
            // messageCenterService.add('success', 'Position enregistée', { status: messageCenterService.status.unseen, timeout: 4000 });
            category.images.splice(getIndexInBy(category.images,'id',image.id),1,image);
            service.categories.splice(getIndexInBy(service.categories,'id',category.id),1,category)
            deferred.resolve(image);
        }).error(function (data,status) {
            // messageCenterService.add('danger', 'Erreur', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject(data);
        })
        return deferred.promise;
    }


    return service;
}]);