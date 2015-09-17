app.controller('addlinkCtrl',['$scope','accountService','$stateParams','filterFilter','flux','fluxsService','$state','messageCenterService',
function addlinkCtrl($scope,accountService,$stateParams,filterFilter,flux,fluxsService ,$state,messageCenterService) {
    $scope.newContent={};
    $scope.newContent.description='';
    $scope.newContent.url='';
    $scope.newContent.title='';

        console.log(flux);
    $('.newModalLink').modal();
    $('.newModalLink').on('hidden.bs.modal',function(e) {

        console.log('HIDE');
        $state.go('/.fluxs.flux', {id:flux.id});
    });
    $scope.exitNew=function() {
        // console.log(flux.id);
        // $state.go('transition', {destination: '/.fluxs.flux'});
        $state.go('/.fluxs.flux');
        // $scope.$parent.back();
        // $('.newModalLink').trigger('hidden.bs.modal');

    };

    // $scope.timeSet = function() {

    //     $scope.openDatepicker = false;
    // };

    $scope.submitNew=function() {
        console.log('SUBMIT NEW');
        $scope.newContent.owner=accountService.me.id;
        fluxsService.addLink($scope.newContent).then(function() {
            $state.transitionTo('/.fluxs.flux', {id:flux.id}, { reload: true, inherit: true, notify: true });
        },function(err) {
            console.log(err);
            if(err.invalidAttributes)
            {
                messageCenterService.add('danger', 'Veuillez revoir votre saisie', { status: messageCenterService.status.unseen, timeout: 4000 });
                invalAttrs = err.invalidAttributes;
                for(var i in invalAttrs)
                {
                    $('[name="'+i+'"]').parent().addClass('has-error');
                }
            }
        })
        
    };
}]);
app.controller('editlinkCtrl',['$scope','$stateParams','filterFilter','configService','fluxsService','$state','$filter','content','messageCenterService',
function editlinkCtrl($scope,$stateParams,filterFilter,configService ,fluxsService ,$state,$filter,content,messageCenterService) {
    $('.editModalLink').modal();
    $('.editModalLink').on('hidden.bs.modal',function(e) {
        $state.go('/.fluxs.flux');
    });
    $scope.editContent = content;
    $scope.link = content.link;

    $scope.exitNew=function() {
        $state.go('/.fluxs.flux');
    };
   // console.log($scope.editContent);
    $scope.submitEdit = function() {

        fluxsService.editlink($scope.link,content.id).then(function() {

            $state.go('/.fluxs.flux',{id:fluxsService.flux.id});

            // $('.editModalLink').modal('hide');
        },function(err) {


            if(err.invalidAttributes)
            {
                messageCenterService.add('danger', 'Veuillez revoir votre saisie', { status: messageCenterService.status.unseen, timeout: 4000 });
                invalAttrs = err.invalidAttributes;
                for(var i in invalAttrs)
                {
                    $('[name="'+i+'"]').parent().addClass('has-error');
                }
            }
        })
    };


}]);




app.controller('addprezCtrl',['$scope','accountService','$stateParams','filterFilter','fluxsService','$state','messageCenterService',
function addprezCtrl($scope,accountService,$stateParams,filterFilter,fluxsService ,$state,messageCenterService) {
    $scope.newContent={};
    $scope.newContent.description='';
    $scope.newContent.title='';

    //     console.log(flux);
    $('.newModalPrez').modal();
    $('.newModalPrez').on('hidden.bs.modal',function(e) {

    //     console.log('HIDE');
        $state.go('/.fluxs.flux');
    });
    $scope.exitNew=function() {
        $state.go('/.fluxs.flux');
    };

    // $scope.timeSet = function() {

    //     $scope.openDatepicker = false;
    // };

    $scope.submitNew=function() {
        console.log('SUBMIT NEW');
        $scope.newContent.owner=accountService.me.id;
        fluxsService.addPrez($scope.newContent).then(function() {
         $state.transitionTo('/.fluxs.flux', {id:fluxsService.flux.id}, { reload: true, inherit: true, notify: true });
            
        },function(err) {
            if(err.invalidAttributes)
            {
                messageCenterService.add('danger', 'Veuillez revoir votre saisie', { status: messageCenterService.status.unseen, timeout: 4000 });
                invalAttrs = err.invalidAttributes;
                for(var i in invalAttrs)
                {
                    $('[name="'+i+'"]').parent().addClass('has-error');
                }
            }
        })
        
    };
}]);


app.controller('editprezCtrl',['$scope','$stateParams','filterFilter','configService','fluxsService','$state','$filter','content','messageCenterService',
function editprezCtrl($scope,$stateParams,filterFilter,configService ,fluxsService ,$state,$filter,content,messageCenterService) {
    $('.editModalPrez').modal();
    $('.editModalPrez').on('hidden.bs.modal',function(e) {
        $state.go('/.fluxs.flux');
    });
    $scope.editContent = content;
    $scope.prez = content.prez;
   // console.log($scope.editContent);

    $scope.exitNew=function() {
        $state.go('/.fluxs.flux');
    };
    $scope.submitEdit = function() {

        fluxsService.editPrez($scope.prez,content.id).then(function() {

            $state.go('/.fluxs.flux',{id:fluxsService.flux.id});

            // $('.editModalLink').modal('hide');
        },function(err) {


            if(err.invalidAttributes)
            {
                messageCenterService.add('danger', 'Veuillez revoir votre saisie', { status: messageCenterService.status.unseen, timeout: 4000 });
                invalAttrs = err.invalidAttributes;
                for(var i in invalAttrs)
                {
                    $('[name="'+i+'"]').parent().addClass('has-error');
                }
            }
        })
    };


}]);

app.controller('addprivatearticleCtrl',['$scope','accountService','$stateParams','filterFilter','fluxsService','$state','messageCenterService',
function addprivatearticleCtrl($scope,accountService,$stateParams,filterFilter,fluxsService ,$state,messageCenterService) {
    $scope.newContent={};
    $scope.newContent.description='';
    $scope.newContent.title='';
    $('.newModalPrivatearticle').modal();
    $('.newModalPrivatearticle').on('hidden.bs.modal',function(e) {

        $state.go('/.fluxs.flux');
    });
    $scope.exitNew=function() {
        $state.go('/.fluxs.flux');
    };
    $scope.submitNew=function() {
        console.log('SUBMIT NEW');
        $scope.newContent.owner=accountService.me.id;
        fluxsService.addPrivatearticle($scope.newContent).then(function() {
         $state.transitionTo('/.fluxs.flux', {id:fluxsService.flux.id}, { reload: true, inherit: true, notify: true });
            
        },function(err) {
            if(err.invalidAttributes)
            {
                messageCenterService.add('danger', 'Veuillez revoir votre saisie', { status: messageCenterService.status.unseen, timeout: 4000 });
                invalAttrs = err.invalidAttributes;
                for(var i in invalAttrs)
                {
                    $('[name="'+i+'"]').parent().addClass('has-error');
                }
            }
        })
        
    };
}]);


app.controller('editprivatearticleCtrl',['$scope','$stateParams','filterFilter','configService','fluxsService','$state','$filter','content','messageCenterService',
function editprivatearticleCtrl($scope,$stateParams,filterFilter,configService ,fluxsService ,$state,$filter,content,messageCenterService) {
    $('.editModalPrivatearticle').modal();
    $('.editModalPrivatearticle').on('hidden.bs.modal',function(e) {
        $state.go('/.fluxs.flux');
    });
    $scope.editContent = content;
    $scope.privatearticle = content.privatearticle;
   // console.log($scope.editContent);

    $scope.exitNew=function() {
        $state.go('/.fluxs.flux');
    };
    $scope.submitEdit = function() {

        fluxsService.editPrivatearticle($scope.privatearticle,content.id).then(function() {

            $state.go('/.fluxs.flux',{id:fluxsService.flux.id});

            // $('.editModalLink').modal('hide');
        },function(err) {


            if(err.invalidAttributes)
            {
                messageCenterService.add('danger', 'Veuillez revoir votre saisie', { status: messageCenterService.status.unseen, timeout: 4000 });
                invalAttrs = err.invalidAttributes;
                for(var i in invalAttrs)
                {
                    $('[name="'+i+'"]').parent().addClass('has-error');
                }
            }
        })
    };


}]);

app.controller('addingredientCtrl',['$scope','accountService','ingredientsService','allingredients','$stateParams','filterFilter','fluxsService','$state','messageCenterService',
function addingredientCtrl($scope,accountService,ingredientsService,$stateParams,allingredients,filterFilter,fluxsService ,$state,messageCenterService) {
    $scope.ingredientid='';

    console.log(ingredientsService.ingredients);

    $scope.ingredients=ingredientsService.ingredients;
    // $scope.newContent.title='';
    $('.newModalIngredient').modal();
    $('.newModalIngredient').on('hidden.bs.modal',function(e) {

        $state.go('/.fluxs.flux');
    });
    $scope.exitNew=function() {
        $state.go('/.fluxs.flux');
    };
    $scope.submitNew=function() {
        console.log('SUBMIT NEW');
        $scope.ingredientcontent={};
        $scope.ingredientcontent.owner=accountService.me.id;
        fluxsService.addIngredient($scope.ingredientcontent,$scope.ingredientid).then(function() {
         $state.transitionTo('/.fluxs.flux', {id:fluxsService.flux.id}, { reload: true, inherit: true, notify: true });
            
        },function(err) {
            if(err.invalidAttributes)
            {
                messageCenterService.add('danger', 'Veuillez revoir votre saisie', { status: messageCenterService.status.unseen, timeout: 4000 });
                invalAttrs = err.invalidAttributes;
                for(var i in invalAttrs)
                {
                    $('[name="'+i+'"]').parent().addClass('has-error');
                }
            }
        })
        
    };
}]);
app.controller('addfichierCtrl',['$http','$upload','$scope','accountService','ingredientsService','$stateParams','filterFilter','fluxsService','$state','messageCenterService',
function addfichierCtrl($http,$upload,$scope,accountService,ingredientsService,$stateParams,filterFilter,fluxsService ,$state,messageCenterService) {
  
    $scope.newContent={};
    $scope.newContent.title='';
    $('.newModalFichier').modal();
    $('.newModalFichier').on('hidden.bs.modal',function(e) {

        $state.go('/.fluxs.flux');
    });
    $scope.clickAddImg = function($event) {
                setTimeout(function() {
                    $($event.target).find('input').click();
                },0);
    }   

    $scope.exitNew=function() {
        $state.go('/.fluxs.flux');
    };

    $scope.onFileSelect = function($files) {
               
                    $scope.f=$files[0];
                    $scope.newContent.path=$scope.f.name;
                    $scope.newContent.extention=$scope.f.type;
                    $scope.newContent.size=$scope.f.size;
                    console.log($scope.f);
    }

    $scope.submitNew=function() {
        console.log('SUBMIT NEW');
        $scope.newContent.owner=accountService.me.id;
        $scope.upload = $upload.upload({
            url: '/flux/'+fluxsService.flux.id+'/addfichier', //upload.php script, node.js route, or servlet url
            method: 'POST',
            // headers: {'header-key': 'header-value'},
            // withCredentials: true,
            file: $scope.f, // or list of files: $files for html5 only
            // fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file
        /* customize file formData name ('Content-Desposition'), server side file variable name. 
            Default is 'file' */
            fileFormDataName: 'img',//or a list of names for multiple files (html5).
            /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
            //formDataAppender: function(formData, key, val){}

            data: {'content': $scope.newContent}

          }).progress(function(evt) {
          }).success(function(data, status, headers, config) {

            console.log('SUCCESS');
            console.log(data);
            fluxsService.flux.contents.unshift(data);
            messageCenterService.add('success', 'Fichier ajouté', { status: messageCenterService.status.unseen, timeout: 4000 });
             $state.transitionTo('/.fluxs.flux', {id:fluxsService.flux.id}, { reload: true, inherit: true, notify: true });
            // file is uploaded successfully
            // $scope.$parent.recupImage(data);
          }).error(function(data, status, headers, config) {

            console.log('ERROR');
            console.log(data);
            if(data.invalidAttributes)
            {
                messageCenterService.add('danger', 'Veuillez revoir votre saisie', { status: messageCenterService.status.unseen, timeout: 4000 });
                invalAttrs = data.invalidAttributes;
                for(var i in invalAttrs)
                {
                    $('[name="'+i+'"]').parent().addClass('has-error');
                }
            }
            else if(data.error ==="nofile")
            {
                messageCenterService.add('danger', 'Aucun fichier', { status: messageCenterService.status.unseen, timeout: 4000 });

            }
            else
            messageCenterService.add('danger', 'Un erreur est survenu', { status: messageCenterService.status.unseen, timeout: 4000 });
            // file is uploaded successfully
            // $scope.$parent.recupImage(data);
          });
        
        };
}]);