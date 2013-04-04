/*
Copyright (c) 2008, Tiest Vilee
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    * The names of its contributors may not be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

importClass(java.io.File);
importClass(Packages.org.apache.tools.ant.util.FileUtils);
importClass(java.io.FileReader);

var options;
var testfailed = false;

function loadFile(fileName) {
	var file = new File(fileName);
	if (file.isAbsolute() === false)
	{
		file = new File(project.getProperty("basedir"), fileName);
	}
	var reader = new FileReader(file);
	return (new String(FileUtils.readFully(reader))).toString();
}

var rhinoUnitUtilPath = "src/rhinoUnitUtil.js";
if (attributes.get("rhinounitutilpath")) {
	rhinoUnitUtilPath = attributes.get("rhinounitutilpath");
}
eval(loadFile(rhinoUnitUtilPath));

var ignoredGlobalVars = attributes.get("ignoredglobalvars") ? attributes.get("ignoredglobalvars").split(" ") : [];
function ignoreGlobalVariableName(name) {
	var foundVariable = false;
	forEachElementOf(ignoredGlobalVars, function (ignoredGlobalVar) {
		if (ignoredGlobalVar == name) {
			foundVariable = true;
		}
	});
	return foundVariable;
}

var haltOnFirstUnitFailure = false;
if (attributes.get("haltonfirstfailure")) {
	haltOnFirstUnitFailure = attributes.get("haltonfirstfailure") == "true";
}

function addTestsToTestObject(tests, TestObject) {
	var whenCases = 0;
	forEachElementOf(tests, function (parameter) {
		if (parameter instanceof Function) {
			TestObject[getFunctionNameFor(parameter)] = parameter;
		} else {
			TestObject["when" + whenCases] = parameter;
			whenCases += 1;
		}
	});
}

function testCases(testObject) {
	var args = AssertionException.cloneArray(arguments);
	args.shift(); // remove first element
	addTestsToTestObject(args, testObject);
}

function when(setUp) {
	var whenCase = {
		setUp: setUp
	};

	var args = AssertionException.cloneArray(arguments);
	args.shift(); // remove first element
	addTestsToTestObject(args, whenCase);

	return whenCase;
}

function runTest(file) {

	function failingTestMessage(testName, e) {
		if (options.verbose) {
			self.log("Failed: " + testName + ", " + e, 0);
			if (options.stackTrace && e.stackTrace) {
				self.log(e.stackTrace);
			}
			self.log("");
		}
	}

	function erroringTestMessage(testName, e) {
		if (options.verbose) {
			self.log("Error: " + testName + ", Reason: " + e, 0);

			if (e.rhinoException) {
				var stackTrace = getStackTraceFromRhinoException(e.rhinoException);
				var traceString = extractScriptStackTraceFromFullStackTrace(stackTrace, /runTest/);
				self.log("The line number of the error within the file being tested is probably -> " + traceString.match(/:([0-9]+)/)[1] + " <-");
				self.log(traceString);
			}
			self.log("");
		}
	}

	function executeTest(tests, testName, superSetUp, superTearDown) {
		testCount++;
		try {
			if (superSetUp) {
				superSetUp();
			}
			tests[testName]();
			assert.test();
		} catch (e) {
			if (e.constructor === AssertionException) {
				failingTests++;
				failingTestMessage(testName, e);
			} else {
				erroringTests++;
				erroringTestMessage(testName, e);
			}
			testfailed = true;
		}
		if (superTearDown) {
			superTearDown();
		}
	}

	var before = {}, after = {};
	function wrapFunction$With$Position$(wrapped, wrapping, position) {
		if (wrapping) {
			return function () {
				if (position === before && wrapped) {
					wrapped();
				}
				wrapping();
				if (position === after && wrapped) {
					wrapped();
				}
			};
		}
		return wrapped;
	}

	function executeTestCases(tests, superSetUp, superTearDown) {

		for (var testName in tests) {
			assert = new Assert();

			if (testName === "setUp" || testName === "tearDown") {
				continue;
			}

			var theTest = tests[testName];

			if (theTest instanceof Function) {
				executeTest(tests, testName, superSetUp, superTearDown);
			} else {
				var newSuperSetup = wrapFunction$With$Position$(superSetUp, theTest.setUp, before);
				var newSuperTearDown = wrapFunction$With$Position$(superTearDown, theTest.tearDown, after);
				executeTestCases(theTest, newSuperSetup, newSuperTearDown);
			}
		}
	}

	var assert;
	var test = {};

	eval(loadFile(file));

	var testCount = 0;
	var failingTests = 0;
	var erroringTests = 0;

	executeTestCases(test, test.setUp, test.tearDown);

	if (testCount === 0) {
		erroringTests += 1;
		testfailed = true;
		failingTestMessage(file, "No tests defined");
	}

    self.log("Tests run: " + testCount + ", Failures: " + failingTests + ", Errors: " + erroringTests);
	self.log("");

}

eval("options = " + attributes.get("options") + ";");

var filesets = elements.get("fileset");
for (var j = 0; j < filesets.size(); j++) {

	var fileset = elements.get("fileset").get(0);
	var ds = fileset.getDirectoryScanner(project);
	var srcFiles = ds.getIncludedFiles();

	forEachElementOf(srcFiles, function (srcFile) {
		self.log("Testsuite: " + srcFile);
		var jsfile = new File(fileset.getDir(project), srcFile);

		var globalVars = {};
		var varName;
		for (varName in this) {
			globalVars[varName] = true;
		}

		runTest(jsfile);

		for (varName in this) {
			if (! globalVars[varName]) {
				if (ignoreGlobalVariableName(varName)) {
					delete this[varName];
				} else {
					self.log("Warning: " + srcFile + ", Reason: Polluted global namespace with '" + varName + "'", 0);
					testfailed = true;
				}
			}
		}

		if (testfailed && haltOnFirstUnitFailure) {
			self.fail("RhinoUnit failed.");
		}
	});
}

if (testfailed) {
	self.fail("RhinoUnit failed.");
}
