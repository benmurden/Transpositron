(function() {
  'use strict';

  angular
    .module('transpositron')
    .directive('tnTouchmove', tnTouchMove)
    .directive('tnTouchstart', tnTouchStart)
    .directive('tnTouchend', tnTouchEnd);

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

  /** @ngInject */
  function tnTouchStart() {
    var directive = {
      restrict: 'A',
      controller: TnTouchStartController
    };

    return directive;

    function TnTouchStartController($scope, $element) {
      $element.bind('touchstart', onTouchStart);

      function onTouchStart(event) {
        event.preventDefault();
        var method = $element.attr('tn-touchstart');
        $scope.$event = event;
        $scope.$apply(method);
      }
    }
  }

  /** @ngInject */
  function tnTouchEnd() {
    var directive = {
      restrict: 'A',
      controller: TnTouchEndController
    };

    return directive;

    function TnTouchEndController($scope, $element) {
      $element.bind('touchend', onTouchEnd);

      function onTouchEnd(event) {
        event.preventDefault();
        var method = $element.attr('tn-touchend');
        $scope.$event = event;
        $scope.$apply(method);
      }
    }
  }
})();
