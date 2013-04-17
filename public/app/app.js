/*jsl:import controllers.js */

//we define our app "freshquest" here
var app = angular.module('freshquest', ['freshquest.service','freshquest.directive']);

//define our app's routes here, and map them to controllers and HTML fragment ("partial")
//this will automatically integrate with the "view" directive on index.html
app.config(function($routeProvider, RestangularProvider) {
    $routeProvider.
        when('/home', {templateUrl: 'app/partials/home.html'}).
        when('/farms', {templateUrl: 'app/partials/farms.html',controller : FarmsController}).
        when('/farm/:slug', {templateUrl: 'app/partials/farmDetail.html',controller : FarmDetailController}).
        when('/produce', {templateUrl: 'app/partials/produce.html',controller : ProduceController}).
        when('/shopping-list', {templateUrl: 'app/partials/shopping-list.html',controller : ShoppingListController}).
        when('/about', {templateUrl: 'app/partials/about.html'}).
        when('/login', {templateUrl: 'app/partials/login.html'}).
        otherwise({redirectTo: '/home'});           //default route


    //do some config on Restangular as well
    RestangularProvider.setBaseUrl('/api');
});

//This is the app entry point.
//Anything that needs to be done once, when the app is first run, is done here.
app.run(function(){
    //there isn't actually anything we need to do currently
});

// Expects a number 0 to 5
app.filter('stars', function() {
    return function(rating) {
        var result = '';
        rank = Math.round(rating);
        for(i=0; i<5; i++) {
            if (i < rank)
                result += '<span class="on">&#9733;</span>';
            else
                result += '<span>&#9733;</span>';
        }
        return result;
    };
});

// Expects a marketDayBooth
app.filter('shedAndStall', function() {
    return function(marketDayBooth) {
        if (!marketDayBooth) return '';
        var components = [];
        if (marketDayBooth.shed)
            components.push('Shed ' + marketDayBooth.shed);
        if (marketDayBooth.stall)
            components.push('Stall ' + marketDayBooth.stall);
        return components.join(', ');
    };
});
