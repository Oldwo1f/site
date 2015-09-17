'use strict';

var csvImport = angular.module('Csv', []);

csvImport.directive('csv', function() {
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		scope:{
			content:'=',
			header: '=',
			headerVisible: '=',
			separator: '=',
			result: '='
		},
		template: '<div class="btn-info btn-xs btn">'+
			'<div class="fileinput-button" ng-click="clickAddImg($event)">'+
     			'<span class="glyphicon glyphicon-plus"></span><span style="margin-left:5px">Importer un fichier csv</span>'+
        		'<input type="file" name="imgs" >'+
    		'</div>'+
    				'</div>'

			,
		link: function(scope, element) {  
			element.on('keyup', function(e){
				if ( scope.content != null ) {
					var content = {
						csv: scope.content,
						header: scope.header,
						separator: e.target.value
					};
					scope.result = csvToJSON(content);
					scope.$apply();
				}
			});

			scope.clickAddImg = function($event) {
		    	setTimeout(function() {
		    		$($event.target).find('input').click();
		    	},0);
		    }   

			element.on('change', function(onChangeEvent) {
				var reader = new FileReader();
				reader.onload = function(onLoadEvent) {
					scope.$apply(function() {
						var content = {
							csv: onLoadEvent.target.result,
							header: scope.header,
							separator: scope.separator
						};

						scope.content = content.csv;
						scope.result = csvToJSON(content);
						scope.$parent.finishImport(scope.result)
					});
				};
				if ( (onChangeEvent.target.type === "file") && (onChangeEvent.target.files != null || onChangeEvent.srcElement.files != null) )  {
					reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
				} else {
					if ( scope.content != null ) {
						var content = {
							csv: scope.content,
							header: !scope.header,
							separator: scope.separator
						};
						scope.result = csvToJSON(content);
						scope.$parent.finishImport(scope.result)
					}
				}
			});

			var csvToJSON = function(content) {
				var lines=content.csv.split('\n');
				var result = [];
				var start = 0;
				var columnCount = lines[0].split(content.separator).length;

				var headers = [];
				if (content.header) {
					headers=lines[0].split(content.separator);
					start = 1;
				}

				for (var i=start; i<lines.length; i++) {
					var obj = {};
					var currentline=lines[i].split(content.separator);
					if ( currentline.length === columnCount ) {
						if (content.header) {
							for (var j=0; j<headers.length; j++) {
								obj[headers[j]] = currentline[j];
							}
						} else {
							for (var k=0; k<currentline.length; k++) {
								obj[k] = currentline[k];
							}
						}
						result.push(obj);
					}
				}
				return result;
			};
		}
	};
});