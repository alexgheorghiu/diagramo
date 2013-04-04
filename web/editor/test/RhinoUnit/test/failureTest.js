/*
Copyright (c) 2008, Tiest Vilee
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    * The names of its contributors may not be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var anObject;

function shouldThrowAssertException(theTest) {
	var threwException = false;
	try {
		theTest();
	} catch (e) {
		assert.that(e, hasConstructor("AssertionException"));
		threwException = true;
	}
	assert.that(threwException, isTrue("The test passed - it shouldn't have"));
}

testCases(test,

	function setUp() {
		anObject = {
			defaultFunction : function () {
			},
			defaultProperty : 1,
			defaultString : "john and mary"
		};
	},
	
	function defaultPropertyIs1() {
		shouldThrowAssertException(function () {
			assert.that(anObject.defaultProperty, eq(2));
		});
	},
	
	function defaultPropertySimilarToString1() {
		shouldThrowAssertException(function () {
			assert.that(anObject.defaultProperty, similar("2"));
		});
	},
	
	function defaultStringIsJohnAndMary() {
		shouldThrowAssertException(function () {
			assert.that(anObject.defaultString, eq("john isn't mary"));
		});
	},
	
	function defaultStringMatchesAnd() {
		shouldThrowAssertException(function () {
			assert.that(anObject.defaultString, matches(/isn't/));
		});
	},
	
	function checkIsNull() {
		shouldThrowAssertException(function () {
			assert.that("isn't null", isNull());
		});
	},
	
	function checkIsTrue() {
		shouldThrowAssertException(function () {
			assert.that(false, isTrue());
		});
	},	
	function defaultPropertyIsNot2() {
		shouldThrowAssertException(function () {
			assert.that(anObject.defaultProperty, not(eq(1)));
		});
	},
	
	function defaultPropertyIsNotSimilarToString2() {
		shouldThrowAssertException(function () {
			assert.that(anObject.defaultProperty, not(similar("1")));
		});
	},
	
	function defaultStringIsNoteSomethingElse() {
		shouldThrowAssertException(function () {
			assert.that(anObject.defaultString, not(eq("john and mary")));
		});
	},
	
	function defaultStringDoesntMatchElse() {
		shouldThrowAssertException(function () {
			assert.that(anObject.defaultString, not(matches(/and/)));
		});
	},
	
	function checkIsNotNull() {
		shouldThrowAssertException(function () {
			assert.that(null, not(isNull()));
		});
	},
	
	function checkIsNotTrue() {
		shouldThrowAssertException(function () {
			assert.that(true, not(isTrue()));
		});
	},
	
	function checkShouldThrowException() {
		shouldThrowAssertException(function () {
			shouldThrowException(
				function () {},
				"Should have thrown an exception or something");
		});
	},
	
	function checkCollectionContaining() {
		shouldThrowAssertException(function () {
			assert.that([1, 2, 3], isCollectionContaining(5, 3));
		});
	},
	
	function checkCollectionNotContaining() {
		shouldThrowAssertException(function () {
			assert.that([1, 3], not(isCollectionContaining(1, 3)));
		});
	},
	
	function checkCollectionContainingInOrder() {
		shouldThrowAssertException(function () {
			assert.that([1, 3, 2], containsInOrder(1, 2, 3));
		});
	},
	
	function checkCollectionDoesntContainInOrder() {
		shouldThrowAssertException(function () {
			assert.that([1, 3, 2], not(containsInOrder(1, 3, 2)));
		});
	},
	
	function checkCollectionContainingOnly() {
		shouldThrowAssertException(function () {
			assert.that([1, 3, 2], not(isCollectionContainingOnly([1, 2, 3])));
		});
	},
	
	function checkNotCollectionContainingOnly() {
		shouldThrowAssertException(function () {
			assert.that([4, 1, 3, 2], isCollectionContainingOnly([1, 2, 3]));
			assert.that([3, 2], isCollectionContainingOnly([1, 2, 3]));
		});
	},
	
	function checkFloatComparison() {
		shouldThrowAssertException(function () {
			assert.that(1.011, eqFloat(1.0));
		});
	},
	
	function checkNotFloatComparison() {
		shouldThrowAssertException(function () {
			assert.that(1.009, not(eqFloat(1.0)));
		});
	},
	
	function checkFloatComparisonWithAccuracy() {
		shouldThrowAssertException(function () {
			assert.that(2.9, eqFloat(1.0, 1.0));
		});
	}
	
);