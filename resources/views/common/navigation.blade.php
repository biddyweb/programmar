<div class="logo-container">
	<a href="https://github.com/Layerful/programmar" target="_blank" class="version">v2.0</a>
	<a href="/" class="logo">Programmar.io</a>
</div>

@if($navigationInclude)
	<nav role="navigation">
		<ul>
			<li><a href="/write" class="btn btn-primary">Write</a></li>
		</ul>

		@if(Auth::check())
			<ul>
				<li><a href="/dev/{{ Auth::user()->username }}">Me</a></li>
				<li><a href="/notifications">Notifications</a></li>
			</ul>
		@endif

		<ul>
			@if(Auth::check())
				<li><a href="/#/following/1" ng-click="changePage('following')" ng-class="{active: currentView == 'following'}">Following</a></li>
			@endif
			<li><a href="/#/popular/1" ng-click="changePage('popular')" ng-class="{active: currentView == 'popular'}">Popular</a></li>
			<li><a href="/#/all/1" ng-click="changePage('all')" ng-class="{active: currentView == 'all'}">Latest</a></li>
		</ul>

		<ul>
			@if(Auth::check())
				<li><a href="/logout">Logout</a></li>
			@else
				<li><a href="/oauth/github">Sign in</a></li>
			@endif
		</ul>
	</nav>
@endif