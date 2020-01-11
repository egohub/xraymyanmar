angular.module('starter.services', [])


.factory('DataLoader', function( $http) {

  return {
    get: function(url) {
      // Simple index lookup
      return $http.get( url );
    }
  }

})


.factory('NewsData', function($http, $q, NewsStorage) {
    
    var json = 'https://channelmyanmar.org/wp-json/wp/v2/posts/';

    var deferred = $q.defer();
    var promise = deferred.promise;
    var data = [];
    var service = {};
    
    service.async = function() {
    $http({method: 'GET', url: json, timeout: 5000}).
    // this callback will be called asynchronously
    // when the response is available.
    success(function(d) {
        data = d;
        NewsStorage.save(data);
        deferred.resolve();
        console.log(JSON.parse(d));
    }).
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    error(function() {
        data = NewsStorage.all();
        deferred.reject();
    });
        
    return promise;
        
    };
    
    service.getAll = function() { return data; };

    service.get = function(newId) { return data[newId]; };

    return service;
})

/**

.factory('Bookmark', function( CacheFactory ) {

  if ( ! CacheFactory.get('bookmarkCache') ) {
    CacheFactory.createCache('bookmarkCache');
  }

  var bookmarkCache = CacheFactory.get( 'bookmarkCache' );

  return {
    set: function(id) {
      bookmarkCache.put( id, 'bookmarked' );
    },
    get: function(id) {
      bookmarkCache.get( id );
      console.log( id );
    },
    check: function(id) {
      var keys = bookmarkCache.keys();
      var index = keys.indexOf(id);
      if(index >= 0) {
        return true;
      } else {
        return false;
      }
    },
    remove: function(id) {
      bookmarkCache.remove(id);
    }
  }

})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);

**/
