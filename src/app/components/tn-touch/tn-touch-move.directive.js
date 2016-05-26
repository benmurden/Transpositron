(function() {
  'use strict';

  angular
    .module('transpositron')
    .directive('tnTouchmove', tnTouchMove);

  /** @ngInject */
  function tnTouchMove() {
    var directive = {
      restrict: 'A',
      controller: TnTouchMoveController
    };

    return directive;

    function TnTouchMoveController($scope, $element) {
      $element.bind("touchmove", onTouchMove);

      function onTouchMove(event) {
        event.preventDefault();
        var method = $element.attr("tn-touchmove");
        $scope.$event = event;
        $scope.$apply(method);
      }
    }
  }
})();
