//this module defines "services"
//"services" are often back-end services, but they can basically be any application-wide singleton you want to make accessible
//Here, I use the restangular library to create services for our mongodb collections.

angular.module('freshquest.service', ['restangular']).
    //here's how we use Restangular to set up a service for farms collection
    service('farms',function(Restangular) {
    	return {
    		one: function(id) { return Restangular.one('~farm', id) },
    		all: Restangular.all('~farm')
    	}
    });