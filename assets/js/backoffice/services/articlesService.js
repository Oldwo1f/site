app.factory('articlesService', ['$http','$q','messageCenterService',function ($http,$q,messageCenterService) {
    var service = {};
    service.articles=[];


    service.fetchArticles= function() {
        var deferred = $q.defer();

        $http.get('/article').success(function (data,status) {
            service.articles =data;
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Erreur de récupération des articles', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    


    service.fetchArticle= function(id) {
        var deferred = $q.defer();

        $http.get('/article/'+id).success(function (data,status) {
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Impossible de récupérer l\'article', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    



    service.addNew=function(article){
        var deferred = $q.defer();

console.log(article);
        $http.post('/article',article).success(function (data2,status2) {
            $http.get('/article/'+data2.id).success(function (data,status) {
                service.articles.unshift(data);
                messageCenterService.add('success', 'Article ajouté', { status: messageCenterService.status.unseen, timeout: 4000 });

                deferred.resolve(data);
            })
        }).error(function (data,status) {
             deferred.reject(data);
        })
        
        return deferred.promise;      
    }

    service.edit=function(article){
        var deferred = $q.defer();
        $http.put('/article/'+article.id,article).success(function (data2,status) {
            $http.get('/article/'+article.id).success(function (data,status) {
                service.articles.splice(getIndexInBy(service.articles,'id',article.id),1,data)
                messageCenterService.add('success', 'Article enregistré', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
            })
        }).error(function (data,status) {
            deferred.reject(data);
        })
        return deferred.promise;
    }
    service.changeStatusArticle=function(array,status){
        var deferred = $q.defer();
        for(var i in array)
        {
            array[i].status =status;
            $http.put('/article/'+array[i].id,array[i]).success(function (article,status) {
                console.log(article);
                console.log(service.articles);
                console.log('index:'+getIndexInBy(service.articles,'id',article.id));
                service.articles.splice(getIndexInBy(service.articles,'id',article.id),1,article)
                console.log(service.articles);
                // messageCenterService.add('success', 'Status enregistré', { status: messageCenterService.status.unseen, timeout: 4000 });
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans le changement de status', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.reject(data);
            })
        }
        messageCenterService.add('success', 'Status enregistré(s)', { status: messageCenterService.status.unseen, timeout: 4000 });

    }
     
    service.remove=function(catArray){

        for(var i in catArray)
        {
            $http.delete('/article/'+catArray[i].id).success(function (article,status) {
                 service.articles.splice(getIndexInBy(service.articles,'id',article.id),1)
                messageCenterService.add('success', 'Article supprimé', { status: messageCenterService.status.unseen, timeout: 4000 });
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
            })
        }
         
    }
    service.removeimage=function(article,image){
        $http.delete('/image/'+image.id).success(function (data,status) {

            article.images.splice(getIndexInBy(article.images,'id',image.id),1);
            service.articles.splice(getIndexInBy(service.articles,'id',article.id),1,article)
            messageCenterService.add('success', 'Image supprimée', { status: messageCenterService.status.unseen, timeout: 4000 });
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
        })
    }

    service.replace=function(article){
        
        service.articles.splice(getIndexInBy(service.articles,'id',article.id),1,article)
        return;
    }
    service.updateImgIndex=function(image,article){
        var deferred = $q.defer();
        $http.put('/image/'+image.id,image).success(function (image,status) {
            image.article = image.article.id;
            article.images.splice(getIndexInBy(article.images,'id',image.id),1,image);
            service.articles.splice(getIndexInBy(service.articles,'id',article.id),1,article)
            deferred.resolve(image);
        }).error(function (data,status) {
            deferred.reject(data);
        })
        return deferred.promise;
    }


    return service;
}]);