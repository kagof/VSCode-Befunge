import * as testRunner from 'vscode/lib/testrunner';

testRunner.configure({
  ui: 'tdd', 		// the TDD UI is being used in whitespace.test.ts (suite, test, etc.)
  useColors: true, // colored output from test results
});

module.exports = testRunner;
