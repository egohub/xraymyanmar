angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    

      .state('tabsController.home', {
    url: '/home',
    views: {
      'tab1': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('tabsController.popular', {
    url: '/popular',
    views: {
      'tab2': {
        templateUrl: 'templates/popular.html',
        controller: 'popularCtrl'
      }
    }
  })

  .state('tabsController.categories', {
    url: '/categories',
    views: {
      'tab3': {
        templateUrl: 'templates/categories.html',
        controller: 'categoriesCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

$urlRouterProvider.otherwise('/page1/home')


});