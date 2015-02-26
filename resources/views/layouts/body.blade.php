<?php
	//Default variables for body
	if(!isset($headerInclude)) { $headerInclude = true; }
	if(!isset($sidebarInclude)) { $sidebarInclude = true; }
	if(!isset($footerInclude)) { $footerInclude = true; }
	if(!isset($navigationInclude)) { $navigationInclude = true; }
	if(!isset($pageId)) { $pageId = ''; }
	if(!isset($pageAngular)) { $pageAngular = false; }
	if(!isset($pageDesc)) {
		$pageDesc = 'Programmar allows you to always keep up to day with the latest news, tips and how-to\'s. Follow your favourite developers and create a custom digest of the best and most popular development articles.';
	}
?>
<!DOCTYPE html>
<html lang="en" @if($pageAngular) ng-app="com.programmar" @endif>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="description" content="{{ $pageDesc }}">
	<title>{{ $pageName }}</title>
	<link href="/css/app.css" rel="stylesheet">
	<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
		<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
	<![endif]-->
</head>
<body id="{{ $pageId }}" @if($pageAngular) ng-controller="{{ $pageController }}" @endif>
	<progress class="progress-loader" role="progressbar" ng-show="loaderShow" style="width: <% pageLoaded %>%;"></progress>
	<div class="wrapper clearfix" role="main">
		<aside class="sidebar sa fadeInLeft" role="menu">
			@include('common/navigation')
			@yield('sidebar')
		</aside>

		<div class="expanded-info sa popIn" ng-show="expandMenu">
			@yield('expandSection')
		</div>

		<article class="content sa fadeInUp" role="article" ng-cloak ng-hide="loaderShow" ng-class="{slideRight: expandMenu, faded: expandMenu}">
			@yield('content')
			@if($footerInclude)
				@include('common/footer')
			@endif
		</article>
	</div>
	<script src="/js/vendor/jquery.min.js"></script>
	<script src="/js/vendor/bootstrap.min.js"></script>
	@if($pageAngular)
		<script src="/js/vendor/angular.min.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.0-rc.5/angular-resource.js"></script>
	@endif
	@yield('scripts')
	@if($pageAngular)
		<script src="/app/_core/config.js"></script>
		<script src="/app/_core/controller.js"></script>
		<script src="/app/_core/directive.js"></script>
		<script src="/app/_core/filter.js"></script>
		<script src="/app/_core/services/user_api.js"></script>
		<script src="/app/_core/services/article_api.js"></script>
		<script src="/app/_core/services/articles_api.js"></script>
		<script src="/app/_core/services/messages.js"></script>
		@foreach(['service', 'config', 'controller', 'directive', 'filter'] as $fileName)
			<script src="/app/{{ $pageAngular }}/{{ $fileName }}.js"></script>
		@endforeach
	@endif
	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-59897932-1', 'auto');
	  ga('send', 'pageview');
	</script>
</body>
</html>
