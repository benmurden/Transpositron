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
