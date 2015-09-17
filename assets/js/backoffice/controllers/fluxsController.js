app.controller('fluxsCtrl',['$scope','filterFilter','fluxsService','$filter','$state','fluxs','messageCenterService',
function fluxsCtrl($scope,filterFilter,fluxsService,$filter,$state,fluxs,messageCenterService) {

    $scope.fluxs= fluxs;
    $scope.order='title';
    $scope.reverse=false;
    $scope.filterActif = true;
    $scope.filterInactif = true;
    $scope.filterNew = true;

    // $scope.getCatName =function(cat) {
    //     return getIndexInBy($scope.categories,'id',cat.id)
    // }
    $scope.totalChecked = function()
    {
        if(filterFilter($scope.fluxs,{checked : true}).length == $scope.fluxs.length)
            $scope.allChecked = true;
        else
            $scope.allChecked = false;
        return filterFilter($scope.fluxs,{checked : true}).length;
    }
    $scope.toggleAllcheck = function()
    {
        allchecked = !$scope.allChecked;
        $scope.fluxs.forEach(function(flux) {
            flux.checked = allchecked;
        });
    }
    $scope.linkedit=function(id){
        if(id){
            clearSelection()
            $state.go('/.fluxs.fluxs.edit',{id: id})
        }
        else
            $state.go('/.fluxs.fluxs.edit',{id: filterFilter($scope.fluxs,{checked : true})[0].id})
    }
    $scope.linkFlux=function(id){
        if(id){
            clearSelection()
            $state.go('/.fluxs.flux',{id: id})
        }
        else
            $state.go('/.fluxs.flux',{id: filterFilter($scope.fluxs,{checked : true})[0].id})
    }
    $scope.linkadd =function(){
            $state.go('/.fluxs.fluxs.add');
    }
    $scope.removeselected =function(){
            fluxsService.remove(filterFilter($scope.fluxs,{checked : true}))
    }
    $scope.changestatus = function(status) {
        fluxsService.changeStatusFlux(filterFilter($scope.fluxs,{checked : true}),status)
        
    };

    $scope.sortFunction =function(val){

        // if($scope.order === 'author')
        // {
        //     if( typeof(val['owner']) !='undefined'){
        //         if(typeof(val['owner'].name))
        //             return val['owner'].name;
        //         else
        //             return val['owner'].email
        //     }
        // }else
        // {
            return val[$scope.order];
        // }
    }
    // $scope.getCat =function(val){
    //     if(!$scope.filterActif)
    //     {
    //         if(val.status ==='résolu'){
    //             val.checked=false;
    //             return false;
    //         }
    //     }
    //     if(!$scope.filterInactif)
    //     {
    //         if(val.status ==='en discussion'){
    //             val.checked=false;
    //             return false;
    //         }
    //     }
    //     if(!$scope.filterNew)
    //     {
    //         if(val.status ==='new'){
    //             val.checked=false;
    //             return false;
    //         }
    //     }
    //     return true;
    // }
    $scope.fluxfilter =function(val){
        var patt = new RegExp($scope.slug,'i');
        if(patt.test(val.title))
            return true;
        
        if(patt.test($filter('date')(val.createdAt,'dd MMMM')))
            return true;

        val.checked=false;
        return false;
    }




    
    

}]);

app.controller('addfluxsCtrl',['$scope','accountService','$stateParams','filterFilter','fluxsService','$state','messageCenterService',
function addfluxsCtrl($scope,accountService,$stateParams,filterFilter,fluxsService ,$state,messageCenterService) {
    $scope.newFlux={};
    $scope.newFlux.description='';
    $scope.newFlux.title='';

    
    $('.newModal').modal();
    $('.newModal').on('hidden.bs.modal',function(e) {
        $state.go('/.fluxs.fluxs');
    });

    // $scope.timeSet = function() {

    //     $scope.openDatepicker = false;
    // };

    $scope.submitNew=function() {
        $scope.newFlux.status='new';
        $scope.newFlux.owner=accountService.me.id;
        fluxsService.addNew($scope.newFlux,accountService.me.id).then(function() {
            $scope.newFlux.title='';
            $state.go('/.fluxs.fluxs');
        },function(err) {
            if(err.error.invalidAttributes)
            {
                messageCenterService.add('danger', 'Veuillez revoir votre saisie', { status: messageCenterService.status.unseen, timeout: 4000 });
                invalAttrs = err.error.invalidAttributes;
                for(var i in invalAttrs)
                {
                    $('[name="'+i+'"]').parent().addClass('has-error');
                }
            }
        })
        
    };
}]);
app.controller('editfluxsCtrl',['$scope','$stateParams','filterFilter','configService','fluxsService','$state','$filter','flux','messageCenterService',
function editfluxsCtrl($scope,$stateParams,filterFilter,configService ,fluxsService ,$state,$filter,flux,messageCenterService) {
    $('.editModal').modal();
    $('.editModal').on('hidden.bs.modal',function(e) {
        $state.go('/.fluxs.fluxs');
    });
    $scope.editFlux = flux;
   console.log($scope.editFlux);
    $scope.submitEdit = function() {

        fluxsService.edit($scope.editFlux).then(function() {
            $('.editModal').modal('hide');
        },function(err) {
            if(err.error.invalidAttributes)
            {
                messageCenterService.add('danger', 'Veuillez revoir votre saisie', { status: messageCenterService.status.unseen, timeout: 4000 });
                invalAttrs = err.error.invalidAttributes;
                for(var i in invalAttrs)
                {
                    $('[name="'+i+'"]').parent().addClass('has-error');
                }
            }
        })
    };


}]);
app.controller('fluxCtrl',['$scope','$stateParams','$timeout','filterFilter','configService','fluxsService','$state','$filter','flux','messageCenterService','accountService',
    function fluxCtrl($scope,$stateParams,$timeout,filterFilter,configService ,fluxsService ,$state,$filter,flux,messageCenterService,accountService) {
    // $('.editModal').modal();
    // $('.editModal').on('hidden.bs.modal',function(e) {
    //     $state.go('/.forum.fluxs');
    // });
// $state.transitionTo($state.current, $state.$current.params, { reload: true, inherit: true, notify: true });
// $state.reload();

    // $scope.hideContent = true;
    // $timeout(function() {
    //   return $scope.hideContent = false;
    // }, 1000);

console.log("FluxController");
    $scope.flux = flux;
    console.log($scope.flux);
    $scope.newAnswer= {};
    $scope.newAnswer.content='';
    $scope.removeContent =function(content){
            fluxsService.removeContent(content).then(function() {

            })
            
    }
    $scope.changestatus = function(status) {
        fluxsService.changeStatusFlux([flux],status)
        
    };
    $scope.linkForum =function(){
            $state.go('/.fluxs.fluxs');
    }
    $scope.back =function(){

        console.log('BACK');
            $state.go('/.fluxs.flux')
    }
    $scope.addContent=function(type) {
        switch(type){
            case 'link':
                $state.go('.addlink');
            break;
            case 'prez':
                $state.go('.addprez');
            break;
            case 'privatearticle':
                $state.go('.addprivatearticle');
            break;
            case 'ingredient':
                $state.go('.addingredient');
            break;
            case 'fichier':
                $state.go('.addfichier');
            break;
        }
    };
    $scope.editContent=function(type,id) {
        switch(type){
            case 'link':
                $state.go('.editlink',{contentid:id});
            break;
            case 'prez':
                $state.go('.editprez',{contentid:id});
            break;
            case 'privatearticle':
                $state.go('.editprivatearticle',{contentid:id});
            break;
        }
    };


    $scope.submitAdd = function() {
        $scope.newAnswer.author=accountService.me.id;
        $scope.newAnswer.flux=flux.id;

        fluxsService.newAnswer($scope.newAnswer).then(function() {
            $scope.newAnswer.content='';
            $('.has-error').removeClass('has-error');
        },function(err) {
            messageCenterService.add('danger', 'Veuillez revoir votre saisie', { status: messageCenterService.status.unseen, timeout: 4000 });
            $('[name="content"]').parent().addClass('has-error');
            
        })
    };
    $scope.removeanswer =function(id){
        console.log('remove' + id);
            fluxsService.removeAnswer(id)
    }

}]);