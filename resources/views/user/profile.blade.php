<?php
	$pageName = 'Programmar - ' . $user->name;
	$pageDesc = 'Programmar allows you to always keep up to day with the latest news, tips and how-to\'s.
				Follow your favourite subjects or people and create a custom digest of the best and most
				popular development articles.';
	$pageId = 'profile';
	$pageAngular = 'profile';
	$pageController = 'ProfileCtrl';
?>
@extends('layouts/body')

@section('expandSection')
	<div class="common-container top-section">
		<span class="title">Followers</span>
		<div class="info" ng-show="userData.followers.length == 0">
			<span>Looks like this user has no followers.</span>
		</div>

		<div class="info" ng-show="userData.followers.length > 0">
			<span><% userData.followers.length %> Followers.</span>
		</div>
	</div>

	<div class="overflow-container">
		<div class="user" ng-repeat="(key, user) in userData.followers">
			<img ng-src="<% user.user_avatar %>" class="profile-image img-circle">
			<a class="link" href="/dev/<% user.user_slug %>"><% user.user_name %></a>
		</div>
	</div>
@endsection

@section('content')
<div class="user-data-container animated fadeInUp" ng-hide="userLoading" ng-cloak>
	<div class="common-container top-section">
		<div class="clearfix">
			<img ng-src="<% userData.avatar %>" class="img-circle profile-image f-left">
			<div class="f-left clearfix">
				<span class="title"><% userData.name %></span>
				<div class="info">
					<a href="#" ng-click="openMenu();"><% userData.followers.length %> Followers</a>
					<a href="#" ng-show="showArticleContent" ng-click="showEnjoys();"><% userData.enjoys.length %> Enjoyed</a>
					<a href="#" ng-show="showEnjoyContent" ng-click="showArticles();"><% articlesData.length %> Article<span ng-show="articlesData.length > 1 || articlesData.length == 0">s</span></a>
				</div>
			</div>
			<div class="f-right">
				<a href="http://github.com/<% userData.username %>" target="_blank" class="btn btn-gray octicon octicon-mark-github"></a>
				@if(Auth::check())
					<div class="follow-buttons" ng-hide="userData.self">
						<a href="#" class="btn btn-gray" ng-show="userData.your_following" ng-click="unfollow();"><% unfollowTxt %></a>
						<a href="#" class="btn btn-primary" ng-hide="userData.your_following" ng-click="follow();"><% followTxt %></a>
					</div>
				@endif
			</div>
		</div>
	</div>

	<div class="article-listing animated fadeInUp" ng-cloak ng-hide="articlesLoading" ng-show="showArticleContent">
		<div class="missing-text animated fadeInUp" ng-show="articlesData.length == 0">
			<% userData.name %> currently has no articles
		</div>
		<div class="common-container list clearfix" ng-repeat="(key, article) in articlesData | orderBy:'last_updated':true">
			<a class="title" href="/article/<% article.slug %>"><% article.title %></a>
			<div class="info">
				<span><% article.enjoys.length %> Enjoy<span ng-show="article.enjoys.length > 1 || article.enjoys.length == 0">s</span></span>
			</div>
		</div>
	</div>

	<div class="article-listing animated fadeInUp" ng-cloak ng-show="showEnjoyContent">
		<div class="missing-text animated fadeInUp" ng-show="userData.enjoys.length == 0">
			<% userData.name %> currently hasn't enjoyed anything!
		</div>
		<div class="common-container list clearfix" ng-repeat="(key, article) in userData.enjoys | orderBy:'last_updated':true">
			<a class="title" href="/article/<% article.article_data.slug %>"><% article.article_data.title %></a>
			<div class="info">
				<a href="/dev/<% article.article_data.user_slug %>"><% article.article_data.userName %></a>
				<span><% article.enjoys.length %> Enjoy<span ng-show="article.enjoys.length > 1 || article.enjoys.length == 0">s</span></span>
			</div>
		</div>
	</div>
</div>
@endsection

@section('scripts')
	<script src="/js/vendor/github.js"></script>
@endsection