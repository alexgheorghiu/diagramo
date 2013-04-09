/*
Copyright (c) 2008, Tiest Vilee
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    * The names of its contributors may not be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/* Generally useful utils */
function getFunctionNameFor(theFunction) {
	return /function (.*)\(/.exec("" + theFunction)[1];
}

function getConstructorNameFor(theObject) {
	return getFunctionNameFor(theObject.constructor);
}

function inspectObject(theObject, depth, indent) {
	if (!indent) {
		indent = "";
	}
	if (!depth) {
		depth = 1;
	}
	
	if (theObject === null) {
		project.log(indent + "null");
		return;
	}
	if (typeof theObject === "undefined") {
		project.log(indent + "undefined");
		return;
	}
	
	if (theObject.getClass) {
		project.log(indent + theObject.getClass() + " =>");
	} else {
		project.log(indent + getConstructorNameFor(theObject) + " =>");
	}
	
	indent += "  ";
	depth -= 1;
	
	for (var w in theObject) {
		var typeOfW = typeof theObject[w];
		var output = indent + w + " : ";
		if (typeOfW === "string") {
			output += "[";
			if (theObject[w].length > (80 - output.length - 1)) {
				output += theObject[w].substring(80 - output.length - 1 - 3) + "...]";
			} else {
				output += theObject[w] + "]";
			}
		} else if (typeOfW === "number") {
			output += "[" + theObject[w] + "]";
		} else {
			output += typeOfW;
		}

		project.log(output);
		
		if (typeOfW === "object" && depth) {
			inspectObject(theObject[w], depth, indent + "  ");
		}
	}
}

function forEachElementOf(list, doThis) {
    var listLength = list.length;
    for (var i = 0; i < listLength; i++) {
        doThis(list[i], i);
    }
}

function forEachElementOfReversed(list, doThis) {
	var reversedList = [].concat(list).reverse();
    forEachElementOf(reversedList, doThis);
}

function AssertionException(message, stackTrace) {
	this.message = message;
	this.toString = function () {
		return message;
	};
	this.stackTrace = stackTrace;
}

AssertionException.print = function (object) {
	if (typeof object === "object" && object !== null) {
		return getConstructorNameFor(object) + ":" + object;
	}
	return typeof object + ":" + object;
};

AssertionException.printString = function (string, start, end) {
	return string.substring(0, start) + "[" + string.substring(start, end) + "]" + string.substring(end);
};

AssertionException.stringDif = function (expected, actual) {
	var startPoint;
	for (startPoint = 0; startPoint < actual.length; startPoint++) {
		if (actual[startPoint] !== expected[startPoint]) {
			break;
		}
	}
	
	var actualEndPoint, expectedEndPoint = expected.length;
	for (actualEndPoint = actual.length; actualEndPoint > 0;) {
		actualEndPoint--;
		expectedEndPoint--;
		if (actual[actualEndPoint] !== expected[expectedEndPoint]) {
			break;
		}
	}
	
	actualEndPoint++;
	expectedEndPoint++;
	return "expected:<" + AssertionException.printString(expected, startPoint, expectedEndPoint) + "> but was:<" + AssertionException.printString(actual, startPoint, actualEndPoint) + ">";
};

// O(n^2)
AssertionException.intersection = function (expected, actual) {
	var result = [];
	for (var i = 0; i < expected.length; i++) {
		for (var j = 0; j < actual.length; j++) {
			if (expected[i] === actual[j]) {
				result.push(expected[i]);
			}
		}
	}
	return result;
};

AssertionException.cloneArray = function (array) {
	var result = [];
	forEachElementOf(array, function (item) {
		result.push(item);
	});
	return result;
};


AssertionException.testOrNot = function (test, not, failString, notFailString) {
	if (not && test) {
		return notFailString;
	} else if (!not && !test) {
		return failString;
	}
};

AssertionException.equalTestFailureString = function (expected, actual) {
	if (typeof expected === "string" && typeof actual === "string") {
		return AssertionException.stringDif(expected, actual);
	}
	return "expected:<" + AssertionException.print(expected) + "> but was:<" + AssertionException.print(actual) + ">";
};

AssertionException.returnArrayOrArgumentsAsArray = function (theArguments) {
	var expected = theArguments[0];
	if (theArguments.length === 1 && expected instanceof Array) {
		return expected;
	}
	return AssertionException.cloneArray(theArguments);

};


function eq(expected) {
	return function (actual, not) {
		var notFailString = "was expecting something different from:<" + AssertionException.print(expected) + "> but was:<" + AssertionException.print(actual) + ">";
		var failString = AssertionException.equalTestFailureString(expected, actual);

		return AssertionException.testOrNot(actual === expected, not, failString, notFailString);
	};
}

function similar(expected) {
	return function (actual, not) {
		var notFailString = "was expecting something different from:<" + AssertionException.print(expected) + "> but was:<" + AssertionException.print(actual) + ">"; 
		var failString = AssertionException.equalTestFailureString(expected, actual);
		
		return AssertionException.testOrNot(actual == expected, not, failString, notFailString);
	};
}

function matches(regExp) {
	return function (actual, not) {
		return AssertionException.testOrNot(
			regExp.test(actual), 
			not, 
			"<" + actual + "> should not have matched " + regExp, 
			"<" + actual + "> did not match " + regExp);
	};
}

function isTrue(message) {
	return function (actual, not) {
		return AssertionException.testOrNot(
			actual, 
			not, 
			message || "Should have been truey:<" + actual + ">", 
			message || "Should have been falsey:<" + actual + ">");
	};
}

function isFalse(message) {
	return function (actual, not) {
		return isTrue(message)(actual, !not);
	};
}

function not(predicate) {
	return function (actual, not) {
		return predicate(actual, !not);
	};
}

function and() {
}

function hasConstructor(expected) {
	return function (actual, not) {
		return AssertionException.testOrNot(
			getConstructorNameFor(actual) === expected, 
			not, 
			"expected:<" + AssertionException.print(actual) + "> to have a constructor of:<" + expected + "> but it was " + (typeof actual), 
			"expected:<" + AssertionException.print(actual) + "> should not have a constructor of:<" + expected + ">, but it did");
	};
}

function isA(expected) {
	return function (actual, not) {
		return AssertionException.testOrNot(
			actual instanceof expected, 
			not, 
			"expected:<" + AssertionException.print(actual) + "> should be a:<" + AssertionException.print(expected) + ">, but it isn't", 
			"expected:<" + AssertionException.print(actual) + "> should not be a:<" + AssertionException.print(expected) + ">, but it is");
	};
}

function isOfType(expected) {
	return function (actual, not) {
		return AssertionException.testOrNot(
			typeof actual === expected, 
			not, 
			"expected:<" + AssertionException.print(actual) + "> to be of type:<" + expected + "> but it was " + (typeof actual), 
			"expected:<" + AssertionException.print(actual) + "> to be of any type except:<" + expected + ">, but it was");
	};
}

function isCollectionContaining() {
	var expected = AssertionException.returnArrayOrArgumentsAsArray(arguments);

	return function (list, not) {
		return AssertionException.testOrNot(
			AssertionException.intersection(expected, list).length === expected.length, 
			not, 
			"couldn't find:<" + AssertionException.print(expected) + "> in:<" + AssertionException.print(list) + ">", 
			"should not have found:<" + AssertionException.print(expected) + "> in:<" + AssertionException.print(list) + ">");
	};
}

function isCollectionContainingOnly() {
	var expected = AssertionException.returnArrayOrArgumentsAsArray(arguments);
	return function (list, not) {
		return AssertionException.testOrNot(
			expected.length === list.length && AssertionException.intersection(expected, list).length === expected.length, 
			not, 
			"Should have been the same as:<" + AssertionException.print(expected) + "> but was:<" + AssertionException.print(list) + ">", 
			"Should not have been the same as:<" + AssertionException.print(list) + ">");
	};
}

function containsInOrder() {

	function doesContainInOrder(expected, actual) {
		var matches = true;
		forEachElementOf(expected, function (item, index) {
			if (item !== actual[index]) {
				matches = false;
			}
		});
		return matches;
	}

	var expected = AssertionException.returnArrayOrArgumentsAsArray(arguments);
	return function (actual, not) {
		return AssertionException.testOrNot(
			doesContainInOrder(expected, actual), 
			not, 
			"Should have been the same as:<" + AssertionException.print(expected) + "> but was:<" + AssertionException.print(actual) + ">", 
			"Should not have been the same as:<" + AssertionException.print(actual) + ">");
	};
}

function isNull(message) {
	return function (actual, not) {
		return AssertionException.testOrNot(
			actual === null, 
			not, 
			message || "Should have been null:<" + AssertionException.print(actual) + ">", 
			message || "Should NOT have been null:<" + AssertionException.print(actual) + ">");
	};
}


function eqFloat(expected, accuracy) {
	return function (actual, not) {
		if (!accuracy) {
			accuracy = 0.01;
		}
		return AssertionException.testOrNot(
			actual < expected * (1 + accuracy) && actual > expected * (1 - accuracy), 
			not, 
			"expected:<" + expected + "> +/-" + (accuracy * 100) + "%, but was:<" + actual + ">", 
			"get:<" + actual + "> but should not have been:<" + expected + "> +/-" + (accuracy * 100) + "%");
	};
}


function Assert() {

	var assert = this;

	assert.that = function that(actual, predicate) {
		var result = predicate(actual);
		if (result) {
			throw new AssertionException(result, assert.callStack(/script.executeTest/));
		}
	};
	
	var assertions = [];
	
	assert.mustCall = function mustCall(onThisObject, thisMethod) {
		var originalFunction = onThisObject[thisMethod];
		onThisObject[thisMethod] = assert.functionThatMustBeCalled(thisMethod, originalFunction);
	};
	
	assert.mustCallNTimes = function mustCallNTimes(onThisObject, numberOfTimes, thisMethod) {
		var originalFunction = onThisObject[thisMethod];
		onThisObject[thisMethod] = this.functionThatMustBeCalledNTimes(thisMethod, numberOfTimes, originalFunction);
	};
	
	assert.mustNotCall = function mustNotCall(onThisObject, thisMethod) {
		onThisObject[thisMethod] = assert.functionThatMustNotBeCalled(thisMethod);
	};
	
	assert.functionThatMustNotBeCalled = function functionThatMustNotBeCalled(thisMethod) {
		return function () {
			assert.fail("\n--> function '" + (thisMethod || "anonymous") + "' should not have been called. <--\n");
		};
	};
	
	assert.functionThatMustBeCalled = function functionThatMustBeCalled(thisMethod, originalFunction) {
		
		var hasBeenCalled = false;
		var theFunction = function () {
			hasBeenCalled = true;
			if (originalFunction) {
				return originalFunction.apply(this, arguments);
			}
		};
		
		assertions.push(function () {
			assert.that(
				hasBeenCalled, 
				isTrue("\n--> function '" + (thisMethod || "anonymous") + "' was not called. <--\n"));
		});
		
		return theFunction;
	};
	
	assert.functionThatMustBeCalledNTimes = function functionThatMustBeCalledNTimes(thisMethod, numberOfTimes, originalFunction) {
		
		var callCount = 0;
		var theFunction = function () {
			callCount += 1;
			if (originalFunction) {
				return originalFunction.apply(this, arguments);
			}
		};
		
		assertions.push(function () {
			assert.that(
				callCount === numberOfTimes, 
				isTrue("\n--> function '" + (thisMethod || "anonymous") + "' was called " + callCount + " times, but should have been called " + numberOfTimes + " times. <--\n"));
		});
		
		return theFunction;
	};
	
	assert.test = function test() {
		forEachElementOf(assertions, function (assertion) {
			assertion();
		});
	};
	
	assert.fail = function fail(message) {
		assert.that(false, isTrue(message || "failed"));
	};
	
	/**
	* Simulates a 'real' Exception by calling a non-existant menthod.  This real EcmaException
	 * is then used to extract the script call stack.
	 **/
	assert.callStack = function callStack(optionalIgnoreAfterMatching) {
		if (!optionalIgnoreAfterMatching) {
			optionalIgnoreAfterMatching = /runTest/;
		}
		
		/* Very Rhino specific way of getting the stack trace so we know where the error happened */
		function getStackTraceFromRhinoException(exception) {
			var outputStream = new java.io.ByteArrayOutputStream();
			var printStream = new java.io.PrintStream(outputStream);
			exception.printStackTrace(printStream);
			return outputStream.toString();
		}

		function extractScriptStackTraceFromFullStackTrace(trace, ignoreAfterMatching) {
			var result = [];
			var lines = trace.split("[\n\r\f]");
			for (var i = 0; i < lines.length; i++) {
				if (/at script/.test(lines[i]) && ! /callStack/.test(lines[i])) {
					result.push(lines[i]);
					if (ignoreAfterMatching && ignoreAfterMatching.test(lines[i])) {
						break;
					}
				}
			}
			return result.join("\n");
		}

		try {
			this.doesntexist();
		} catch (e) {
			var stackTrace = getStackTraceFromRhinoException(e.rhinoException);
			return extractScriptStackTraceFromFullStackTrace(stackTrace, optionalIgnoreAfterMatching);
		}
	};

}

function fail(message) {
	(new Assert()).fail(message);
}

function shouldThrowException(theTest, message, checkException) {
	try {
		theTest();
		fail(message || "An exception was expected, but not thrown.");
	} catch (e) {
		if (e.constructor === AssertionException) {
			throw e;
		}
		if (checkException) {
			checkException(e);
		}
	}
}
