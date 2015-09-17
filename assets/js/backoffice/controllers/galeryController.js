app.controller('galeryCtrl',['$scope','$stateParams','filterFilter','galeryService','$state','$filter','galery',
function galeryCtrl($scope,$stateParams,filterFilter,galeryService ,$state,$filter,galery) {
	console.log('galerycontroller');
	$scope.resizeStep = $scope.resizeConfig.homeGalery;
	$scope.galery = galery;
	$scope.submitEdit = function() {
		galeryService.edit(galery).then(function() {
			$('.editimageModal').modal('hide');
		})
	};

	$scope.recupImage = function(data) {
		galery.images.unshift(data.files)
		galeryService.replace(galery)
	};

	$scope.removeimage = function(imagetoremove) {

		galeryService.removeimage(galery,imagetoremove)
	};
	$scope.sortableOptions = {
	    update: function(e, ui) {
	     	startIndex = ui.item.sortable.index;
	     	dropIndex = ui.item.sortable.dropindex;
	     	if(dropIndex<startIndex)
	     	{
	     		for(var i in $scope.galery.images)
	     		{
	     			
	     			if($scope.galery.images[i].index < startIndex && $scope.galery.images[i].index >=dropIndex)
	     			{
	     				$scope.galery.images[i].index = $scope.galery.images[i].index +1;
	     				galeryService.updateImgIndex($scope.galery.images[i],$scope.galery);
	     			}
	     			else if($scope.galery.images[i].index == startIndex )
	     			{
	     				$scope.galery.images[i].index = dropIndex;
	     				galeryService.updateImgIndex($scope.galery.images[i],$scope.galery);
	     			}
	     			
	     		}

	     	}
	     	if(dropIndex>startIndex)
	     	{
	     		for(var i in $scope.galery.images)
	     		{
	     			
	     			
	     			if($scope.galery.images[i].index >startIndex && $scope.galery.images[i].index <=dropIndex)
	     			{
	     				$scope.galery.images[i].index = $scope.galery.images[i].index -1;
	     				galeryService.updateImgIndex($scope.galery.images[i],$scope.galery);
	     			}
	     			else if($scope.galery.images[i].index == startIndex)
	     			{
	     				$scope.galery.images[i].index = dropIndex;
	     				galeryService.updateImgIndex($scope.galery.images[i],$scope.galery);
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