(function() {
  'use strict';

  angular
    .module('transpositron')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastr, $mdThemingProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastr.options.timeOut = 3000;
    toastr.options.positionClass = 'toast-top-right';
    toastr.options.preventDuplicates = true;
    toastr.options.progressBar = true;

    $mdThemingProvider.theme('default')
      .primaryPalette('orange')
      .accentPalette('deep-orange')
      .dark();

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
  }

})();
