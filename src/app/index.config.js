(function() {
  'use strict';

  angular
    .module('transpositron')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastr, $mdThemingProvider, $routeProvider, $locationProvider) {
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

    var homeRoute = {
      templateUrl: 'app/home/home.html',
      controller: 'HomeController',
      controllerAs: 'home'
    };

    $routeProvider
      .when('/', homeRoute)
      .when('/home/', homeRoute)
      .when('/about/', {
        templateUrl: 'app/about/about.html',
        controller: 'AboutController',
        controllerAs: 'about'
      });

    $locationProvider.html5Mode(true);

    }

})();
