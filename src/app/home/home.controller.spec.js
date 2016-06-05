(function() {
  'use strict';

  describe('home controller', function(){
    var $controller, $scope, webAudioPlayer, vm;

    beforeEach(module('transpositron'));

    beforeEach(inject(function($rootScope, _$controller_, _webAudioPlayer_) {
      $controller = _$controller_;
      webAudioPlayer = _webAudioPlayer_;
      webAudioPlayer.setWaveform = function() {return null;};
      $scope = $rootScope.$new();
      vm = $controller('HomeController', {$scope: $scope});
    }));

    it('is defined', inject(function() {
      expect($controller).toBeDefined();
      expect(vm).toBeDefined();
      expect(vm.noteOn).toBeDefined();
    }));

    describe('mapKeysToNotes', function() {
      it('gives all notes when useScale is false', inject(function() {
        vm.useScale = false;

        vm.mapKeysToNotes();

        expect(vm.keyNoteMap.b).toEqual('E3');
      }));
    });

    describe('noteOn', function() {
      beforeEach(function() {
        spyOn(webAudioPlayer, 'startNote');
      });

      it('plays note', inject(function() {
        vm.noteOn('C3');

        expect(webAudioPlayer.startNote).toHaveBeenCalledWith('C3');
        expect(vm.notesPlaying).toEqual([{key: 'C3'}]);
      }));

      it('does not play note when already playing', function() {
        vm.notesPlaying = [{key: 'C3'}];
        vm.noteOn('C3');

        expect(webAudioPlayer.startNote).not.toHaveBeenCalled();
      });
    });

    describe('noteOff', function() {
      beforeEach(function() {
        spyOn(webAudioPlayer, 'endNote');
      });

      it('stops note', inject(function() {
        vm.notesPlaying = [{key: 'C3'}];
        vm.noteOff('C3');

        expect(webAudioPlayer.endNote).toHaveBeenCalledWith('C3');
        expect(vm.notesPlaying).toEqual([]);
      }));
    });

    describe('keyDown', function() {
      var e;

      beforeEach(function() {
        e = {keycode: 39};
        spyOn(vm, 'noteOn');
      });

      it('does nothing when duplicate', inject(function() {
        vm.keyDown(e, 2, true);

        expect(vm.noteOn).not.toHaveBeenCalled();
      }));

      it('does nothing when keys are not mapped', inject(function() {
        vm.keyDown(e);

        expect(vm.noteOn).not.toHaveBeenCalled();
      }));

      it('sends noteOn for mapped key', inject(function() {
        vm.keyNoteMap = {z: 'C3'};
        e.keyCode = 90;
        vm.keyDown(e);

        expect(vm.noteOn).toHaveBeenCalledWith('C3');
      }));

      it('ignores keypress when combined with special keys', inject(function() {
        e.ctrlKey = true;

        expect(vm.keyDown(e)).toEqual(true);
        expect(vm.noteOn).not.toHaveBeenCalled();
      }));
    });

    describe('keyUp', function() {
      var e;

      beforeEach(function() {
        e = {keycode: 39};
        spyOn(vm, 'noteOff');
      });

      it('does nothing when keys are not mapped', inject(function() {
        vm.keyUp(e);

        expect(vm.noteOff).not.toHaveBeenCalled();
      }));

      it('sends noteOff for mapped key', inject(function() {
        vm.keyNoteMap = {z: 'C3'};
        e.keyCode = 90;
        vm.keyUp(e);

        expect(vm.noteOff).toHaveBeenCalledWith('C3');
      }));

      it('ignores keypress when combined with special keys', inject(function() {
        e.ctrlKey = true;

        expect(vm.keyDown(e)).toEqual(true);
        expect(vm.noteOff).not.toHaveBeenCalled();
      }));
    });
  });
})();
