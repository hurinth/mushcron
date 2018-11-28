let deviceFactory = angular.module('deviceFactory', [])
  .factory('deviceFactory', [function () {
    return {
      intake: {
        mode: "auto",
        state: "off"
      },
      exhaust: {
        mode: "auto",
        state: "off"
      },
    }
}]);