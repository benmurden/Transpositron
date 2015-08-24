(function() {
  'use strict';

  angular
      .module('transpositron')
      .service('keypressHelper', keypressHelper);

  /** @ngInject */
  function keypressHelper(keypress) {
    this.listener = new keypress.Listener();
  }

})();
