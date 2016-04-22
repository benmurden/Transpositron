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
          baseOctave: '=',
          playNote: '&',
          stopNote: '&'
      }
    };

    return directive;

    /** @ngInject */
    function TnKeyboardController($scope, $log, webAudioPlayer, _) {
      var vm = this;

      vm.keyPattern = [0,1,0,1,0,0,1,0,1,0,1,0];
      vm.keyboardNotes = [];

      vm.generateKeyboardNotes = function() {
        var j = 0;
        for (var i = vm.baseOctave * 12; i < (vm.baseOctave + 3) * 12; i++) {
          vm.keyboardNotes[j] = {
            label: webAudioPlayer.noteList[i],
            type: vm.keyPattern[i % 12]
          };
          j++;
        }
      };

      vm.isBeingPlayed = function(note) {
        return _.some(vm.notesPlaying, {key: note});
      };

      vm.noteDown = function(note) {
        vm.playNote()(note);
      };

      vm.noteUp = function(note) {
        vm.stopNote()(note);
      };

      vm.notesDown = function(notes) {
        notes.forEach(function(v) {
          vm.playNote()(v);
        });
      };

      vm.notesUp = function(notes) {
        notes.forEach(function(v) {
          vm.stopNote()(v);
        });
      };

      vm.mouseOver = function(e, note) {
        // Send noteDown if only the left mouse button is held.
        if (e.buttons === 1) {
          return vm.noteDown(note);
        }
      };

      vm.touchmove = function(e) {
        vm.touchesToNotes(e.touches);
      };

      vm.touchStart = function(e) {
        vm.touchesToNotes(e.touches);
      };

      vm.touchEnd = function(e) {
        vm.touchesToNotes(e.touches);
      };

      vm.touchesToNotes = function(touches) {
        var touchNotes = [];
        _.forEach(touches, function(v) {
          var targetElement = document.elementFromPoint(v.clientX, v.clientY);
          if (targetElement !== null) {
            touchNotes.push({key: targetElement.id});
          }
        });

        vm.syncNotesPlaying(touchNotes);

        vm.notesPlaying = touchNotes;
      };

      vm.syncNotesPlaying = function(notes) {
        var partitionedNotes = _.partition(notes, function(v) {
          return _.some(vm.notesPlaying, v);
        });
        var keyMap = function(v) {
          return v.key;
        };
        var flatNotesPlaying = _.map(vm.notesPlaying, keyMap);
        var flatTouchNotes = _.map(notes, keyMap);

        var newNotes = _.difference(flatTouchNotes, flatNotesPlaying);
        var oldNotes = _.difference(flatNotesPlaying, flatTouchNotes);

        $log.log(newNotes, oldNotes);

        vm.notesDown(newNotes);
        vm.notesUp(oldNotes);
      };

      $scope.$watch('vm.baseOctave', vm.generateKeyboardNotes);

      activate();

      function activate() {
        vm.generateKeyboardNotes();
      }

      return vm;
    }
  }

})();
