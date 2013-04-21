//This file defines the controllers.
//Each controller corresponds to a page
//They define that page's "scope", which are the variables accessible to that page for templating.
//The "$scope" variable is an AngularJS "service", and it is injected automatically at runtime.
//We can put whatever data we want in the scope. Arbitrary JavaScript objects, doesn't matter.

function addToShoppingList($http) {
    return function (boothid, item) {
        var data = { id: boothid, item: item };
        $http.post('/api/~user_shopping_list_item', data).
        success(function (data, status) {
            var notice = $('<div id="notice">You added ' + item + ' to your shopping list.</div>');
            notice.appendTo(document.body);
            notice.css('top', $('header.main').outerHeight());
            notice.hide();
            notice.slideDown(500).delay(3000).slideUp(500, function(){$(this).remove()});
        }).
        error(function (data, status) {
            var notice = $('<div id="notice" class="error">An error occurred adding ' + item + ' to your shopping list. Please reload the page and try again.</div>');
            notice.appendTo(document.body);
            notice.css('top', $('header.main').outerHeight());
            notice.hide();
            notice.slideDown(500).delay(6000).slideUp(500, function(){$(this).remove()});
        });
    }
}

//here, the 'farms' service is also automatically injected
function FarmsController($scope,farms){
    $scope.farmList = farms.all.getList();       //we set the farms as a variable on the scope, which will make it accessible to the partial
                                             //note that farms is a promise. Angular's templates will deal with this elegantly. 

    //This is just to verify that Restangular is working correctly
    // $scope.farmList.then(function(resolvedFarmsList){
    //     console.log('resolvedFarmsList',resolvedFarmsList);
    // });
}

function FarmDetailController($scope,$routeParams,farms,$http){
    $scope.farm = farms.one($routeParams.slug).get();

    $scope.addToShoppingList = addToShoppingList($http);

    // $scope.farm.then(function(resolvedFarm){
    //     console.log('resolvedFarm',resolvedFarm);
    // });
}

function ProduceController($scope, product){
    $scope.productList = product.productList;
}

function ProduceDetailController($scope, $routeParams, product, $http) {
    var productName = $routeParams.item;
    $scope.productIconImage = product.productImage(productName);

    $scope.product = product.one(productName).get().then(function(result) {
        result.booths.forEach(function(booth) {
            booth.sellSheet = _.filter(booth.sellSheet, function(item) {
                return productName == item.item;
            });
            booth.hasVarieties = false; // Eventually, we'll set this to true when they're selling a sub-variety
        })
        return result;
    });

    $scope.addToShoppingList = addToShoppingList($http);

    // $scope.product.then(function(resolved){
    //     console.log('resolved',resolved);
    // });
}


function ShoppingListController($scope, user){
    $scope.shoppingList = user.shoppingList.getList();

    $scope.sheds = $scope.shoppingList.then(function(result) {
        return _.groupBy(result, function(item) {
            return item.shed;
        })
    });

    $scope.shoppingListIsEmpty = $scope.shoppingList.then(function(result) {
        return result.length == 0;
    });

    // $scope.sheds.then(function(resolved){
    //     console.log('resolved',resolved);
    // });
}

