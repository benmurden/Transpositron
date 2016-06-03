(function() {
  'use strict';

  describe('Keypress service', function(){
    var service, keypress;

    beforeEach(module('transpositron'));

    beforeEach(inject(function(keypressHelper, _keypress_) {
        service = keypressHelper;
        keypress = _keypress_;
    }));

    it('is available', inject(function(){
      expect(service).toBeDefined();
      expect(service.convert_key_to_readable).toBeDefined();
    }));

    it('converts keycode to readable', inject(function() {
      expect(service.convert_key_to_readable(90)).toEqual('z');
    }));
  });
})();
