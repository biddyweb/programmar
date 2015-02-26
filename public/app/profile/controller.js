(function () {

    'use strict';

    var app = angular.module(profileGlobals.app.name);

    app.controller(profileGlobals.controller.name, [
        '$scope',
        '$http',
        '$location',
        '$window',
        'UserApi',
        function ($scope, $http, $location, $window, UserApi) {

            //Default variables
            var href = $window.location.href;
            var apiRoute = '/api/v2/';
            $scope.userLoading = true; //Set the page to loading.
            $scope.articlesLoading = true;
            $scope.userData = [];
            $scope.articlesData = [];
            $scope.slug = href.substr(href.lastIndexOf('/') + 1);
            $scope.followTxt = 'Follow';
            $scope.unfollowTxt = 'Unfollow';
            $scope.pageLoaded = 30;
            $scope.loaderShow = true;
            $scope.moveLeft = false;
            $scope.showFollowers = false;
            $scope.showFollowing = false;
            $scope.showArticleContent = true;
            $scope.showEnjoyContent = false;

            //Collect api articles
            var refreshArticleData = function() {
                $http.get(appGlobals.api.rootRoute + '/articles/' + $scope.userData.id).
                success(function(data, status, headers, config) {
                    $scope.articlesData = data;
                    //Set loading to false
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $scope.articlesLoading = false;
                            $scope.pageLoaded = 100;
                            setTimeout(function() {
                                $scope.loaderShow = false;
                                $scope.$apply();
                            }, 500);
                        });
                    }, 300);
                });
            };

            //Collect user API stuff
            var refreshUserData = function() {
                UserApi.get({slug: $scope.slug}).$promise.then(function(userData) {
                    var username = '',
                        name = '',
                        id = '',
                        avatar = '',
                        your_following = '',
                        followers = '',
                        following = '',
                        enjoys = '',
                        self = '';

                    if (userData) {
                        username = userData['username'] || '';
                        name = userData['name'] || '';
                        id = userData['id'] || '';
                        avatar = userData['avatar'] || '';
                        your_following = userData['your_following'] || '';
                        followers = userData['followers'] || '';
                        following = userData['following'] || '';
                        self = userData['self'] || '';
                        enjoys = userData['enjoys'] || '';
                    }

                    $scope.userData = {
                        'username': angular.copy(username),
                        'name': angular.copy(name),
                        'id': angular.copy(id),
                        'avatar': angular.copy(avatar),
                        'your_following': angular.copy(your_following),
                        'followers': angular.copy(followers),
                        'following': angular.copy(following),
                        'self': angular.copy(self),
                        'enjoys': angular.copy(enjoys)
                    };

                    //Set loading to false
                    setTimeout(function() {
                        $scope.$apply(function() {
                            $scope.userLoading = false;
                            $scope.pageLoaded = 60;
                            refreshArticleData();
                        });
                    }, 300);
                });
            };

            refreshUserData(); //Collect user data

            //Follow user
            $scope.follow = function() {
                $scope.followTxt = 'Following...';
                $http.post(apiRoute + 'follow/' + $scope.userData.id, {}).
                success(function(data, status, headers, config) {
                    $scope.followTxt = 'Follow';
                    $scope.userData.your_following = true;
                    refreshUserData();
                }).
                error(function(data, status, headers, config) {
                    $scope.followTxt = 'Follow';
                    alert(data.messgae);
                });
            };

            //Unfollow user
            $scope.unfollow = function() {
                $scope.unfollowTxt = 'Unfollowing...';
                $http.post(apiRoute + 'unfollow/' + $scope.userData.id, {}).
                success(function(data, status, headers, config) {
                    $scope.unfollowTxt = 'Unfollow';
                    $scope.userData.your_following = false;
                    refreshUserData();
                }).
                error(function(data, status, headers, config) {
                    $scope.unfollowTxt = 'Unfollow';
                    alert(data.messgae);
                });
            };

            $scope.openMenu = function(menuItem) {
                $scope.expandMenu = true;
                setTimeout(function() {
                    $scope.$apply();
                });
            };

            $scope.closeMenu = function() {
                var offset = angular.element(".content").position().left;
                if(offset >= 300) {
                    angular.element(".content").addClass('slideLeft');
                    angular.element(".expanded-info").addClass('popOut');

                    setTimeout(function() {
                        $scope.expandMenu = false;
                        angular.element(".content").removeClass('slideLeft').removeClass('fadeInUp');
                        angular.element(".expanded-info").removeClass('popOut');
                        $scope.$apply();
                    }, 400);
                }
            };

            $scope.showEnjoys = function() {
                $scope.showEnjoyContent = true;
                $scope.showArticleContent = false;
            };

            $scope.showArticles = function() {
                $scope.showEnjoyContent = false;
                $scope.showArticleContent = true;
            };

        }
    ]);

})();
