(function() {
  'use strict';

  angular
    .module('transpositron')
    .directive('tnTouchstart', tnTouchStart);

  /** @ngInject */
  function tnTouchStart() {
    var directive = {
      restrict: 'A',
      controller: TnTouchStartController
    };

    return directive;

    function TnTouchStartController($scope, $element) {
      var vm = this;

      vm._onTouchStart = function(event) {
        event.preventDefault();
        var method = $element.attr('tn-touchstart');
        $scope.$event = event;
        $scope.$apply(method);
      };

      $element.bind('touchstart', vm._onTouchStart);
    }
  }
})();
