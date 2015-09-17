app.directive('auditref', function(){
    return {
        restrict: 'E',
        // transclude: true,
        scope: { model:'=model'},
        template: '<div><div class="col col-sm-6 nopadding"><h4>Audit</h4>'+
        '<ul class="listAudit">'+
        '<li>'+
        '<span class="label label-lg label-success" ng-show="auditTitle()==0"><label for="">Parfait! Au moin un mots clefs est dans le titre</label></span>'+
        '<span class="label label-lg label-danger" ng-show="auditTitle()==2"><label for="">Aucun mot clef dans le titre</label></span>'+
        '<span class="label label-lg label-danger" ng-show="auditTitle()==1"><label for="">Pas de titre</label></span>'+
        '</li>'+
        '<li>'+
        '<span class="label label-lg label-success" ng-show="countContentLength()> 200"><label for="">Parfait! Votre contenu est bien garni ({{ countContentLength() }} / 200 mots)</label></span>'+
        '<span class="label label-lg label-danger" ng-show="countContentLength()< 100"><label for="">Votre contenu n\'est assez long ({{ countContentLength() }} / 200 mots)</label></span>'+
        '<span class="label label-lg label-warning" ng-show="countContentLength()< 200 && countContentLength()> 100"><label for="">Votre contenu suffisamment long ({{ countContentLength() }} / 200 mots)</label></span>'+
        '</li>'+
        '<li>'+
        '<span class="label label-lg label-success" ng-show="auditContent()==0"><label for="">Parfait! Tous vos titre comporte des mots clefs</label></span>'+
        '<span class="label label-lg label-success" ng-show="auditContent()==3"><label for="">Il manque des mots clefs dans certain titre({{ keywordInTitle }} / {{nbTitle}})</label></span>'+
        '<span class="label label-lg label-danger" ng-show="auditContent()==2"><label for="">Aucun mots clef dans vos titre</label></span>'+
        '<span class="label label-lg label-danger" ng-show="auditContent()==1"><label for="">Ne pas utilisé de titre de rang 1</label></span>'+
        '</li>'+
        '<li>'+
        '<span class="label label-lg label-success" ng-show="auditKeyword()==0"><label for="">Parfait: Au moin 5 mots clefs</label></span>'+
        '<span class="label label-lg label-warning" ng-show="auditKeyword()==2"><label for="">Pas assez de mots clefs</label></span>'+
        '<span class="label label-lg label-danger" ng-show="auditKeyword()==1"><label for="">Aucun mots clefs</label></span>'+
        '</li>'+
        '<li>'+
        '<span class="label label-lg label-success" ng-show="auditUrl()==0"><label for="">Parfait! Au moin un mots clefs est dans l\'url</label></span>'+
        '<span class="label label-lg label-warning" ng-show="auditUrl()==2"><label for="">Vos mots clefs ne sont pas dans l\'url</label></span>'+
        '<span class="label label-lg label-danger" ng-show="auditUrl()==1"><label for="">Pas de réécriture d\'url</label></span>'+
        '</li>'+
        '<li>'+
        '<span class="label label-lg label-success" ng-show="auditMetaDescription()==0"><label for="">Parfait! La balise description est renseignée</label></span>'+
        '<span class="label label-lg label-warning" ng-show="auditMetaDescription()==2"><label for="">La balise description est trop courte</label></span>'+
        '<span class="label label-lg label-danger" ng-show="auditMetaDescription()==1"><label for="">La balise description est vide</label></span>'+
        '</li>'+
        '</ul></div>'+
        '<div class="col col-sm-6 nopadding"><h4>Petit plus</h4><ul class="listAudit">'+
        '<li> Mettre les mots clef en gras</li>'+
        '<li> Renommer vos images en incluant vos mots clefs</li>'+
        '</ul>'+
        '</div></div>'
        ,
        controller:function($scope) {
        	$scope.countContentLength = function(){
        		var val = $scope.model.content.split(' ')
        		return val.length;
        	}

            $scope.auditContent = function(){
                    var lexer = new marked.Lexer();
                    var tokens = lexer.lex($scope.model.content);
                    $scope.keywordInTitle = 0;
                    $scope.nbTitle = 0;
                    if(!$scope.model.keyword)
                            return 2
                    var arr = $scope.model.keyword.split(',')
                    for(var i in tokens)
                    {
                        if(tokens[i].type==="heading" && tokens[i].depth === 1)
                            return 1

                        if(tokens[i].type==="heading" && tokens[i].depth > 1){
                            $scope.nbTitle++;
                            for (var j in arr) {
                                var patt = new RegExp(arr[j].trim(),'i');
                                if(patt.test(tokens[i].text))
                                {
                                    $scope.keywordInTitle ++;
                                    break;
                                }
                            }

                        }


                    }

                    if(!$scope.keywordInTitle)
                    {
                        return 2
                    }
                    if($scope.keywordInTitle == $scope.nbTitle)
                    {
                        return 0;
                    }
                    else{
                        return 3
                    }
            }
        	$scope.auditUrl = function(){
        		// var arr = $scope.model.keyword.split(',')
				if(!$scope.model.rewriteurl)
        		{
        			return 1;
        		}

        		if($scope.model.keyword)
        		{
        			var arr = $scope.model.keyword.split(',')
        			for (var i in arr) {
        				var patt = new RegExp(arr[i].trim(),'i');
        				if(patt.test($scope.model.rewriteurl))
        					return 0
        			}	
        		}
				return 2;    		
        	}
        	$scope.auditKeyword = function(){
				if(!$scope.model.keyword)
        		{
        			return 1;
        		}

        		if($scope.model.keyword)
        		{
        			var arr = $scope.model.keyword.split(',')
        			if(arr.length<5){
        					return 2
        			}	
        		}
				return 0;    		
        	}
        	$scope.auditTitle = function(){
				if(!$scope.model.title)
        		{
        			return 1;
        		}

        		if($scope.model.keyword)
        		{
        			var arr = $scope.model.keyword.split(',')
        			for (var i in arr) {
        				var patt = new RegExp(arr[i].trim(),'i');
        				if(patt.test($scope.model.title))
        					return 0
        			}	
        		}
				return 2;    		
        	}
        	$scope.auditMetaDescription = function(){
        		if(!$scope.model.description)
        		{
        			return 1;
        		}
        		else if($scope.model.description.length < 40)
        		{
        			return 2;
        		}
        		return 0;
        	}
        },
        link:function(scope, element, attrs) {


      	}
     }
  })

