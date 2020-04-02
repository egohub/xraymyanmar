angular.module('starter.services', [])


.factory('DataLoader', function($http) {

    return {
        get: function(url) {
            // Simple index lookup
            return $http.get(url);
        }
    }

})


.factory('MovieService', function($http) {


        var content = [];
        var gc = 'https://untitled-o2334v8oxm2y.runkit.sh/';
        $http.get('https://xraymovie.herokuapp.com/api/1').then(function(response) {
            console.log('-----------response ----------------------- ');
            for (var i = 0; i < response.data.results.length; i++) {

                content.push(response.data.results[i]);
            }
        })


        return {
            all: function() {
                return content;
            },

            get: function(petId) {
                for (var i = 0; i < content.length; i++) {
                    if (content[i].id === parseInt(petId)) {
                        return content[i];
                    }
                }
                return null;
            }
        };

    })
  
