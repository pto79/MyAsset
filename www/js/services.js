angular.module('starter.services', [])

.factory('assetData', function() {
  // Might use a resource here that returns a JSON array

  return {
    all: function() {
      var myAsset = JSON.parse(localStorage.getItem('assets'));
      if(myAsset == null)
        myAsset = [];
      return myAsset;
    },
    remove: function(asset) {
      myAsset.splice(myAsset.indexOf(asset), 1);
    },
    get: function(asset) {
      return myAsset[myAsset.indexOf(asset)];
    }
  };
});
