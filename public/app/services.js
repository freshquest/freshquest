//this module defines "services"
//"services" are often back-end services, but they can basically be any application-wide singleton you want to make accessible
//Here, I use the restangular library to create services for our mongodb collections.

var mod = angular.module('freshquest.service', ['restangular']);

//here's how we use Restangular to set up a service for farms collection
mod.service('farms',function(Restangular) {
	return {
		one: function(id) { return Restangular.one('~farm', id) },
		all: Restangular.all('~farm')
	}
});

mod.service('productList', function() {
	var dict = {
		"Acorn Squash" : "/img/product/acorn_squash.png",
		"Apples" : "/img/product/apple.png",
		"Apples, Gala" : "/img/product/apple.png",
		"Bell Peppers" : "/img/product/bell_pepper.png",
		"Blueberries" : "/img/product/blueberries.png",
		"Broccoli" : "/img/product/broccoli.png",
		"Carrots" : "/img/product/carrot.png",
		"Celery" : "/img/product/celery.png",
		"Chili Peppers" : "/img/product/chili_pepper.png",
		"Eggplant" : "/img/product/eggplant.png",
		"Lettuce" : "/img/product/lettuce.png",
		"Mushrooms" : "/img/product/mushroom.png",
		"Onions" : "/img/product/onion.png",
		"Potatoes" : "/img/product/potato.png",
		"Pumpkin" : "/img/product/pumpkin.png",
		"Radishes" : "/img/product/radish.png",
		"Summer Squash" : "/img/product/squash.png",
		"Strawberries" : "/img/product/strawberry.png",
		"Sugar Snap Peas" : "/img/product/sugar_snap.png",
		"Tomatoes" : "/img/product/tomato.png",
		"Zucchini" : "/img/product/zucchini.png",
		"blank": "/img/product/blank.png"
	};
	var result = [];
	Object.keys(dict).forEach( function(key) {
		result.push(
		{
			name: key,
			iconURL: dict[key]
		});
	});
	return result;
});