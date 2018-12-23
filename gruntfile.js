'use strict';

const sass = require('node-sass');

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    paths: {       
      dist:            'dist',
      dist_uc:         '<%= paths.dist %>/uncompressed',
      src:             'src',
      src_assets:      '<%= paths.src %>/assets',
      src_php:         '<%= paths.src %>/php',
      src_pug:         '<%= paths.src %>/pug',
      src_sass:        '<%= paths.src %>/sass',
      src_ts:          '<%= paths.src %>/typescript',
      live:            '',      // For use while developing, copy compiled files to wordpress/themes on watch.
      archive:         '<%= paths.dist %>/<%= pkg.name %>.zip'
    },

    clean: {
      all: ['<%= paths.dist_uc %>', '<%= paths.archive %>']
    }, 


   // Sass compiling. Compression left to WP/main theme for now.
   sass: {
     expanded: {
       options: {
         implementation: sass,
         outputStyle: 'expanded',
         sourceMap: false
       },
       files: [{
         expand: true,
         cwd: '<%= paths.src_sass %>',
         src: ['**/*.scss', '**/*.sass', '*.scss', '*.sass'],
         dest: '<%= paths.dist_uc %>',
         ext: '.css'
       }]
     }
   },

   // Add vendor CSS prefixes where sensible.
   autoprefixer: {
     expanded: {
       options: {
         browsers: ['> 5%', 'last 3 versions', 'ie 10', 'ie 11']
       },
       files: [{
         expand: true,
         cwd: '<%= paths.dist_uc %>',
         src: ['*.css'],
         dest: '<%= paths.dist_uc %>',
       }]
     }
   },

   // Changed file only pug compilation for use while developing with watch task.
   'cache-pug-compiler': {
     cache: {
       options: {
         pugTask: 'compile',
         basedir: '<%= paths.src_pug %>'
       },
       files: [ {
         expand: true,
         cwd: '<%= paths.src_pug %>',
         src: ['*.pug', '**/*.pug'],
         dest: '<%= paths.dist %>',
         ext: '.php'
       } ]
     }
   },


  pug: {
    compile: {
      data: {},
        options: {
          basedir: '<%= paths.src_pug %>',
          pretty: true
        },
        files: [ {
          cwd: '<%= paths.src_pug %>',
          src: ['*.pug', '**/*.pug'],
          dest: '<%= paths.dist_uc %>',
          expand: true,
          ext: '.php'
        } ]
      }
    },

    copy: {
      php: {
        expand: true,
         cwd: '<%= paths.src_php %>',
         src: ['**/*.php', '*.php'],
         dest: '<%= paths.dist_uc %>',
      }
    },

   // Watcher.
   watch: {
     css: {
       files: ['<%= paths.src_scss %>/**/*.scss', '<%= paths.src_scss %>/**/*.sass'],
       tasks: ['sass:expanded', 'autoprefixer:expanded']
     },
     'cache-pug-compiler': {
       files: ['<%= paths.src_pug %>/*.pug', '<%= paths.src_pug %>/**/*.pug'],
       tasks: ['cache-pug-compiler', 'pug']
     },
     pug: {
       files: ['<%= paths.src_pug %>/helpers/*.pug', '<%= paths.src_pug %>/partials/*.pug', '<%= paths.src_pug %>/modules/**/*.pug'],
       tasks: ['clean:pug', 'pug']
     },
     ts: {
       files:['<%= paths.src_ts %>/*.js'],
       tasks: []
     }
   },

   // Create theme archive.
  compress: {
    main: {
      options: { 
        archive: '<%= paths.archive %>'
      },
      files: [{
        expand: true,
        cwd: '<%= paths.dist_uc %>',
        src: ['*'],
        dest: '/'
      }]
    }
  }

 });

 // Plugin loads
 grunt.loadNpmTasks('grunt-sass');
 grunt.loadNpmTasks('grunt-contrib-compress');
 grunt.loadNpmTasks('grunt-cache-pug-compile'); // Only update changed templates rather than full recompile.
 grunt.loadNpmTasks('grunt-contrib-pug');
 grunt.loadNpmTasks('grunt-autoprefixer');
 grunt.loadNpmTasks('grunt-contrib-watch');
 grunt.loadNpmTasks('grunt-contrib-clean');
 grunt.loadNpmTasks('grunt-contrib-copy');



 // Default task.
 grunt.registerTask('default', [
    'clean:all', 
    'sass:expanded', 
    'autoprefixer:expanded', 
    'copy:php',
    'pug',
    'compress:main'
  ]);
};
