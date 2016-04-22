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
      $element.bind("touchstart", onTouchStart);

      function onTouchStart(event) {
        event.preventDefault();
        $element.bind("touchmove", onTouchMove);
        $element.bind("touchend", onTouchEnd);
      }

      function onTouchMove(event) {
        var method = $element.attr("tn-touchmove");
        $scope.$event = event;
        $scope.$apply(method);
      }

      function onTouchEnd(event) {
        event.preventDefault();
        $element.unbind("touchmove", onTouchMove);
        $element.unbind("touchend", onTouchEnd);
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
