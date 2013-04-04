/*
Copyright (c) 2008, Tiest Vilee
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    * The names of its contributors may not be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

eval(loadFile("test/RhinoUnit/test/standard.js"));

var controller;
var view;
var service;
var aValue;

testCases(test,

	function setUp() {
		view = {
			addClickListener : function () {}
		};
		service = {
			incrementCounterBy : function () {},
			getCount : function () {
				return 1;
			}
		};
		service.getCount = function () {
			return aValue;
		};
		controller = new rhinounit.smallController(view, service);
	},
	
	function shouldAddClickListenerWhenCreated() {
		assert.mustCall(view, 'addClickListener');
		controller = new rhinounit.smallController(view, service);
	},
	
	when(function addClickListenerShouldImediatelyCallCallback() {
			view.addClickListener = function (aFunction) {
				aFunction();
			};		
		},
		function shouldIncrementByOne() {
			service.incrementCounterBy = function (by) {
				assert.that(by, eq(1));
			};
			assert.mustCall(service, 'incrementCounterBy');
			
			controller = new rhinounit.smallController(view, service);
		}),
	
	function shouldRetrieveCountFromService() {
            aValue = 456;
            assert.that(controller.getCount(), eq(aValue));
        },

	function shouldReturnRedForCountDivisibleBy3() {
            aValue = 9;
            assert.that(controller.colouring(), eq(controller.red));
        },

	function shouldReturnGreenForCountDivisibleBy3Plus1() {
            aValue = 10;
            assert.that(controller.colouring(), eq(controller.green));
        },

	function shouldReturnBlueForCountDivisibleBy3Plus2() {
            aValue = 11;
            assert.that(controller.colouring(), eq(controller.blue));
        },

	function shouldReturnGreenForCountDivisibleBy3RotatedBy1() {
            aValue = 9;
            assert.that(controller.colouring(1), eq(controller.green));
        }

);
