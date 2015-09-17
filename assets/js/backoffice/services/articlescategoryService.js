app.factory('articlescategoryService', ['$http','$q','messageCenterService',function ($http,$q,messageCenterService) {
    var service = {};
    service.categories=[];

    service.fetchCategories= function() {
        var deferred = $q.defer();

        $http.get('/categoryArticle').success(function (data,status) {
            service.categories =data;
            service.colors=['5D8AA8','C9FFE5','9966CC','FBCEB1','87A96B','FE6F5E','E97451','800020']
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Erreur de récupération des catégories', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    


    service.fetchCategory= function(id) {
        var deferred = $q.defer();

        $http.get('/categoryArticle/'+id).success(function (data,status) {
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Impossible de récupérer la catégorie', { status: messageCenterService.status.unseen, timeout: 4000 });
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
        $http.post('/categoryArticle',category).success(function (data,status) {
            
            service.categories.unshift(data);
            messageCenterService.add('success', 'Catégorie ajouté', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.resolve(data);
        }).error(function (data,status) {
             deferred.reject(data);
        })
        
        return deferred.promise;      
    }

    service.edit=function(category){
        var deferred = $q.defer();
        $http.put('/categoryArticle/'+category.id,category).success(function (data,status) {
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
            $http.delete('/categoryArticle/'+catArray[i].id).success(function (category,status) {
                 service.categories.splice(getIndexInBy(service.categories,'id',category.id),1)
                messageCenterService.add('success', 'Catégorie supprimé', { status: messageCenterService.status.unseen, timeout: 4000 });
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
            })
        }
         
    }
    service.removeimage=function(category,image){
        $http.delete('/image/'+image.id).success(function (data,status) {

            category.images.splice(getIndexInBy(category.images,'id',image.id),1);
            service.categories.splice(getIndexInBy(service.categories,'id',category.id),1,category)
            messageCenterService.add('success', 'Image supprimée', { status: messageCenterService.status.unseen, timeout: 4000 });

        }).error(function (data,status) {
            messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
        })
    }

    service.replace=function(category){
        
        service.categories.splice(getIndexInBy(service.categories,'id',category.id),1,category)
        return;
    }
    service.updateImgIndex=function(image,category){
        var deferred = $q.defer();
        $http.put('/image/'+image.id,image).success(function (image,status) {
            image.articlecategory = image.articlecategory.id;
            category.images.splice(getIndexInBy(category.images,'id',image.id),1,image);
            service.categories.splice(getIndexInBy(service.categories,'id',category.id),1,category)
            deferred.resolve(image);
        }).error(function (data,status) {
            deferred.reject(data);
        })
        return deferred.promise;
    }


    return service;
}]);