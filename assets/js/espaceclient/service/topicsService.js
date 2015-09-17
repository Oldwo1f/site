app.factory('topicsService', ['$http','$q','messageCenterService',function ($http,$q,messageCenterService) {
    var service = {};
    service.topics=[];
    service.topic={};


    service.fetchTopics= function() {
        var deferred = $q.defer();

        $http.get('/topic').success(function (data,status) {
            service.topics =data;
            console.log(data);
            console.log(service.topics);
            deferred.resolve(data);
        }).error(function (data,status) {
            deferred.reject('error perso');
            messageCenterService.add('danger', 'Erreur de récupération des topics', { status: messageCenterService.status.unseen, timeout: 4000 });

        })

        return deferred.promise;
    };
    


    service.fetchTopic= function(id) {
        var deferred = $q.defer();

        $http.get('/topic/'+id).success(function (data,status) {
            service.topic=data;
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Impossible de récupérer le topic', { status: messageCenterService.status.unseen, timeout: 4000 });
            deferred.reject('error perso');
        })

        return deferred.promise;
    };
    



    service.addNew=function(topic,userid){
        var deferred = $q.defer();
        topic.owner = userid;
        console.log(topic);
        $http.post('/topic',topic).success(function (data2,status2) {
            $http.get('/topic/'+data2.id).success(function (data,status) {
                service.topics.unshift(data);
            messageCenterService.add('success', 'Topic ajouté', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
            })
        }).error(function (data,status) {
             deferred.reject(data);
        })
        
        return deferred.promise;      
    }

    service.newAnswer=function(answer){
        var deferred = $q.defer();
        console.log(service.topics);
        $http.post('/addanswer',answer).success(function (data2,status2) {

         console.log(data2);
            // service.topics
            $http.get('/answer/'+data2.id).success(function (data,status) {
                // console.log(getIndexInBy(service.topics,'id',answer.topic));
                // console.log(service.topics.answers);
                console.log(data);
                service.topic.answers.push(data);
                messageCenterService.add('success', 'Réponse ajoutée', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
            })
        }).error(function (data,status) {
            console.log(data);
             deferred.reject(data);
        })
        
        return deferred.promise;      
    }

    service.edit=function(topic){
        var deferred = $q.defer();
        $http.put('/topic/'+topic.id,topic).success(function (data2,status) {
            $http.get('/topic/'+topic.id).success(function (data,status) {
                service.topics.splice(getIndexInBy(service.topics,'id',topic.id),1,data)
                messageCenterService.add('success', 'Topic enregistré', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.resolve(data);
            })
        }).error(function (data,status) {
            deferred.reject(data);
        })
        return deferred.promise;
    }
    service.changeStatusTopic=function(array,status){
        var deferred = $q.defer();
        for(var i in array)
        {
            console.log(array[i]);
            array[i].status =status;
            $http.put('/topic/changestatus/'+array[i].id+'/'+array[i].status).success(function (topic,status) {
                service.topics[getIndexInBy(service.topics,'id',topic.id)].status = topic.status;
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
            $http.delete('/topic/'+catArray[i].id).success(function (topic,status) {
                 service.topics.splice(getIndexInBy(service.topics,'id',topic.id),1)
                 messageCenterService.add('success', 'Topic supprimé', { status: messageCenterService.status.unseen, timeout: 4000 });
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
            })
        }
         
    }

    service.removeOne=function(topic){
        var deferred = $q.defer();
            $http.delete('/topic/'+topic.id).success(function (topic,status) {
                deferred.resolve(topic);
                service.topics.splice(getIndexInBy(service.topics,'id',topic.id),1)
                messageCenterService.add('success', 'Topic supprimé', { status: messageCenterService.status.unseen, timeout: 4000 });
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.reject(data);
            })
         return deferred.promise;
    }
    service.removeAnswer=function(id){
        var deferred = $q.defer();
            $http.delete('/answer/'+id).success(function (topic,status) {
                deferred.resolve(topic);
                service.topic.answers.splice(getIndexInBy(service.topic.answers,'id',id),1)
                messageCenterService.add('success', 'Réponse supprimée', { status: messageCenterService.status.unseen, timeout: 4000 });
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
                deferred.reject(data);
            })
         return deferred.promise;
    }




    return service;
}]);