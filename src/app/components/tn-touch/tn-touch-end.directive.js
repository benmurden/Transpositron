(function() {
  'use strict';

  angular
    .module('transpositron')
    .directive('tnTouchend', tnTouchEnd);

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
