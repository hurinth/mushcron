(function () {
  'use strict';

let mushCtrl = angular.module('mushCtrl', [])

.controller("mushCtrl", ['$scope', '$http', 'deviceFactory', function ($scope, $http, deviceFactory) {
  $scope.intakeMode = "auto";
  $scope.intakeState = "Off";
  $scope.changeMode = function(device) {
    var modeReq = JSON.stringify({
      device: device,
      newMode: $scope.intakeMode
    });
    $http.post("/changeMode", {dataType:'application/json', data: modeReq}).then(function (response) {
        console.log(response.data);
    }); 
  }
  $scope.changeState = function(device) {
    var stateReq = JSON.stringify({
      device: device,
      newState: $scope.intakeState
    })
    $http.post("/changeState", {dataType:'application/json', data: stateReq}).then(function (response) {
        console.log(response.data);
    }); 
  }
  $scope.devices = deviceFactory;
  console.log(`These are the devices: ${JSON.stringify($scope.devices)}`)
}]);
  
})();