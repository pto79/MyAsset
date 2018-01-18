angular.module('starter.services', [])

.factory('assetData', function() {
  // Might use a resource here that returns a JSON array
  var myAsset;

  return {
    all: function() {
      myAsset = localStorage.getItem('assets');
      if(myAsset == "undefined" || myAsset == null)
        myAsset = [];
      else
        myAsset = JSON.parse(myAsset);
      return myAsset;
    },
    save: function(assets) {
      localStorage.setItem('assets', JSON.stringify(assets));
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
});
