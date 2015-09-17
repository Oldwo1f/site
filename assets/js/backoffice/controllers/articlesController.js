app.controller('articlesCtrl',['$scope','filterFilter','articlesService','$filter','$state','articles','messageCenterService',
function articlesCtrl($scope,filterFilter,articlesService,$filter,$state,articles,messageCenterService) {

	$scope.articles= articles;
	$scope.order='date';
	$scope.reverse=true;
	$scope.filterActif = true;
	$scope.filterInactif = true;
	$scope.filterNew = true;
	$scope.totalChecked = function()
	{
		if(filterFilter($scope.articles,{checked : true}).length == $scope.articles.length)
	 		$scope.allChecked = true;
	 	else
	 		$scope.allChecked = false;
	 	return filterFilter($scope.articles,{checked : true}).length;
	}
	$scope.toggleAllcheck = function()
	{
		allchecked = !$scope.allChecked;
		$scope.articles.forEach(function(article) {
			article.checked = allchecked;
		});
	}
	$scope.linkedit=function(id){
		if(id){
			clearSelection()
			$state.go('/.articles.articles.edit',{id: id})
		}
		else
			$state.go('/.articles.articles.edit',{id: filterFilter($scope.articles,{checked : true})[0].id})
	}
	$scope.linkeditimages =function(id){
		if(id){
			clearSelection()
			$state.go('/.articles.articles.editimage',{id: id})
		}
		else
			$state.go('/.articles.articles.editimage',{id: filterFilter($scope.articles,{checked : true})[0].id})
	}
	$scope.linkadd =function(){
			$state.go('/.articles.articles.add')
	}


	$scope.removeselected =function(){
			articlesService.remove(filterFilter($scope.articles,{checked : true}))
	}
	$scope.changestatus = function(status) {
		articlesService.changeStatusArticle(filterFilter($scope.articles,{checked : true}),status)
		
	};

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
	$scope.articlefilter =function(val){
		var patt = new RegExp($scope.slug,'i');
		
		if(patt.test(val.title))
			return true;
		if(patt.test(val.category.title))
			return true;
		if(patt.test($filter('date')(val.date,'dd MMMM')))
			return true;

		val.checked=false;
		return false;
	}




	
	

}]);

app.controller('addarticlesCtrl',['$scope','$stateParams','filterFilter','articlesService','$state','categories','messageCenterService',
function addarticlesCtrl($scope,$stateParams,filterFilter,articlesService ,$state,categories,messageCenterService) {
	$scope.categories= categories;
	$scope.newArticle={};
	$scope.translation={};
	$scope.translation.description='';
	$scope.translation.content='';
	$scope.translation.shortcontent='';
	$scope.translation.title='';
	$scope.translation.place='';
	$scope.translation.keyword='';
	$scope.translation.accroche='';
	$scope.translation.rewriteurl='';
	$scope.newArticle.date=new Date();
	$('.newModal').modal();
	$('.newModal').on('hidden.bs.modal',function(e) {
		$state.go('/.articles.articles');
	});

	$scope.timeSet = function() {

		$scope.openDatepicker = false;
	};

	$scope.submitNew=function() {
		$scope.newArticle.status='new';
        $scope.newArticle.translationFR = $scope.translation;
		articlesService.addNew($scope.newArticle).then(function() {
			$scope.newArticle.title='';
			$state.go('/.articles.articles');
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
app.controller('editarticlesCtrl',['$scope','$stateParams','filterFilter','articlesService','$state','$filter','article','categories','messageCenterService','configService',
function editarticlesCtrl($scope,$stateParams,filterFilter,articlesService ,$state,$filter,article,categories,messageCenterService,configService) {
	$scope.categories= categories;
	$('.editModal').modal();
	$('.editModal').on('hidden.bs.modal',function(e) {
		$state.go('/.articles.articles');
	});

 	$scope.editArticle = article;
    $scope.lang='fr';
    $scope.languages= configService.languages;
    $scope.currenttranslation = getIndexInBy($scope.editArticle.translations,'lang',$scope.lang)

    $scope.changeLanguage = function() {

        var index = getIndexInBy($scope.editArticle.translations,'lang',$scope.lang)
        if(typeof(index)=='undefined')
        {
           $scope.editArticle.translations.push(
           {
                'lang':$scope.lang,
                'title':'',
                'content':'',
                'shortcontent':'',
                'keyword':'',
                'description':'',
                'rewriteurl':'',
                'place':'',
           });
        }
        $scope.currenttranslation = getIndexInBy($scope.editArticle.translations,'lang',$scope.lang)
    };


	if(typeof($scope.editArticle.category)!="undefined")
	$scope.editArticle.category = $scope.editArticle.category.id;
	$scope.submitEdit = function() {
		articlesService.edit($scope.editArticle).then(function() {
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
app.controller('editimagearticlesCtrl',['$scope','$stateParams','filterFilter','articlesService','$state','$filter','article','messageCenterService',
function editimagearticlesCtrl($scope,$stateParams,filterFilter,articlesService ,$state,$filter,article,messageCenterService) {
	


	$scope.resizeStep = $scope.resizeConfig.article;
	$('.editimageModal').modal();
	$('.editimageModal').on('hidden.bs.modal',function(e) {
		$state.go('/.articles.articles');
	});
	$scope.article = article;
	$scope.submitEdit = function() {
		articlesService.edit(article).then(function() {
			$('.editimageModal').modal('hide');
		})
	};

	$scope.recupImage = function(data) {
		article.images.unshift(data.files)
		articlesService.replace(article)
	};

	$scope.removeimage = function(imagetoremove) {

		articlesService.removeimage(article,imagetoremove)
	};
	$scope.sortableOptions = {
	    update: function(e, ui) {
	     	startIndex = ui.item.sortable.index;
	     	dropIndex = ui.item.sortable.dropindex;
	     	if(dropIndex<startIndex)
	     	{
	     		for(var i in $scope.article.images)
	     		{
	     			
	     			if($scope.article.images[i].index < startIndex && $scope.article.images[i].index >=dropIndex)
	     			{
	     				$scope.article.images[i].index = $scope.article.images[i].index +1;
	     				articlesService.updateImgIndex($scope.article.images[i],$scope.article);
	     			}
	     			else if($scope.article.images[i].index == startIndex )
	     			{
	     				$scope.article.images[i].index = dropIndex;
	     				articlesService.updateImgIndex($scope.article.images[i],$scope.article);
	     			}
	     			
	     		}

	     	}
	     	if(dropIndex>startIndex)
	     	{
	     		for(var i in $scope.article.images)
	     		{
	     			
	     			
	     			if($scope.article.images[i].index >startIndex && $scope.article.images[i].index <=dropIndex)
	     			{
	     				$scope.article.images[i].index = $scope.article.images[i].index -1;
	     				articlesService.updateImgIndex($scope.article.images[i],$scope.article);
	     			}
	     			else if($scope.article.images[i].index == startIndex)
	     			{
	     				$scope.article.images[i].index = dropIndex;
	     				articlesService.updateImgIndex($scope.article.images[i],$scope.article);
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