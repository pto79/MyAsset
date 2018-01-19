var d = new Date();
var y = d.getFullYear();
var m = d.getMonth();
var ys = [];
var ms = [];
for (i = y; i >= y - 100; i--) ys.push(i.toString());
for (i = 1; i <= 12; i++) ms.push(i.toString());


angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicModal, $window, assetData) {
  $scope.currentDate = {};
  $scope.currentDate.month = (m+1).toString();
  $scope.currentDate.year = y.toString();

  function resetModal() {
    $scope.modalData = {};
    $scope.modalData.type = 'Bank Saving';
    $scope.modalData.bank = 'OCBC';
    $scope.modalData.currency = 'SGD';
    $scope.modalData.year = y.toString();
    $scope.modalData.month = (m+1).toString();
  }

  $scope.$on('$ionicView.enter', function(e) {
    $scope.myAsset = assetData.all();
    calculate();
  })

  $scope.doCalculate = function() { calculate(); }

  function calculate() {
    $scope.total = 0;
    $scope.chartArray = [];
    $scope.chartData = [];
    $scope.chartData.push('Bank Name');
    $scope.chartData.push('Amount');
    $scope.chartArray.push($scope.chartData);

    angular.forEach($scope.myAsset, function(value, key) {
      if(value.month == $scope.currentDate.month && value.year == $scope.currentDate.year)
        if(value.type == 'Bank Saving' || value.type == 'Cash')
          $scope.total += Number(value.amount);
    });

    angular.forEach($scope.myAsset, function(value, key) {
      $scope.chartData = [];
      if(value.month == $scope.currentDate.month && value.year == $scope.currentDate.year) {
          $scope.chartData.push(value.type);
        $scope.chartData.push(value.amount);
        $scope.chartArray.push($scope.chartData);
      }
    });
    console.log($scope.chartArray);

      google.charts.load("current", {packages:["corechart"]});
      if($scope.chartArray.length > 1)
        google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable($scope.chartArray);

        var options = {
          //title: total,
          //titleTextStyle: {fontSize: 20},
          //pieHole: 0.4, for donut chart
          width: '100%',
          height: '100%',
          is3D: true,
          legend: {position: 'bottom'},
          chartArea: {left: "3%", top: "3%", height: "94%", width: "94%"},
        };

        var chart = new google.visualization.PieChart(document.getElementById('chart'));
        chart.draw(data, options);
      }
  }

  $ionicModal.fromTemplateUrl('templates/modal-asset.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalAsset = modal;
  });

  $scope.addAsset = function() {
    assetData.add($scope.modalData);
    assetData.save($scope.myAsset);
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
    $scope.modalAsset.hide();
  }

  $scope.years = ys;
  $scope.months = ms;

})


.controller('DataCtrl', function($scope, $ionicModal, assetData) {

  $scope.$on('$ionicView.enter', function(e) {
    $scope.myAsset = assetData.all();
  });

  $scope.remove = function(asset) {
    assetData.remove(asset);
    assetData.save($scope.myAsset);
  };

  $ionicModal.fromTemplateUrl('templates/modal-asset.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalAsset = modal;
  });

  $scope.updateAsset = function() {
    assetData.set($scope.modalData);
    assetData.save($scope.myAsset);
    $scope.modalAsset.hide();
  }

  $scope.openModalAsset = function(asset) {
    $scope.modalStatus = 'update';
    $scope.modalData = assetData.get(asset);
    $scope.modalAsset.show();
  }

  $scope.closeModalAsset = function() {
    $scope.modalAsset.hide();
  }

  $scope.years = ys;
  $scope.months = ms;

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
