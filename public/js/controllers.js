angular.module('starter.controllers', [])
  
.controller('ChatsCtrl', function($scope, $ionicLoading, NewsData, NewsStorage) {
    
    $scope.news = [];
    $scope.storage = '';
    
    $scope.loading = $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Loading Data',

      showBackdrop: false,
      showDelay: 10
    });
    
    NewsData.async().then(
        function() {
            $scope.news = NewsData.getAll();
            $ionicLoading.hide();
        },
       
        function() {
            $scope.news = NewsStorage.all();
            $scope.storage = 'Data from local storage';
          console.log($scope.news);
            $ionicLoading.hide();
        },
        
        function() {}
    );

})

.controller('DashCtrl', function( $scope, $http, DataLoader, $timeout, $log ) {

  var singlePostApi = 'https://xmxx.herokuapp.com/posts/', postsApi ='https://channelmyanmar.org/wp-json/wp/v2/posts/';

  $scope.moreItems = false;

  $scope.loadPosts = function() {

    // Get all of our posts
    DataLoader.get( postsApi ).then(function(response) {

      $scope.posts = response.data;

      $scope.moreItems = true;

      console.log(postsApi, response.data);

    }, function(response) {
      console.log(postsApi, response.data);
    });

  }

  // Load posts on page load
  $scope.loadPosts();

  paged = 2;

  // Load more (infinite scroll)
  $scope.loadMore = function() {

    if( !$scope.moreItems ) {
      return;
    }

    var pg = paged++;

    console.log('loadMore ' + pg );

    $timeout(function() {

      DataLoader.get( postsApi + '?page=' + pg ).then(function(response) {

        angular.forEach( response.data, function( value, key ) {
          $scope.posts.push(value);
        });

        if( response.data.length <= 0 ) {
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
  
    $timeout( function() {

      $scope.loadPosts();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  };
    
})

.controller('DashDetailCtrl', function($scope, $stateParams, DataLoader, $ionicLoading) {

   $scope.loading = $ionicLoading.show({
      template: '<i class="icon ion-loading-c"></i> Loading Data',

      showBackdrop: false,
      showDelay: 10
    });
   
   var hero = 'https://xraymovie.herokuapp.com/';
    DataLoader.get('/'+$stateParams.id).then(function(response) {
    console.log(response.data);
      $ionicLoading.hide();
      $scope.posts = response.data;
       
 })
  
})

.controller('ChatsxxCtrl', function($scope) {
})

.controller('ChatDetailCtrl', function($scope, $stateParams) {
  
})

.controller('AccountCtrl', function($scope, DataLoader) {
  $scope.settings = {
    enableFriends: true
  };
  var cat = 'http://channelmyanmar.org/wp-json/wp/v2/categories';
 DataLoader.get( cat ).then(function(response) {

      $scope.category = response.data;
 });
});
