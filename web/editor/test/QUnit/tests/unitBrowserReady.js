"use strict";

module( "Tests if browser supports necessary features" );

test("isBrowserReady()", function () {
    ok(isBrowserReady() != 0);
});

test("primitive.Point.contains [Depends on Point.constructor]", function () {
    var x = 7;
    var y = 8;
    var point = new Point(x,y);

    ok(point.contains(x,y), "new Point(7,8).contains(7,8)");
});


(function (){

    var testContext;

    module("Text's metrix", {
        setup: function() {
            testContext = document.getElementsByTagName('CANVAS')[0].getContext('2d');
            testContext.font = 12 + "px 'Arial'";
        }
    });



    test("get canvas context", function () {
        var r = testContext instanceof CanvasRenderingContext2D;
        ok(r, "No CanvasRenderingContext2D ?");
    });


    /**
     * Check if we do have measureText
    **/
    test("2d Context's measureText(...)", function () {
        var r = typeof testContext.measureText === 'function';

        ok(r, "No context's measureText(...) method ? ");
    });


    /**
     * WARNING: If you run this page @see http://www.w3schools.com/tags/canvas_measuretext.asp
     * you will see that width is not the same across browses, thus making current
     * test irelevant 
     * 
     * Our discovering of this issue documented
     * @see <a href="https://bitbucket.org/scriptoid/diagramo/issue/36/text-units-fails-on-ie9">here</a>    
     * In time of developing this test ("letters metrix") passes in Firefox, Chrome & Safari, IE11
     * but fails in IE9 and IE10.
     * 
     * From the point of view of official
     * @see <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html">HTML5 Canvas documentation</a>
     * we are doing everything correct: use the same font-family, font-size and the same method
     * CanvasRenderingContext2D :: TextMetrics measureText(DOMString text)
     *
     **/
    test("digit metrix", function () {
        var EXPECTED_VALUE = 7;
        var r = true;
        for(var i = 0; i < 10; i++){
            var metrics = testContext.measureText(i);
            r &= metrics.width === EXPECTED_VALUE;
        }

        ok(r, 'Wrong metrics mesurement. It should be ' + EXPECTED_VALUE 
                + " but found " +  metrics.width);
    });


})();