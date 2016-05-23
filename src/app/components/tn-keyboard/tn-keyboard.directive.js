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
          keyNoteMap: '=',
          useScale: '=',
          showKeys: '=',
          keySequence: '=',
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
      vm.activeNotes = [];

      vm.generateKeyboardNotes = function() {
        var j = 0;
        var note;
        var noteKeyMap = _.invert(vm.keyNoteMap);
        vm.activeNotes = _.values(vm.keyNoteMap);

        for (var i = vm.baseOctave * 12; i < (vm.baseOctave + 3) * 12; i++) {
          note = webAudioPlayer.noteList[i];
          vm.keyboardNotes[j] = {
            label: note,
            keyLabel: noteKeyMap[note],
            type: vm.keyPattern[i % 12],
            active: vm.activeNotes.indexOf(note) !== -1
          };

          j++;
        }
      };

      vm.isBeingPlayed = function(note) {
        return _.some(vm.notesPlaying, {key: note});
      };

      vm.noteDown = function(note) {
        if (vm.activeNotes.indexOf(note) !== -1) {
          vm.showKeys = false;
          vm.playNote()(note);
        }
      };

      vm.noteUp = function(note) {
        if (vm.activeNotes.indexOf(note) !== -1) {
          vm.stopNote()(note);
        }
      };

      vm.notesDown = function(notes) {
        notes.forEach(function(v) {
          vm.noteDown(v);
        });
      };

      vm.notesUp = function(notes) {
        notes.forEach(function(v) {
          vm.noteUp(v);
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
            var shouldBubble = targetElement.getAttribute('data-touch-bubble');

            while (shouldBubble !== null) {
              targetElement = targetElement.parentNode;
              shouldBubble = targetElement.getAttribute('data-touch-bubble');
            }

            touchNotes.push({key: targetElement.id});
          }
        });

        vm.syncNotesPlaying(touchNotes);

        // vm.notesPlaying = touchNotes;
      };

      vm.syncNotesPlaying = function(notes) {
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

      $scope.$watchGroup(['vm.baseOctave', 'vm.scale', 'vm.baseKeyOffset', 'vm.useScale'], vm.generateKeyboardNotes);

      activate();

      function activate() {
        vm.generateKeyboardNotes();
      }

      return vm;
    }
  }

})();
