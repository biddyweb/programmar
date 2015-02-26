'use strict';

angular.module('wysiwyg.module', ['colorpicker.module'])
    .directive('wysiwyg', function($timeout, wysiwgGui, $compile) {
        return {
            template: '<p></p>',
            restrict: 'E',
            scope: {
                value: '=ngModel',
                textareaHeight: '@textareaHeight',
                textareaName: '@textareaName',
                textareaPlaceholder: '@textareaPlaceholder',
                textareaClass: '@textareaClass',
                textareaRequired: '@textareaRequired',
                textareaId: '@textareaId',
                textareaMenu: '@textareaMenu'
            },
            replace: true,
            require: 'ngModel',
            link: function(scope, element, attrs, ngModelController) {
                //Create the menu system
                element.html(wysiwgGui.createMenu(attrs.textareaMenu));
                $compile(element.contents())(scope);

                var textarea = element.find('div.wysiwyg-textarea');
                var pre = element.find('pre');

                scope.fonts = [
                    'Georgia',
                    'Palatino Linotype',
                    'Times New Roman',
                    'Arial',
                    'Helvetica',
                    'Arial Black',
                    'Comic Sans MS',
                    'Impact',
                    'Lucida Sans Unicode',
                    'Tahoma',
                    'Trebuchet MS',
                    'Verdana',
                    'Courier New',
                    'Lucida Console',
                    'Helvetica Neue'
                ].sort();

                scope.font = scope.fonts[6];

                scope.fontSizes = [{
                    value: '1',
                    size: '10px'
                }, {
                    value: '2',
                    size: '13px'
                }, {
                    value: '3',
                    size: '16px'
                }, {
                    value: '4',
                    size: '18px'
                }, {
                    value: '5',
                    size: '24px'
                }, {
                    value: '6',
                    size: '32px'
                }, {
                    value: '7',
                    size: '48px'
                }];

                scope.fontSize = scope.fontSizes[1];

                if (attrs.enableBootstrapTitle === "true" && attrs.enableBootstrapTitle !== undefined)
                    element.find('button[title]').tooltip({
                        container: 'body'
                    })

                textarea.on('input keyup paste mouseup', function(event) {
                    var html = textarea.html();

                    if (html == '<br>') {
                        html = '';
                    }

                    html.replace("\n", "<br />", "g")

                    ngModelController.$setViewValue(html);
                });


                scope.isLink = false;

                //Used to detect things like A tags and others that dont work with cmdValue().
                function itemIs(tag) {
                    var selection = window.getSelection().getRangeAt(0);
                    if (selection) {
                        if (selection.startContainer.parentNode.tagName === tag.toUpperCase() || selection.endContainer.parentNode.tagName === tag.toUpperCase()) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }

                //Used to detect things like A tags and others that dont work with cmdValue().
                function getHiliteColor() {
                    var selection = window.getSelection().getRangeAt(0);
                    if (selection) {
                        var style = $(selection.startContainer.parentNode).attr('style');

                        if (!angular.isDefined(style))
                            return false;

                        var a = style.split(';');
                        for (var i = 0; i < a.length; i++) {
                            var s = a[i].split(':');
                            if (s[0] === 'background-color')
                                return s[1];
                        }
                        return '#fff';
                    } else {
                        return '#fff';
                    }
                }

                textarea.on('click keyup keydown focus mouseup', function(e) {
                    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
                        if(e.keyCode == 13) {
                            var docFragment = document.createDocumentFragment();

                            //add a new line
                            var newEle = document.createTextNode('\n');
                            docFragment.appendChild(newEle);

                            //add the br, or p, or something else
                            newEle = document.createElement('br');
                            docFragment.appendChild(newEle);

                            //make the br replace selection
                            var range = window.getSelection().getRangeAt(0);
                            range.deleteContents();
                            range.insertNode(docFragment);

                            //create a new range
                            range = document.createRange();
                            range.setStartAfter(newEle);
                            range.collapse(true);

                            //make the cursor there
                            var sel = window.getSelection();
                            sel.removeAllRanges();
                            sel.addRange(range);

                            return false;
                        }
                    }

                    $timeout(function() {
                        scope.isBold = scope.cmdState('bold') && scope.cmdValue('formatblock') != "h2";
                        scope.isUnderlined = scope.cmdState('underline');
                        scope.isStrikethrough = scope.cmdState('strikethrough');
                        scope.isItalic = scope.cmdState('italic');
                        scope.isSuperscript = itemIs('SUP'); //scope.cmdState('superscript');
                        scope.isSubscript = itemIs('SUB'); //scope.cmdState('subscript');
                        scope.isRightJustified = scope.cmdState('justifyright');
                        scope.isLeftJustified = scope.cmdState('justifyleft');
                        scope.isCenterJustified = scope.cmdState('justifycenter');
                        scope.isHeading = scope.cmdValue('formatblock') == "h2";
                        scope.isPre = scope.cmdValue('formatblock') == "pre";
                        scope.isBlockquote = scope.cmdValue('formatblock') == "blockquote";

                        scope.isOrderedList = scope.cmdState('insertorderedlist');
                        scope.isUnorderedList = scope.cmdState('insertunorderedlist');

                        scope.isLink = itemIs('A');
                    }, 10);
                });

                // model -> view
                ngModelController.$render = function() {
                    textarea.html(ngModelController.$viewValue);
                };

                scope.format = function(cmd, arg) {
                    document.execCommand(cmd, false, arg);
                }

                scope.cmdState = function(cmd, id) {
                    return document.queryCommandState(cmd);
                }

                scope.cmdValue = function(cmd) {
                    return document.queryCommandValue(cmd);
                }

                scope.createLink = function() {
                    var input = prompt('Enter the link URL');
                    if (input && input !== undefined)
                        scope.format('createlink', input);
                }

                scope.insertImage = function() {
                    var input = prompt('Enter the image URL');
                    if (input && input !== undefined)
                        scope.format('insertimage', input);
                }

                scope.setFont = function() {
                    scope.format('fontname', scope.font)
                }

                scope.setFontSize = function() {
                    scope.format('fontsize', scope.fontSize.value)
                }

                scope.setFontColor = function() {
                    scope.format('forecolor', scope.fontColor)
                }

                scope.setHiliteColor = function() {
                    scope.format('hiliteColor', scope.hiliteColor)
                }

                scope.format('enableobjectresizing', true);
                scope.format('styleWithCSS', true);


            }
        };
    })
    .factory('wysiwgGui', function() {

        var defaultMenu = [
            ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript'],
            ['font'],
            ['font-size'],
            ['font-color', 'hilite-color'],
            ['remove-format'],
            ['ordered-list', 'unordered-list', 'outdent', 'indent'],
            ['left-justify', 'center-justify', 'right-justify'],
            ['code', 'quote', 'paragragh'],
            ['link', 'image']
        ];

        var getMenuStyles = function() {
            return '<style>' +
                '   .wysiwyg-btn-group-margin{  margin-right:5px; }' +
                '   .wysiwyg-select{ height:30px;margin-bottom:1px;}' +
                '   .wysiwyg-colorpicker{ font-family: arial, sans-serif !important;font-size:16px !important; padding:2px 10px !important;}' +
                '</style>';
        }

        var getMenuTextArea = function() {
            return '<div ng-attr-style="resize:vertical;height:{{textareaHeight || \'80px\'}}; overflow:auto" contentEditable="true" class="content-write wysiwyg-textarea animated fadeIn" placeholder="Start writing..." ng-model="value"></div>';
        }

        var getMenuGroup = function() {
            return '<div class="btn-group btn-group-sm wysiwyg-btn-group-margin">'
        }

        var getMenuItem = function(item) {
            item = item.toLowerCase().replace(' ', '-');
            switch (item) {
                case 'bold':
                    return '<a href="#" title="Bold" class="boldLink" tabindex="-1" ng-click="format(\'bold\')" ng-class="{ active: isBold}">Bold</a>';
                    break;
                case 'heading':
                    return '<a href="#" title="Heading" class="headingLink" tabindex="-1" ng-click="format(\'formatblock\', \'h2\')"  ng-class="{ active: isHeading}">Heading</a>';
                    break;
                case 'italic':
                    return '<a href="#" title="Italic" class="italicLink" tabindex="-1" ng-click="format(\'italic\')" ng-class="{ active: isItalic}">Italic</a>';
                    break;
                case 'underline':
                    return '<button title="Underline" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'underline\')" ng-class="{ active: isUnderlined}"><i class="fa fa-underline"></i></button>';
                    break;
                case 'strikethrough':
                    return '<button title="Strikethrough" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'strikethrough\')" ng-class="{ active: isStrikethrough}"><i class="fa fa-strikethrough"></i></button>';
                    break;
                case 'subscript':
                    return '<button title="Subscript" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'subscript\')" ng-class="{ active: isSubscript}"><i class="fa fa-subscript"></i></button>';
                    break;
                case 'superscript':
                    return '<button title="Superscript" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'superscript\')" ng-class="{ active: isSuperscript}"><i class="fa fa-superscript"></i></button>';
                    break;
                case 'font':
                    return '<select tabindex="-1"  unselectable="on" class="form-control wysiwyg-select" ng-model="font" ng-options="f for f in fonts" ng-change="setFont()"></select>';
                    break;
                case 'font-size':
                    return '<select unselectable="on" tabindex="-1" class="form-control wysiwyg-select" ng-model="fontSize" ng-options="f.size for f in fontSizes" ng-change="setFontSize()"></select>';
                    break;
                case 'font-color':
                    return '<button title="Font Color" tabindex="-1" colorpicker="rgba" type="button" colorpicker-position="top" class="btn btn-default ng-valid ng-dirty wysiwyg-colorpicker wysiwyg-fontcolor" ng-model="fontColor" ng-change="setFontColor()">A</button>';
                    break;
                case 'hilite-color':
                    return '<button title="Hilite Color" tabindex="-1" colorpicker="rgba" type="button" colorpicker-position="top" class="btn btn-default ng-valid ng-dirty wysiwyg-colorpicker wysiwyg-hiliteColor" ng-model="hiliteColor" ng-change="setHiliteColor()">H</button>';
                    break;
                case 'remove-format':
                    return '<button title="Remove Formatting" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'removeFormat\')" ><i class="fa fa-eraser"></i></button>';
                    break;
                case 'ordered-list':
                    return '<button title="Ordered List" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'insertorderedlist\')" ng-class="{ active: isOrderedList}"><i class="fa fa-list-ol"></i></button>';
                    break;
                case 'unordered-list':
                    return '<button title="Unordered List" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'insertunorderedlist\')" ng-class="{ active: isUnorderedList}"><i class="fa fa-list-ul"></i></button>';
                    break;
                case 'outdent':
                    return '<button title="Outdent" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'outdent\')"><i class="fa fa-outdent"></i></button>';
                    break;
                case 'indent':
                    return '<button title="Indent" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'indent\')"><i class="fa fa-indent"></i></button>';
                    break;
                case 'left-justify':
                    return '<button title="Left Justify" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'justifyleft\')" ng-class="{ active: isLeftJustified}"><i class="fa fa-align-left"></i></button>';
                    break;
                case 'center-justify':
                    return '<button title="Center Justify" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'justifycenter\')" ng-class="{ active: isCenterJustified}"><i class="fa fa-align-center"></i></button>';
                    break;
                case 'right-justify':
                    return '<button title="Right Justify" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'justifyright\')" ng-class="{ active: isRightJustified}"><i class="fa fa-align-right"></i></button>';
                    break;
                case 'code':
                    return '<a href="#" title="Code" class="codeLink" tabindex="-1" ng-click="format(\'insertHTML\', \'<pre contenteditable></pre><br>\')"  ng-class="{ active: isPre}">Code</a>';
                    break;
                case 'quote':
                    return '<a href="#" title="Quote" tabindex="-1" ng-click="format(\'insertHTML\', \'<blockquote></blockquote><br>\')"  ng-class="{ active: isBlockquote}">Quote</a>';
                    break;
                case 'paragragh':
                    return '<button title="Paragragh" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'insertParagraph\')"  ng-class="{ active: isParagraph}">P</button>';
                    break;
                case 'link':
                    return '<a href="#" ng-show="!isLink" class="linkLink" tabindex="-1" title="Link" ng-click="createLink()">Link</button>' +
                        '<a href="#" ng-hide="!isLink" title="Unlink" ng-click="format(\'unlink\')">Unlink</button>';
                    break;
                case 'image':
                    return '<button title="Image" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="insertImage()"><i class="fa fa-picture-o"></i> </button>';
                    break;
                default:
                    console.log('Angular.wysiwyg: Unknown menu item.')
                    return '';
                    break;
            }

        }

        var createMenu = function(menu) {

            if (angular.isDefined(menu) && menu !== '')
                menu = stringToArray(menu)
            else
                menu = defaultMenu;

            var menuHtml = '<div class="wysiwyg-menu">';
            var sidebarHtml = '';

            menuHtml += getMenuStyles();

            menuHtml += '<aside class="sidebar hidden">';
            for (var i = 0; i < menu.length; i++) {
                menuHtml += getMenuGroup();
                for (var j = 0; j < menu[i].length; j++) {
                    menuHtml += getMenuItem(menu[i][j]);
                }
                menuHtml += '</div>';
            }

            menuHtml += '</aside>';
            menuHtml += getMenuTextArea();
            menuHtml += '</div>';
            return menuHtml;
        }



        var stringToArray = function(string) {
            var ret;
            try {
                ret = JSON.parse(string.replace(/'/g, '"'));
            } catch (e) {}
            return ret;
        }

        return {
            createMenu: createMenu
        }

    });