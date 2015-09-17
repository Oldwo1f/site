app.controller('ingredientsCtrl',['$scope','filterFilter','ingredientsService','ingredients','$filter','$state','ingredients','messageCenterService',
function ingredientsCtrl($scope,filterFilter,ingredientsService,ingredients,$filter,$state,ingredients,messageCenterService) {

    $scope.ingredients= ingredients;
    $scope.order='date';
    $scope.reverse=true;
    $scope.filterActif = true;
    $scope.filterInactif = true;
    $scope.filterNew = true;

    // $scope.getCatName =function(cat) {
    //     return getIndexInBy($scope.categories,'id',cat.id)
    // }
    $scope.totalChecked = function()
    {
        if(filterFilter($scope.ingredients,{checked : true}).length == $scope.ingredients.length)
            $scope.allChecked = true;
        else
            $scope.allChecked = false;
        return filterFilter($scope.ingredients,{checked : true}).length;
    }
    $scope.toggleAllcheck = function()
    {
        allchecked = !$scope.allChecked;
        $scope.ingredients.forEach(function(ingredient) {
            ingredient.checked = allchecked;
        });
    }
    $scope.linkedit=function(id){
        if(id){
            clearSelection()
            $state.go('/.food.ingredients.edit',{id: id})
        }
        else
            $state.go('/.food.ingredients.edit',{id: filterFilter($scope.ingredients,{checked : true})[0].id})
    }
    $scope.linkeditimages =function(id){
        if(id){
            clearSelection()
            $state.go('/.food.ingredients.editimage',{id: id})
        }
        else
            $state.go('/.food.ingredients.editimage',{id: filterFilter($scope.ingredients,{checked : true})[0].id})
    }
    $scope.linkadd =function(){
            $state.go('/.food.ingredients.add');
    }


    $scope.removeselected =function(){
            ingredientsService.remove(filterFilter($scope.ingredients,{checked : true}))
    }
    $scope.changestatus = function(status) {
        ingredientsService.changeStatusProject(filterFilter($scope.ingredients,{checked : true}),status)
        
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
    $scope.ingredientfilter =function(val){
        var patt = new RegExp($scope.slug,'i');
        if(patt.test(val.name))
            return true;
        if(patt.test(val.keyword))
            return true;
        if(val.fabrican){
            if(patt.test(val.fabrican.name))
                return true;
        }
        if(patt.test($filter('date')(val.date,'MMMM yy')))
            return true;

        val.checked=false;
        return false;
    }




    
    

}]);

app.controller('addingredientsCtrl',['$scope','$stateParams','filterFilter','ingredientsService','fabricans','$state','messageCenterService',
function addingredientsCtrl($scope,$stateParams,filterFilter,ingredientsService,fabricans,$state,messageCenterService) {
    // $scope.categories= categories;
    $scope.newIngredient={};
    $scope.fabricans = fabricans

    $scope.newIngredient.date=new Date();;
    $scope.newIngredient.description='';
    $scope.newIngredient.composition='';
    $scope.newIngredient.keyword='';
    
    $('.newModal').modal();
    $('.newModal').on('hidden.bs.modal',function(e) {
        $state.go('/.food.ingredients');
    });

    $scope.timeSet = function() {

        $scope.openDatepicker = false;
    };

    $scope.submitNew=function() {
        // $scope.newProject.status='new';
        // $scope.newIngredient.translationFR = $scope.translation;
        ingredientsService.addNew($scope.newIngredient).then(function() {
            $scope.newIngredient.title='';
            $state.go('/.food.ingredients');
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
app.controller('editingredientsCtrl',['$scope','$stateParams','filterFilter','configService','ingredientsService','$state','$filter','ingredient','fabricans','messageCenterService',
function editingredientsCtrl($scope,$stateParams,filterFilter,configService ,ingredientsService ,$state,$filter,ingredient,fabricans,messageCenterService) {
    $scope.fabricans= fabricans;
    $scope.editIngredient= ingredient;
    $('.editModal').modal();
    console.log('here');
    $('.editModal').on('hidden.bs.modal',function(e) {
        $state.go('/.food.ingredients');
    });
    

    $scope.submitEdit = function() {

        ingredientsService.edit($scope.editIngredient).then(function() {
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
app.controller('editimageingredientsCtrl',['$scope','$stateParams','filterFilter','ingredientsService','$state','$filter','ingredient','messageCenterService',
function editimageingredientsCtrl($scope,$stateParams,filterFilter,ingredientsService ,$state,$filter,ingredient,messageCenterService) {
    
    $scope.resizeStep = $scope.resizeConfig.ingredient;
    $('.editimageModal').modal();
    $('.editimageModal').on('hidden.bs.modal',function(e) {
        $state.go('/.food.ingredients');
    });
    $scope.ingredient = ingredient;
    $scope.submitEdit = function() {
        ingredientsService.edit(ingredient).then(function() {
            $('.editimageModal').modal('hide');
        })
    };

    $scope.recupImage = function(data) {
        ingredient.images.unshift(data.files)
        ingredientsService.replace(ingredient)
    };

    $scope.removeimage = function(imagetoremove) {

        ingredientsService.removeimage(ingredient,imagetoremove)
    };
    $scope.sortableOptions = {
        update: function(e, ui) {
            startIndex = ui.item.sortable.index;
            dropIndex = ui.item.sortable.dropindex;
            if(dropIndex<startIndex)
            {
                for(var i in $scope.ingredient.images)
                {
                    
                    if($scope.ingredient.images[i].index < startIndex && $scope.ingredient.images[i].index >=dropIndex)
                    {
                        $scope.ingredient.images[i].index = $scope.ingredient.images[i].index +1;
                        ingredientsService.updateImgIndex($scope.ingredient.images[i],$scope.ingredient);
                    }
                    else if($scope.ingredient.images[i].index == startIndex )
                    {
                        $scope.ingredient.images[i].index = dropIndex;
                        ingredientsService.updateImgIndex($scope.ingredient.images[i],$scope.ingredient);
                    }
                    
                }

            }
            if(dropIndex>startIndex)
            {
                for(var i in $scope.ingredient.images)
                {
                    
                    
                    if($scope.ingredient.images[i].index >startIndex && $scope.ingredient.images[i].index <=dropIndex)
                    {
                        $scope.ingredient.images[i].index = $scope.ingredient.images[i].index -1;
                        ingredientsService.updateImgIndex($scope.ingredient.images[i],$scope.ingredient);
                    }
                    else if($scope.ingredient.images[i].index == startIndex)
                    {
                        $scope.ingredient.images[i].index = dropIndex;
                        ingredientsService.updateImgIndex($scope.ingredient.images[i],$scope.ingredient);
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