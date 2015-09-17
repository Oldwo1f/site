app.controller('topicsCtrl',['$scope','filterFilter','topicsService','$filter','$state','topics','messageCenterService',
function topicsCtrl($scope,filterFilter,topicsService,$filter,$state,topics,messageCenterService) {

    $scope.topics= topics;
    $scope.order='createdAt';
    $scope.reverse=true;
    $scope.filterActif = true;
    $scope.filterInactif = true;
    $scope.filterNew = true;

    // $scope.getCatName =function(cat) {
    //     return getIndexInBy($scope.categories,'id',cat.id)
    // }
    $scope.totalChecked = function()
    {
        if(filterFilter($scope.topics,{checked : true}).length == $scope.topics.length)
            $scope.allChecked = true;
        else
            $scope.allChecked = false;
        return filterFilter($scope.topics,{checked : true}).length;
    }
    $scope.toggleAllcheck = function()
    {
        allchecked = !$scope.allChecked;
        $scope.topics.forEach(function(topic) {
            topic.checked = allchecked;
        });
    }
    $scope.linkedit=function(id){
        if(id){
            clearSelection()
            $state.go('/.forum.topics.edit',{id: id})
        }
        else
            $state.go('/.forum.topics.edit',{id: filterFilter($scope.topics,{checked : true})[0].id})
    }
    $scope.linkTopic=function(id){
        if(id){
            clearSelection()
            $state.go('/.forum.topic',{id: id})
        }
        else
            $state.go('/.forum.topic',{id: filterFilter($scope.topics,{checked : true})[0].id})
    }
    $scope.linkadd =function(){
            $state.go('/.forum.topics.add');
    }
    $scope.removeselected =function(){
            topicsService.remove(filterFilter($scope.topics,{checked : true}))
    }
    $scope.changestatus = function(status) {
        topicsService.changeStatusTopic(filterFilter($scope.topics,{checked : true}),status)
        
    };

    $scope.sortFunction =function(val){

        if($scope.order === 'author')
        {
            if( typeof(val['owner']) !='undefined'){
                if(typeof(val['owner'].name))
                    return val['owner'].name;
                else
                    return val['owner'].email
            }
        }else
        {
            return val[$scope.order];
        }
    }
    $scope.getCat =function(val){
        if(!$scope.filterActif)
        {
            if(val.status ==='résolu'){
                val.checked=false;
                return false;
            }
        }
        if(!$scope.filterInactif)
        {
            if(val.status ==='en discussion'){
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
    $scope.topicfilter =function(val){
        var patt = new RegExp($scope.slug,'i');
        if(patt.test(val.title))
            return true;
        if(patt.test(val.keyword))
                return true;
        if( typeof(val['owner']) !='undefined'){
            if(typeof(val['owner'].name))
                if(patt.test(val.owner.name))
                return true;
            if(typeof(val['owner'].name))
                if(patt.test(val.owner.email))
                    return true;
        }
        if(patt.test($filter('date')(val.createdAt,'dd MMMM')))
            return true;

        val.checked=false;
        return false;
    }




    
    

}]);
app.filter('bytes', function() {
   return function(bytes, precision) {
   if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
   if (typeof precision === 'undefined') precision = 1;
   var units = ['octets', 'Ko', 'Mo', 'Go', 'To', 'Po'],
   number = Math.floor(Math.log(bytes) / Math.log(1024));
   return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
}
});
app.controller('topicCtrl',['$scope','$stateParams','filterFilter','configService','topicsService','$state','$filter','topic','messageCenterService','accountService',
    function topicCtrl($scope,$stateParams,filterFilter,configService ,topicsService ,$state,$filter,topic,messageCenterService,accountService) {
    // $('.editModal').modal();
    // $('.editModal').on('hidden.bs.modal',function(e) {
    //     $state.go('/.forum.topics');
    // });
    $scope.topic = topic;
    console.log(topic);
    $scope.newAnswer= {};
    $scope.newAnswer.content='';
   console.log('topic CTRL');
   console.log(topic.content);
topic.content=String(topic.content)
    $scope.removeselected =function(){
            topicsService.removeOne(topic).then(function() {$state.go('/.forum.topics');})
            
    }
    $scope.changestatus = function(status) {
        console.log(topic);
        topicsService.changeStatusTopic([topic],status)
        
    };
    $scope.linkForum =function(){
            $state.go('/.forum.topics');
    }



    $scope.submitAdd = function() {
        $scope.newAnswer.author=accountService.me.id;
        $scope.newAnswer.topic=topic.id;

        topicsService.newAnswer($scope.newAnswer).then(function() {
            $scope.newAnswer.content='';
            $('.has-error').removeClass('has-error');
        },function(err) {
            messageCenterService.add('danger', 'Veuillez revoir votre saisie', { status: messageCenterService.status.unseen, timeout: 4000 });
            $('[name="content"]').parent().addClass('has-error');
            
        })
    };
    $scope.removeanswer =function(id){
        console.log('remove' + id);
            topicsService.removeAnswer(id)
    }

}]);

app.controller('addtopicsCtrl',['$scope','accountService','$stateParams','filterFilter','topicsService','$state','messageCenterService',
function addtopicsCtrl($scope,accountService,$stateParams,filterFilter,topicsService ,$state,messageCenterService) {
    $scope.newTopic={};
    $scope.newTopic.content='';
    $scope.newTopic.keyword='';
    $scope.newTopic.title='';

    
    $('.newModal').modal();
    $('.newModal').on('hidden.bs.modal',function(e) {
        $state.go('/.forum.topics');
    });

    // $scope.timeSet = function() {

    //     $scope.openDatepicker = false;
    // };

    $scope.submitNew=function() {

        console.log('SUBMIT');
        $scope.newTopic.status='new';
        $scope.newTopic.owner=accountService.me.id;
        topicsService.addNew($scope.newTopic,accountService.me.id).then(function() {
            $scope.newTopic.title='';
            $state.go('/.forum.topics');
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