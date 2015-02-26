(function () {

    'use strict';

    var app = angular.module(homeGlobals.app.name);

    app.controller(homeGlobals.controller.name, [
        '$scope',
        '$http',
        '$location',
        '$window',
        'ArticlesApi',
        '$stateParams',
        '$timeout',
        '$state',
        function ($scope, $http, $location, $window, ArticlesApi, $stateParams, $timeout, $state) {
            $scope.pageLoaded = 0;
            $scope.loaderShow = true;
            $scope.isLastPage = false;

            var refreshArticleData = function() {
                $scope.currentView = $stateParams.view;
                $scope.currentPage = $stateParams.page;

                $http.get(appGlobals.api.rootRoute + '/feed/' + $stateParams.view + '/' + $scope.currentPage).
                success(function(data, status, headers, config) {
                    $scope.articles = data.articles;
                    $scope.lastPage = data.lastPage;

                    if($scope.lastPage == $scope.currentPage) {
                        $scope.isLastPage = true;
                    }

                    if($scope.currentPage == $scope.lastPage) {
                        $scope.nextPage = 1;
                    }else{
                        $scope.nextPage = parseInt($scope.currentPage) + 1;
                    }

                    if($scope.currentPage == 1) {
                        $scope.prevPage = $scope.lastPage;
                    }else{
                        $scope.prevPage = parseInt($scope.currentPage) - 1;
                    }

                    $timeout(function() {
                        $scope.$apply(function() {
                            $scope.pageLoaded = 100;
                            $timeout(function() {
                                $scope.loaderShow = false;
                                $scope.pageLoaded = 0;
                                $scope.$apply();
                            }, 600);
                        });
                    }, 100);
                });
            };

            $timeout(function() {
                refreshArticleData();
            }, 200);

            $scope.changePage = function(page) {
                event.preventDefault();
                var view = $stateParams.view;

                $scope.currentView = page;
                $scope.pageLoaded = 0;

                $timeout(function() {
                    $scope.loaderShow = true;
                    $state.go('home', {"view": page, "page": 1});
                    $scope.$apply();
                    refreshArticleData();
                }, 100);
            };

            $scope.next = function() {
                event.preventDefault();
                var view = $stateParams.view;

                $scope.pageLoaded = 0;

                $timeout(function() {
                    $scope.loaderShow = true;
                    $state.go('home', {"view": view, "page": parseInt($scope.nextPage)});

                    $scope.$apply();
                    refreshArticleData();
                }, 100);
            };

             $scope.prev = function() {
                event.preventDefault();
                var view = $stateParams.view;

                $scope.pageLoaded = 0;

                $timeout(function() {
                    $scope.loaderShow = true;
                    $state.go('home', {"view": view, "page": parseInt($scope.prevPage)});

                    $scope.$apply();
                    refreshArticleData();
                }, 100);
            };
        }
    ]);
})();
