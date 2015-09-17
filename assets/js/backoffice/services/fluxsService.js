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

        $http.get('/flux/'+id).success(function (data,status) {
            service.flux=data;
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
    



    service.addNew=function(flux,userid){
        var deferred = $q.defer();
        flux.owner = userid;
        console.log(flux);
        $http.post('/flux',flux).success(function (data2,status2) {
            $http.get('/flux/'+data2.id).success(function (data,status) {
                service.fluxs.unshift(data);
            messageCenterService.add('success', 'Flux ajouté', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
            })
        }).error(function (data,status) {
             deferred.reject(data);
        })
        
        return deferred.promise;      
    }

    service.newAnswer=function(answer){
        var deferred = $q.defer();
        console.log(service.fluxs);
        $http.post('/addanswer',answer).success(function (data2,status2) {

         console.log(data2);
            // service.fluxs
            $http.get('/answer/'+data2.id).success(function (data,status) {
                // console.log(getIndexInBy(service.fluxs,'id',answer.flux));
                // console.log(service.fluxs.answers);
                console.log(data);
                service.flux.answers.push(data);
                messageCenterService.add('success', 'Réponse ajoutée', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
            })
        }).error(function (data,status) {
            console.log(data);
             deferred.reject(data);
        })
        
        return deferred.promise;      
    }

    service.edit=function(flux){
        var deferred = $q.defer();
        $http.put('/flux/'+flux.id,flux).success(function (data2,status) {
            $http.get('/flux/'+flux.id).success(function (data,status) {
                service.fluxs.splice(getIndexInBy(service.fluxs,'id',flux.id),1,data)
                messageCenterService.add('success', 'Flux enregistré', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
            })
        }).error(function (data,status) {
            deferred.reject(data);
        })
        return deferred.promise;
    }

    
    service.changeStatusFlux=function(array,status){
        var deferred = $q.defer();
        for(var i in array)
        {
            array[i].status =status;
            $http.put('/flux/changestatus/'+array[i].id+'/'+array[i].status).success(function (flux,status) {
                service.fluxs[getIndexInBy(service.fluxs,'id',flux.id)].status = flux.status;
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
            $http.delete('/flux/'+catArray[i].id).success(function (flux,status) {
                 service.fluxs.splice(getIndexInBy(service.fluxs,'id',flux.id),1)
                 messageCenterService.add('success', 'Flux supprimé', { status: messageCenterService.status.unseen, timeout: 4000 });
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
            })
        }
         
    }

    service.removeOne=function(flux){
        var deferred = $q.defer();
            $http.delete('/flux/'+flux.id).success(function (flux,status) {
                service.fluxs.splice(getIndexInBy(service.fluxs,'id',flux.id),1)
                messageCenterService.add('success', 'Flux supprimé', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(flux);
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.reject(data);
            })
         return deferred.promise;
    }
    service.removeContent=function(content){
        var deferred = $q.defer();
            $http.delete('/content/'+content).success(function (content,status) {
                // service.fluxs.contents.splice(getIndexInBy(service.fluxs,'id',flux.id),1)
                service.flux.contents.splice(getIndexInBy(service.flux.contents,'id',content.id),1);
                messageCenterService.add('success', 'Contenu supprimé', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(content);
                
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.reject(data);
            })
         return deferred.promise;
    }
    service.removeAnswer=function(id){
        var deferred = $q.defer();
            $http.delete('/answer/'+id).success(function (flux,status) {
                deferred.resolve(flux);
                service.flux.answers.splice(getIndexInBy(service.flux.answers,'id',id),1)
                messageCenterService.add('success', 'Réponse supprimée', { status: messageCenterService.status.unseen, timeout: 4000 });
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.reject(data);
            })
         return deferred.promise;
    }

    service.addLink=function(link){
        var deferred = $q.defer();
        $http.post('/flux/'+service.flux.id+'/addlink/',link).success(function (data,status2) {
                service.flux.contents.unshift(data);
                messageCenterService.add('success', 'Lien ajouté', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
        }).error(function (data,status) {
            console.log(data);
             deferred.reject(data);
        })
        
        return deferred.promise;      
    }
    service.editlink=function(link,contentId){
        console.log("EDIT");
        var deferred = $q.defer();
        $http.put('/flux/'+service.flux.id+'/editlink/'+contentId,link).success(function (data,status) {
            
            console.log('EDIT');
            console.log(data);
            // data.htmldescription = $sce.trustAsHtml(data.htmldescription)
            // $http.get('/content/'+link.id).success(function (data,status) {
                console.log(service.flux.contents[getIndexInBy(service.flux.contents,'id',contentId)]);
                service.flux.contents[getIndexInBy(service.flux.contents,'id',contentId)].link= data;
                // console.log(service.flux.contents[getIndexInBy(service.flux.contents,'id',contentId)]);
                messageCenterService.add('success', 'Lien modifié', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
            // })
        }).error(function (data,status) {
            deferred.reject(data);
        })
        return deferred.promise;
    }
    service.addPrez=function(prez){
        var deferred = $q.defer();
        $http.post('/flux/'+service.flux.id+'/addprez/',prez).success(function (data,status2) {
                service.flux.contents.unshift(data);
                messageCenterService.add('success', 'Présentation ajoutée', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
        }).error(function (data,status) {
            console.log(data);
             deferred.reject(data);
        })
        
        return deferred.promise;      
    }
    service.editPrez=function(prez,contentId){
        console.log("EDIT");
        var deferred = $q.defer();
        $http.put('/flux/'+service.flux.id+'/editprez/'+contentId,prez).success(function (data,status) {
            
            console.log('EDIT');
            console.log(data);
            // data.htmldescription = $sce.trustAsHtml(data.htmldescription)
            // $http.get('/content/'+link.id).success(function (data,status) {
                console.log(service.flux.contents[getIndexInBy(service.flux.contents,'id',contentId)]);
                service.flux.contents[getIndexInBy(service.flux.contents,'id',contentId)].prez= data;
                // console.log(service.flux.contents[getIndexInBy(service.flux.contents,'id',contentId)]);
                messageCenterService.add('success', 'Présentation modifiée', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
            // })
        }).error(function (data,status) {
            deferred.reject(data);
        })
        return deferred.promise;
    }
    service.addPrivatearticle=function(privatearticle){
        var deferred = $q.defer();
        $http.post('/flux/'+service.flux.id+'/addprivatearticle/',privatearticle).success(function (data,status2) {
                service.flux.contents.unshift(data);
                messageCenterService.add('success', 'Présentation ajoutée', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
        }).error(function (data,status) {
            console.log(data);
             deferred.reject(data);
        })
        
        return deferred.promise;      
    }
    service.editPrivatearticle=function(privatearticle,contentId){
        console.log("EDIT");
        var deferred = $q.defer();
        $http.put('/flux/'+service.flux.id+'/editprivatearticle/'+contentId,privatearticle).success(function (data,status) {
            
            console.log('EDIT');
            console.log(data);
            // data.htmldescription = $sce.trustAsHtml(data.htmldescription)
            // $http.get('/content/'+link.id).success(function (data,status) {
                console.log(service.flux.contents[getIndexInBy(service.flux.contents,'id',contentId)]);
                service.flux.contents[getIndexInBy(service.flux.contents,'id',contentId)].privatearticle= data;
                // console.log(service.flux.contents[getIndexInBy(service.flux.contents,'id',contentId)]);
                messageCenterService.add('success', 'Présentation modifiée', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
            // })
        }).error(function (data,status) {
            deferred.reject(data);
        })
        return deferred.promise;
    }
    service.addIngredient=function(ingredientcontent,ingredientid){
        var deferred = $q.defer();
        $http.post('/flux/'+service.flux.id+'/addingredient/'+ingredientid,ingredientcontent).success(function (data,status2) {
                service.flux.contents.unshift(data);
                messageCenterService.add('success', 'Présentation ajoutée', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
        }).error(function (data,status) {
            console.log(data);
             deferred.reject(data);
        })
        
        return deferred.promise;      
    }

    return service;
}]);