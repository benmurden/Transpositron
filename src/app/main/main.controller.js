(function() {
  'use strict';

  angular
    .module('transpositron')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, $log, webAudioPlayer, webDevTec, toastr) {
    var vm = this;

    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1440125657487;
    vm.showToastr = showToastr;
    vm.envelope = {
      a: 0.02,
      d: 1,
      s: 0.5,
      r: 0.25
    };
    vm.keySequence = [90,88,67,86,66,78,77,188,190,65,83,68,70,71,72,74,75,76,186,222];
    vm.keysDown = [];

    vm.keyDown = function(e) {
      var index = vm.keysDown.indexOf(e.keyCode);

      if (index === -1) {
        vm.keysDown.push(e.keyCode);
        $log.log(e.keyCode);
      }
    };

    vm.keyUp = function(e) {
      var index = vm.keysDown.indexOf(e.keyCode);

      if (index !== -1) {
        vm.keysDown.pop(index);
        $log.log('Key up: ' + e.keyCode);
      }
    };

    activate();

    function activate() {
      getWebDevTec();
      $timeout(function() {
        vm.classAnimation = 'rubberBand';
      }, 4000);
    }

    function showToastr() {
      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      vm.classAnimation = '';
    }

    function getWebDevTec() {
      vm.awesomeThings = webDevTec.getTec();

      angular.forEach(vm.awesomeThings, function(awesomeThing) {
        awesomeThing.rank = Math.random();
      });
    }
  }
})();
