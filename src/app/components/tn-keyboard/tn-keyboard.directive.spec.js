(function() {
  'use strict';

  describe('tn-keyboard directive', function(){
    var el, scope, controller;

    beforeEach(function() {
      module('transpositron');

      inject(function($compile, $rootScope) {
        el = angular.element('<tn-keyboard></tn-keyboard>');
        $compile(el)($rootScope);
        $rootScope.$digest();

        controller = el.controller("tnKeyboard");

        scope = el.isolateScope() || el.scope();
      });
    });

    it('returns false when note is not playing', inject(function() {
      expect(controller.isBeingPlayed('C3')).toBeFalsy();
    }));

    it('returns true when note is playing', inject(function() {
      controller.notesPlaying = [{key: 'C3'}];

      expect(controller.isBeingPlayed('C3')).toBeTruthy();
    }));

    it('plays note when active', inject(function() {
      var callArgs;

      spyOn(controller, 'playNote').and.callFake(function() {
        return function() {callArgs = Array.prototype.slice.call(arguments);};
      });
      controller.activeNotes = ['C3'];
      controller.noteDown('C3');

      expect(callArgs).toEqual(['C3']);
    }));

    it('does not play note when inactive', inject(function() {
      spyOn(controller, 'playNote');
      controller.noteDown('C3');

      expect(controller.playNote.calls.any()).toEqual(false);
    }));

    it('stops note when active', inject(function() {
      var callArgs;

      spyOn(controller, 'stopNote').and.callFake(function() {
        return function() {callArgs = Array.prototype.slice.call(arguments);};
      });
      controller.activeNotes = ['C3'];
      controller.noteUp('C3');

      expect(callArgs).toEqual(['C3']);
    }));

    it('does not stop note when inactive', inject(function() {
      spyOn(controller, 'stopNote');
      controller.noteUp('C3');

      expect(controller.stopNote.calls.any()).toEqual(false);
    }));

    it('can send multiple note events', inject(function() {
      spyOn(controller, 'noteDown');

      controller.notesDown(['C3', 'E3']);

      expect(controller.noteDown.calls.count()).toEqual(2);
      expect(controller.noteDown.calls.argsFor(0)).toEqual(['C3']);
      expect(controller.noteDown.calls.argsFor(1)).toEqual(['E3']);
    }));
  });
})();
