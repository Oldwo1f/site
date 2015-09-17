app.factory('envoiService', ['$http','$q','$upload','messageCenterService',function ($http,$q,$upload,messageCenterService) {
    var service = {};
    service.envois=[];


    service.fetchenvois= function() {
        var deferred = $q.defer();

        $http.get('/getenvoi').success(function (data,status) {
            service.envois =data;
            deferred.resolve(data);
        }).error(function (data,status) {
            messageCenterService.add('danger', 'Erreur de récupération des envois', { status: messageCenterService.status.unseen, timeout: 4000 });

            deferred.reject('error perso');
        })

        return deferred.promise;
    };

    service.send= function(envoi,files,calllback) {
        var deferred = $q.defer();
        $upload.upload({
            url: '/envoiserie',
            method: 'POST',
            // headers: {'header-key': 'header-value'},
            // withCredentials: true,
            file: (typeof(files)!='undefined') ? files[0] : null, // or list of files: $files for html5 only
            // fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file
        /* customize file formData name ('Content-Desposition'), server side file variable name. 
            Default is 'file' */
            fileFormDataName: 'pjs',//or a list of names for multiple files (html5).
            /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
            //formDataAppender: function(formData, key, val){}

            data: envoi

        }).progress(function(evt) {
        }).success(function(data, status, headers, config) {
            service.envois.push(data)
                messageCenterService.add('success', 'Votre envoi est accepté', { status: messageCenterService.status.unseen, timeout: 4000 });
            calllback(data);
        });

        return deferred.promise;
    };
    
    service.remove=function(catArray){

        for(var i in catArray)
        {
            $http.delete('/campagne/'+catArray[i].id).success(function (envoi,status) {
                 service.envois.splice(getIndexInBy(service.envois,'id',envoi.id),1)
                messageCenterService.add('success', 'Campagne supprimé', { status: messageCenterService.status.unseen, timeout: 4000 });
            }).error(function (data,status) {
                messageCenterService.add('danger', 'Erreur dans la suppression', { status: messageCenterService.status.unseen, timeout: 4000 });
            })
        }
         
    }
  
    return service;
}]);