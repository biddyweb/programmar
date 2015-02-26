<?php
	$pageName = 'Programmar - All';
	$pageId = "home";
	$pageAngular = 'home';
	$pageController = 'HomeCtrl';
?>
@extends('layouts/body')

@section('content')
	<section class="article-list">
		<div ui-view class="animation"></div>
		<div class="pagination-container clearfix" ng-show="lastPage > 1">
			<a href="#" ng-click="prev();" ng-show="currentPage > 1" class="f-left" ng-class="{isLastPage: brand-primary}">Previous</a>
			<a href="#" ng-click="next();" ng-show="currentPage != lastPage && lastPage > 1" class="f-right brand-primary">Next</a>
		</div>
	</section>
@endsection

@section('scripts')
	<script src="//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.13/angular-ui-router.min.js"></script>
@endsection