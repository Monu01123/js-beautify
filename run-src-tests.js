#!/usr/bin/env node
'use strict';
// Direct src test runner - runs tests against source files (no build needed)
var SanityTest = require('./js/test/sanitytest');
var run_js_tests = require('./js/test/generated/beautify-javascript-tests').run_javascript_tests;
var beautify = require('./js/src/index');

var Urlencoded = require('./js/src/unpackers/urlencode_unpacker');

function test_js(name, test_runner) {
  console.log('Testing ' + name + '...');
  var results = new SanityTest();
  test_runner(results, Urlencoded, beautify.js, beautify.html, beautify.css);
  console.log(results.results_raw());
  return results.get_exitcode();
}

var exit = test_js('js-beautifier from src', run_js_tests);
process.exit(exit);
