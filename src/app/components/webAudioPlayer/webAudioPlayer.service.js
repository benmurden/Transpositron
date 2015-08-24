(function() {
  'use strict';

  angular
      .module('transpositron')
      .service('webAudioPlayer', webAudioPlayer);

  /** @ngInject */
  function webAudioPlayer() {
    this.NOTES = (function () {
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

    this.noteList = (function() {
      var list = [];
      var toneSymbols = "CcDdEFfGgAaB";

      for (var octave = 0; octave < 8; ++octave) {
        for (var t = 0; t < 12; ++t) {
          list.push(toneSymbols[t]+octave);
        }
      }
      return list;
    }());

    this.waveform = 'sine';
    this.envelopeDefs = {
      a: 0.02,
      d: 0.6,
      s: 0.4,
      r: 0.25
    };

    var audioContext = new window.AudioContext();
    var compressor = audioContext.createDynamicsCompressor();

    this.playNote = function(note, duration, semitone) {
      var osc = audioContext.createOscillator();
      var freq = this.NOTES[note];
      var time = audioContext.currentTime;
      var a = this.envelopeDefs.a;
      var d = this.envelopeDefs.d;
      var s = this.envelopeDefs.s;
      var r = this.envelopeDefs.r;
      var gain = audioContext.createGain();
      var waveform = this.waveform;
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
      // osc.detune.value = semitone * 100;
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
