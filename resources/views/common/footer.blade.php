<footer class="main-footer container animated fadeIn" @if($pageAngular) ng-hide="loaderShow" ng-cloak @endif ng-class="{slideRight: moveLeft}">
	<div class="f-left" ng-class="{faded: moveLeft}">
		<a href="https://github.com/dthms/sassy-flags" target="_blank" class="footer-item flag gb">Made in England</span>
		<a href="http://layerful.com" target="_blank" class="footer-item layerful">Made by Layerful</a>
	</div>

	<div class="f-right" ng-class="{faded: moveLeft}">
		<a href="http://twitter.com/_programmar" target="_blank">Twitter</a>
		<a href="/terms">Terms</a>
	</div>
</footer>