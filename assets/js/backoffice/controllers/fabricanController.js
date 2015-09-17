app.controller('fabricansCtrl',['$scope','filterFilter','fabricansService','fabricans','$filter','$state','fabricans','messageCenterService',
function fabricansCtrl($scope,filterFilter,fabricansService,fabricans,$filter,$state,fabricans,messageCenterService) {

    $scope.fabricans= fabricans;
    $scope.order='name';
    $scope.reverse=false;
    $scope.filterActif = true;
    $scope.filterInactif = true;
    $scope.filterNew = true;

    // $scope.getCatName =function(cat) {
    //     return getIndexInBy($scope.categories,'id',cat.id)
    // }
    $scope.totalChecked = function()
    {
        if(filterFilter($scope.fabricans,{checked : true}).length == $scope.fabricans.length)
            $scope.allChecked = true;
        else
            $scope.allChecked = false;
        return filterFilter($scope.fabricans,{checked : true}).length;
    }
    $scope.toggleAllcheck = function()
    {
        allchecked = !$scope.allChecked;
        $scope.fabricans.forEach(function(project) {
            project.checked = allchecked;
        });
    }
    $scope.linkedit=function(id){
        if(id){
            clearSelection()
            $state.go('/.food.fabricans.edit',{id: id})
        }
        else
            $state.go('/.food.fabricans.edit',{id: filterFilter($scope.fabricans,{checked : true})[0].id})
    }
    // $scope.linkeditimages =function(id){
    //     if(id){
    //         clearSelection()
    //         $state.go('/.fabricans.fabricans.editimage',{id: id})
    //     }
    //     else
    //         $state.go('/.fabricans.fabricans.editimage',{id: filterFilter($scope.fabricans,{checked : true})[0].id})
    // }
    $scope.linkadd =function(){
            $state.go('/.food.fabricans.add');
    }


    $scope.removeselected =function(){
            fabricansService.remove(filterFilter($scope.fabricans,{checked : true}))
    }
    $scope.changestatus = function(status) {
        fabricansService.changeStatusFabrican(filterFilter($scope.fabricans,{checked : true}),status)
        
    };

    $scope.sortFunction =function(val){

        if($scope.order === 'category')
        {
            if( typeof(val['category']) !='undefined')
                return val['category'].translations[0].title;
        }else
        {
            return val[$scope.order];
        }
    }
    // $scope.getCat =function(val){
    //     if(!$scope.filterActif)
    //     {
    //         if(val.status ==='actif'){
    //             val.checked=false;
    //             return false;
    //         }
    //     }
    //     if(!$scope.filterInactif)
    //     {
    //         if(val.status ==='inactif'){
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
    $scope.fabricanfilter =function(val){
        var patt = new RegExp($scope.slug,'i');
        if(patt.test(val.name))
            return true;
        if(patt.test(val.email))
            return true;
        if(patt.test(val.country))
            return true;
        
        

        val.checked=false;
        return false;
    }




    
    

}]);

app.controller('addfabricansCtrl',['$scope','$stateParams','filterFilter','fabricansService','$state','messageCenterService',
function addfabricansCtrl($scope,$stateParams,filterFilter,fabricansService ,$state,messageCenterService) {
    // $scope.categories= categories;
    $scope.newFabrican={};
    $scope.newFabrican.country='';
    $scope.newFabrican.phone='';
    $scope.newFabrican.fax='';
    $scope.newFabrican.adress='';
    $scope.newFabrican.email='';
    $scope.newFabrican.name='';

    
    $('.newModal').modal();
    $('.newModal').on('hidden.bs.modal',function(e) {
        $state.go('/.food.fabricans');
    });

    // $scope.timeSet = function() {

    //     $scope.openDatepicker = false;
    // };

    $scope.submitNew=function() {
        console.log(this);
        // $scope.newFabrican.status='new';
        // $scope.newFabrican.translationFR = $scope.translation;
        fabricansService.addNew($scope.newFabrican).then(function() {
            // console.log(finish);
            // $scope.newFabrican.title='';
            $state.go('/.food.fabricans');
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
app.controller('editfabricansCtrl',['$scope','$stateParams','filterFilter','configService','fabricansService','$state','$filter','fabrican','messageCenterService',
function editfabricansCtrl($scope,$stateParams,filterFilter,configService ,fabricansService ,$state,$filter,fabrican,messageCenterService) {
    $('.editModal').modal();
    $('.editModal').on('hidden.bs.modal',function(e) {
        $state.go('/.food.fabricans');
    });
    $scope.editFabrican = fabrican;
   // console.log('totooto');
    $scope.submitEdit = function() {

        fabricansService.edit($scope.editFabrican).then(function() {
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