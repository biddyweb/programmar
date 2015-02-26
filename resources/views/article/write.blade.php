<?php
	$pageName = 'Programmar - Write';
	$pageId = 'article';
	$pageAngular = 'editor';
	$pageController = 'EditorCtrl';
	$footerInclude = false;
	$navigationInclude = false;
?>
@extends('layouts/body')

@section('sidebar')
	<nav role="navigation">
		<ul>
			<li><a href="#" class="boldLink-trigger" ng-click="clickItem('boldLink');" tabindex="-1">Bold</a></li>
			<li><a href="#" class="italicLink-trigger" ng-click="clickItem('italicLink');" tabindex="-1">Italic</a></li>
			<li><a href="#" class="headingLink-trigger" ng-click="clickItem('headingLink');" tabindex="-1">Heading</a></li>
			<li><a href="#" class="codeLink-trigger" ng-click="clickItem('codeLink');" tabindex="-1">Code</a></li>
			<li><a href="#" class="linkLink-trigger" ng-click="clickItem('linkLink');" tabindex="-1">Link</a></li>
		</ul>

		<ul>
			<li><a href="#" class="saveLink" ng-click="saveDocument();" tabindex="-1">Save</a></li>
			<li><a href="#" class="publishLink brand-primary" ng-click="publishArticle();" tabindex="-1">Publish</a></li>
		</ul>

		<ul ng-show="slug != 'write'">
			<li><a href="#" class="deleteLink brand-danger" ng-click="deleteArticle();" tabindex="-1">Delete</a></li>
		</ul>
	</nav>
@endsection

@section('content')
	<div class="common-container">
    	<input type="hidden" ng-model="article.user" ng-cloak>
		<input type="text" class="title animated fadeIn" ng-model="article.title" ng-cloak ng-blur="saveDocument()" ng-change="canSaveChange();" placeholder="Title...">
	</div>

	<input type="hidden" ng-model="article.name" ng-cloak>
	<wysiwyg ng-model="article.content" ng-keydown="checkCharacter();" ng-change="canSaveChange();" ng-cloak enable-bootstrap-title="false" textarea-menu="<% article.customMenu %>"></wysiwyg>
@endsection

@section('scripts')
	<script src="/js/vendor/bootstrap-colorpicker.js"></script>
	<script src="/js/vendor/angular-wysiwyg.js"></script>
@endsection
