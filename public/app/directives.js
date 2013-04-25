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

mod.directive('addtolist', function () {
	return function (scope, element, attrs) {
		element.bind("click", function () {
			if (attrs.boothid && attrs.boothid.length &&
				attrs.item && attrs.item.length) {
				scope.addToShoppingList(attrs.boothid, attrs.item);
				scope.$apply();
			}
		})
	}
});

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

Array.prototype.removeItem = function(item) {
	this.remove(this.indexOf(item));
};

mod.directive('removefromlist', function () {
	return {
		scope: {
			sheds: '&',
			shed: '&',
			booth: '&',
			product: '&',
		},
		link: function (scope, element, attrs) {
			element.bind("click", function () {
				var boothID = scope.booth().id;
				var product = scope.product().item;
				if (boothID && boothID.length &&
					product && product.length) {
					scope.$parent.removeFromShoppingList(boothID, product, function() {
						var sheds = scope.sheds();
						var shed = scope.shed();
						var booth = scope.booth();
						if (booth.products.length > 1)
							booth.products.removeItem(product);
						else if (shed.length > 1)
							shed.removeItem(booth);
						else
							delete sheds[booth.shed];
					});
					scope.$apply();
				}
			})
		}
	}
});