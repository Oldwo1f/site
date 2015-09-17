app.factory('projectsService', ['$http','$q','messageCenterService',function ($http,$q,messageCenterService) {
    var service = {};
    service.projects=[];


    service.fetchProjects= function() {
        var deferred = $q.defer();

        $http.get('/project').success(function (data,status) {
            service.projects =data;
            deferred.resolve(data);
        }).error(function (data,status) {
            deferred.reject('error perso');
            messageCenterService.add('danger', 'Erreur de récupération des projets', { status: messageCenterService.status.unseen, timeout: 4000 });

        })

        return deferred.promise;
    };
    


    service.fetchProject= function(id) {
        var deferred = $q.defer();

        $http.get('/project/'+id).success(function (data,status) {
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Impossible de récupérer le projet', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    



    service.addNew=function(project){
        var deferred = $q.defer();

        $http.post('/project',project).success(function (data2,status2) {
            $http.get('/project/'+data2.id).success(function (data,status) {
                service.projects.unshift(data);
            messageCenterService.add('success', 'Projet ajouté', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
            })
        }).error(function (data,status) {
             deferred.reject(data);
        })
        
        return deferred.promise;      
    }

    service.edit=function(project){
        var deferred = $q.defer();
        $http.put('/project/'+project.id,project).success(function (data2,status) {
            $http.get('/project/'+project.id).success(function (data,status) {
                service.projects.splice(getIndexInBy(service.projects,'id',project.id),1,data)
                messageCenterService.add('success', 'Projet enregistré', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
            })
        }).error(function (data,status) {
            deferred.reject(data);
        })
        return deferred.promise;
    }
    service.changeStatusProject=function(array,status){
        var deferred = $q.defer();
        for(var i in array)
        {
            array[i].status =status;
            $http.put('/project/'+array[i].id,array[i]).success(function (project,status) {
                service.projects.splice(getIndexInBy(service.projects,'id',project.id),1,project)
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans le changement de status', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.reject(data);
            })
        }
        messageCenterService.add('success', 'Status enregistré', { status: messageCenterService.status.unseen, timeout: 4000 });
    }
    service.remove=function(catArray){

        for(var i in catArray)
        {
            $http.delete('/project/'+catArray[i].id).success(function (project,status) {
                 service.projects.splice(getIndexInBy(service.projects,'id',project.id),1)
                 messageCenterService.add('success', 'Projet supprimé', { status: messageCenterService.status.unseen, timeout: 4000 });
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });

            })
        }
         
    }
    service.removeimage=function(project,image){
        $http.delete('/image/'+image.id).success(function (data,status) {

            project.images.splice(getIndexInBy(project.images,'id',image.id),1);
            service.projects.splice(getIndexInBy(service.projects,'id',project.id),1,project)
            messageCenterService.add('success', 'Image supprimée', { status: messageCenterService.status.unseen, timeout: 4000 });

        }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
        })
    }

    service.replace=function(project){
        
        service.projects.splice(getIndexInBy(service.projects,'id',project.id),1,project)
        return;
    }
    service.updateImgIndex=function(image,project){
        var deferred = $q.defer();
        $http.put('/image/'+image.id,image).success(function (image,status) {
            image.project = image.project.id;
            project.images.splice(getIndexInBy(project.images,'id',image.id),1,image);
            service.projects.splice(getIndexInBy(service.projects,'id',project.id),1,project)
            deferred.resolve(image);
        }).error(function (data,status) {
            deferred.reject(data);
        })
        return deferred.promise;
    }


    return service;
}]);