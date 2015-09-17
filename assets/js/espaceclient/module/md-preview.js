(function() {
  'use strict';

  angular.module('markdownpreview', [])

  .controller('Ctrl', ['$scope', '$window', '$http', '$sce',
    function($scope, $window, $http, $sce) {
      $scope.md2Html = function() {
        $scope.html = $window.marked($scope.model);
        $scope.htmlSafe = $sce.trustAsHtml($scope.html);
      };

      $scope.initFromUrl = function(url) {
        $http.get(url).success(function(data) {
          $scope.model = data;
          return $scope.md2Html();
        });
      };

      $scope.initFromText = function(text) {
        $scope.model = text;
        $scope.md2Html();
      };
      $scope.enterPreview = function() {
        
        $scope.md2Html();
      };
      $scope.toogleCheat = function() {
          $scope.cheatVisible = !$scope.cheatVisible;
      };
    }
  ])

  .directive('markdownpreview', function() {
    return {
      template:'<div class="form-group col-xs-12" >'+
      '<div class="markdaownheader">'+
      '<li ng-click="previewmode = true" ng-hide="previewmode" title="Preview" class="glyphicon glyphicon-eye-open"></li>'+
      '<li ng-click="previewmode = false" ng-show="previewmode" title="Preview" class="glyphicon glyphicon-eye-close"></li>'+
      '<li title="CheatSheets" ng-click="toogleCheat()" class="glyphicon glyphicon-pushpin"></li>'+
      '<li title="Le markdown pourquoi et comment" class="glyphicon glyphicon-question-sign"></li>'+
      '</ul></div>'+
      '<div class="cheatsheets" name="{{handleerror}}" ng-class="{\'visible\' :cheatVisible}" ng-include="\'/templates/front/mdcheatsheets.html\'" ></div>'+
      '<span class="placeholderabsolute" ng-hide="model" >{{placehold}}</span> <textarea ng-hide="previewmode" class="form-control input-lg" style="min-height:{{height}}px" ng-change="md2Html()" ng-model="model" ></textarea>'+
      ' <div class="MdPreview-html form-control input-lg" ng-show="previewmode" style="min-height:{{height}}px" ng-bind-html="htmlSafe" /></div>',
      restrict: 'E',
      replace: true,
      controller: 'Ctrl',
      scope: {placehold:'=placehold',handleerror :'=handleerror',height:'=minheight',model:'=ngModel'},
      link: function(scope, element, attrs) {
        scope.md2Html();
        scope.previewmode = false; 
        scope.cheatVisible = false
        if (attrs.url) {
          scope.initFromUrl(attrs.url);
        }
        if (attrs.text) {
          scope.initFromText(attrs.text);
        }
        // scope.model = attrs.model;
      }
    };
  });

}).call(this);
