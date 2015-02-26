'use strict';

var homeGlobals = (appGlobals)? angular.copy(appGlobals) : {};

homeGlobals.app = {
    name : 'com.programmar'
};

homeGlobals.controller = {
    name : 'HomeCtrl'
};

(function () {

    'use strict';

    angular.module(homeGlobals.app.name,
        [
            'com.programmar.core',
            'ui.router',
        ]
    ).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        var home = {
            name: 'home',
            templateUrl: '/app/home/partials/articles.html',
            controller: homeGlobals.controller.name,
            url: '/:view/:page'
        }
        $stateProvider.state(home);
        $urlRouterProvider.when('' ,'/all/1');
        $urlRouterProvider.otherwise('' ,'/all/1');
    }]);


})();


