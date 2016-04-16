(function() {
  'use strict';

  angular
    .module('transpositron')
    .directive('tnKeyboard', tnKeyboard);

  /** @ngInject */
  function tnKeyboard() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/tn-keyboard/tn-keyboard.html',
      scope: true,
      controller: TnKeyboardController,
      controllerAs: 'vm',
      bindToController: {
          notesPlaying: '=',
          scale: '=',
          baseKeyOffset: '=',
          baseOctave: '='
      }
    };

    return directive;

    /** @ngInject */
    function TnKeyboardController($scope, $log, webAudioPlayer, _) {
      var vm = this;

      vm.keyPattern = [0,1,0,1,0,0,1,0,1,0,1,0];
      vm.keyboardNotes = [];

      vm.generateKeyboardNotes = function() {
        for (var i = vm.baseOctave * 12; i < (vm.baseOctave + 3) * 12; i++) {
          vm.keyboardNotes.push({
            label: webAudioPlayer.noteList[i],
            type: vm.keyPattern[i % 12]
          });
        }
      };

      vm.isBeingPlayed = function(note) {
        return _.some(vm.notesPlaying, {key: note});
      };

      activate();

      function activate() {
        vm.generateKeyboardNotes();
      }

      return vm;
    }
  }

})();