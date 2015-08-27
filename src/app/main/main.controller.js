(function() {
  'use strict';

  angular
    .module('transpositron')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, $log, webAudioPlayer, keypressHelper, wavetables, toastr, _) {
    var vm = this;

    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1440125657487;
    vm.showToastr = showToastr;
    vm.ap = webAudioPlayer;
    // vm.keySequence = [90,88,67,86,66,78,77,188,190,65,83,68,70,71,72,74,75,76,186,222];
    vm.keySequence = ['z','x','c','v','b','n','m',',','.','a','s','d','f','g','h','j','k','l',';','\'','q','w','e','r','t','y','u','i','o','p','[',']'];
    vm.scale = '2212221';
    vm.baseOctave = 2;
    vm.baseKeyOffset = 0;
    vm.keyNoteMap = {};

    vm.mapKeysToNotes = function() {
      var scalePosition = 0;

      vm.keySequence.forEach(function(v, i) {
        vm.keyNoteMap[v] = webAudioPlayer.noteList[(vm.baseOctave * 12) + scalePosition + parseInt(vm.baseKeyOffset)];
        scalePosition += parseInt(vm.scale[i % vm.scale.length]);
      });
    };

    vm.keyDown = function(e) {
      var key = keypressHelper.convert_key_to_readable(e.keyCode);
      var sequenceIndex = _.indexOf(vm.keySequence, key);

      if (sequenceIndex !== -1 && vm.keyNoteMap[key]) {
        $log.log(e.keyCode, vm.keyNoteMap[key]);

        webAudioPlayer.startNote(vm.keyNoteMap[key]);
      }
    };

    vm.keyUp = function(e) {
      var key = keypressHelper.convert_key_to_readable(e.keyCode);
      var sequenceIndex = _.indexOf(vm.keySequence, key);

      if (sequenceIndex !== -1 && vm.keyNoteMap[key]) {
        $log.log('Key up: ' + e.keyCode, vm.keyNoteMap[key]);

        webAudioPlayer.endNote(vm.keyNoteMap[key]);
      }
    };

    vm.setWaveform = function() {
      webAudioPlayer.setWaveform(vm.waveform);
    };

    activate();

    function activate() {
      vm.mapKeysToNotes();
      $timeout(function() {
        vm.classAnimation = 'rubberBand';
      }, 4000);

      var combos = [];
      vm.keySequence.forEach(function(v) {
        combos.push({
          keys: v,
          on_keydown: function(e, count, duplicate) {
            if (!duplicate) {
              vm.keyDown(e);
            }
          },
          on_keyup: function(e) {
            vm.keyUp(e);
          }
        });
      });
      keypressHelper.listener.register_many(combos);
    }

    function showToastr() {
      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      vm.classAnimation = '';
    }

    vm.scales = [
      {
        name: 'Major',
        value: '2212221'
      },
      {
        name: 'Lydian',
        value: '2221221'
      },
      {
        name: 'Locrian',
        value: '1221222'
      },
      {
        name: 'Chinese',
        value: '42141'
      },
      {
        name: 'Japanese A',
        value: '14214'
      },
      {
        name: 'Japanese B',
        value: '23214'
      },
      {
        name: 'Japanese (Ichikosucho)',
        value: '22111221'
      },
      {
        name: 'Japanese (Taishikicho)',
        value: '221112111'
      }
    ];

    vm.naturalKeys = [
      {
        name: 'C',
        value: 0
      },
      {
        name: 'C#',
        value: 1
      },
      {
        name: 'D',
        value: 2
      },
      {
        name: 'D#',
        value: 3
      },
      {
        name: 'E',
        value: 4
      },
      {
        name: 'F',
        value: 5
      },
      {
        name: 'F#',
        value: 6
      },
      {
        name: 'G',
        value: 7
      },
      {
        name: 'G#',
        value: 8
      },
      {
        name: 'A',
        value: 9
      },
      {
        name: 'A#',
        value: 10
      },
      {
        name: 'B',
        value: 11
      }
    ];

    vm.waveforms = [
      "Sine",
      "Square",
      "Triangle",
      "Sawtooth",
      "01_Saw",
      "02_Triangle",
      "03_Square",
      "04_Noise",
      "05_Pulse",
      "06_Warm_Saw",
      "07_Warm_Triangle",
      "08_Warm_Square",
      "09_Dropped_Saw",
      "10_Dropped_Square",
      "11_TB303_Square",
      "Bass",
      "Bass_Amp360",
      "Bass_Fuzz",
      "Bass_Fuzz_ 2",
      "Bass_Sub_Dub",
      "Bass_Sub_Dub_2",
      "Brass",
      "Brit_Blues",
      "Brit_Blues_Driven",
      "Buzzy_1",
      "Buzzy_2",
      "Celeste",
      "Chorus_Strings",
      "Dissonant Piano",
      "Dissonant_1",
      "Dissonant_2",
      "Dyna_EP_Bright",
      "Dyna_EP_Med",
      "Ethnic_33",
      "Full_1",
      "Full_2",
      "Guitar_Fuzz",
      "Harsh",
      "Mkl_Hard",
      "Organ_2",
      "Organ_3",
      "Phoneme_ah",
      "Phoneme_bah",
      "Phoneme_ee",
      "Phoneme_o",
      "Phoneme_ooh",
      "Phoneme_pop_ahhhs",
      "Piano",
      "Putney_Wavering",
      "Throaty",
      "Trombone",
      "Twelve String Guitar 1",
      "Twelve_OpTines",
      "Wurlitzer",
      "Wurlitzer_2"
    ];
  }
})();
