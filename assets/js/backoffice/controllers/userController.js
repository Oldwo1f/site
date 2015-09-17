app.controller('usersCtrl',['$scope','filterFilter','userService','$filter','$state','users','messageCenterService',
function usersCtrl($scope,filterFilter,userService,$filter,$state,users,messageCenterService) {

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
            $state.go('/.users.user.edit',{id: id})
        }
        else
            $state.go('/.users.user.edit',{id: filterFilter($scope.users,{checked : true})[0].id})
    }
   
    $scope.linkadd =function(){
            $state.go('/.users.user.add');
    }
    $scope.removeselected =function(){
            userService.remove(filterFilter($scope.users,{checked : true}))
    }
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

app.controller('adduserCtrl',['$scope','$stateParams','filterFilter','userService','$state','messageCenterService',
function adduserCtrl($scope,$stateParams,filterFilter,userService ,$state,messageCenterService) {
    $scope.newUser={};
    
    $scope.newUser.email='';
    
    $('.newModal').modal();
    $('.newModal').on('hidden.bs.modal',function(e) {
        $state.go('/.users.user');
    });

    $scope.timeSet = function() {

        $scope.openDatepicker = false;
    };

    $scope.submitNew=function() {
        $scope.newUser.status='new';
        userService.addNew($scope.newUser).then(function() {
            $scope.newUser.email='';
            $state.go('/.users.user');
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
app.controller('edituserCtrl',['$scope','$stateParams','filterFilter','userService','$state','$filter','user','messageCenterService',
function edituserCtrl($scope,$stateParams,filterFilter,userService ,$state,$filter,user,messageCenterService) {
    $('.editModal').modal();
    $('.editModal').on('hidden.bs.modal',function(e) {
        $state.go('/.users.user');
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
app.controller('editimageuserCtrl',['$scope','$stateParams','filterFilter','userService','$state','$filter','user',
function editimageuserCtrl($scope,$stateParams,filterFilter,userService ,$state,$filter,user) {
    
    $scope.resizeStep = $scope.resizeConfig.user;
    $('.editimageModal').modal();
    $('.editimageModal').on('hidden.bs.modal',function(e) {
        $state.go('/.users.users');
    });
    $scope.user = user;
    $scope.submitEdit = function() {
        userService.edit(user).then(function() {
            $('.editimageModal').modal('hide');
        })
    };

    $scope.recupImage = function(data) {
        user.images.unshift(data.files)
        userService.replace(user)
    };

    $scope.removeimage = function(imagetoremove) {

        userService.removeimage(user,imagetoremove)
    };
    $scope.sortableOptions = {
        update: function(e, ui) {
            startIndex = ui.item.sortable.index;
            dropIndex = ui.item.sortable.dropindex;
            if(dropIndex<startIndex)
            {
                for(var i in $scope.user.images)
                {
                    
                    if($scope.user.images[i].index < startIndex && $scope.user.images[i].index >=dropIndex)
                    {
                        $scope.user.images[i].index = $scope.user.images[i].index +1;
                        userService.updateImgIndex($scope.user.images[i],$scope.user);
                    }
                    else if($scope.user.images[i].index == startIndex )
                    {
                        $scope.user.images[i].index = dropIndex;
                        userService.updateImgIndex($scope.user.images[i],$scope.user);
                    }
                    
                }

            }
            if(dropIndex>startIndex)
            {
                for(var i in $scope.user.images)
                {
                    
                    
                    if($scope.user.images[i].index >startIndex && $scope.user.images[i].index <=dropIndex)
                    {
                        $scope.user.images[i].index = $scope.user.images[i].index -1;
                        userService.updateImgIndex($scope.user.images[i],$scope.user);
                    }
                    else if($scope.user.images[i].index == startIndex)
                    {
                        $scope.user.images[i].index = dropIndex;
                        userService.updateImgIndex($scope.user.images[i],$scope.user);
                    }
                    
                }

            }
            

        },
        sort:function() {
        },
        out:function() {
        },
        start:function(e,ui) {
        }
    };


}]);