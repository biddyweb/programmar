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

@section('expandSection')
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
@endsection

@extends('layouts/body')
@section('content')
	<article class="animated fadeInUp" ng-hide="articleLoading" ng-cloak>
		<div class="common-container">
			<div class="title">{{$data->title}}</div>
			<div class="info"><a href="/dev/{{$data->userName}}"><% article.user %></a></div>
		</div>

		<article class="content-write" ng-model="article.content" contenteditable="false"></article>

		<div class="bottom-bar">
			<div class="f-left">
				<a href="http://pgmr.co/{{$data->slug}}" class="gray" id="copyLink" data-clipboard-text="http://pgmr.co/{{$data->slug}}">
					<span>pgmr.co/{{$data->slug}}</span>
					pgmr.co/{{$data->slug}}
				</a>
			</div>

			<div class="f-right" id="highfives" ng-hide="loaderShow">
				@if(Auth::check())
					<div class="cont">
						<a href="#" ng-hide="article.enjoyed" class="btn enjoy-btn sa" ng-cloak ng-click="enjoy()">Highfive!</a>

						<a href="/dev/<% userData.username %>" ng-cloak ng-show="article.enjoyed" class="face sa inline-block" style="background-image:url(<% userData.avatar %>)"></a>
						<span class="inline-block faces-cont">
							<a href="/dev/<% user.user_slug %>" class="face sa inline-block" style="background-image:url(<% user.user_avatar %>)" ng-repeat="(key, user) in article.enjoys | limitTo:limit"></a>
						</span>

						<div class="num sa" ng-click="openMenu();" ng-show="article.enjoys.length > limit">+<% article.enjoys.length - limit %></div>
					</div>
				@endif
			</div>
		</div>
	</article>
@endsection

@section('scripts')
	<script src="/js/vendor/z-clip.min.js"></script>
@endsection
