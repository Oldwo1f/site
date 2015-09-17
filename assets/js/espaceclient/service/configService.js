app.factory('configService', ['$http','$q',function ($http,$q) {
    var service = {};
    service.frontConfig={};
    console.log('configService');
    service.h1 = 'Administration NUTRIMARKETING';
   
    service.maintabs=[
    // {'title':'Dashboard','name' :'dashboard','active':false,'viewName':'dashboardView'},
    // {'title':'Utilisateurs','name' :'users','active':false,'viewName':'usersView'},
    // {'title':'Blog','name' :'articles','active':false,'viewName':'allarticlesView'},
    // {'title':'Projets','name' :'projects','active':false,'viewName':'projetsView'},
    // {'title':'Galerie d\'images','name' :'galery','active':false,'viewName':'galeryView'},
    // {'title':'Livre d\'or','name' :'goldenbook','active':false,'viewName':'goldenbookView'},
    // {'title':'Newsletters','name' :'newsletters','active':false,'viewName':'newslettersView'},
    {'title':'Flux d\'information','name' :'fluxs','active':false,'viewName':'fluxsView'},
    {'title':'Favoris','name' :'box','active':false,'viewName':'boxView'},
    {'title':'Forum','name' :'forum','active':false,'viewName':'forumView'},
    {'title':'Recherche d\'ingrédients','name' :'food','active':false,'viewName':'foodView'},
    {'title':'Votre avis nous intérèsse','name' :'avis','active':false,'viewName':'avisView'},

    ];
     service.frontConfig={
        imageResize:{
            profilepicture:[
                {  
                    'title':'Image principale',
                    'folder':'profilepicture',
                    'width': 500,
                    'height':500
                },{  
                    'title':'Miniature',
                    'folder':'thumbs',
                    'width': 100,
                    'height':100
                }
            ],
        }
    }
    // service.foodtabs=[
    // {'title':'Ingrédients','name' :'ingredients','active':false},
    // {'title' :'Fabricans','name' :'fabricans','active':false},
    // ];
    // service.articlestabs=[
    // {'title':'Articles','name' :'articles','active':false},
    // {'title' :'Catégories','name' :'category','active':false},
    // {'title':'Commentaires','name' :'coments','active':false}
    // ];
    // service.projectstabs=[
    // {'title':'Projects','name' :'projects','active':false},
    // {'title' :'Catégories','name' :'category','active':false},
    // ];
    // service.galerytabs=[
    // {'title':'Page d\'accueil','name' :'home','active':false},
    // ];
    // service.userstabs=[
    // {'title':'Utilisateurs internes','name' :'user','active':false},
    // {'title':'Clients','name' :'client','active':false},
    // ];
    // service.newsletterstabs=[
    // {'title':'Mes listes','name' :'list','active':false},
    // {'title':'Envoie de mail','name' :'envoi','active':false},
    // ];

    service.languages=['fr','en'];


    return service;
}]);