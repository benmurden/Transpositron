(function() {
  'use strict';

  angular
      .module('transpositron')
      .service('wavetables', wavetables);

  /** @ngInject */
  function wavetables($http, $log, $q) {
    this.getWavetable = function(name) {
      return $q(function(resolve, reject) {
        if (!_wavetables[name]) {
          $http.get('/assets/wavetables/' + name + '.json').then(function(result) {
            var real = new Float32Array(result.data.real);
            var imag = new Float32Array(result.data.imag);

            _wavetables[name] = {real: real, imag: imag};
            resolve(_wavetables[name]);
          }, function(result) {
            $log.warn('Problem loading wavetable', result);
            reject(result);
          });
        } else {
          resolve(_wavetables[name]);
        }
      });
    };

    var _wavetables = {};
    /*
    // Get a JSON object from chromium wavetables.
    var a=document.createElement('a');
    var w=JSON.parse(document.querySelector('pre').textContent.replace(/'/g, '"').replace(/\n/g, "").replace(/,\]/g, "]").replace(/,}/g, "}"));
    w.name=window.location.pathname.substr(window.location.pathname.lastIndexOf('/')+1);
    a.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(w)));
    a.setAttribute('download', w.name + '.json');
    a.textContent = 'File link';
    document.body.insertBefore(a, document.querySelector('pre'));
    a.click();
    */
  }

})();
