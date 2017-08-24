module.exports = function(grunt) {

  // configure the tasks
  grunt.initConfig({
//  Copy
    copy: {
      dist: { cwd: 'font', src: [ '**' ], dest: 'dist/font', expand: true },
    },


//  Sass
    sass: {                              // Task
      expanded: {                            // Target
        options: {                       // Target options
          outputStyle: 'expanded',
          sourcemap: false,
        },
        files: {
          'css/gallery-materialize.css': 'sass/gallery.scss',
        }
      },

      min: {
        options: {
          outputStyle: 'compressed',
          sourcemap: false
        },
        files: {
          'css/gallery-materialize.min.css': 'sass/gallery.scss',
        }
      },

      // Compile ghpages css
      // gh: {
      //   options: {
      //     outputStyle: 'compressed',
      //     sourcemap: false
      //   },
      //   files: {
      //     'css/ghpages-materialize.css': 'sass/ghpages-materialize.scss',
      //   }
      // },
    },

    // PostCss Autoprefixer
    postcss: {
      options: {
        processors: [
          require('autoprefixer')({
            browsers: [
                'last 2 versions',
                'Chrome >= 30',
                'Firefox >= 30',
                'ie >= 10',
                'Safari >= 7']
          })
        ]
      },
      expanded: {
        src: 'css/gallery-materialize.css'
      },
      min: {
        src: 'css/gallery-materialize.min.css'
      },
      // gh: {
      //   src: 'css/ghpages-materialize.css'
      // },
      // bin: {
      //   src: 'bin/materialize.css'
      // }
    },

  // Browser Sync integration
    browserSync: {
      bsFiles: ["bin/*.js", "bin/*.css", "!**/node_modules/**/*"],
      options: {
          server: {
              baseDir: "./" // make server from root dir
          },
          port: 8000,
          ui: {
              port: 8080,
              weinre: {
                  port: 9090
              }
          },
          open: false
      }
    },

//  Concat
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        // the files to concatenate
        src: [
              "materialize/js/initial.js",
              "materialize/js/jquery.easing.1.3.js",
              "materialize/js/animation.js",
              "materialize/js/velocity.min.js",
              "materialize/js/hammer.min.js",
              "materialize/js/jquery.hammer.js",
              "materialize/js/global.js",
              "materialize/js/collapsible.js",
              "materialize/js/dropdown.js",
              "materialize/js/leanModal.js",
              "materialize/js/materialbox.js",
              "materialize/js/parallax.js",
              "materialize/js/tabs.js",
              "materialize/js/tooltip.js",
              "materialize/js/waves.js",
              "materialize/js/toasts.js",
              "materialize/js/sideNav.js",
              "materialize/js/scrollspy.js",
              "materialize/js/forms.js",
              "materialize/js/slider.js",
              "materialize/js/cards.js",
              "materialize/js/chips.js",
              "materialize/js/pushpin.js",
              "materialize/js/buttons.js",
              "materialize/js/transitions.js",
              "materialize/js/scrollFire.js",
              "materialize/js/date_picker/picker.js",
              "materialize/js/date_picker/picker.date.js",
              "materialize/js/character_counter.js",
              "materialize/js/carousel.js",
             ],
        // the location of the resulting JS file
        dest: 'js/materialize.js'
      },
      demoInit: {
        src: [
          'demo/js/imagesloaded.pkgd.min.js',
          'demo/js/masonry.pkgd.min.js',
          'demo/js/color-thief.min.js',
          'demo/js/galleryExpand.js',
          'demo/js/init.js',
        ],
        dest: 'demo/gallery.js'
      },
      demoDocs: {
        src: [
          'demo/js/prism.js',
          'demo/js/imagesloaded.pkgd.min.js',
          'demo/js/masonry.pkgd.min.js',
          'demo/js/color-thief.min.js',
          'demo/js/galleryExpand.js',
          'demo/js/docs-init.js',
        ],
        dest: 'demo/gallery-docs.js'
      },
      temp: {
        // the files to concatenate
        src: [
              "materialize/js/initial.js",
              "materialize/js/jquery.easing.1.3.js",
              "materialize/js/animation.js",
              "materialize/js/velocity.min.js",
              "materialize/js/hammer.min.js",
              "materialize/js/jquery.hammer.js",
              "materialize/js/global.js",
              "materialize/js/collapsible.js",
              "materialize/js/dropdown.js",
              "materialize/js/leanModal.js",
              "materialize/js/materialbox.js",
              "materialize/js/parallax.js",
              "materialize/js/tabs.js",
              "materialize/js/tooltip.js",
              "materialize/js/waves.js",
              "materialize/js/toasts.js",
              "materialize/js/sideNav.js",
              "materialize/js/scrollspy.js",
              "materialize/js/forms.js",
              "materialize/js/slider.js",
              "materialize/js/cards.js",
              "materialize/js/chips.js",
              "materialize/js/pushpin.js",
              "materialize/js/buttons.js",
              "materialize/js/transitions.js",
              "materialize/js/scrollFire.js",
              "materialize/js/date_picker/picker.js",
              "materialize/js/date_picker/picker.date.js",
              "materialize/js/character_counter.js",
              "materialize/js/carousel.js",
             ],
        // the location of the resulting JS file
        dest: 'temp/js/materialize.js'
      },
    },

//  Uglify
    uglify: {
      options: {
        // Use these options when debugging
        // mangle: false,
        // compress: false,
        // beautify: true

      },
      dist: {
        files: {
          'js/materialize.js': ['js/materialize.js']
        }
      },
      demo: {
        files: {
          'demo/gallery.min.js': ['demo/gallery.js'],
          'demo/gallery-docs.min.js': ['demo/gallery-docs.js']
        }
      },
      bin: {
        files: {
          'bin/materialize.js': ['temp/js/materialize.js']
        }
      },
      extras: {
        files: {
          'extras/noUiSlider/nouislider.min.js': ['extras/noUiSlider/nouislider.js']
        }
      }
    },


//  Compress
    // compress: {
    //   main: {
    //     options: {
    //       archive: 'bin/materialize.zip',
    //       level: 6
    //     },
    //     files:[
    //       { expand: true, cwd: 'dist/', src: ['**/*'], dest: 'materialize/'},
    //       { expand: true, cwd: './', src: ['LICENSE', 'README.md'], dest: 'materialize/'},
    //     ]
    //   },

    //   src: {
    //     options: {
    //       archive: 'bin/materialize-src.zip',
    //       level: 6
    //     },
    //     files:[
    //       {expand: true, cwd: 'font/', src: ['**/*'], dest: 'materialize-src/font/'},
    //       {expand: true, cwd: 'sass/', src: ['materialize.scss'], dest: 'materialize-src/sass/'},
    //       {expand: true, cwd: 'sass/', src: ['components/**/*'], dest: 'materialize-src/sass/'},
    //       {expand: true, cwd: 'js/', src: [
    //           "initial.js",
    //           "jquery.easing.1.3.js",
    //           "animation.js",
    //           "velocity.min.js",
    //           "hammer.min.js",
    //           "jquery.hammer.js",
    //           "global.js",
    //           "collapsible.js",
    //           "dropdown.js",
    //           "leanModal.js",
    //           "materialbox.js",
    //           "parallax.js",
    //           "tabs.js",
    //           "tooltip.js",
    //           "waves.js",
    //           "toasts.js",
    //           "sideNav.js",
    //           "scrollspy.js",
    //           "forms.js",
    //           "slider.js",
    //           "cards.js",
    //           "chips.js",
    //           "pushpin.js",
    //           "buttons.js",
    //           "transitions.js",
    //           "scrollFire.js",
    //           "date_picker/picker.js",
    //           "date_picker/picker.date.js",
    //           "character_counter.js",
    //           "carousel.js",
    //          ], dest: 'materialize-src/js/'},
    //     {expand: true, cwd: 'dist/js/', src: ['**/*'], dest: 'materialize-src/js/bin/'},
    //     {expand: true, cwd: './', src: ['LICENSE', 'README.md'], dest: 'materialize-src/'}

    //     ]
    //   },

    //   starter_template: {
    //     options: {
    //       archive: 'templates/starter-template.zip',
    //       level: 6
    //     },
    //     files:[
    //       { expand: true, cwd: 'dist/', src: ['**/*'], dest: 'starter-template/'},
    //       { expand: true, cwd: 'templates/starter-template/', src: ['index.html', 'LICENSE'], dest: 'starter-template/'},
    //       { expand: true, cwd: 'templates/starter-template/css', src: ['style.css'], dest: 'starter-template/css'},
    //       { expand: true, cwd: 'templates/starter-template/js', src: ['init.js'], dest: 'starter-template/js'}

    //     ]
    //   },

    //   parallax_template: {
    //     options: {
    //       archive: 'templates/parallax-template.zip',
    //       level: 6
    //     },
    //     files:[
    //       { expand: true, cwd: 'dist/', src: ['**/*'], dest: 'parallax-template/'},
    //       { expand: true, cwd: 'templates/parallax-template/', src: ['index.html', 'LICENSE', 'background1.jpg', 'background2.jpg', 'background3.jpg'], dest: 'parallax-template/'},
    //       { expand: true, cwd: 'templates/parallax-template/css', src: ['style.css'], dest: 'parallax-template/css'},
    //       { expand: true, cwd: 'templates/parallax-template/js', src: ['init.js'], dest: 'parallax-template/js'}

    //     ]
    //   }

    // },


//  Clean
   clean: {
     temp: {
       src: [ 'temp/' ]
     },
   },

//  Jade
    jade: {
      compile: {
        options: {
          pretty: true,
          data: {
            debug: false
          }
        },
        files: {
          "docs/index.html": "jade/index.jade",
          "docs/icons.html": "jade/icons.jade",
          "docs/about.html": "jade/about.jade",
          "docs/sass.html": "jade/sass.jade",
          "docs/getting-started.html": "jade/getting-started.jade",
          "docs/mobile.html": "jade/mobile.jade",
          "docs/showcase.html": "jade/showcase.jade",
          "docs/parallax.html": "jade/parallax.jade",
          "docs/parallax-demo.html": "jade/parallax-demo.jade",
          "docs/typography.html": "jade/typography.jade",
          "docs/color.html": "jade/color.jade",
          "docs/shadow.html": "jade/shadow.jade",
          "docs/grid.html": "jade/grid.jade",
          "docs/media-css.html": "jade/media-css.jade",
          "docs/table.html": "jade/table.jade",
          "docs/helpers.html": "jade/helpers.jade",
          "docs/forms.html": "jade/forms.jade",
          "docs/buttons.html": "jade/buttons.jade",
          "docs/navbar.html": "jade/navbar.jade",
          "docs/cards.html": "jade/cards.jade",
          "docs/preloader.html": "jade/preloader.jade",
          "docs/collections.html": "jade/collections.jade",
          "docs/badges.html": "jade/badges.jade",
          "docs/footer.html": "jade/footer.jade",
          "docs/dialogs.html": "jade/dialogs.jade",
          "docs/modals.html": "jade/modals.jade",
          "docs/dropdown.html": "jade/dropdown.jade",
          "docs/tabs.html": "jade/tabs.jade",
          "docs/side-nav.html": "jade/sideNav.jade",
          "docs/pushpin.html": "jade/pushpin.jade",
          "docs/waves.html": "jade/waves.jade",
          "docs/media.html": "jade/media.jade",
          "docs/collapsible.html": "jade/collapsible.jade",
          "docs/chips.html": "jade/chips.jade",
          "docs/scrollfire.html": "jade/scrollFire.jade",
          "docs/scrollspy.html": "jade/scrollspy.jade",
          "docs/transitions.html": "jade/transitions.jade",
          "docs/fullscreen-slider-demo.html": "jade/fullscreen-slider-demo.jade",
          "docs/pagination.html": "jade/pagination.jade",
          "docs/breadcrumbs.html": "jade/breadcrumbs.jade"


        }
      }
    },

//  Watch Files
    watch: {
      jade: {
        files: ['jade/**/*'],
        tasks: ['jade_compile'],
        options: {
          interrupt: false,
          spawn: false,
        },
      },

      js: {
        files: [ "js/materialize/js/**/*", "!js/init.js"],
        tasks: ['js_compile'],
        options: {
          interrupt: false,
          spawn: false,
        },
      },

      sass: {
        files: ['sass/**/*'],
        tasks: ['sass_compile'],
        options: {
          interrupt: false,
          spawn: false,
        },
      }
    },


//  Concurrent
    concurrent: {
      options: {
        logConcurrentOutput: true,
        limit: 10,
      },
      monitor: {
        tasks: ["watch:jade", "watch:js", "watch:sass", "notify:watching", 'server']
      },
    },


//  Notifications
    notify: {
      watching: {
        options: {
          enabled: true,
          message: 'Watching Files!',
          title: "Materialize", // defaults to the name in package.json, or will use project directory's name
          success: true, // whether successful grunt executions should be notified automatically
          duration: 1 // the duration of notification in seconds, for `notify-send only
        }
      },

      sass_compile: {
        options: {
          enabled: true,
          message: 'Sass Compiled!',
          title: "Materialize",
          success: true,
          duration: 1
        }
      },

      js_compile: {
        options: {
          enabled: true,
          message: 'JS Compiled!',
          title: "Materialize",
          success: true,
          duration: 1
        }
      },

      jade_compile: {
        options: {
          enabled: true,
          message: 'Jade Compiled!',
          title: "Materialize",
          success: true,
          duration: 1
        }
      },

      server: {
        options: {
          enabled: true,
          message: 'Server Running!',
          title: "Materialize",
          success: true,
          duration: 1
        }
      }
    },

    // Text Replace
    // replace: {
    //   version: { // Does not edit README.md
    //     src: [
    //       'bower.json',
    //       'package.json',
    //       'package.js',
    //       'jade/**/*.html'
    //     ],
    //     overwrite: true,
    //     replacements: [{
    //       from: grunt.option( "oldver" ),
    //       to: grunt.option( "newver" )
    //     }]
    //   },
    //   readme: { // Changes README.md
    //     src: [
    //       'README.md'
    //     ],
    //     overwrite: true,
    //     replacements: [{
    //       from: 'Current Version : v'+grunt.option( "oldver" ),
    //       to: 'Current Version : v'+grunt.option( "newver" )
    //     }]
    //   },
    // },

    // Create Version Header for files
    // usebanner: {
    //     release: {
    //       options: {
    //         position: 'top',
    //         banner: "/*!\n * Materialize v"+ grunt.option( "newver" ) +" (http://materializecss.com)\n * Copyright 2014-2015 Materialize\n * MIT License (https://raw.githubusercontent.com/Dogfalo/materialize/master/LICENSE)\n */",
    //         linebreak: true
    //       },
    //       files: {
    //         src: [ 'dist/css/*.css', 'dist/js/*.js']
    //       }
    //     }
    //   },

      // Rename files
    // rename: {
    //       rename_src: {
    //           src: 'bin/materialize-src'+'.zip',
    //           dest: 'bin/materialize-src-v'+grunt.option( "newver" )+'.zip',
    //           options: {
    //             ignore: true
    //           }
    //       },
    //       rename_compiled: {
    //           src: 'bin/materialize'+'.zip',
    //           dest: 'bin/materialize-v'+grunt.option( "newver" )+'.zip',
    //           options: {
    //             ignore: true
    //           }
    //       },
    //   },

      // Removes console logs
      removelogging: {
          source: {
            src: ["js/**/*.js", "!js/velocity.min.js"],
            options: {
              // see below for options. this is optional.
            }
          }
      },
  });

  // load the tasks
  // grunt.loadNpmTasks('grunt-gitinfo');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-rename');
  grunt.loadNpmTasks('grunt-remove-logging');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-postcss');
  // define the tasks
  grunt.registerTask(
    'release',[
      'lint',
      'copy',
      'sass:expanded',
      'sass:min',
      'postcss:expanded',
      'postcss:min',
      'concat:dist',
      'uglify:dist',
      'uglify:extras',
      // 'usebanner:release',
      // 'compress:main',
      // 'compress:src',
      // 'compress:starter_template',
      // 'compress:parallax_template',
      // 'replace:version',
      // 'replace:readme',
      // 'rename:rename_src',
      // 'rename:rename_compiled'
    ]
  );

  grunt.registerTask('jade_compile', ['jade', 'notify:jade_compile']);
  grunt.registerTask('js_compile', ['concat:temp', 'uglify:bin', 'notify:js_compile', 'clean:temp']);
  grunt.registerTask('sass_compile', ['sass:expanded', 'sass:min', 'postcss:min', 'postcss:expanded', 'notify:sass_compile']);
  grunt.registerTask('server', ['browserSync', 'notify:server']);
  grunt.registerTask('lint', ['removelogging:source']);
  grunt.registerTask('monitor', ["concurrent:monitor"]);
  grunt.registerTask('travis', ['jasmine']);
  grunt.registerTask('demo', ['concat:demoInit', 'concat:demoDocs', 'uglify:demo']);
};
