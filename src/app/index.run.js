(function() {
  'use strict';

  angular
    .module('transpositron')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
