app.factory('fluxsService', ['$http','$q','messageCenterService','$sce',function ($http,$q,messageCenterService,$sce) {
    var service = {};
    service.fluxs=[];
    service.flux={};
    service.content={}

    service.fetchFluxs= function() {
        var deferred = $q.defer();

        $http.get('/flux').success(function (data,status) {
            service.fluxs =data;
            deferred.resolve(data);
        }).error(function (data,status) {
            deferred.reject('error perso');
            messageCenterService.add('danger', 'Erreur de récupération des fluxs', { status: messageCenterService.status.unseen, timeout: 4000 });

        })

        return deferred.promise;
    };
    


    service.fetchFlux= function(id) {
        var deferred = $q.defer();

        $http.get('/fluxtitle/'+id).success(function (data,status) {
            service.flux=data;
            service.flux.contents=[];

            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Impossible de récupérer le flux', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject('error perso');
        })

        return deferred.promise;
    };

    service.fetchPage= function(page) {
        var deferred = $q.defer();

console.log();
console.log(page);
        $http.get('/flux/'+service.flux.id+'/'+page).success(function (data,status) {
            console.log(data);
            for(i in data)
            {
                service.flux.contents.push(data[i])
            }
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Impossible de récupérer le flux', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    service.fetchContent= function(id) {
        console.log('FETCHCONTENT '+ id);
        var deferred = $q.defer();

        $http.get('/content/'+id).success(function (data,status) {
            service.content=data;
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Impossible de récupérer le contenu', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    

    service.addFavoris=function(contentId){
    	// console.log(meid);
        var deferred = $q.defer();
        console.log(this);
        $http.get('/flux/'+service.flux.id+'/addFavoris/'+contentId).success(function (data,status2) {
                // service.flux.contents.unshift(data);
                console.log(data);
                // service.box.contents.splice(getIndexInBy(service.box.contents,'id',contentId),1)

                service.flux.contents[getIndexInBy(service.flux.contents,'id',contentId)].favoris=true;;
                messageCenterService.add('success', 'Favoris ajouté', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
        }).error(function (data,status) {
            console.log(data);
             deferred.reject(data);
        })
        
        return deferred.promise;      
    }

    return service;
}]);