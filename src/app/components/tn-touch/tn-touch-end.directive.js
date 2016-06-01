(function() {
  'use strict';

  angular
    .module('transpositron')
    .directive('tnTouchend', tnTouchEnd);

  /** @ngInject */
  function tnTouchEnd() {
    var directive = {
      restrict: 'A',
      controller: TnTouchEndController
    };

    return directive;

    function TnTouchEndController($scope, $element) {
      var vm = this;

      vm._onTouchEnd = function(event) {
        event.preventDefault();
        var method = $element.attr('tn-touchend');
        $scope.$event = event;
        $scope.$apply(method);
      };

      $element.bind('touchend', vm._onTouchEnd);
    }
  }
})();
