(function () {

    'use strict';

    var apiEndPoint = appGlobals.api.rootRoute + '/feed/:view/:page';

    com.programmar.core.factory('ArticlesApi', ['$resource', function ($resource) {

        var paramDefaults = {

        };

        var actions = {
            query : {
                method : 'GET',
                params : {},
                isArray : false
            }
        };

        return $resource(apiEndPoint, paramDefaults, actions);
    }]);

})();
