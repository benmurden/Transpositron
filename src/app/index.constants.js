/* global malarkey:false, toastr:false, moment:false, keypress:false */
(function() {
  'use strict';

  angular
    .module('transpositron')
    .constant('malarkey', malarkey)
    .constant('toastr', toastr)
    .constant('moment', moment)
    .constant('keypress', keypress)
    .constant('_', _);

})();
