app.controller('projectsCtrl',['$scope','filterFilter','projectsService','categories','$filter','$state','projects','messageCenterService',
function projectsCtrl($scope,filterFilter,projectsService,categories,$filter,$state,projects,messageCenterService) {

    $scope.projects= projects;
    $scope.categories= categories;
    $scope.order='date';
    $scope.reverse=true;
    $scope.filterActif = true;
    $scope.filterInactif = true;
    $scope.filterNew = true;

    $scope.getCatName =function(cat) {
        return getIndexInBy($scope.categories,'id',cat.id)
    }
    $scope.totalChecked = function()
    {
        if(filterFilter($scope.projects,{checked : true}).length == $scope.projects.length)
            $scope.allChecked = true;
        else
            $scope.allChecked = false;
        return filterFilter($scope.projects,{checked : true}).length;
    }
    $scope.toggleAllcheck = function()
    {
        allchecked = !$scope.allChecked;
        $scope.projects.forEach(function(project) {
            project.checked = allchecked;
        });
    }
    $scope.linkedit=function(id){
        if(id){
            clearSelection()
            $state.go('/.projects.projects.edit',{id: id})
        }
        else
            $state.go('/.projects.projects.edit',{id: filterFilter($scope.projects,{checked : true})[0].id})
    }
    $scope.linkeditimages =function(id){
        if(id){
            clearSelection()
            $state.go('/.projects.projects.editimage',{id: id})
        }
        else
            $state.go('/.projects.projects.editimage',{id: filterFilter($scope.projects,{checked : true})[0].id})
    }
    $scope.linkadd =function(){
            $state.go('/.projects.projects.add');
    }


    $scope.removeselected =function(){
            projectsService.remove(filterFilter($scope.projects,{checked : true}))
    }
    $scope.changestatus = function(status) {
        projectsService.changeStatusProject(filterFilter($scope.projects,{checked : true}),status)
        
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
    $scope.projectfilter =function(val){
        var patt = new RegExp($scope.slug,'i');
        if(patt.test(val.translations[0].title))
            return true;
        if(val.category){
            if(patt.test(val.category.title))
                return true;
        }
        if(patt.test($filter('date')(val.date,'dd MMMM')))
            return true;

        val.checked=false;
        return false;
    }




    
    

}]);

app.controller('addprojectsCtrl',['$scope','$stateParams','filterFilter','projectsService','$state','categories','messageCenterService',
function addprojectsCtrl($scope,$stateParams,filterFilter,projectsService ,$state,categories,messageCenterService) {
    $scope.categories= categories;
    $scope.newProject={};
    $scope.translation={};
    $scope.translation.description='';
    $scope.translation.content='';
    $scope.translation.shortcontent='';
    $scope.translation.title='';
    $scope.translation.keyword='';
    $scope.translation.rewriteurl='';
    $scope.newProject.date=new Date();

    
    $('.newModal').modal();
    $('.newModal').on('hidden.bs.modal',function(e) {
        $state.go('/.projects.projects');
    });

    $scope.timeSet = function() {

        $scope.openDatepicker = false;
    };

    $scope.submitNew=function() {
        $scope.newProject.status='new';
        $scope.newProject.translationFR = $scope.translation;
        projectsService.addNew($scope.newProject).then(function() {
            $scope.newProject.title='';
            $state.go('/.projects.projects');
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
app.controller('editprojectsCtrl',['$scope','$stateParams','filterFilter','configService','projectsService','$state','$filter','project','categories','messageCenterService',
function editprojectsCtrl($scope,$stateParams,filterFilter,configService ,projectsService ,$state,$filter,project,categories,messageCenterService) {
    $scope.categories= categories;
    $('.editModal').modal();
    $('.editModal').on('hidden.bs.modal',function(e) {
        $state.go('/.projects.projects');
    });
    $scope.editProject = project;
    $scope.lang='fr';
    $scope.languages= configService.languages;
    $scope.currenttranslation = getIndexInBy($scope.editProject.translations,'lang',$scope.lang)

    $scope.changeLanguage = function() {

        var index = getIndexInBy($scope.editProject.translations,'lang',$scope.lang)
        if(typeof(index)=='undefined')
        {
           $scope.editProject.translations.push(
           {
                'lang':$scope.lang,
                'title':'',
                'content':'',
                'shortcontent':'',
                'keyword':'',
                'description':'',
                'rewriteurl':'',
           });
        }
        $scope.currenttranslation = getIndexInBy($scope.editProject.translations,'lang',$scope.lang)
    };

    $scope.submitEdit = function() {

        projectsService.edit($scope.editProject).then(function() {
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
app.controller('editimageprojectsCtrl',['$scope','$stateParams','filterFilter','projectsService','$state','$filter','project','messageCenterService',
function editimageprojectsCtrl($scope,$stateParams,filterFilter,projectsService ,$state,$filter,project,messageCenterService) {
    
    $scope.resizeStep = $scope.resizeConfig.project;
    $('.editimageModal').modal();
    $('.editimageModal').on('hidden.bs.modal',function(e) {
        $state.go('/.projects.projects');
    });
    $scope.project = project;
    $scope.submitEdit = function() {
        projectsService.edit(project).then(function() {
            $('.editimageModal').modal('hide');
        })
    };

    $scope.recupImage = function(data) {
        project.images.unshift(data.files)
        projectsService.replace(project)
    };

    $scope.removeimage = function(imagetoremove) {

        projectsService.removeimage(project,imagetoremove)
    };
    $scope.sortableOptions = {
        update: function(e, ui) {
            startIndex = ui.item.sortable.index;
            dropIndex = ui.item.sortable.dropindex;
            if(dropIndex<startIndex)
            {
                for(var i in $scope.project.images)
                {
                    
                    if($scope.project.images[i].index < startIndex && $scope.project.images[i].index >=dropIndex)
                    {
                        $scope.project.images[i].index = $scope.project.images[i].index +1;
                        projectsService.updateImgIndex($scope.project.images[i],$scope.project);
                    }
                    else if($scope.project.images[i].index == startIndex )
                    {
                        $scope.project.images[i].index = dropIndex;
                        projectsService.updateImgIndex($scope.project.images[i],$scope.project);
                    }
                    
                }

            }
            if(dropIndex>startIndex)
            {
                for(var i in $scope.project.images)
                {
                    
                    
                    if($scope.project.images[i].index >startIndex && $scope.project.images[i].index <=dropIndex)
                    {
                        $scope.project.images[i].index = $scope.project.images[i].index -1;
                        projectsService.updateImgIndex($scope.project.images[i],$scope.project);
                    }
                    else if($scope.project.images[i].index == startIndex)
                    {
                        $scope.project.images[i].index = dropIndex;
                        projectsService.updateImgIndex($scope.project.images[i],$scope.project);
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