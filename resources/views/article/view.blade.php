<?php
	$pageName = 'Programmar - '. $data->title;
	$pageDesc = 'Programmar allows you to always keep up to day with the latest news, tips and how-to\'s.
				Follow your favourite subjects or people and create a custom digest of the best and most
				popular development articles.';
	$pageId = 'article';
	$pageAngular = 'article';
	$pageController = 'ArticleCtrl';

	if(Auth::check()) {
		if($data->user_id === Auth::user()->id || Auth::user()->account_type === 'admin' || Auth::user()->account_type === 'supervisor') {
			$additionalButtons = '<li><a href="/edit/'.$data->slug.'" class="brand-primary">Edit</a></li>';
		}
	}
?>
@extends('layouts/body')
@section('content')

<div class="top-loader" ng-show="loaderShow" style="width: <% pageLoaded %>%;"></div>

@section('leftSlideOut')
	<div class="container absolute" ng-show="showEnjoys" ng-cloak set-class-when-at-top="fixed">
		<div class="right-container animated fadeInLeft">
			<div class="common-container top-section">
				<span class="title">Enjoys</span>
				<div class="info" ng-show="article.enjoys.length == 0">
					<span class="hide-on-mobile">No one has enjoyed this article yet.</span>
				</div>

				<div class="info" ng-show="article.enjoys.length > 0">
					<span class="hide-on-mobile"><% article.enjoys.length %> Enjoys</span>
				</div>
			</div>
			<div class="overflow-container">
				<div class="user" ng-repeat="(key, user) in article.enjoys">
					<img ng-src="<% user.user_avatar %>" class="profile-image img-circle">
					<a class="link" href="/dev/<% user.user_slug %>"><% user.user_name %></a>
				</div>
			</div>
		</div>
	</div>
@endsection

<div class="container main-container" ng-class="{slideRight: moveLeft}">
	<div ng-class="{faded: moveLeft}" ng-click="closeRightSection();">
		<article class="animated fadeInUp" ng-hide="articleLoading" ng-cloak>
			<div class="title">{{$data->title}}</div>
			<div class="info">
					<a href="/dev/{{$data->userName}}"><% article.user %></a>
			</div>
			<article class="content wrtie-area" ng-model="article.content" contenteditable="false"></article>
			<div class="bottom-bar">
				<div class="f-left">
					<a href="http://pgmr.co/{{$data->slug}}" class="gray" id="copyLink" data-clipboard-text="http://pgmr.co/{{$data->slug}}">pgmr.co/{{$data->slug}}</a>
				</div>

				<div class="f-right">
					@if(Auth::check())
						<a href="#" ng-click="enjoy()" class="enjoyed" ng-hide="article.enjoyed">Enjoy?</a>
						<a href="#" ng-click="enjoy()" class="enjoyed" ng-show="article.enjoyed">Enjoyed</a>
					@else
						<a href="/oauth/github" class="enjoyed">Enjoy?</a>
					@endif
					<div class="inline-block users">
						<span class="user" ng-repeat="(key, user) in article.enjoys | limitTo:3">
							<a href="/dev/<% user.user_slug %>"><img ng-src="<% user.user_avatar %>" class="profile-image img-circle"></a>
						</span>
						<a class="more" ng-click="showEnjoySection();" ng-show="article.enjoys.length > 3">+<% article.enjoys.length - 3 %></a>
					</div>
				</div>
			</div>
		</article>
		</div>
</div>
@endsection

@section('scripts')
	<script src="/js/vendor/z-clip.min.js"></script>
@endsection
