angular.module('starter.services', [])

.factory('assetData', function() {
  // Might use a resource here that returns a JSON array
  var myAsset = localStorage.getItem('assets');
  if(myAsset == undefined || myAsset == null  || myAsset == "")
    myAsset = [];
  myAsset = JSON.parse(myAsset);

  return {
    all: function() {
      return myAsset;
    },
    save: function() {
      localStorage.setItem('assets', JSON.stringify(myAsset));
    },
    export: function() {
      return localStorage.getItem('assets');
    },
    import: function(data) {
      myAsset = JSON.parse(data);
      localStorage.setItem('assets', data);
    },
    add: function(asset) {
      myAsset.push(asset);
    },
    remove: function(asset) {
      myAsset.splice(myAsset.indexOf(asset), 1);
    },
    get: function(asset) {
      return myAsset[myAsset.indexOf(asset)];
    },
    set: function(asset) {
      myAsset[myAsset.indexOf(asset)] = asset;
    }
  };
})


.factory('exchangeService', function($http, $q) {

  return {
    get: function(base) {
      var deferred = $q.defer();
      $http({
        method: "GET",
        url: "https://api.fixer.io/latest?base=" + base
      }).then(function(res) {
        console.log(res);
        deferred.resolve(res.data);
      }, function(res) {
        console.log(res);
        deferred.reject(res.data);
      });
      return deferred.promise;
    }
  };
})


.factory('stockService', function($http, $q) {

  return {
    get: function(s) {
      var deferred = $q.defer();
      $http({
        method: "GET",
        url: "https://api.iextrading.com/1.0/stock/"+s+"/price"
      }).then(function(res) {
        console.log(res);
        deferred.resolve(res.data);
      }, function(res) {
        console.log(res);
        deferred.reject(res.data);
      });
      return deferred.promise;
    }
  };

})

;
