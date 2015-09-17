
app.directive('piecesjointes', function(
    $q
){
    var slice = Array.prototype.slice;

    return {
        restrict: 'A',
        scope: {list:'=list',filelist:'=filelist'},
        // require: '?ngModel',
        link: function(scope, element, attrs){
            element.bind('change', function(e){
                var element = e.target;
                scope.filelist=element.files
                $q.all(slice.call(element.files, 0).map(readFile))
                .then(function(values){
                    if(values.length)
                        scope.list = values;
                });

                function readFile(file) {
                    var deferred = $q.defer();
                    var $file ={};

                    var reader = new FileReader()
                    reader.onload = function(e){
                        $file.filename = file.name;
                        $file.size = file.size;
                        $file.path = e.target.result;
                        $file.file = file;
                        deferred.resolve($file);
                    }
                    reader.onerror = function(e) {
                        deferred.reject(e);
                    }
                    reader.readAsDataURL(file);

                    return deferred.promise;
                }

            });//change

        }//link

    };

})
;