app.controller('projectscategoryCtrl',['$scope','filterFilter','projectscategoryService','$filter','$state','categories','messageCenterService',
function projectscategoryCtrl($scope,filterFilter,projectscategoryService,$filter,$state,categories,messageCenterService) {
	$scope.categories= categories;
	$scope.order='title';
	$scope.reverse=false;
	$scope.totalChecked = function()
	{
		if(filterFilter($scope.categories,{checked : true}).length == $scope.categories.length)
	 		$scope.allChecked = true;
	 	else
	 		$scope.allChecked = false;
	 	return filterFilter($scope.categories,{checked : true}).length;
	}
	$scope.toggleAllcheck = function()
	{
		allchecked = !$scope.allChecked;
		$scope.categories.forEach(function(category) {
			category.checked = allchecked;
		});
	}
	$scope.linkedit=function(id){
		if(id){
			clearSelection()
			$state.go('/.projects.category.edit',{id: id})
		}
		else
			$state.go('/.projects.category.edit',{id: filterFilter($scope.categories,{checked : true})[0].id})
	}
	$scope.linkeditimages =function(id){
		if(id){
			clearSelection()
			$state.go('/.projects.category.editimage',{id: id})
		}
		else
			$state.go('/.projects.category.editimage',{id: filterFilter($scope.categories,{checked : true})[0].id})
	}
	$scope.linkadd =function(){
			$state.go('/.projects.category.add')
	}


	$scope.removeselected =function(){
			projectscategoryService.remove(filterFilter($scope.categories,{checked : true}))
	}



	
	

}]);

app.controller('addprojectscategoryCtrl',['$scope','$stateParams','filterFilter','projectscategoryService','$state','messageCenterService',
function addprojectscategoryCtrl($scope,$stateParams,filterFilter,projectscategoryService ,$state,messageCenterService) {
	$('.newModal').modal();
	$('.newModal').on('hidden.bs.modal',function(e) {
		$state.go('/.projects.category');
	});

	$scope.submitNew=function() {
		projectscategoryService.addNew($scope.newCategory).then(function() {
			$scope.newCategory.title='';
			$state.go('/.projects.category');
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
app.controller('editprojectscategoryCtrl',['$scope','$stateParams','configService','filterFilter','projectscategoryService','$state','$filter','category','messageCenterService',
function editprojectscategoryCtrl($scope,$stateParams,configService,filterFilter,projectscategoryService ,$state,$filter,category,messageCenterService) {

	$('.editModal').modal();
	$('.editModal').on('hidden.bs.modal',function(e) {
		$state.go('/.projects.category');
	});
	$scope.category = category;

    $scope.lang='fr';
    $scope.languages= configService.languages;

    $scope.currenttranslation = getIndexInBy($scope.category.translations,'lang',$scope.lang)


    $scope.changeLanguage = function() {

        var index = getIndexInBy($scope.category.translations,'lang',$scope.lang)
        if(typeof(index)=='undefined')
        {
           $scope.category.translations.push(
           {
                'lang':$scope.lang,
                'title':'',
           });
        }
        $scope.currenttranslation = getIndexInBy($scope.category.translations,'lang',$scope.lang)
    };


	$scope.submitEdit = function() {
		projectscategoryService.edit(category).then(function() {
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
app.controller('editimageprojectscategoryCtrl',['$scope','$stateParams','filterFilter','projectscategoryService','$state','$filter','category',
function editimageprojectscategoryCtrl($scope,$stateParams,filterFilter,projectscategoryService ,$state,$filter,category) {
	
	$scope.resizeStep = $scope.resizeConfig.projectCategory;
	$('.editimageModal').modal();
	$('.editimageModal').on('hidden.bs.modal',function(e) {
		$state.go('/.projects.category');
	});
	$scope.category = category;
	$scope.submitEdit = function() {
		projectscategoryService.edit(category).then(function() {
			$('.editimageModal').modal('hide');
		})
	};

	$scope.recupImage = function(data) {
		category.images.unshift(data.files)
		projectscategoryService.replace(category)
	};

	$scope.removeimage = function(imagetoremove) {

		projectscategoryService.removeimage(category,imagetoremove)
	};
	$scope.sortableOptions = {
	    update: function(e, ui) {
	     	startIndex = ui.item.sortable.index;
	     	dropIndex = ui.item.sortable.dropindex;
	     	if(dropIndex<startIndex)
	     	{
	     		for(var i in $scope.category.images)
	     		{
	     			
	     			if($scope.category.images[i].index < startIndex && $scope.category.images[i].index >=dropIndex)
	     			{
	     				$scope.category.images[i].index = $scope.category.images[i].index +1;
	     				projectscategoryService.updateImgIndex($scope.category.images[i],$scope.category);
	     			}
	     			else if($scope.category.images[i].index == startIndex )
	     			{
	     				$scope.category.images[i].index = dropIndex;
	     				projectscategoryService.updateImgIndex($scope.category.images[i],$scope.category);
	     			}
	     			
	     		}

	     	}
	     	if(dropIndex>startIndex)
	     	{
	     		for(var i in $scope.category.images)
	     		{
	     			
	     			
	     			if($scope.category.images[i].index >startIndex && $scope.category.images[i].index <=dropIndex)
	     			{
	     				$scope.category.images[i].index = $scope.category.images[i].index -1;
	     				projectscategoryService.updateImgIndex($scope.category.images[i],$scope.category);
	     			}
	     			else if($scope.category.images[i].index == startIndex)
	     			{
	     				$scope.category.images[i].index = dropIndex;
	     				projectscategoryService.updateImgIndex($scope.category.images[i],$scope.category);
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