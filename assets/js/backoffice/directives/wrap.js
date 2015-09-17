app.directive('wrap', function() {
    return {

      restrict: 'E',
      replace:true,
      transclude:true,
      scope: {title:'=mytitle'},
      template:'<div><div class="wraptitle" ng-click="show = !show"><span ng-hide="show">Afficher</span><span ng-show="show">Masquer</span> {{ title }} ' +
      '<span ng-show="show" class="caret"></span></div>'+
      '<div ng-transclude ng-show="show"></div>' +
      '</div>',
      controller:function($scope) {
          $scope.show = false;
      }
      

    };
  });