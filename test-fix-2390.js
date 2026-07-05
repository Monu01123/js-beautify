/**
 * Quick test for issue #2390 fix.
 * Template literals with trailing whitespace before real newlines
 * should have that whitespace escaped to prevent editor corruption.
 */
'use strict';

var beautify_js = require('./js/src/javascript/index');

function test(description, input, expected) {
  var result = beautify_js(input);
  var pass = result === expected;
  console.log((pass ? '✓' : '✗') + ' ' + description);
  if (!pass) {
    console.log('  INPUT   : ' + JSON.stringify(input));
    console.log('  EXPECTED: ' + JSON.stringify(expected));
    console.log('  ACTUAL  : ' + JSON.stringify(result));
  }
  return pass;
}

var allPassed = true;

// Issue #2390: packer uses real newline to represent \n in template literal.
// The template `[ \t<real-newline>\f\r]` should have trailing whitespace escaped.
// Input: backtick string with space + tab before real newline
// Note: In this JS string, \t = real tab, \n = real newline, \\f = backslash-f, \\r = backslash-r
allPassed &= test(
  'Issue #2390: escape trailing whitespace before newline in template literal',
  'let pattern=`[ \t\n\\f\\r]`',
  'let pattern = `[\\x20\\t\n\\f\\r]`'
);

// Verify that already-escaped template literals with \n sequences are unchanged
allPassed &= test(
  'Template literal with \\n escape sequences should be unchanged',
  '`This\\n  is\\n  a\\n  ${template}\\n  string.`',
  '`This\\n  is\\n  a\\n  ${template}\\n  string.`'
);

// Verify that template literals without trailing whitespace before newlines are unchanged
allPassed &= test(
  'Template literal with newlines but no trailing whitespace should be unchanged',
  '`line1\nline2\nline3`',
  '`line1\nline2\nline3`'
);

// Verify that regular template literals are not affected
allPassed &= test(
  'Regular template literal without newlines should be unchanged',
  '`This is a ${template} string.`',
  '`This is a ${template} string.`'
);

// Just a tab before newline
allPassed &= test(
  'Template literal with only tab before newline should escape tab',
  '`foo\t\nbar`',
  '`foo\\t\nbar`'
);

// Just spaces before newline
allPassed &= test(
  'Template literal with spaces before newline should escape them',
  '`foo   \nbar`',
  '`foo\\x20\\x20\\x20\nbar`'
);

console.log('\n' + (allPassed ? 'All tests PASSED!' : 'Some tests FAILED!'));
process.exit(allPassed ? 0 : 1);
