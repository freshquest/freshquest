//This file defines the controllers.
//Each controller corresponds to a page
//They define that page's "scope", which are the variables accessible to that page for templating.
//The "$scope" variable is an AngularJS "service", and it is injected automatically at runtime.
//We can put whatever data we want in the scope. Arbitrary JavaScript objects, doesn't matter.

//here, the 'farms' service is also automatically injected
function FarmsController($scope,farms){
    $scope.farmList = farms.getList();       //we set the farms as a variable on the scope, which will make it accessible to the partial
                                             //note that farms is a promise. Angular's templates will deal with this elegantly. 

    //This is just to verify that Restangular is working correctly
    // $scope.farmList.then(function(resolvedFarmsList){
    //     console.log('resolvedFarmsList',resolvedFarmsList);
    // });
}

function FarmDetailController($scope,$routeParams,Restangular){
    $scope.farm = Restangular.one('~farm', $routeParams.slug).get();

    // $scope.farm.then(function(resolvedFarm){
    //     console.log('resolvedFarm',resolvedFarm);
    // });
}


function ProduceController($scope){
    //TODO
}

function ShoppingListController($scope){
    //TODO
}

