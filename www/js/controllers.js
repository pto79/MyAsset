angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicModal, $window) {
  $scope.newAsset = {};

  $scope.myAsset = JSON.parse(localStorage.getItem('assets'));
  if($scope.myAsset == null)
    $scope.myAsset = [];
  else
    calculate();

  function calculate() {
    $scope.myAsset.total = 0;
    angular.forEach($scope.myAsset, function(value, key) {
      console.log(value.type);
      if(value.type == 'Bank Saving')
        $scope.myAsset.total += Number(value.amount);
      if(value.type == 'Cash')
        $scope.myAsset.total += Number(value.amount);
    });
  }

  $ionicModal.fromTemplateUrl('templates/modal-addAsset.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalAdd = modal;
  });

  $scope.addAsset = function() {
    $scope.myAsset.push($scope.newAsset);
    localStorage.setItem('assets', JSON.stringify($scope.myAsset));
    $scope.newAsset = {};
    $scope.modalAdd.hide();
    calculate();
  }

  $scope.closeModalAdd = function() {
    $scope.newAsset = {}; //clear the modal
    $scope.modalAdd.hide();
  }

  $scope.years = [];
  var d = new Date();
  var n = d.getFullYear();
  for (i = n; i >= n - 100; i--) { 
    $scope.years.push(i);
  }

  $scope.months = [];
  for (i = 1; i <= 12; i++) { 
    $scope.months.push(i);
  }

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $ionicPopup) {

  $scope.settings = {
    onlineMode: false
  };

  $scope.clearData = function() {

   var confirmPopup = $ionicPopup.confirm({
     title: 'Warning!',
     template: 'Are you sure you want to delete ALL asset data permanently?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       localStorage.clear();
     } else {
     }
   });
  }

});
