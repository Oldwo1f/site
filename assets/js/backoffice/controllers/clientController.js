app.controller('clientCtrl',['$scope','filterFilter','userService','$filter','$state','users','messageCenterService',
function clientCtrl($scope,filterFilter,userService,$filter,$state,users,messageCenterService) {

    $scope.users= users;
    $scope.order='date';
    $scope.reverse=true;
    $scope.filterActif = true;
    $scope.filterInactif = true;
    $scope.filterNew = true;
    $scope.totalChecked = function()
    {
        if(filterFilter($scope.users,{checked : true}).length == $scope.users.length)
            $scope.allChecked = true;
        else
            $scope.allChecked = false;
        return filterFilter($scope.users,{checked : true}).length;
    }
    $scope.toggleAllcheck = function()
    {
        allchecked = !$scope.allChecked;
        $scope.users.forEach(function(user) {
            user.checked = allchecked;
        });
    }
    $scope.linkedit=function(id){
        if(id){
            clearSelection()
            $state.go('/.users.client.edit',{id: id})
        }
        else
            $state.go('/.users.client.edit',{id: filterFilter($scope.users,{checked : true})[0].id})
    }
    // $scope.linkeditimages =function(id){
    //     if(id){
    //         clearSelection()
    //         $state.go('/.users.users.editimage',{id: id})
    //     }
    //     else
    //         $state.go('/.users.users.editimage',{id: filterFilter($scope.users,{checked : true})[0].id})
    // }
    $scope.linkadd =function(){
            $state.go('/.users.client.add');
    }


    $scope.removeselected =function(){
            userService.remove(filterFilter($scope.users,{checked : true}))
    }
    // $scope.changestatus = function(status) {
    //     userService.changeStatusUser(filterFilter($scope.users,{checked : true}),status)
        
    // };

    $scope.sortFunction =function(val){

        if($scope.order === 'category')
        {
            return val[$scope.order].title;
        }else
        {
            return val[$scope.order];
        }
    }
    $scope.getCat =function(val){
        if(!$scope.filterActif)
        {
            if(val.status ==='actif'){
                val.checked=false;
                return false;
            }
        }
        if(!$scope.filterInactif)
        {
            if(val.status ==='inactif'){
                val.checked=false;
                return false;
            }
        }
        if(!$scope.filterNew)
        {
            if(val.status ==='new'){
                val.checked=false;
                return false;
            }
        }
        return true;
    }
    $scope.userfilter =function(val){
        var patt = new RegExp($scope.slug,'i');
        
        if(patt.test(val.email))
            return true;
        if(patt.test(val.name))
            return true;
        if(patt.test($filter('date')(val.createdAt,'dd MMMM')))
            return true;

        val.checked=false;
        return false;
    }




    
    

}]);

app.controller('addclientCtrl',['$scope','$stateParams','filterFilter','userService','$state','messageCenterService',
function addclientCtrl($scope,$stateParams,filterFilter,userService ,$state,messageCenterService) {
    $scope.newUser={};
    
    $scope.newUser.email='';
    
    $('.newModal').modal();
    $('.newModal').on('hidden.bs.modal',function(e) {
        $state.go('/.users.client');
    });

    $scope.timeSet = function() {

        $scope.openDatepicker = false;
    };

    $scope.submitNew=function() {
        $scope.newUser.status='new';
        userService.addClient($scope.newUser).then(function() {
            $scope.newUser.email='';
            $state.go('/.users.client');
        },function(err) {
            if(err.error.invalidAttributes)
            {
                invalAttrs = err.error.invalidAttributes;
                for(var i in invalAttrs)
                {
                    $('[name="'+i+'"]').parent().addClass('has-error');
                }
            }
        })
        
    };
}]);
app.controller('editclientCtrl',['$scope','$stateParams','filterFilter','userService','$state','$filter','user','messageCenterService',
function editclientCtrl($scope,$stateParams,filterFilter,userService ,$state,$filter,user,messageCenterService) {
    $('.editModal').modal();
    $('.editModal').on('hidden.bs.modal',function(e) {
        $state.go('/.users.client');
    });
    $scope.editUser = user;
    $scope.submitEdit = function() {
        userService.edit($scope.editUser).then(function() {
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