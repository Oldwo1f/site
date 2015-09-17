app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.when('/food',"/food/ingredients");
  $urlRouterProvider.when('/forum',"/forum/topics");
  $urlRouterProvider.when('/fluxs',"/fluxs/fluxs");
 
  // Now set up the states
  $stateProvider
   .state('/.fluxs', {
        url: "fluxs",
        data:{'mainTabs':'fluxs'},
        views: {
          'fluxsView':{
            templateUrl: "/templates/backoffice/flux/main.html"
          }
        }
    })
    	       .state('/.fluxs.fluxs', {
                url: "/fluxs",
                data:{'mainTabs':'fluxs'},
                views: {
                    'fluxsView':{
                      templateUrl: "/templates/backoffice/flux/fluxs.html",
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
                            .state('/.fluxs.fluxs.add', {
                                  url: "/add",
                                  views: {
                                      'addfluxsView':{
                                        templateUrl: "/templates/backoffice/flux/addflux.html",
                                        controller:'addfluxsCtrl',
                                        // data:{'foodtabs':'ingredients'},
                                        // resolve:{
                                        //   topics : function(topicsService) {
                                        //     return topicsService.fetchTopics();
                                        //   }
                                        // }
                                      }
                                  }
                              })
                            .state('/.fluxs.fluxs.edit', {
                                  url: "/edit/:id",
                                  views: {
                                      'editfluxsView':{
                                        templateUrl: "/templates/backoffice/flux/editflux.html",
                                        controller:'editfluxsCtrl',
                                        // data:{'foodtabs':'ingredients'},
                                        resolve:{
                                          flux : function(fluxsService,$stateParams) {
                                            return fluxsService.fetchFlux($stateParams.id);
                                          }
                                        }
                                      }
                                  }
                              })
            .state('/.fluxs.flux', {
                  url: "/flux/:id",
                  views: {
                      'fluxView':{
                        templateUrl: "/templates/backoffice/flux/flux.html",
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

                        .state('/.fluxs.flux.addlink', {
                              url: "/addlink",
                              views: {
                                  'addlinkView':{
                                    templateUrl: "/templates/backoffice/flux/addlink.html",
                                    controller:'addlinkCtrl',
                                    // data:{'foodtabs':'ingredients'},
                                    resolve:{
                                      flux : function(fluxsService,$stateParams) {
                                        return fluxsService.fetchFlux($stateParams.id);
                                      }
                                    }
                                  }
                              }
                        })
                        .state('/.fluxs.flux.editlink', {
                              url: "/editlink/:contentid",
                              views: {
                                  'editlinkView':{
                                    templateUrl: "/templates/backoffice/flux/editlink.html",
                                    controller:'editlinkCtrl',
                                    // data:{'foodtabs':'ingredients'},
                                    resolve:{
                                      content : function(fluxsService,$stateParams) {

                                        console.log('$stateParams.contentid = '+$stateParams.contentid);
                                        return fluxsService.fetchContent($stateParams.contentid);
                                      }
                                    }
                                  }
                              }
                        })

                        .state('/.fluxs.flux.addprez', {
                              url: "/addprez",
                              views: {
                                  'addprezView':{
                                    templateUrl: "/templates/backoffice/flux/addprez.html",
                                    controller:'addprezCtrl',
                                  }
                              }
                        })
                        .state('/.fluxs.flux.editprez', {
                              url: "/editPrez/:contentid",
                              views: {
                                  'editprezView':{
                                    templateUrl: "/templates/backoffice/flux/editprez.html",
                                    controller:'editprezCtrl',
                                    // data:{'foodtabs':'ingredients'},
                                    resolve:{
                                      content : function(fluxsService,$stateParams) {

                                        console.log('$stateParams.contentid = '+$stateParams.contentid);
                                        return fluxsService.fetchContent($stateParams.contentid);
                                      }
                                    }
                                  }
                              }
                        })

                        .state('/.fluxs.flux.addprivatearticle', {
                              url: "/addprivatearticle",
                              views: {
                                  'addprivatearticleView':{
                                    templateUrl: "/templates/backoffice/flux/addprivatearticle.html",
                                    controller:'addprivatearticleCtrl',
                                  }
                              }
                        })
                        .state('/.fluxs.flux.editprivatearticle', {
                              url: "/editprivatearticle/:contentid",
                              views: {
                                  'editprivatearticleView':{
                                    templateUrl: "/templates/backoffice/flux/editprivatearticle.html",
                                    controller:'editprivatearticleCtrl',
                                    // data:{'foodtabs':'ingredients'},
                                    resolve:{
                                      content : function(fluxsService,$stateParams) {

                                        console.log('$stateParams.contentid = '+$stateParams.contentid);
                                        return fluxsService.fetchContent($stateParams.contentid);
                                      }
                                    }
                                  }
                              }
                        })

                        .state('/.fluxs.flux.addingredient', {
                              url: "/addingredient",
                              views: {
                                  'addingredientView':{
                                    templateUrl: "/templates/backoffice/flux/addingredient.html",
                                    controller:'addingredientCtrl',
                                    resolve:{
                                      allingredients : function(ingredientsService,$stateParams) {
                                        return ingredientsService.fetchIngredients();
                                      }
                                    }
                                  }
                              }
                        })
                        .state('/.fluxs.flux.addfichier', {
                              url: "/addfichier",
                              views: {
                                  'addfichierView':{
                                    templateUrl: "/templates/backoffice/flux/addfichier.html",
                                    controller:'addfichierCtrl',
                                    // resolve:{
                                    //   allingredients : function(ingredientsService,$stateParams) {
                                    //     return ingredientsService.fetchIngredients();
                                    //   }
                                    // }
                                  }
                              }
                        })

//////////////////////////////////////////////////////////FORUM

    .state('/.forum', {
        url: "forum",
        data:{'mainTabs':'forum'},
        views: {
          'forumView':{
            templateUrl: "/templates/backoffice/forum/main.html"
          }
        }
    })
            .state('/.forum.topics', {
                url: "/topics",
                data:{'mainTabs':'forum'},
                views: {
                    'topicsView':{
                      templateUrl: "/templates/backoffice/forum/topics.html",
                      controller:'topicsCtrl',
                      // data:{'foodtabs':'ingredients'},
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
                                        templateUrl: "/templates/backoffice/forum/addtopic.html",
                                        controller:'addtopicsCtrl',
                                        // data:{'foodtabs':'ingredients'},
                                        // resolve:{
                                        //   topics : function(topicsService) {
                                        //     return topicsService.fetchTopics();
                                        //   }
                                        // }
                                      }
                                  }
                              })
                            .state('/.forum.topics.edit', {
                                  url: "/edit/:id",
                                  views: {
                                      'edittopicView':{
                                        templateUrl: "/templates/backoffice/forum/edittopic.html",
                                        controller:'edittopicsCtrl',
                                        // data:{'foodtabs':'ingredients'},
                                        resolve:{
                                          topic : function(topicsService,$stateParams) {
                                            return topicsService.fetchTopic($stateParams.id);
                                          }
                                        }
                                      }
                                  }
                              })
            .state('/.forum.topic', {
                  url: "/topic/:id",
                  views: {
                      'topicView':{
                        templateUrl: "/templates/backoffice/forum/topic.html",
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
/////////////////////////////////////////////////////////////FOOD
    .state('/.food', {
        url: "food",
        data:{'mainTabs':'food'},
        views: {
          'foodView':{
            templateUrl: "/templates/backoffice/food/main.html"
          }
        }
    })
               .state('/.food.ingredients', {
                     url: "/ingredients",
                     data:{'foodtabs':'ingredients'},
                     views: {
                         'ingredientsView':{
                              templateUrl: "/templates/backoffice/food/ingredients.html",
                              controller:'ingredientsCtrl',
                              data:{'foodtabs':'ingredients'},
                              resolve:{
                                ingredients : function(ingredientsService) {
                                  return ingredientsService.fetchIngredients();
                                }
                              }
                         }
                    }
               })
                           .state('/.food.ingredients.add', {
                                url: "/add",
                                views: {
                                  'addingredientView':{
                                    templateUrl: "/templates/backoffice/food/addingredients.html",
                                    controller:'addingredientsCtrl',
                                    resolve:{
                                      fabricans : function(fabricansService) {
                                        return fabricansService.fetchFabricans();
                                      }
                                    }
                                  }
                                }

                                
                           })
                          .state('/.food.ingredients.edit', {
                            url: "/edit/:id",
                            views: {
                              'editingredientsView':{
                                templateUrl: "/templates/backoffice/food/editingredients.html",
                                controller:'editingredientsCtrl',
                                resolve:{
                                  ingredient : function(ingredientsService,$stateParams) {
                                    return ingredientsService.fetchIngredient($stateParams.id);
                                  },
                                  fabricans : function(fabricansService) {
                                    return fabricansService.fetchFabricans();
                                  }
                                }
                              }
                            }
                            
                          })
                          .state('/.food.ingredients.editimage', {
                                url: "/editimage/:id",
                                views: {
                                  'editimageingredientsView':{
                                    templateUrl: "/templates/backoffice/food/editimageingredients.html",
                                    controller:'editimageingredientsCtrl',
                                    resolve:{
                                      ingredient : function(ingredientsService,$stateParams) {
                                        return ingredientsService.fetchIngredient($stateParams.id);
                                      },
                                    }
                                  }
                                }
                         })
              .state('/.food.fabricans', {
                     url: "/fabricans",
                     data:{'foodtabs':'fabricans'},
                     views: {
                         'fabricansView':{
                              templateUrl: "/templates/backoffice/food/fabricans.html",
                              controller:'fabricansCtrl',
                              data:{'foodtabs':'fabricans'},
                              resolve:{
                                fabricans : function(fabricansService) {
                                  return fabricansService.fetchFabricans();
                                }
                              }
                         }
                    }
               })
                         .state('/.food.fabricans.add', {
                              url: "/add",
                              views: {
                                'addfabricanView':{
                                  templateUrl: "/templates/backoffice/food/addfabricans.html",
                                  controller:'addfabricansCtrl'
                                }
                              }
                              
                         })
                        .state('/.food.fabricans.edit', {
                          url: "/edit/:id",
                          views: {
                            'editfabricanView':{
                              templateUrl: "/templates/backoffice/food/editfabricans.html",
                              controller:'editfabricansCtrl',
                              resolve:{
                                fabrican : function(fabricansService,$stateParams) {
                                  return fabricansService.fetchFabrican($stateParams.id);
                                }
                              }
                            }
                          }
                          
                        })
            
          /////////////////////////////////////////////////////////////////////////////////////PROJECTS
          // .state('/.projects', {
          //   url: "projects",
          //   data:{'mainTabs':'projects'},
          //   views: {
          //     'projetsView':{
          //       templateUrl: "/templates/backoffice/project/main.html"

          //     }
          //   }
          // })
          //              .state('/.projects.category', {
          //                 url: "/category",
          //                 data:{'projectsTabs':'category'},
          //                 views: {
          //                   'categoryView':{
          //                     templateUrl: "/templates/backoffice/project/projectscategory.html",
          //                     controller:'projectscategoryCtrl',
          //                     data:{'projectsTabs':'category'},
          //                     resolve:{
          //                       categories : function(projectscategoryService) {
          //                         return projectscategoryService.fetchCategories();
          //                       }
          //                     }
          //                   }
          //                 }
          //               })
          //                                 .state('/.projects.category.add', {
          //                               url: "/add",
          //                               views: {
          //                                 'addprojectscategoryView':{
          //                                   templateUrl: "/templates/backoffice/project/addprojectscategory.html",
          //                                   controller:'addprojectscategoryCtrl'
          //                                 }
          //                               }
                                        
          //                             })
          //                             .state('/.projects.category.edit', {
          //                               url: "/edit/:id",
          //                               views: {
          //                                 'editprojectscategoryView':{
          //                                   templateUrl: "/templates/backoffice/project/editprojectscategory.html",
          //                                   controller:'editprojectscategoryCtrl',
          //                                   resolve:{
          //                                     category : function(projectscategoryService,$stateParams) {
          //                                       return projectscategoryService.fetchCategory($stateParams.id);
          //                                     }
          //                                   }
          //                                 }
          //                               }
                                        
          //                             })
          //                             .state('/.projects.category.editimage', {
          //                               url: "/editimage/:id",
          //                               // data:{'projectsTabs':'projects'},
          //                               views: {
          //                                 'editimageprojectscategoryView':{
          //                                   templateUrl: "/templates/backoffice/project/editimageprojectscategory.html",
          //                                   controller:'editimageprojectscategoryCtrl',
          //                                   resolve:{
          //                                     category : function(projectscategoryService,$stateParams) {
          //                                       return projectscategoryService.fetchCategory($stateParams.id);
          //                                     }
          //                                   }
          //                                 }
          //                               }
          //                             })


          //              .state('/.projects.projects', {
          //                 url: "/projects",
          //                 data:{'projectsTabs':'projects'},
          //                 views: {
          //                   'projectsView':{
          //                     templateUrl: "/templates/backoffice/project/projects.html",
          //                     controller:'projectsCtrl',
          //                     resolve:{
          //                       projects : function(projectsService) {
          //                         return projectsService.fetchProjects();
          //                       },
          //                       categories:  function(projectscategoryService){
          //                         // return ['test'];
          //                         return projectscategoryService.fetchCategories();
          //                       }
          //                     }
          //                   }
          //                 }
          //               })
          //                             .state('/.projects.projects.add', {
          //                               url: "/add",
          //                               views: {
          //                                 'addprojectView':{
          //                                   templateUrl: "/templates/backoffice/project/addproject.html",
          //                                   controller:'addprojectsCtrl'
          //                                 }
          //                               },
          //                               resolve:{
          //                                 categories:  function(projectscategoryService){
          //                                   // return ['test'];
          //                                   return projectscategoryService.fetchCategories();
          //                                 }
          //                               }
          //                             })
                                        
          //                             .state('/.projects.projects.edit', {
          //                               url: "/edit/:id",
          //                               // data:{'projectsTabs':'projects'},
          //                               views: {
          //                                 'editprojectView':{
          //                                   templateUrl: "/templates/backoffice/project/editproject.html",
          //                                   controller:'editprojectsCtrl'
          //                                 }
          //                               },
          //                               resolve:{
          //                                 categories:  function(projectscategoryService){
          //                                   return projectscategoryService.fetchCategories();
          //                                 },
          //                                 project:  function(projectsService,$stateParams){
          //                                   return projectsService.fetchProject($stateParams.id);
          //                                 }
          //                               }
          //                             })
          //                             .state('/.projects.projects.editimage', {
          //                               url: "/editimage/:id",
          //                               // data:{'projectsTabs':'projects'},
          //                               views: {
          //                                 'editimagesprojectsView':{
          //                                   templateUrl: "/templates/backoffice/project/editimageproject.html",
          //                                   controller:'editimageprojectsCtrl'
          //                                 },
          //                               },
          //                               resolve:{
          //                                   project:  function(projectsService,$stateParams){

          //                                     return projectsService.fetchProject($stateParams.id);
          //                                   }
          //                               }
                                        
          //                             })
        
  
   
});