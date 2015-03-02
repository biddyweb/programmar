(function () {

    'use strict';

    var app = angular.module(editorGlobals.app.name);

    var apiEnjoyInteractBackendUri = '/api/internal/v1/article/enjoy';

    app.controller(editorGlobals.controller.name, [
        '$scope',
        '$http',
        '$location',
        '$window',
        'ArticleApi',
        'UserApi',
        function ($scope, $http, $location, $window, ArticleApi, UserApi) {

            //Default variables
            var href = $window.location.href;
            $scope.articleLoading = true;
            $scope.article = {};
            $scope.article.enjoyed = false;
            $scope.pageLoaded = 30;
            $scope.loaderShow = true;
            $scope.showEnjoys = false;
            $scope.expandMenu = false;
            $scope.moveLeft = false;
            $scope.slug = href.substr(href.lastIndexOf('/') + 1);

            UserApi.query().$promise.then(function(userData) {
                var username = '',
                    name = '',
                    id = '',
                    avatar = '';

                if (userData) {
                    username = userData['username'] || '';
                    name = userData['name'] || '';
                    id = userData['id'] || '';
                    avatar = userData['avatar'] || '';
                }

                $scope.userData = {
                    'username': angular.copy(username),
                    'name': angular.copy(name),
                    'id': angular.copy(id),
                    'avatar': angular.copy(avatar),
                };

                setTimeout(function() {
                    reloadArticleData();
                    $scope.$apply();
                }, 300);
            });

            //Collect article API stuff
            var reloadArticleData = function() {
                ArticleApi.get({article_id: $scope.slug}).$promise.then(function(articleData) {
                    var title = '',
                        content = '',
                        user = '',
                        name = '',
                        slug = '',
                        enjoyed = false,
                        enjoys = '';

                    if (articleData) {
                        title = articleData['title'] || '';
                        content = articleData['content'] || '';
                        user = articleData['userName'] || '';
                        name = articleData['last_updated'] || '';
                        slug = articleData['slug'] || '';
                        enjoys = articleData['enjoys'] || '';
                        enjoyed = articleData['user_enjoyed'] || false;
                    }

                    $scope.article = {
                        'title': angular.copy(title),
                        'content': angular.copy(content),
                        'user': angular.copy(user),
                        'name': angular.copy(name),
                        'slug': angular.copy(slug),
                        'enjoyed': angular.copy(enjoyed),
                        'enjoys': angular.copy(enjoys),
                    };

                    setTimeout(function() {
                        $scope.articleLoading = false;
                        $scope.limit = 3;

                        if($scope.article.enjoyed) {
                            $scope.limit = 2;
                        }

                        $scope.pageLoaded = 100;

                        //Setting up clip
                        var client = new ZeroClipboard( document.getElementById("copyLink"), {
                          moviePath: "/js/ZeroClipboard.swf"
                        });

                        client.on("load", function(client) {
                          client.on("complete", function(client, args) {
                            var linkElement = this;
                            angular.element(linkElement).addClass('clicked');
                          });
                        });

                        setTimeout(function() {
                            $scope.loaderShow = false;
                            $scope.$apply();
                        }, 500);
                        $scope.$apply();
                    }, 300);
                });
            }

            $scope.enjoy = function() {
                var $this = $('.enjoy-btn');
                var $facesCont = angular.element('.faces-cont');

                if(!$scope.article.enjoyed) {
                    if($scope.article.enjoys.length >= 3) {
                        $facesCont.find('.face:first-child').addClass('faceSlideRight');
                        $facesCont.find('.face:nth-child(2n)').addClass('faceSlideRight');
                        $facesCont.find('.face:last-child').addClass('faceSlideRightOut');
                        $this.addClass("highfiveClick").addClass('pop');
                    }else{
                        $this.addClass("highfiveClickStatic").addClass('pop');
                    }

                    var newNumber = $scope.article.enjoys.length + 1 - 3;

                    setTimeout(function() {
                        $this.css('background-image', 'url(' + $scope.userData.avatar + ')');
                        angular.element('.num').addClass('pop').text("+" + newNumber);

                        $http.post(apiEnjoyInteractBackendUri, {'name': $scope.slug}).
                        success(function(data, status, headers, config) {}).
                        error(function(data, status, headers, config) {});
                    }, 150);
                }else{
                    alert('you cannot unenjoy yet');
                }
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
        }
    ]);

})();
