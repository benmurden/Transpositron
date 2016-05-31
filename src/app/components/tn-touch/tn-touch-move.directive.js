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
      var vm = this;

      vm._onTouchMove = function(event) {
        event.preventDefault();
        var method = $element.attr("tn-touchmove");
        $scope.$event = event;
        $scope.$apply(method);
      };

      $element.bind("touchmove", vm._onTouchMove);
    }
  }
})();
