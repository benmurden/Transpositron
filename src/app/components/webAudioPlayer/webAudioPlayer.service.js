(function() {
  'use strict';

  angular
      .module('transpositron')
      .service('webAudioPlayer', webAudioPlayer);

  /** @ngInject */
  function webAudioPlayer(_, toastr, wavetables) {
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
    this.waveforms = {};
    this.envelopeDefs = {
      a: 0.02,
      d: 0.6,
      s: 0.4,
      r: 0.25
    };

    this._playing = {};

    var standardOscillatorTypes = ['sine', 'square', 'sawtooth', 'triangle'];

    var audioContext = new window.AudioContext();
    var compressor = audioContext.createDynamicsCompressor();

    this.setWaveform = function(waveform) {
      var self = this;
      this.waveform = waveform;
      if (_.indexOf(standardOscillatorTypes, waveform.toLowerCase()) === -1 && !this.waveforms[waveform]) {
        wavetables.getWavetable(waveform).then(function(result) {
          self.waveforms[waveform] = audioContext.createPeriodicWave(result.real, result.imag);
        }, function() {
          toastr.error('Error loading instrument ' + waveform);
        });
      }
    };

    this.buildOscillatorObject = function(note) {
      var osc = audioContext.createOscillator();
      var freq = this.NOTES[note];
      var gain = audioContext.createGain();
      var waveform = this.waveform;

      if (_.indexOf(standardOscillatorTypes, waveform.toLowerCase()) !== -1) {
        osc.type = waveform.toLowerCase();
      } else {
        if (this.waveforms[waveform]) {
          osc.type = 'custom';
          osc.setPeriodicWave(this.waveforms[waveform]);
        } else {
          toastr.warning('Still loading your instrument.');
        }
      }
      osc.connect(gain);
      gain.connect(compressor);
      compressor.connect(audioContext.destination);

      osc.frequency.value = freq;

      return {osc: osc, gain: gain};
    };

    this.playNote = function(note, duration) {
      var oscObj = this.buildOscillatorObject(note);
      var time = audioContext.currentTime;
      var a = this.envelopeDefs.a;
      var d = this.envelopeDefs.d;
      var s = this.envelopeDefs.s;
      var r = this.envelopeDefs.r;

      this.envelope(oscObj.gain, time, 1, duration, a, d, s, r);

      // osc.detune.value = semitone * 100;
      oscObj.osc.start(time);
      oscObj.osc.stop(time + a + d + duration + r);
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

    this.startEnvelope = function(gainNode, time, volume, a, d, s) {
      var gain = gainNode.gain;
      gain.cancelScheduledValues(0);
      gain.setValueAtTime(0, time);
      gain.linearRampToValueAtTime(volume, time + a);
      gain.linearRampToValueAtTime(volume * s, time + a + d);
    };

    this.endEnvelope = function(gainNode, time, r) {
      var gain = gainNode.gain;
      gain.cancelScheduledValues(0);
      gain.setValueAtTime(gainNode.gain.value, time);
      gain.linearRampToValueAtTime(0, time + r);
    };

    this.startNote = function(note) {
      var oscObj = this.buildOscillatorObject(note);
      var time = audioContext.currentTime;
      var a = this.envelopeDefs.a;
      var d = this.envelopeDefs.d;
      var s = this.envelopeDefs.s;

      this.startEnvelope(oscObj.gain, time, 1, a, d, s);

      oscObj.osc.start(time);
      this._playing[note] = oscObj;
    };

    this.endNote = function(note) {
      var oscObj = _.get(this._playing, note, false);
      var time = audioContext.currentTime;
      var r = this.envelopeDefs.r;

      if (oscObj) {
        this.endEnvelope(oscObj.gain, time, r);
        oscObj.osc.stop(time + r);
        delete(this._playing[note]);
      }
    };

    this.clean = function() {
      
    };
  }
})();
