var clientResize = angular.module('clientresize',['angularFileUpload']);
clientResize.factory('clientResizeService',['$scope', function($scope) {
    var service = {};

    service.toto=function() { return 'youpi'};





    return service;
}]);
clientResize.directive('clientresize', function() {
    return {
      restrict: 'E',
      templateUrl:'js/backoffice/modules/clientresize.html',
      scope:{ callback: '=callback', multiple:'=',boxsize :'=boxsize',itemid:"=itemid", itemtype:"=itemtype",steps :'=steps',uploadurl :'=uploadurl'},
      controller :function($scope,$http,$upload,configService) {
      		//ATTRIBUT
      		$scope.uploadArray = [];
      		
      		$scope.$safeApply = function(fn) {
			  var phase = this.$root.$$phase;
			  if(phase == '$apply' || phase == '$digest') {
			    if(fn && (typeof(fn) === 'function')) {
			      fn();
			    }
			  } else {
			    this.$apply(fn);
			  }
			};
			/** *****************************************************************************************
			*********************************************************************************************
																						Click on button
			*********************************************************************************************
			********************************************************************************************/
      		$scope.clickAddImg = function($event) {
		    	setTimeout(function() {
		    		$($event.target).find('input').click();
		    	},0);
		    }   
			/** *****************************************************************************************
			*********************************************************************************************
																						ON FILE SELECT
			*********************************************************************************************
			********************************************************************************************/
      		$scope.onFileSelect = function($files) {
		    	var startindex = $scope.uploadArray.length;
		    	$scope.countImg= $files.length;
		    	$scope.currentImg=0;
		    	// $scope.currentstep=0;

		    	for(var i in $files){
		    		var $f = [];
		    		$f['file'] = $files[i];
		    		$f['statusUpload'] = 'added';
		    		$f['statusResize'] = 'added';
		    		var index = $scope.uploadArray.push($f);
		    		index--;
		    		// --> Start upload
		    		$scope.addResizeQueu(index)

		    	};
		    	 // = $scope.uploadArray.concat($filess)
		    	$scope.startResizeQueu(startindex);
		    }      		
		    /** *****************************************************************************************
		    *********************************************************************************************
		    																				START UPLOAD
		    *********************************************************************************************
		    ********************************************************************************************/
		    $scope.startUpload = function(index) {
		    	$scope.uploadArray[index].statusUpload = 'starting';
		    	resizeStuffCopy =$scope.uploadArray[index]['resizeStuff']

				// arr =_.map(resizeStuffCopy,function(item) {return _.map(item,function(it) {  return _.map(it,function(ite) {return angular.toJson(ite)}); })})

		    	$scope.upload = $upload.upload({
			        url: 'image/upload', //upload.php script, node.js route, or servlet url
			        method: 'POST',
			        // headers: {'header-key': 'header-value'},
			        // withCredentials: true,
			        file: $scope.uploadArray[index].file, // or list of files: $files for html5 only
			        // fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file
			    /* customize file formData name ('Content-Desposition'), server side file variable name. 
			        Default is 'file' */
			        fileFormDataName: 'imgs',//or a list of names for multiple files (html5).
			        /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
			        //formDataAppender: function(formData, key, val){}

			        data: {'resizeStuff': JSON.stringify(resizeStuffCopy),
			        		'itemId': $scope.itemid,	
			        		'itemType': $scope.itemtype	
			    	}

			      }).progress(function(evt) {
			      }).success(function(data, status, headers, config) {
			        // file is uploaded successfully
			        $scope.$parent.recupImage(data);
			      });
		    }  		
		    /** *****************************************************************************************
		    *********************************************************************************************
		    																				addResizeQueu
		    *********************************************************************************************
		    ********************************************************************************************/
		    $scope.addResizeQueu = function(index) {
		    	$scope.uploadArray[index].statusResize = 'addedtoqueu';
		    		
		    }      		
		    /** *****************************************************************************************
		    *********************************************************************************************
		    																			startResizeQueu
		    *********************************************************************************************
		    ********************************************************************************************/
		    $scope.startResizeQueu = function(startindex) {
		    	$('#myModal').modal('show');	    	
		    	$scope.resize(startindex);
               	
        	}      		
		    /** *****************************************************************************************
		    *********************************************************************************************
		    																					Resize
		    *********************************************************************************************
		    ********************************************************************************************/
		    $scope.resize = function(imgId) {
		    	
		    	$scope.currentImg++;

		    	$scope.imageResizing = imgId;
		    	if (window.FileReader && $scope.uploadArray[imgId]['file'].type.indexOf('image') > -1) {
	        		var fileReader = new FileReader();
	                fileReader.readAsDataURL($scope.uploadArray[imgId]['file']);
	                // $scope.selectedFiles[i]['fileReader']=fileReader;
	                (function(imgId){
	                	fileReader.onload = function(e) {
	                        // $timeout(function() {
	                        //   $scope.dataUrls[imgId] = e.target.result;
	                        //   $scope.uploadFile(imgId);
	                        // });

	                    	$scope.uploadArray[imgId]['statusResize'] ='resizing';
	                    	$scope.uploadArray[imgId]['img'] = new Image;
				            $scope.uploadArray[imgId]['img']['src'] = e.target.result;
				            $scope.uploadArray[imgId]['img']['onload'] = function() {
				            	$scope.originalWidth = $scope.uploadArray[imgId]['img'].width
				            	$scope.originalHeight = $scope.uploadArray[imgId]['img'].height
				            };
				            $scope.step(0);
	                	}
	                }(imgId));
               	}
        	
		    		
		    }      		
		    /** *****************************************************************************************
		    *********************************************************************************************
		    																						step
		    *********************************************************************************************
		    ********************************************************************************************/
		    $scope.step = function(step) {
		    	
		    	// $scope.imageResizing;
		    	$scope.currentstep =step;
		    	$('.cl-borderBox').css({'width':$scope.steps[step].width+'px','height':$scope.steps[step].height+'px','margin-left':(-$scope.steps[step].width/2)+'px','margin-top':(-$scope.steps[step].height/2)+'px'})
		    	$scope.currentzoom=1;
				$scope.currentX=0;
				$scope.currentY=0;
				$('#slider').slider('setValue',1);
		    	
		    	if(step == 0)
		    	{
		    		$scope.currentSrc = $scope.uploadArray[$scope.imageResizing]['img'].src;
		    	
        				$scope.$apply(function() {

        				});
        		
		    	}
		    	

    	        $('.cl-imgContainer img').css({
		          top: 0 + 'px',
		          left:  0 + 'px'
		        }).width($scope.originalWidth);

		    }      		
		    /********************************************************************************************
		    *********************************************************************************************
		    																					zomming
		    *********************************************************************************************
		    ********************************************************************************************/
		    $scope.zomming = function() {
		    	
		    	
		    }
		    /** *****************************************************************************************
		    *********************************************************************************************
		    																				VALIDATE STEP
		    *********************************************************************************************
		    ********************************************************************************************/
		    $scope.validateStep = function() {
		    	var step = $scope.currentstep;
      			var container = $('.cl-imgContainer');

		    	//ajouter les valeur de zoom et position  pour cette etape
		    	if(typeof($scope.uploadArray[$scope.imageResizing].resizeStuff) != 'object')
		    		$scope.uploadArray[$scope.imageResizing].resizeStuff = [];
		    	if(typeof($scope.uploadArray[$scope.imageResizing].resizeStuff[step]) != 'object')
		    		$scope.uploadArray[$scope.imageResizing].resizeStuff[step] = {};
		    	$scope.uploadArray[$scope.imageResizing].resizeStuff[step].zoom=$scope.currentzoom;
		    	$scope.uploadArray[$scope.imageResizing].resizeStuff[step].x= -$scope.currentX +(container.width()/2)-($scope.steps[step].width/2);
		    	$scope.uploadArray[$scope.imageResizing].resizeStuff[step].y= -$scope.currentY+(container.height()/2)-($scope.steps[step].height/2);

		    	$scope.uploadArray[$scope.imageResizing].resizeStuff[step].cropWidth=$scope.steps[step].width;
		    	$scope.uploadArray[$scope.imageResizing].resizeStuff[step].cropHeight=$scope.steps[step].height;
		    	$scope.uploadArray[$scope.imageResizing].resizeStuff[step].folder=$scope.steps[step].folder;
		    	$scope.uploadArray[$scope.imageResizing].resizeStuff[step].originalWidth=$scope.originalWidth;
		    	$scope.uploadArray[$scope.imageResizing].resizeStuff[step].originalHeight=$scope.originalHeight;
		    	
		    	if(step< $scope.steps.length-1)
		    	{
			    	
		    		$scope.step(step+1);



		    	}else{
			    	
		    		//check si image suivante
		    		$scope.startUpload($scope.imageResizing)

		    		if($scope.uploadArray.length === $scope.imageResizing+1)
		    		{
		    			//CLIENT RESIZE FINISH
		    			$('#myModal').modal('hide');	
		    		}else{
		    			$scope.imageResizing++;
		    			$scope.resize($scope.imageResizing);
		    		}
		    	}
		    	
		    }
      },
      link:function(scope,elem, attrs) {
      		$('body > #myModal').remove()
      		$('body').prepend($('#myModal'));
      		
      		$('#myModal').modal({show:false});
      		$('#slider').slider({min:0.2,max:1.5,value:1, step:0.05,tooltip:'hide'}).on('slide', function(ev){
    			scope.currentzoom=ev.value;
    			var originalWidth = scope.originalWidth
    			$(this).parent().parent().parent().find('.cl-imgContainer img').width(ev.value*originalWidth)
  			});
      }	
    };
});



clientResize.directive('myOndragstart', function($document) {
        return function(scope, element, attr) {
      var startX = 0, startY = 0, x = 0, y = 0;
 
      element.css({
       position: 'relative',
       cursor: 'move'
      });
 
      element.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();
         x = scope.currentX || 0, y = scope.currentY || 0;
        startX = event.pageX - x;
        startY = event.pageY - y;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });
 
      function mousemove(event) {
        y = event.pageY - startY;
        x = event.pageX - startX;

        element.css({
          top: y + 'px',
          left:  x + 'px'
        });

      }
 
      function mouseup() {

        scope.currentX = x;
        scope.currentY = y;

        $document.unbind('mousemove', mousemove);
        $document.unbind('mouseup', mouseup);
      }
    }
  });