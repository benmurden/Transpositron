(function() {
  'use strict';

  angular
      .module('transpositron')
      .service('webAudioPlayer', webAudioPlayer);

  /** @ngInject */
  function webAudioPlayer() {
    var NOTES = (function () {
      var notes = {};
      var toneSymbols = "CcDdEFfGgAaB";
      function noteToFrequency (note) {
        return Math.pow(2, (note-69)/12)*440;
      }
      for (var octave = 0; octave < 8; ++octave) {
        for (var t = 0; t < 12; ++t) {
          notes[toneSymbols[t]+octave] = noteToFrequency(octave * 12 + t);
        }
      }
      return notes;
    }());

    var audioContext = new window.AudioContext();

    this.playNote = function(note, duration, semitone) {
      var osc = audioContext.createOscillator();
      var freq = NOTES[note];
      var time = audioContext.currentTime;
      var a = parseFloat(this.get('attack'));
      var d = parseFloat(this.get('decay'));
      var s = parseFloat(this.get('sustain'));
      var r = parseFloat(this.get('release'));
      var gain = audioContext.createGain();
      var waveform = this.get('waveform');
      var compressor = this.get('compressor');
      var standardOscillatorTypes = ['sine', 'square', 'sawtooth', 'triangle'];

      if (standardOscillatorTypes.indexOf(waveform) !== -1) {
        osc.type = waveform;
      } else {
        osc.type = 'custom';
        osc.setPeriodicWave(this.get(waveform + 'Wave'));
      }
      osc.connect(gain);
      gain.connect(compressor);
      compressor.connect(audioContext.destination);

      this.envelope(gain, time, 1, duration, a, d, s, r);

      osc.frequency.value = freq;
      osc.detune.value = semitone * 100;
      osc.start(time);
      osc.stop(time + a + d + duration + r);
    };

    this.envelope = function(gainNode, time, volume, duration, a, d, s, r) {
      var gain = gainNode.gain;
      gain.cancelScheduledValues(0);
      gain.setValueAtTime(0, time);
      gain.linearRampToValueAtTime(volume, time + a);
      gain.linearRampToValueAtTime(volume * s, time + a + d);
      gain.setValueAtTime(volume * s, time + a + d + duration);
      gain.linearRampToValueAtTime(0, time + a + d + duration + r);
    };

  }

})();
