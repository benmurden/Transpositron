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

    it('can send multiple note up events', inject(function() {
      spyOn(controller, 'noteUp');

      controller.notesUp(['C3', 'E3']);

      expect(controller.noteUp.calls.count()).toEqual(2);
      expect(controller.noteUp.calls.argsFor(0)).toEqual(['C3']);
      expect(controller.noteUp.calls.argsFor(1)).toEqual(['E3']);
    }));

    it('sends note down when mouse button held', inject(function() {
      spyOn(controller, 'noteDown');

      controller.mouseOver({buttons: 1}, 'C3');

      expect(controller.noteDown.calls.count()).toEqual(1);
    }));

    it('does not send note when mouse button is not held', inject(function() {
      spyOn(controller, 'noteDown');

      controller.mouseOver({buttons: 0}, 'C3');

      expect(controller.noteDown.calls.count()).toEqual(0);
    }));

    it('handles all touch events', inject(function() {
      var touchEvent = {touches: [{clientX: 0, clientY: 0}]};

      spyOn(controller, 'touchesToNotes');
      controller.touchmove(touchEvent);

      expect(controller.touchesToNotes.calls.count()).toEqual(1);

      controller.touchStart(touchEvent);

      expect(controller.touchesToNotes.calls.count()).toEqual(2);

      controller.touchEnd(touchEvent);

      expect(controller.touchesToNotes.calls.count()).toEqual(3);
    }));

    it('converts touch to element id', inject(function() {
      var touches = [{clientX: 0, clientY: 0}],
          mockElement = {id: 'mock'};

      spyOn(controller, 'syncNotesPlaying');
      spyOn(document, 'elementFromPoint').and.returnValue(mockElement);

      controller.touchesToNotes(touches);

      expect(controller.syncNotesPlaying.calls.argsFor(0)).toEqual([[{key: 'mock'}]]);
    }));

    it('touchesToNotes ignores null elements', inject(function() {
      var touches = [{clientX: 0, clientY: 0}],
          mockElement = null;

      spyOn(controller, 'syncNotesPlaying');
      spyOn(document, 'elementFromPoint').and.returnValue(mockElement);

      controller.touchesToNotes(touches);

      expect(controller.syncNotesPlaying.calls.argsFor(0)).toEqual([[]]);
    }));

    it('syncs new notes', inject(function() {
      spyOn(controller, 'notesDown');
      spyOn(controller, 'notesUp');

      controller.syncNotesPlaying([{key: 'C3'}]);

      expect(controller.notesDown.calls.argsFor(0)).toEqual([['C3']]);
      expect(controller.notesUp.calls.argsFor(0)).toEqual([[]]);
    }));

    it('syncs old notes', inject(function() {
      controller.notesPlaying = [{key: 'C3'}];
      spyOn(controller, 'notesDown');
      spyOn(controller, 'notesUp');

      controller.syncNotesPlaying([]);

      expect(controller.notesDown.calls.argsFor(0)).toEqual([[]]);
      expect(controller.notesUp.calls.argsFor(0)).toEqual([['C3']]);
    }));

    it('handles combined note sync events', inject(function() {
      controller.notesPlaying = [{key: 'C3'}, {key: 'E3'}];
      spyOn(controller, 'notesDown');
      spyOn(controller, 'notesUp');

      controller.syncNotesPlaying([{key: 'A3'}, {key: 'E3'}]);

      expect(controller.notesDown.calls.argsFor(0)).toEqual([['A3']]);
      expect(controller.notesUp.calls.argsFor(0)).toEqual([['C3']]);
    }));
  });
})();
