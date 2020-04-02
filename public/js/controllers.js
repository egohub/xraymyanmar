angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $log,$timeout, $ionicLoading, DataLoader, MovieService) {
    var localUrl = '/api/';
    $scope.news = [];
    $scope.storage = '';
    $scope.moreItems = false;
    $scope.loading = $ionicLoading.show({
        template: '<i class="icon ion-loading-c"></i> Loading Data',

        showBackdrop: false,
        showDelay: 10
    });
    $scope.loadPosts = function() {

        // Get all of our posts
        // DataLoader.get(localUrl).then(function(response) {

        $scope.news = MovieService.all();
        $ionicLoading.hide();
        $scope.moreItems = true;

    };
 
    $scope.loadPosts();
    paged = 2;
    // Load more (infinite scroll)
    $scope.loadMore = function() {
        if (!$scope.moreItems) {
            return;
        }
        var pg = paged++;
        console.log('loadMore ' + pg);
        $timeout(function() {

            DataLoader.get(localUrl + pg).then(function(response) {
                console.log('Getting Data from ' + localUrl + pg)
                angular.forEach(response.data.results, function(value, key) {
                    $scope.news.push(value);
                });
                // $scope.news = response.data.results;
                if (response.data <= 0) {
                    $scope.moreItems = false;
                }
            }, function(response) {
                $scope.moreItems = false;
                $log.error(response);
            });
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.$broadcast('scroll.resize');
        }, 3000);

    }
    $scope.moreDataExists = function() {
        return $scope.moreItems;
    }

    $scope.doRefresh = function() {
        $timeout(function() {
            $scope.loadPosts();
            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000);
    };
})

.controller('DashDetailCtrl', function($scope, $stateParams, $ionicLoading, MovieService) {

    $scope.loading = $ionicLoading.show({
        template: '<i class="icon ion-loading-c"></i> Loading Data',

        showBackdrop: false,
        showDelay: 10
    });

    $scope.news = MovieService.get($stateParams.id);

    // var myObj = JSON.parse(window.localStorage['news']);
    // console.log(myObj.lenght);
    $ionicLoading.hide();
})

.controller('ChatsCtrl', function($scope, MovieService, DataLoader, $timeout, $log, $ionicModal, $ionicPopup) {
    var localUrl = 'http://localhost:3000/api/';

    $scope.moreItems = false;

    $scope.loadPosts = function() {

        // Get all of our posts
        // DataLoader.get(localUrl).then(function(response) {

        $scope.posts = MovieService.all();

        $scope.moreItems = true;

    };
    //     console.log(localUrl, response.data);

    // }, function(response) {
    //     console.log(localUrl, response.data);
    // });


    // Load posts on page load
    $scope.loadPosts();
    var paged = 2;
    // Load more (infinite scroll)
    $scope.loadMore = function() {
        if (!$scope.moreItems) {
            return;
        }
        var pg = paged++;
        console.log('loadMore ' + pg);
        $timeout(function() {

            DataLoader.get(localUrl + pg).then(function(response) {
                console.log('Getting Data from ' + localUrl + pg)
                angular.forEach(response.data.data, function(value, key) {
                    $scope.posts.push(value);
                });

                if (response.data.totalCount <= 0) {
                    $scope.moreItems = false;
                }
            }, function(response) {
                $scope.moreItems = false;
                $log.error(response);
            });
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.$broadcast('scroll.resize');
        }, 1000);

    }
    $scope.moreDataExists = function() {
        return $scope.moreItems;
    }

    // Pull to refresh
    $scope.doRefresh = function() {
        $timeout(function() {
            $scope.loadPosts();
            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000);
    };
    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.showInfo = function(pet) {
        $ionicPopup.alert({
            title: pet.title,
            template: '<img style="width: 100%" src="' + pet.img + '"> <p> {{pet.details.download}} </p> '
        });
    }

})

.controller('ChatDetailCtrl', function($scope, $stateParams) {

})

.controller('AccountCtrl', function($scope, DataLoader) {
    $scope.settings = {
        enableFriends: true
    };
    var cat = 'https://channelmyanmar.org/wp-json/wp/v2/categories';
    DataLoader.get(cat).then(function(response) {

        $scope.category = response.data;
    });
});

