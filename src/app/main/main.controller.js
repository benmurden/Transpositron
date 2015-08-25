(function() {
  'use strict';

  angular
    .module('transpositron')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, $log, webAudioPlayer, keypressHelper, webDevTec, toastr, _) {
    var vm = this;

    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1440125657487;
    vm.showToastr = showToastr;
    vm.ap = webAudioPlayer;
    // vm.keySequence = [90,88,67,86,66,78,77,188,190,65,83,68,70,71,72,74,75,76,186,222];
    vm.keySequence = ['z','x','c','v','b','n','m',',','.','a','s','d','f','g','h','j','k','l',';','\''];
    vm.keysDown = [];
    vm.scale = '2212221';
    vm.baseOctave = 2;
    vm.keyNoteMap = {};

    vm.mapKeysToNotes = function() {
      var scalePosition = 0;

      vm.keySequence.forEach(function(v, i) {
        vm.keyNoteMap[v] = webAudioPlayer.noteList[(vm.baseOctave * 12) + scalePosition];
        scalePosition += parseInt(vm.scale[i % vm.scale.length]);
      });
    };

    vm.keyDown = function(e) {
      var key = keypressHelper.convert_key_to_readable(e.keyCode);
      var sequenceIndex = _.indexOf(vm.keySequence, key);

      if (sequenceIndex !== -1) {
        $log.log(e.keyCode);

        webAudioPlayer.startNote(vm.keyNoteMap[key]);
      }
    };

    vm.keyUp = function(e) {
      var key = keypressHelper.convert_key_to_readable(e.keyCode);
      var sequenceIndex = _.indexOf(vm.keySequence, key);

      if (sequenceIndex !== -1) {
        $log.log('Key up: ' + e.keyCode);

        webAudioPlayer.endNote(vm.keyNoteMap[key]);
      }
    };

    activate();

    function activate() {
      getWebDevTec();
      vm.mapKeysToNotes();
      $timeout(function() {
        vm.classAnimation = 'rubberBand';
      }, 4000);

      var combos = [];
      vm.keySequence.forEach(function(v) {
        combos.push({
          keys: v,
          on_keydown: function(e, count, duplicate) {
            if (!duplicate) {
              vm.keyDown(e);
            }
          },
          on_keyup: function(e) {
            vm.keyUp(e);
          }
        });
      });
      keypressHelper.listener.register_many(combos);
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

    vm.scales = [
      {
        name: 'Major',
        value: '2212221'
      },
      {
        name: 'Lydian',
        value: '2221221'
      },
      {
        name: 'Locrian',
        value: '1221222'
      },
      {
        name: 'Japanese A',
        value: '14214'
      },
      {
        name: 'Japanese B',
        value: '23214'
      },
      {
        name: 'Japanese (Ichikosucho)',
        value: '22111221'
      },
      {
        name: 'Japanese (Taishikicho)',
        value: '221112111'
      }
    ];
  }
})();
