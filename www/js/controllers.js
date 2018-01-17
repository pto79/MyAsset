var d = new Date();
var y = d.getFullYear();
var m = d.getMonth();
angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicModal, $window) {

  function resetModal() {
    $scope.newAsset = {};
    $scope.newAsset.type = 'Bank Saving';
    $scope.newAsset.bank = 'OCBC';
    $scope.newAsset.currency = 'SGD';
  }

  $scope.currentDate = {};
  $scope.currentDate.month = m+1;
  $scope.currentDate.year = y;

  $scope.myAsset = JSON.parse(localStorage.getItem('assets'));
  if($scope.myAsset == null)
    $scope.myAsset = [];
  else {
    resetModal();
    calculate();
  }

  function calculate() {
    $scope.total = 0;
    $scope.chartArray = [];
    $scope.chartData = [];
    $scope.chartData.push('Bank Name');
    $scope.chartData.push('Amount');
    $scope.chartArray.push($scope.chartData);

    angular.forEach($scope.myAsset, function(value, key) {
      console.log(value.type);
      if(value.month == $scope.currentDate.month && value.year == $scope.currentDate.year)
        if(value.type == 'Bank Saving' || value.type == 'Cash')
          $scope.total += Number(value.amount);
    });

    angular.forEach($scope.myAsset, function(value, key) {
      $scope.chartData = [];
      if(value.month == $scope.currentDate.month && value.year == $scope.currentDate.year) {
        if(value.type == 'Bank Saving')
          $scope.chartData.push(value.bank+':'+value.account);
        if(value.type == 'Cash')
          $scope.chartData.push(value.type+':'+value.remark);
        if(value.type == 'Stock')
          $scope.chartData.push(value.type+':'+value.symbol);
        $scope.chartData.push(value.amount);
        $scope.chartArray.push($scope.chartData);
      }
    });
    console.log($scope.chartArray);

      google.charts.load("current", {packages:["corechart"]});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable($scope.chartArray);

        var options = {
          //title: total,
          //titleTextStyle: {fontSize: 20},
          //pieHole: 0.4, for donut chart
          is3D: true,
          legend: {position: 'bottom'},
          //chartArea: {width: 400, height: 600},
        };

        var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
        //chart.draw(data, options);
      }
  }

  $ionicModal.fromTemplateUrl('templates/modal-Asset.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalAsset = modal;
  });

  $scope.addAsset = function() {
    $scope.myAsset.push($scope.newAsset);
    localStorage.setItem('assets', JSON.stringify($scope.myAsset));
    $scope.modalAsset.hide();
    resetModal();
    calculate();
  }

  $scope.openModalAsset = function() {
    $scope.modalStatus = 'add';
    resetModal();
    $scope.modalAsset.show();
  }

  $scope.closeModalAsset = function() {
    resetModal();
    $scope.modalAsset.hide();
  }

  $scope.years = [];
    for (i = y; i >= y - 100; i--) { 
    $scope.years.push(i);
  }
  $scope.months = [];
  for (i = 1; i <= 12; i++) { 
    $scope.months.push(i);
  }

})

.controller('DataCtrl', function($scope, $ionicModal, assetData) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.myAsset = assetData.all();
  $scope.remove = function(asset) {
    assetData.remove(asset);
  };

  $ionicModal.fromTemplateUrl('templates/modal-Asset.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalAsset = modal;
  });

  $scope.updateAsset = function() {
    $scope.myAsset.push($scope.newAsset);
    localStorage.setItem('assets', JSON.stringify($scope.myAsset));
    $scope.modalAsset.hide();
  }

  $scope.openModalAsset = function(asset) {
    $scope.modalStatus = 'update';
    $scope.newAsset = assetData.get(asset);
    $scope.modalAsset.show();
  }

  $scope.closeModalAsset = function() {
    $scope.modalAsset.hide();
  }
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
