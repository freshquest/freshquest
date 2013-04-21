//we could define custom directives in this file, but right now we don't have any


var mod = angular.module('freshquest.directive', []);

mod.directive('fqtitle', function () {
	return {
		restrict: 'E',
		transclude: true,
		template: 
			'<div class="row lineBottom name"> \
				<div class="twelvecol"> \
					<h2 ng-transclude></h2> \
				</div> \
			</div>'
	}
});
