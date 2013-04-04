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
		assert.that(anObject.defaultProperty, eq(1));
	},
	
	function defaultPropertySimilarToString1() {
		assert.that(anObject.defaultProperty, similar("1"));
	},
	
	function defaultStringIsJohnAndMary() {
		assert.that(anObject.defaultString, eq("john and mary"));
	},
	
	function defaultStringMatchesAnd() {
		assert.that(anObject.defaultString, matches(/and/));
	},
	
	function checkIsNull() {
		assert.that(null, isNull());
	},
	
	function checkIsTrue() {
		assert.that(true, isTrue());
	},	
	
	function checkIsFalse() {
		assert.that(false, isFalse());
	},	
	
	function defaultPropertyIsNot2() {
		assert.that(anObject.defaultProperty, not(eq(2)));
	},
	
	function defaultPropertyIsNotSimilarToString2() {
		assert.that(anObject.defaultProperty, not(similar("2")));
	},
	
	function defaultStringIsNoteSomethingElse() {
		assert.that(anObject.defaultString, not(eq("something else")));
	},
	
	function defaultStringDoesntMatchElse() {
		assert.that(anObject.defaultString, not(matches(/else/)));
	},
	
	function checkIsNotNull() {
		assert.that(".", not(isNull()));
	},
	
	function checkIsNotTrue() {
		assert.that(false, not(isTrue()));
	},
	
	function checkIsNotFalse() {
		assert.that(true, not(isFalse()));
	},	
	
	function checkShouldThrowException() {
		shouldThrowException(
			function () {
				throw "an error";
			},
			"Should have thrown an exception or something");
	},
	
	function defaultFunctionIsCalled() {
		anObject.defaultFunction = function (aString) {
			assert.that(aString, eq("a string"));
		};
		assert.mustCall(anObject, "defaultFunction");
		anObject.defaultFunction("a string");
	},
	
	function checkCollectionContaining() {
		assert.that([1, 2, 3], isCollectionContaining(2, 3));
	},
	
	function checkCollectionContainingArray() {
		assert.that([1, 2, 3], isCollectionContaining([2, 3]));
	},
	
	function checkCollectionNotContaining() {
		assert.that([1, 3], not(isCollectionContaining(2, 4)));
	},
	
	function checkCollectionContainingInOrder() {
		assert.that([1, 3, 2], containsInOrder(1, 3, 2));
	},
	
	function checkCollectionContainingInOrder() {
		assert.that([1, 3, 2], containsInOrder([1, 3, 2]));
	},
	
	function checkCollectionDoesntContainInOrder() {
		assert.that([1, 3, 2], not(containsInOrder(1, 2, 3)));
	},
	
	function checkCollectionContainingOnly() {
		assert.that([1, 3, 2], isCollectionContainingOnly([1, 2, 3]));
	},
	
	function checkNotCollectionContainingOnly() {
		assert.that([4, 1, 3, 2], not(isCollectionContainingOnly([1, 2, 3])));
		assert.that([3, 2], not(isCollectionContainingOnly([1, 2, 3])));
	},
	
	function checkFloatComparison() {
		assert.that(1.009, eqFloat(1.0));
	},
	
	function checkNotFloatComparison() {
		assert.that(1.011, not(eqFloat(1.0)));
	},
	
	function checkFloatComparisonWithAccuracy() {
		assert.that(1.9, eqFloat(1.0, 1.0));
	},
	
	when(function () {
			anObject.defaultProperty = 2;
		},
		
		function defaultPropertyShouldNowBe2() {
			assert.that(anObject.defaultProperty, eq(2));
		},
		
		function defaultStringShouldStayTheSame() {
			assert.that(anObject.defaultString, eq("john and mary"));
		},
		
		when(function () {
				anObject.defaultString = "this has changed";
			},
			
			function defaultPropertyShouldStillBe2() {
				assert.that(anObject.defaultProperty, eq(2));
			},
			
			function defaultStringShouldNowBeDifferent() {
				assert.that(anObject.defaultString, eq("this has changed"));
			}
		)
	),
	
	function defaultPropertyShouldStillBe1() {
				assert.that(anObject.defaultProperty, eq(1));
			},
	
	function tearDown() {
				anObject = null;
			}
);