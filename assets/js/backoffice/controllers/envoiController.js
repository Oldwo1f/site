app.controller('envoiCtrl',['$scope','filterFilter','$filter','$state','envois','envoiService','$stateParams',
function envoiCtrl($scope,filterFilter,$filter,$state,envois,envoiService,$stateParams) {

    $scope.Math = window.Math;
    $scope.order='createdAt';
    $scope.reverse=true;
    $scope.envois= envois;

    $scope.linkaddList =function(){
        $state.go('/.newsletters.list.add');
    }
    $scope.linkenvoi =function(){
        $state.go('/.newsletters.envoi.envoiserie');
    }

    $scope.totalChecked = function()
    {
        if(filterFilter($scope.envois,{checked : true}).length == $scope.envois.length)
            $scope.allChecked = true;
        else
            $scope.allChecked = false;
        return filterFilter($scope.envois,{checked : true}).length;
    }
    $scope.toggleAllcheck = function()
    {
        allchecked = !$scope.allChecked;
        $scope.envois.forEach(function(envoi) {
            envoi.checked = allchecked;
        });
    }


    $scope.removeselected =function(){
        envoiService.remove(filterFilter($scope.envois,{checked : true}),function(envois) {
            $scope.envois=envois;
        })

    }

    $scope.envoifilter =function(val){
        var patt = new RegExp($scope.slug,'i');
        
        if(patt.test(val.name))
            return true;
        // if(patt.test(val.category.title))
        //     return true;
        if(patt.test($filter('date')(val.createdAt,'dd MMMM')))
            return true;

        val.checked=false;
        return false;
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

app.controller('envoiserieCtrl',['$scope','$upload','filterFilter','$filter','$state','envoiService','$stateParams','mailingLists',
function envoiserieCtrl($scope,$upload,filterFilter,$filter,$state,envoiService,$stateParams,mailingLists) {


    $('.newModal').modal();
    $('.newModal').on('hidden.bs.modal',function(e) {
        $state.go('/.newsletters.envoi');
    });
    $scope.client={};
    $scope.client.checked=false;
    $scope.newEnvoi={};
    $scope.newEnvoi.content='';
    $scope.pjs=[];$scope.filelist;
    $scope.mailingLists=mailingLists;

    $scope.clickAddPj = function($event) {
        setTimeout(function() {
            $($event.target).find('input').click();
        },0);
    }  
    $scope.removePj = function($index) {
        $scope.pjs={};
        $scope.filelist={};

    }   


    $scope.Envoi=function() {

        $scope.newEnvoi.destinataire=[];
        for(i in $scope.mailingLists)
        {
            if($scope.mailingLists[i].checked === true)
            {
                $scope.newEnvoi.destinataire.push($scope.mailingLists[i].id)
            }
        }
        $scope.newEnvoi.client= $scope.client.checked;

        envoiService.send($scope.newEnvoi,$scope.filelist,function(data){
            $state.go('/.newsletters.envoi');
        })

    };

}]);

