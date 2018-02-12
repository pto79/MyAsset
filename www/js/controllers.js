var d = new Date();
var y = d.getFullYear();
var m = d.getMonth();
var ys = [];
var ms = [];
for (i = y; i >= y - 100; i--) ys.push(i.toString());
for (i = 1; i <= 12; i++) ms.push(i.toString());

angular.module('starter.controllers', ['ngTouch'])

.controller('DashCtrl', function($scope, $ionicModal, $window, assetData, $rootScope) {
  $scope.currentDate = {};
  $scope.currentDate.month = (m+1).toString();
  $scope.currentDate.year = y.toString();
  $scope.chartStatus = 'pie';

  $scope.$on('$ionicView.beforeEnter', function(e) {
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
      $scope.chartData = [];
      if(value.month == $scope.currentDate.month && value.year == $scope.currentDate.year) {
        if(value.type == 'Bank Saving' || value.type == 'Cash')
          $scope.total += Number(value.amount);
        //if(value.type == 'Stock') todo
        var existing = false;
        angular.forEach($scope.chartArray, function(value2, key) {
          if(value2[0] == value.type) {
            value2[1] += value.amount;
            existing = true;
          }
        })
        if(!existing) {
          $scope.chartData.push(value.type);
          $scope.chartData.push(value.amount);
          $scope.chartArray.push($scope.chartData);
        }
        //if(value.type == 'Stock')
        //if(value.type == 'Other')
      }
    });
    //console.log($scope.chartArray);

      google.charts.load("current", {packages:["corechart"]});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable($scope.chartArray);
        var options = {
          //title: $scope.total,
          //titleTextStyle: {fontSize: 20},
          //pieHole: 0.4, for donut chart
          backgroundColor: 'gray',
          is3D: true,
          legend: {position: 'bottom'},
          chartArea: {width: '90%', height: '90%'}
        };
        var chart = new google.visualization.PieChart(document.getElementById('chart'));
        //chart.draw(data, options);

        google.visualization.events.addListener(chart, 'select', selectHandler);
        function selectHandler(e) {
          console.log('A row was selected');
        }
      }
  }

  $scope.years = ys;
  $scope.months = ms;

  $scope.switchChart = function() {
    if($scope.chartStatus == 'pie')
      $scope.chartStatus = 'line';
    else
      $scope.chartStatus = 'pie';
  }

  $scope.doSwipeLeft = function() {
    $scope.currentDate.month = (parseInt($scope.currentDate.month) + 1).toString();
    if(parseInt($scope.currentDate.month) > 12) {
      $scope.currentDate.month = '1';
      $scope.currentDate.year = (parseInt($scope.currentDate.year) + 1).toString();
    }
    calculate();
  }

  $scope.doSwipeRight = function() {
    $scope.currentDate.month = (parseInt($scope.currentDate.month) - 1).toString(); 
    if(parseInt($scope.currentDate.month) < 1) {
      $scope.currentDate.month = '12';
      $scope.currentDate.year = (parseInt($scope.currentDate.year) - 1).toString();
    }
    calculate();
  }
})


.controller('DataCtrl', function($scope, $ionicModal, assetData, $ionicPopover) {

  $scope.$on('$ionicView.beforeEnter', function(e) {
    $scope.myAsset = assetData.all();
    angular.forEach($scope.myAsset, function(value, key) {
      value.date = value.year + value.month;
    });
    console.log($scope.myAsset);
  });

  $scope.remove = function(asset) {
    assetData.remove(asset);
    assetData.save();
  };

  $ionicModal.fromTemplateUrl('templates/modal-asset.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalAsset = modal;
  });

  $scope.openModalAssetEdit = function(asset) {
    $scope.modalStatus = 'update';
    $scope.modalData = assetData.get(asset);
    $scope.modalAsset.show();
  }

  $scope.updateAsset = function() {
    $scope.modalData.month = ("0" + ($scope.modalData.month)).slice(-2);
    assetData.set($scope.modalData);
    assetData.save();
    $scope.modalAsset.hide();
  }

  $scope.closeModalAsset = function() {
    $scope.modalAsset.hide();
  }

  $scope.openModalAssetNew = function() {
    $scope.modalStatus = 'add';
    $scope.modalData = {};
    $scope.modalData.type = 'Bank Saving';
    $scope.modalData.bank = 'OCBC';
    $scope.modalData.currency = 'SGD';
    $scope.modalData.year = y.toString();
    $scope.modalData.month = (m+1).toString();
    $scope.modalAsset.show();
  }

  $scope.addAsset = function() {
    if($scope.modalData.account == undefined)
      $scope.modalData.account = 'unnamed';
    if($scope.modalData.type != "Bank Saving")
      delete $scope.modalData.bank;
    $scope.modalData.month = ("0" + ($scope.modalData.month)).slice(-2);
    assetData.add($scope.modalData);
    assetData.save();
    $scope.modalAsset.hide();
  }

  $scope.years = ys;
  $scope.months = ms;

  $scope.reverse = true;
  $scope.sortData = function(sortOrder) {
    $scope.reverse = (sortOrder === 'desc') ? true : false;
  };

  $scope.filterType = {};
  $scope.filterType.bank = true;
  $scope.filterType.cash = true;
  $scope.filterType.stock = true;
  $scope.filterType.other = true;
  $scope.filterData = function (asset) {
    return (asset.type === "Bank Saving" && $scope.filterType.bank || asset.type === "Cash" && $scope.filterType.cash || asset.type === "Stock" && $scope.filterType.stock || asset.type === "Other" && $scope.filterType.other);
  }

   $ionicPopover.fromTemplateUrl('templates/popover-filter.html', {
      scope: $scope
   }).then(function(popover) {
      $scope.popoverFilter = popover;
   });

})


.controller('AccountCtrl', function($scope, $ionicPopup, assetData, $ionicModal, exchangeService) {

  $scope.settings = {
    onlineMode: false,
    base: exchangeService.getBase()
  };

  $ionicModal.fromTemplateUrl('templates/modal-import.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalImport = modal;
  });

  $scope.clearData = function() {
    $ionicPopup.confirm({
      title: 'Warning!',
      template: 'Are you sure to delete ALL asset data permanently?'
    }).then(function(res) {
      if(res)
        localStorage.clear();
      else
        console.log("never mind");
    });
  }

  $scope.exportData = function() {
    var copyText = document.getElementById("myClipboard");
    copyText.type = "text";
    copyText.value = assetData.export();
    copyText.select();
    document.execCommand("Copy");
    alert("Asset data has copied to clipboard");
    copyText.type = "hidden";
  }

  $scope.importData = function() {
    $scope.importData.data = "";
    $scope.modalImport.show();
  }

  $scope.closeModalImport = function() {
    $scope.modalImport.hide();
  }

  $scope.saveData = function(data) {
    $ionicPopup.confirm({
      title: 'Warning!',
      template: 'Are you sure to overwrite the current asset data?'
    }).then(function(res){
      if(res) {
        assetData.import(data);
        $scope.modalImport.hide();
      }
      else
        console.log("never mind");
    });
  }

  $scope.changeBase = function() {
    console.log($scope.settings.base);
    exchangeService.setBase($scope.settings.base);
  }

});
