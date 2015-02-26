(function () {

    'use strict';

    var app = angular.module(editorGlobals.app.name);
    var apiEditorInteractBackendUri = '/api/internal/v1/editor/save';
    var apiPublishInteractBackendUri = '/api/internal/v1/editor/publish';
    var apiDeleteInteractBackendUri = '/api/internal/v1/editor/delete';

    app.controller(editorGlobals.controller.name, [
        '$scope',
        '$http',
        '$location',
        '$window',
        '$compile',
        'ArticleApi',
        'ProgrammarMessages',
        '$timeout',
        function ($scope, $http, $location, $window, $compile, ArticleApi, ProgrammarMessages, $timeout) {

            //Default variables
            var href = $window.location.href;
            $scope.article = {};
            $scope.saving = false;
            $scope.publishing = false;
            $scope.loading = true;
            $scope.callbackMsg = 'Not Saved';
            $scope.areaSelector = '.write-area';
            $scope.lastSaveTime = false;
            $scope.canSave = false;
            $scope.saveDelay = 10 * 1000;
            $scope.article.userID = '';
            $scope.slug = href.substr(href.lastIndexOf('/') + 1);

            $scope.article.customMenu = [
                ['bold', 'italic', 'heading','code', 'link'],
            ];

            ArticleApi.get({article_id: $scope.slug}).$promise.then(function(articleData) {
                var title = '',
                    content = '',
                    name = '',
                    user = '',
                    userID = '';

                if (articleData) {
                    title = articleData['title'] || '';
                    content = articleData['content'] || '';
                    name = articleData['slug'] || '';
                    user = articleData['userName'] || '';
                    userID = articleData['user_id'] || '';
                }

                $scope.article = {
                    'title': angular.copy(title),
                    'content': angular.copy(content),
                    'name': angular.copy(name),
                    'user': angular.copy(user),
                    'userID': angular.copy(userID),
                };

                $scope.loading = false;
            });

            //Apply initialised variables
            setTimeout(function() {
                $scope.$apply();
            }, 300);

            //Auto saving
            setInterval(function() {
                $scope.saveDocument();
            }, $scope.saveDelay);

            $scope.canSaveChange = function() {
                if(!$scope.canSave && $scope.article.content != '') {
                    $scope.canSave = true;
                }
            };

            $scope.checkCharacter = function(e) {
                e = e || window.event;
                var keyCode = e.keyCode || e.which;
                if (keyCode == 9)
                {
                    e.preventDefault();
                    $scope.insertFakeTabs();
                }
            };

            $scope.insertFakeTabs = function() {
                document.execCommand('CreateLink', false, "tabInsert");
                var sel = $('a[href="tabInsert"]');
                sel.wrap('<div class="tab" />');
                sel.closest('.tab').html('');
                sel.contents().unwrap();
            };

            $scope.deleteArticle = function() {
                ProgrammarMessages.confirm("Are you sure you want to delete?", "No", "Delete", "danger", function(result) {
                    if(result == 'confirm') {
                        var name = $scope.slug;
                        $(".deleteLink").text('Deleting...');
                        $http.post(apiDeleteInteractBackendUri, {'name': name, 'userID': $scope.article.userID}).
                        success(function(data, status, headers, config) {
                            $(".deleteLink").text(data.message);
                            $scope.article.name = data.name;
                            window.location.href = "/drafts";
                        }).
                        error(function(data, status, headers, config) {
                            $scope.saving = false;
                            $scope.publishing = false;
                            $(".deleteLink").text(data.message);
                        });
                    }
                });
            };

            function countWords(s){
                s = s.replace(/(^\s*)|(\s*$)/gi,"");
                s = s.replace(/[ ]{2,}/gi," ");
                s = s.replace(/\n /,"\n");
                return s.split(' ').length;
            }

            $scope.publishArticle = function() {
                var title = $scope.article.title,
                    content = $scope.article.content,
                    name = $scope.article.name,
                    currentTime = new Date();

                if(title != '' && content != '') {

                    if(countWords(content) < 10) {
                        ProgrammarMessages.confirm("You need 10 words to publish", "Ok", "Save as draft", "warning", function(result) {
                            if(result == 'confirm') {
                                $scope.saveDocument();
                            }
                        });
                    }else{
                        $scope.publishing = true;
                        $scope.saving = true;
                        $(".publishLink").text('Publishing...');
                        $scope.lastSaveTime = currentTime;

                        $http.post(apiPublishInteractBackendUri, {'title': title, 'content': content, 'name': name, 'userID': $scope.article.userID}).
                        success(function(data, status, headers, config) {
                            $scope.callbackMsg = data.message;
                            $(".publishLink").text(data.message);
                            $scope.article.name = data.name;
                            window.location.href = "/article/" + name;
                        }).
                        error(function(data, status, headers, config) {
                            $scope.saving = false;
                            $scope.publishing = false;
                            $(".publishLink").text(data.message);
                        });
                    }
                }else{
                    ProgrammarMessages.confirm("You need a title to publish", "Ok", "Save as draft", "warning", function(result) {
                        if(result == 'confirm') {
                            $scope.saveDocument();
                        }
                    });
                }
            };

            $scope.clickItem = function(className) {
                $timeout(function() {
                    angular.element('.' + className).trigger('click');
                });
            };

            setInterval(function() {
                angular.element('nav a[class*=-trigger]').each(function() {
                    var $this = $(this);
                    var className = $this.attr('class');
                    var targetName = className.split('-');
                    var target = targetName[0];

                    if(angular.element('.' + target).hasClass('active')) {
                        $this.addClass('active');
                    }else{
                        $this.removeClass('active');
                    }
                });
            }, 100);

            //Function for saving the document
            $scope.saveDocument = function() {
                var title = $scope.article.title,
                    content = $scope.article.content,
                    name = $scope.article.name,
                    currentTime = new Date();

                if($scope.canSave === true && !$scope.loading && !$scope.saving) {
                    //make sure the title or content has been edited
                    if(title != '' || content != '') {
                        $scope.saving = true;
                        $(".saveLink").text('Saving...');
                        $scope.lastSaveTime = currentTime;

                        $http.post(apiEditorInteractBackendUri, {'title': title, 'content': content, 'name': name, 'userID': $scope.article.userID}).
                        success(function(data, status, headers, config) {
                            $scope.saving = false;
                            $(".saveLink").text('Saved');
                            $scope.article.name = data.name;
                        }).
                        error(function(data, status, headers, config) {
                            $scope.saving = false;
                            $(".saveLink").text('Not Saved');
                        });
                    }
                }
            };
        }
    ]);

})();
