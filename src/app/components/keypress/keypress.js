(function() {
  'use strict';

  angular
      .module('transpositron')
      .service('keypressHelper', keypressHelper);

  /** @ngInject */
  function keypressHelper(keypress) {
    this.listener = new keypress.Listener();

    this.convert_key_to_readable = function(code) {
      return keypress._keycode_dictionary[code];
    };
  }

})();
