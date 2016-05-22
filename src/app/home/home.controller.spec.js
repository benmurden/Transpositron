(function() {
  'use strict';

  describe('home controller', function(){
    var $controller, $scope, webAudioPlayer, vm;

    beforeEach(module('transpositron'));

    beforeEach(inject(function(_$controller_, _webAudioPlayer_) {
      $controller = _$controller_;
      webAudioPlayer = _webAudioPlayer_;
      $scope = {};
      vm = $controller('HomeController', {$scope: $scope});
    }));

    it('is defined', inject(function() {
      expect($controller).toBeDefined();
      expect(vm).toBeDefined();
      expect(vm.noteOn).toBeDefined();
    }));

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
  });
})();
