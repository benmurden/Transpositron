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
      $element.bind('touchstart', onTouchStart);

      function onTouchStart(event) {
        event.preventDefault();
        var method = $element.attr('tn-touchstart');
        $scope.$event = event;
        $scope.$apply(method);
      }
    }
  }
})();
