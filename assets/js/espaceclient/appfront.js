var app = angular.module('app', ['ngSanitize','MessageCenterModule','satellizer','markdownpreview','ngLocale','ui.router','ui.bootstrap','ngAnimate','clientresize','ui.bootstrap.datetimepicker','ui.sortable','angular-loading-bar']);

console.log('cool');
app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
  }])
// cfpLoadingBar.start();
function clearSelection() {
    if(document.selection && document.selection.empty) {
        document.selection.empty();
    } else if(window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
    }
}
function getIndexInBy(arr,property,value) {
  for(var i in arr)
  {
      if(arr[i][property] ===value)
        return i;
  }
};

app.config(function($authProvider) {

    // $authProvider.facebook({
    //   clientId: '624059410963642',
    // });

    // $authProvider.google({
    //   clientId: '631036554609-v5hm2amv4pvico3asfi97f54sc51ji4o.apps.googleusercontent.com'
    // });

    // $authProvider.github({
    //   clientId: '0ba2600b1dbdb756688b'
    // });

    // $authProvider.linkedin({
    //   clientId: '77cw786yignpzj'
    // });

    // $authProvider.twitter({
    //   url: '/auth/twitter'
    // });

    // $authProvider.oauth2({
    //   name: 'foursquare',
    //   url: '/auth/foursquare',
    //   redirectUri: window.location.origin,
    //   clientId: 'MTCEJ3NGW2PNNB31WOSBFDSAD4MTHYVAZ1UKIULXZ2CVFC2K',
    //   authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate',
    // });

  });

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.when('/forum',"/forum/topics");
  $urlRouterProvider.when('/fluxs',"/fluxs/fluxs");
  $urlRouterProvider.when('/',"/fluxs");
  // $urlRouterProvider.when('/fluxs',"/fluxs/fluxs");
  // $urlRouterProvider.when('/fluxs',"/fluxs/fluxs");
  // $urlRouterProvider.when('/articles',"/articles/articles");
  // $urlRouterProvider.when('/projects',"/projects/projects");
  // $urlRouterProvider.when('/galery',"/galery/home");
  // $urlRouterProvider.when('/users',"/users/user");
  // $urlRouterProvider.when('/newsletters',"/newsletters/list/");
  // $urlRouterProvider.when('/',"/dashboard");
  // // $urlRouterProvider.when('/login',"../");
  $urlRouterProvider.otherwise("/");
  
  console.log("config app front");
  // Now set up the states
  $stateProvider
    .state('/login', {
      url: "/login",
      template: this["JST"]["assets/templates/front/login.html"](),
      controller:'loginCtrl'
    })
    .state('/', {
      url: "/",
      views: {
              'navbarView':{
                template: this["JST"]["assets/templates/front/navbar.html"](),
                controller:'navbarCtrl',
                resolve: {
                    me: function(accountService, $auth) {
                      // return {};
                      return accountService.getProfile();
                    }
                }
              },
              'rootView':{
                template:this["JST"]["assets/templates/front/root.html"]()
              }
            }
    })

///////////////////////////////////////////////////////////////////////FORUM
    .state('/.forum', {
        url: "forum",
        data:{'mainTabs':'forum'},
        views: {
          'forumView':{
            template: this["JST"]["assets/templates/front/forum/main.html"]()
          }
        }
    })
            .state('/.forum.topics', {
                url: "/topics",
                data:{'mainTabs':'forum'},
                views: {
                    'topicsView':{
                      template: this["JST"]["assets/templates/front/forum/topics.html"](),
                      controller:'topicsCtrl',
                      resolve:{
                        topics : function(topicsService) {
                          return topicsService.fetchTopics();
                        }
                      }
                    }
                }
            })
                            .state('/.forum.topics.add', {
                                  url: "/add",
                                  views: {
                                      'addtopicView':{
                                        template: this["JST"]["assets/templates/front/forum/addtopic.html"](),
                                        controller:'addtopicsCtrl',
                                      }
                                  }
                              })

            .state('/.forum.topic', {
                  url: "/topic/:id",
                  views: {
                      'topicView':{
                        template: this["JST"]["assets/templates/front/forum/topic.html"](),
                        controller:'topicCtrl',
                        // data:{'foodtabs':'ingredients'},
                        resolve:{
                          topic : function(topicsService,$stateParams) {
                            return topicsService.fetchTopic($stateParams.id);
                          }
                        }
                      }
                  }
              })
///////////////////////////////////////////////////////////////////////FLUX

    .state('/.fluxs', {
        url: "fluxs",
        data:{'mainTabs':'fluxs'},
        views: {
          'fluxsView':{
            template: this["JST"]["assets/templates/front/flux/main.html"]()
          }
        }
    })
             .state('/.fluxs.fluxs', {
                url: "/fluxs",
                data:{'mainTabs':'fluxs'},
                views: {
                    'fluxsView':{
                      template: this["JST"]["assets/templates/front/flux/fluxs.html"](),
                      // templateUrl: "/templates/backoffice/flux/fluxs.html",
                      controller:'fluxsCtrl',
                      // data:{'foodtabs':'ingredients'},
                      resolve:{
                        fluxs : function(fluxsService) {
                          return fluxsService.fetchFluxs();
                        }
                      }
                    }
                }
            })
            .state('/.fluxs.flux', {
                  url: "/flux/:id",
                  views: {
                      'fluxView':{
                        template: this["JST"]["assets/templates/front/flux/flux.html"](),
                        controller:'fluxCtrl',
                        // data:{'foodtabs':'ingredients'},
                        resolve:{
                          flux : function(fluxsService,$stateParams) {
                            console.log("RESOLVE FLUX");
                            return fluxsService.fetchFlux($stateParams.id);
                          }
                        }
                      }
                  }
            })
            .state('/.box', {
                  url: "favoris",
                  data:{'mainTabs':'box'},
                  views: {
                      'boxView':{
                        template: this["JST"]["assets/templates/front/flux/box.html"](),
                        controller:'boxCtrl',
                        resolve:{
                          box : function(boxService) {
                            console.log("RESOLVE BOX");
                            return boxService.getbox();
                          }
                        }
                      }
                  }
            })
            .state('/.food', {
                  url: "food",
                  data:{'mainTabs':'food'},
                  views: {
                      'foodView':{
                        template: this["JST"]["assets/templates/front/food/food.html"](),
                        controller:'foodCtrl',
                        // resolve:{
                        //   box : function(boxService) {
                        //     console.log("RESOLVE BOX");
                        //     return boxService.getbox();
                        //   }
                        // }
                      }
                  }
            })
            .state('/.avis', {
                  url: "avis",
                  data:{'mainTabs':'avis'},
                  views: {
                      'avisView':{
                        template: this["JST"]["assets/templates/front/avis.html"](),
                        controller:'avisCtrl',
                        // resolve:{
                        //   box : function(boxService) {
                        //     console.log("RESOLVE BOX");
                        //     return boxService.getbox();
                        //   }
                        // }
                      }
                  }
            })



    //       /////////////////////////////////////////////////////////////////////////////////////goldenbook
    //       .state('/.goldenbook', {
    //         url: "goldenbook",
    //         data:{'mainTabs':'goldenbook'},
    //         views: {
    //           'goldenbookView':{
    //             templateUrl: "/templates/goldenbook/main.html",
    //             controller:'goldenbookCtrl',
    //             resolve:{
    //               goldenbooks : function(goldenbookService) {
    //                 return goldenbookService.fetchGoldenbooks();
    //               }
    //             }
    //           }
    //         }
    //       })

    .state('profile', {
      url: "/profile",
      views: {
              'navbarView':{
                templateUrl: "/templates/front/navbar.html",
                controller:'navbarCtrl',
                resolve: {
                    me: function(accountService, $auth) {
                      return accountService.getProfile();
                    }
                }
              },
              'rootView':{
                templateUrl: "/templates/front/profile.html",
                controller:'profileCtrl',
                resolve:{
                  myself : function(accountService) {
                    return accountService.getProfile();
                  }
                }
              }
            },
      
    });
  
   
});