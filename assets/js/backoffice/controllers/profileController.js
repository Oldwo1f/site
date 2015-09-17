app.controller('profileCtrl',['$scope','$location','$auth','$stateParams','$state','filterFilter','accountService','$filter','myself','messageCenterService',
function profileCtrl($scope,$location,$auth,$stateParams,$state,filterFilter,accountService ,$filter,myself,messageCenterService) {
    
    $scope.myself = myself;
    $scope.resizeStep = $scope.resizeConfig.profilepicture;

    $scope.back = function() {
        if($scope.$parent.$previousState.name)
            $state.go($scope.$parent.$previousState.name)
        else
            $state.go('/.dashboard')
    };

    $scope.submitEdit = function() {
        accountService.updateProfile($scope.myself).then(function() {
            // $('.editModal').modal('hide');
            $('.has-error').removeClass('has-error');
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
    $scope.editpasswordMe = function() {
        accountService.editpasswordMe({
            oldpassword: $scope.oldpassword,
            password: $scope.password,
            comfirmpassword: $scope.comfirmpassword
        }).then(function() {
            // $('.editModal').modal('hide');
            $('.has-error').removeClass('has-error');
            $auth.logout();

        },function(err) {
            
                    $('[name$="password"]').parent().addClass('has-error');
        
        })
    };

    $scope.recupImage = function(data) {
       $scope.myself.images.unshift(data.files)
        // accountService.me.images.unshift(data.files)
    };

    $scope.removeimage = function(imagetoremove) {

        accountService.removeimage($scope.myself,imagetoremove)
    };

}]);