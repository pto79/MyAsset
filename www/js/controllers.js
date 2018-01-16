var d = new Date();
var y = d.getFullYear();
var m = d.getMonth();
angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicModal, $window) {
  $scope.newAsset = {};
  $scope.currentDate = {};
  $scope.currentDate.month = m+1;
  $scope.currentDate.year = y;
  console.log($scope.currentDate.month);
  console.log($scope.currentDate.year);

  $scope.myAsset = JSON.parse(localStorage.getItem('assets'));
  if($scope.myAsset == null)
    $scope.myAsset = [];
  else
    calculate();

  function calculate() {
    $scope.total = 0;
    $scope.chartArray = [];
    $scope.chartData = [];
    $scope.chartData.push('Bank Name');
    $scope.chartData.push('Amount');
    $scope.chartArray.push($scope.chartData);

    angular.forEach($scope.myAsset, function(value, key) {
      console.log(value.type);
      if(value.type == 'Bank Saving' && value.month == $scope.currentDate.month && value.year == $scope.currentDate.year)
        $scope.total += Number(value.amount);
      if(value.type == 'Cash' && value.month == m+1 && value.year == y)
        $scope.total += Number(value.amount);
    });

    angular.forEach($scope.myAsset, function(value, key) {
      $scope.chartData = [];
      if(value.month == $scope.currentDate.month && value.year == $scope.currentDate.year) {
        $scope.chartData.push(value.bank+':'+value.account);
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
        chart.draw(data, options);
      }
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
    for (i = y; i >= y - 100; i--) { 
    $scope.years.push(i);
  }
  $scope.months = [];
  for (i = 1; i <= 12; i++) { 
    $scope.months.push(i);
  }

})

.controller('DataCtrl', function($scope, assetData) {
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
