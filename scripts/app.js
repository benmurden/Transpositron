(function() {
  'use strict';

  angular
    .module('transpositron', ['ngAnimate', 'ngCookies', 'ngMaterial', 'ngRoute']);

    angular.element(document.getElementsByTagName('head')).append(angular.element('<base href="' + window.location.pathname + '" />'));
    
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
})();

(function() {
  'use strict';

  angular
    .module('transpositron')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastr, $mdThemingProvider, $routeProvider, $locationProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastr.options.timeOut = 3000;
    toastr.options.positionClass = 'toast-top-right';
    toastr.options.preventDuplicates = true;
    toastr.options.progressBar = true;

    $mdThemingProvider.theme('default')
      .primaryPalette('orange')
      .accentPalette('deep-orange')
      .dark();

    $routeProvider
      .when('/', {
        templateUrl: 'app/home/home.html',
        controller: 'HomeController',
        controllerAs: 'home'
      })
      .when('/about/', {
        templateUrl: 'app/about/about.html',
        controller: 'AboutController',
        controllerAs: 'about'
      });

    $locationProvider.html5Mode(true);

    }

})();

/* global malarkey:false, toastr:false, moment:false, keypress:false */
(function() {
  'use strict';

  angular
    .module('transpositron')
    .constant('malarkey', malarkey)
    .constant('toastr', toastr)
    .constant('moment', moment)
    .constant('keypress', keypress)
    .constant('_', _);

})();

(function() {
  'use strict';

  angular
    .module('transpositron')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();

(function() {
  'use strict';

  angular
    .module('transpositron')
    .controller('AboutController', AboutController);

  /** @ngInject */
  function AboutController(_) {
    var vm = this;

    var techs = {
      "angular": {
        "title": "AngularJS",
        "url": "https://angularjs.org/",
        "description": "HTML enhanced for web apps!",
        "logo": "angular.png"
      },
      "angular-material": {
        "title": "Angular Material Design",
        "url": "https://material.angularjs.org/#/",
        "description": "The Angular reference implementation of the Google's Material Design specification.",
        "logo": "angular-material.png"
      },
      "browsersync": {
        "title": "BrowserSync",
        "url": "http://browsersync.io/",
        "description": "Time-saving synchronised browser testing.",
        "logo": "browsersync.png"
      },
      "gulp": {
        "title": "GulpJS",
        "url": "http://gulpjs.com/",
        "description": "The streaming build system.",
        "logo": "gulp.png"
      },
      "zeptojs": {
        "title": "Zepto",
        "url": "http://zeptojs.com/",
        "description": "The aerogel-weight jQuery-compatible JavaScript library.",
        "logo": "zepto.png"
      },
      "node-sass": {
        "title": "Sass (Node)",
        "url": "https://github.com/sass/node-sass",
        "description": "Node.js binding to libsass, the C version of the popular stylesheet preprocessor, Sass.",
        "logo": "node-sass.png"
      },
      "jade": {
        "key": "jade",
        "title": "Jade",
        "url": "http://jade-lang.com/",
        "description": "Jade is a high performance template engine heavily influenced by Haml and implemented with JavaScript for node.",
        "logo": "jade.png"
      }
    };
    
    vm.techs = (function() {
      return _.map(techs, function(v) {
        v.rank = Math.random();
        return v;
      });
    })();
  }
})();

(function() {
  'use strict';

  angular
    .module('transpositron')
    .controller('HomeController', HomeController);

  /** @ngInject */
  function HomeController($scope, $timeout, $log, webAudioPlayer, keypressHelper, wavetables, toastr, _) {
    var vm = this;

    vm.classAnimation = '';
    vm.creationDate = 1440125657487;
    vm.ap = webAudioPlayer;
    // vm.keySequence = [90,88,67,86,66,78,77,188,190,65,83,68,70,71,72,74,75,76,186,222];
    vm.keySequence = ['z','x','c','v','b','n','m',',','.','a','s','d','f','g','h','j','k','l',';','\'','q','w','e','r','t','y','u','i','o','p','[',']'];
    vm.scale = '2212221';
    vm.baseOctave = 3;
    vm.baseKeyOffset = 0;
    vm.keyNoteMap = {};
    vm.notesPlaying = [];
    vm.waveform = '11_TB303_Square';
    vm.useScale = true;
    vm.showKeys = true;

    vm.mapKeysToNotes = function() {
      var scalePosition = 0;
      var scale = vm.scale;

      if (!vm.useScale) {
        scale = [1];
      }

      vm.keySequence.forEach(function(v, i) {
        vm.keyNoteMap[v] = webAudioPlayer.noteList[(vm.baseOctave * 12) + scalePosition + parseInt(vm.baseKeyOffset)];
        scalePosition += parseInt(scale[i % scale.length]);
      });
    };

    vm.noteOn = function(note) {
      if (!_.some(vm.notesPlaying, {key: note})) {
        vm.notesPlaying.push({key: note});

        webAudioPlayer.startNote(note);
      }
    };

    vm.noteOff = function(note) {
      _.remove(vm.notesPlaying, function(v) {
        return v.key === note;
      });

      webAudioPlayer.endNote(note);
    };

    vm.keyDown = function(e) {
      var key = keypressHelper.convert_key_to_readable(e.keyCode);
      var sequenceIndex = _.indexOf(vm.keySequence, key);

      if (e.ctrlKey || e.altKey) {
        return true;
      }

      vm.showKeys = true;

      if (sequenceIndex !== -1 && vm.keyNoteMap[key]) {
        $log.log(e.keyCode, vm.keyNoteMap[key]);
        $scope.$apply(function() {
          vm.noteOn(vm.keyNoteMap[key]);
        });
      }
    };

    vm.keyUp = function(e) {
      var key = keypressHelper.convert_key_to_readable(e.keyCode);
      var sequenceIndex = _.indexOf(vm.keySequence, key);

      if (e.ctrlKey || e.altKey) {
        return true;
      }

      if (sequenceIndex !== -1 && vm.keyNoteMap[key]) {
        $log.log('Key up: ' + e.keyCode, vm.keyNoteMap[key]);
        $scope.$apply(function() {
          vm.noteOff(vm.keyNoteMap[key]);
        });
      }
    };

    vm.setWaveform = function() {
      webAudioPlayer.setWaveform(vm.waveform);
    };

    activate();

    function activate() {
      vm.mapKeysToNotes();
      vm.setWaveform();
      $timeout(function() {
        vm.classAnimation = 'rubberBand';
      }, 4000);

      var combos = [];
      vm.keySequence.forEach(function(v) {
        combos.push({
          keys: v,
          on_keydown: function(e, count, duplicate) {
            if (!duplicate) {
              return vm.keyDown(e);
            }
          },
          on_keyup: function(e) {
            return vm.keyUp(e);
          }
        });
      });
      keypressHelper.listener.register_many(combos);
    }

    vm.scales = [
      {
        name: 'Aeolian',
        value: '2122122'
      },
      {
        name: 'Algerian',
        value: '21211131'
      },
      {
        name: 'Arabian A',
        value: '21212121'
      },
      {
        name: 'Arabian B',
        value: '2211222'
      },
      {
        name: 'Balinese',
        value: '12414'
      },
      {
        name: 'Blues (Hexatonic Major)',
        value: '211323'
      },
      {
        name: 'Blues (Hexatonic Minor)',
        value: '321132'
      },
      {
        name: 'Byzantine',
        value: '1312131'
      },
      {
        name: 'Egyptian',
        value: '23232'
      },
      {
        name: 'Harmonic Minor',
        value: '21222131',
      },
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
        name: 'Major Pentatonic',
        value: '22323'
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

    return vm;
  }
})();

(function() {
  'use strict';

  angular
    .module('transpositron')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController() {
  }
})();

(function() {
  'use strict';

  angular
    .module('transpositron')
    .factory('githubContributor', githubContributor);

  /** @ngInject */
  function githubContributor($log, $http) {
    var apiHost = 'https://api.github.com/repos/benmurden/transpositron';

    var service = {
      apiHost: apiHost,
      getContributors: getContributors
    };

    return service;

    function getContributors(limit) {
      if (!limit) {
        limit = 30;
      }

      return $http.get(apiHost + '/contributors?per_page=' + limit)
        .then(getContributorsComplete)
        .catch(getContributorsFailed);

      function getContributorsComplete(response) {
        return response.data;
      }

      function getContributorsFailed(error) {
        $log.error('XHR Failed for getContributors.\n' + angular.toJson(error.data, true));
      }
    }
  }
})();

(function() {
  'use strict';

  angular
      .module('transpositron')
      .service('keypressHelper', keypressHelper);

  /** @ngInject */
  function keypressHelper(keypress) {
    this.listener = new keypress.Listener();

    this.convert_key_to_readable = function(code) {
      return keypress._keycode_dictionary[code];
    };
  }

})();

(function() {
  'use strict';

  angular
    .module('transpositron')
    .directive('acmeMalarkey', acmeMalarkey);

  /** @ngInject */
  function acmeMalarkey(malarkey) {
    var directive = {
      restrict: 'E',
      scope: {
        extraValues: '=',
      },
      template: '&nbsp;',
      link: linkFunc,
      controller: MalarkeyController,
      controllerAs: 'vm'
    };

    return directive;

    function linkFunc(scope, el, attr, vm) {
      var watcher;
      var typist = malarkey(el[0], {
        typeSpeed: 40,
        deleteSpeed: 40,
        pauseDelay: 800,
        loop: true,
        postfix: ' '
      });

      el.addClass('acme-malarkey');

      angular.forEach(scope.extraValues, function(value) {
        typist.type(value).pause().delete();
      });

      watcher = scope.$watch('vm.contributors', function() {
        angular.forEach(vm.contributors, function(contributor) {
          typist.type(contributor.login).pause().delete();
        });
      });

      scope.$on('$destroy', function () {
        watcher();
      });
    }

    /** @ngInject */
    function MalarkeyController($log, githubContributor) {
      var vm = this;

      vm.contributors = [];

      activate();

      function activate() {
        return getContributors().then(function() {
          $log.info('Activated Contributors View');
        });
      }

      function getContributors() {
        return githubContributor.getContributors(10).then(function(data) {
          vm.contributors = data;

          return vm.contributors;
        });
      }
    }

  }

})();

(function() {
  'use strict';

  angular
    .module('transpositron')
    .directive('acmeNavbar', acmeNavbar);

  /** @ngInject */
  function acmeNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: true,
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: {
          creationDate: '='
      }
    };

    return directive;

    /** @ngInject */
    function NavbarController(moment) {
      var vm = this;

      // "vm.creation" is avaible by directive option "bindToController: true"
      vm.relativeDate = moment(vm.creationDate).fromNow();
    }
  }

})();

(function() {
  'use strict';

  angular
    .module('transpositron')
    .directive('tnKeyboard', tnKeyboard);

  /** @ngInject */
  function tnKeyboard() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/tn-keyboard/tn-keyboard.html',
      scope: true,
      controller: TnKeyboardController,
      controllerAs: 'vm',
      bindToController: {
          notesPlaying: '=',
          scale: '=',
          baseKeyOffset: '=',
          baseOctave: '=',
          keyNoteMap: '=',
          useScale: '=',
          showKeys: '=',
          keySequence: '=',
          playNote: '&',
          stopNote: '&'
      }
    };

    return directive;

    /** @ngInject */
    function TnKeyboardController($scope, $log, webAudioPlayer, _) {
      var vm = this;

      vm.keyPattern = [0,1,0,1,0,0,1,0,1,0,1,0];
      vm.keyboardNotes = [];
      vm.activeNotes = [];

      vm.generateKeyboardNotes = function() {
        var j = 0;
        var note;
        var noteKeyMap = _.invert(vm.keyNoteMap);
        vm.activeNotes = _.values(vm.keyNoteMap);

        for (var i = vm.baseOctave * 12; i < (vm.baseOctave + 3) * 12; i++) {
          note = webAudioPlayer.noteList[i];
          vm.keyboardNotes[j] = {
            label: note,
            keyLabel: noteKeyMap[note],
            type: vm.keyPattern[i % 12],
            active: vm.activeNotes.indexOf(note) !== -1
          };

          j++;
        }
      };

      vm.isBeingPlayed = function(note) {
        return _.some(vm.notesPlaying, {key: note});
      };

      vm.noteDown = function(note) {
        if (vm.activeNotes.indexOf(note) !== -1) {
          vm.showKeys = false;
          vm.playNote()(note);
        }
      };

      vm.noteUp = function(note) {
        if (vm.activeNotes.indexOf(note) !== -1) {
          vm.stopNote()(note);
        }
      };

      vm.notesDown = function(notes) {
        notes.forEach(function(v) {
          vm.noteDown(v);
        });
      };

      vm.notesUp = function(notes) {
        notes.forEach(function(v) {
          vm.noteUp(v);
        });
      };

      vm.mouseOver = function(e, note) {
        // Send noteDown if only the left mouse button is held.
        if (e.buttons === 1) {
          return vm.noteDown(note);
        }
      };

      vm.touchmove = function(e) {
        vm.touchesToNotes(e.touches);
      };

      vm.touchStart = function(e) {
        vm.touchesToNotes(e.touches);
      };

      vm.touchEnd = function(e) {
        vm.touchesToNotes(e.touches);
      };

      vm.touchesToNotes = function(touches) {
        var touchNotes = [];
        _.forEach(touches, function(v) {
          var targetElement = document.elementFromPoint(v.clientX, v.clientY);
          if (targetElement !== null) {
            touchNotes.push({key: targetElement.id});
          }
        });

        vm.syncNotesPlaying(touchNotes);

        // vm.notesPlaying = touchNotes;
      };

      vm.syncNotesPlaying = function(notes) {
        var keyMap = function(v) {
          return v.key;
        };

        var flatNotesPlaying = _.map(vm.notesPlaying, keyMap);
        var flatTouchNotes = _.map(notes, keyMap);

        var newNotes = _.difference(flatTouchNotes, flatNotesPlaying);
        var oldNotes = _.difference(flatNotesPlaying, flatTouchNotes);

        $log.log(newNotes, oldNotes);

        vm.notesDown(newNotes);
        vm.notesUp(oldNotes);
      };

      $scope.$watchGroup(['vm.baseOctave', 'vm.scale', 'vm.baseKeyOffset', 'vm.useScale'], vm.generateKeyboardNotes);

      activate();

      function activate() {
        vm.generateKeyboardNotes();
      }

      return vm;
    }
  }

})();

(function() {
  'use strict';

  angular
    .module('transpositron')
    .directive('tnTouchmove', tnTouchMove)
    .directive('tnTouchstart', tnTouchStart)
    .directive('tnTouchend', tnTouchEnd);

  /** @ngInject */
  function tnTouchMove() {
    var directive = {
      restrict: 'A',
      controller: TnTouchMoveController
    };

    return directive;

    function TnTouchMoveController($scope, $element) {
      $element.bind("touchstart", onTouchStart);

      function onTouchStart(event) {
        event.preventDefault();
        $element.bind("touchmove", onTouchMove);
        $element.bind("touchend", onTouchEnd);
      }

      function onTouchMove(event) {
        var method = $element.attr("tn-touchmove");
        $scope.$event = event;
        $scope.$apply(method);
      }

      function onTouchEnd(event) {
        event.preventDefault();
        $element.unbind("touchmove", onTouchMove);
        $element.unbind("touchend", onTouchEnd);
      }

    }
  }

  /** @ngInject */
  function tnTouchStart() {
    var directive = {
      restrict: 'A',
      controller: TnTouchStartController
    };

    return directive;

    function TnTouchStartController($scope, $element) {
      $element.bind('touchstart', onTouchStart);

      function onTouchStart(event) {
        event.preventDefault();
        var method = $element.attr('tn-touchstart');
        $scope.$event = event;
        $scope.$apply(method);
      }
    }
  }

  /** @ngInject */
  function tnTouchEnd() {
    var directive = {
      restrict: 'A',
      controller: TnTouchEndController
    };

    return directive;

    function TnTouchEndController($scope, $element) {
      $element.bind('touchend', onTouchEnd);

      function onTouchEnd(event) {
        event.preventDefault();
        var method = $element.attr('tn-touchend');
        $scope.$event = event;
        $scope.$apply(method);
      }
    }
  }
})();

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
          $http.get('assets/wavetables/' + name + '.json').then(function(result) {
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
          osc.setPeriodicWave(this.waveforms[waveform]);
          // osc.type = 'custom';
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
      if (!note || !!this._playing[note]) {
        return;
      }

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
      if (!note) {
        return;
      }

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

angular.module("transpositron").run(["$templateCache", function($templateCache) {$templateCache.put("app/home/home.html","<section class=\"jumbotron\"><h1>Transpositron</h1><p class=\"lead\">Transpose your keyboard and easily play any scale.</p></section><tn-keyboard flex=\"\" notes-playing=\"home.notesPlaying\" scale=\"home.scale\" natural-key=\"home.baseKeyOffset\" base-octave=\"home.baseOctave\" base-key-offset=\"home.baseKeyOffset\" key-note-map=\"home.keyNoteMap\" key-sequence=\"home.keySequence\" use-scale=\"home.useScale\" play-note=\"home.noteOn\" stop-note=\"home.noteOff\" show-keys=\"home.showKeys\"></tn-keyboard><div flex=\"\" layout-gt-sm=\"row\" layout-sm=\"column\" layout-align=\"center\"><div flex=\"33\" flex-sm=\"100\"><md-card><md-card-content><h3>Scale settings</h3><div layout=\"row\"><md-checkbox ng-model=\"home.useScale\" ng-change=\"home.mapKeysToNotes()\" aria-label=\"Enable scale\">Enable scale</md-checkbox></div><div layout=\"row\"><md-input-container flex=\"30\" layout=\"\"><label>Base Octave</label> <input class=\"flex-input\" type=\"number\" ng-model=\"home.baseOctave\" aria-label=\"octave\" aria-controls=\"octave-slider\"></md-input-container><div flex=\"\" layout=\"\" layout-margin=\"\" layout-align=\"center center\"><md-slider flex=\"\" ng-model=\"home.baseOctave\" min=\"0\" max=\"6\" step=\"1\" aria-label=\"octave\" id=\"octave-slider\" ng-change=\"home.mapKeysToNotes()\"></md-slider></div></div><md-input-container><label>Scale</label><md-select ng-model=\"home.scale\" ng-change=\"home.mapKeysToNotes()\" aria-label=\"Scale\" placeholder=\"Scale\"><md-option ng-repeat=\"s in home.scales\" value=\"{{s.value}}\">{{s.name}}</md-option></md-select></md-input-container><md-input-container><label>Key</label><md-select ng-model=\"home.baseKeyOffset\" ng-change=\"home.mapKeysToNotes()\" aria-label=\"Key\" placeholder=\"Key\"><md-option ng-repeat=\"k in home.naturalKeys\" value=\"{{k.value}}\">{{k.name}}</md-option></md-select></md-input-container><div layout=\"row\"><md-input-container flex=\"60\"><label>Custom scale</label> <input class=\"flex-input\" type=\"text\" ng-model=\"home.scale\" aria-label=\"Custom scale\"></md-input-container><md-button flex=\"\" class=\"md-raised\" ng-click=\"home.mapKeysToNotes()\">Set</md-button></div></md-card-content></md-card></div><div flex=\"33\" flex-sm=\"100\"><md-card flex=\"33\" flex-sm=\"100\"><md-card-content><h3>Envelope</h3><div layout=\"\"><md-input-container flex=\"30\" layout=\"\"><label>Attack</label> <input class=\"flex-input\" type=\"number\" ng-model=\"home.ap.envelopeDefs.a\" aria-label=\"attack\" aria-controls=\"attack-slider\"></md-input-container><div flex=\"\" layout=\"\" layout-align=\"center center\"><md-slider flex=\"\" ng-model=\"home.ap.envelopeDefs.a\" min=\"0\" max=\"2\" step=\"0.01\" aria-label=\"attack\" id=\"attack-slider\"></md-slider></div></div><div layout=\"\"><md-input-container flex=\"30\" layout=\"\"><label>Decay</label> <input class=\"flex-input\" type=\"number\" ng-model=\"home.ap.envelopeDefs.d\" aria-label=\"decay\" aria-controls=\"decay-slider\"></md-input-container><div flex=\"\" layout=\"\" layout-align=\"center center\"><md-slider flex=\"\" ng-model=\"home.ap.envelopeDefs.d\" min=\"0\" max=\"2\" step=\"0.01\" aria-label=\"decay\" id=\"decay-slider\"></md-slider></div></div><div layout=\"\"><md-input-container flex=\"30\" layout=\"\"><label>Sustain</label> <input class=\"flex-input\" type=\"number\" ng-model=\"home.ap.envelopeDefs.s\" aria-label=\"sustain\" aria-controls=\"sustain-slider\"></md-input-container><div flex=\"\" layout=\"\" layout-align=\"center center\"><md-slider flex=\"\" ng-model=\"home.ap.envelopeDefs.s\" min=\"0\" max=\"1\" step=\"0.01\" aria-label=\"sustain\" id=\"sustain-slider\"></md-slider></div></div><div layout=\"\"><md-input-container flex=\"30\" layout=\"\"><label>Release</label> <input class=\"flex-input\" type=\"number\" ng-model=\"home.ap.envelopeDefs.r\" aria-label=\"release\" aria-controls=\"release-slider\"></md-input-container><div flex=\"\" layout=\"\" layout-align=\"center center\"><md-slider flex=\"\" ng-model=\"home.ap.envelopeDefs.r\" min=\"0\" max=\"2\" step=\"0.01\" aria-label=\"release\" id=\"release-slider\"></md-slider></div></div></md-card-content></md-card></div><div flex=\"33\" flex-sm=\"100\"><md-card><md-card-content><h3>Wavetable instrument</h3><md-input-container><label>Instrument</label><md-select ng-model=\"home.waveform\" aria-label=\"wavetable instrument\" placeholder=\"wavetable\" ng-change=\"home.setWaveform()\"><md-option ng-repeat=\"wave in home.waveforms\" value=\"{{wave}}\">{{wave}}</md-option></md-select></md-input-container></md-card-content></md-card></div></div>");
$templateCache.put("app/components/navbar/navbar.html","<md-toolbar layout=\"row\" layout-align=\"center center\"><md-button hide=\"\" show-gt-xs=\"\" href=\"/\">Transpositron</md-button><section flex=\"\" layout=\"row\" layout-align=\"left center\"><md-button href=\"/\" class=\"md-raised\">Home</md-button><md-button href=\"about/\" class=\"md-raised\">About</md-button></section></md-toolbar>");
$templateCache.put("app/components/tn-keyboard/tn-keyboard.html","<div flex=\"\" layout=\"row\" tn-touchmove=\"vm.touchmove($event)\"><div flex=\"\" ng-repeat=\"key in vm.keyboardNotes\" class=\"piano-key\" ng-class=\"{\'black-key\': key.type, hide: $index >= 12, \'show-gt-xs\': $index >= 12 && $index < 24, \'show-gt-md\': $index >= 24, \'note-down\': vm.isBeingPlayed(key.label), \'disabled\': !key.active}\"><div id=\"{{key.label}}\" class=\"inner\" ng-mousedown=\"vm.noteDown(key.label)\" ng-mouseup=\"vm.noteUp(key.label)\" ng-mouseout=\"vm.noteUp(key.label)\" ng-mouseover=\"vm.mouseOver($event, key.label)\" tn-touchstart=\"vm.touchStart($event)\" tn-touchend=\"vm.touchEnd($event)\"><div class=\"key-label\" ng-class=\"{visible: !!vm.showKeys}\">{{key.keyLabel}}</div><div>{{key.label}}</div></div></div></div>");
$templateCache.put("app/about/about.html","<section class=\"jumbotron\"><h1>Transpositron</h1><p>A Web Audio API project by <a href=\"https://github.com/benmurden\">Benjamin Murden</a></p></section><div flex=\"\" layout=\"row\" layout-align=\"center\"><div class=\"about-text\"><p>Using Angular.js, Material Design, and of course, Web Audio API.</p></div></div><div flex=\"\" layout-gt-sm=\"row\" layout=\"column\" layout-wrap=\"\" layout-align=\"center\" class=\"techs\"><md-card flex=\"30\" flex-sm=\"100\" ng-repeat=\"tech in about.techs | orderBy:\'rank\'\"><div class=\"thumbnail\"><img ng-src=\"assets/images/{{ tech.logo }}\" alt=\"{{ tech.title }}\" class=\"pull-right\"><div class=\"caption\"><h3>{{ tech.title }}</h3><p>{{ tech.description }}</p><p><a ng-href=\"{{ tech.url }}\">{{ tech.url }}</a></p></div></div></md-card></div>");}]);