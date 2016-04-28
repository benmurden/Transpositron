(function() {
  'use strict';

  angular
    .module('transpositron', ['ngAnimate', 'ngCookies', 'ngMaterial', 'ngRoute']);

    angular.element(document.getElementsByTagName('head')).append(angular.element('<base href="' + window.location.pathname + '" />'));
})();
