"use strict";

(function (){

    var ctx;

    module( "Test Dashed line support" , {
        /*
        * Create new Figure on setup before every test run.
        */
        setup: function () {
            if(!dashSupport) throw "Dash support not loaded";
            
            var canvas = document.createElement('canvas');
            canvas.setAttribute('id','dashedcanvas');
            canvas.setAttribute("width", 400);
            canvas.setAttribute("height", 400);
            
            ctx = canvas.getContext('2d');
        }
    });

    /**
     * Test for setLineDash(...)
     */
    test("Test setLineDash(...) support", function () {        
        ok(typeof ctx.setLineDash == 'function', "Context has no setLineDash() support");
        
//        var pattern = [1,2];
//        ctx.setLineDash(pattern);
        
    });

    /**
     * Test for getLineDash(...)
     */
    test("Test getLineDash(...) support", function () {        
        ok(typeof ctx.getLineDash == 'function', "Context has no getLineDash() support");        
    });
    
    /**
     * Test for lineDashOffset
     */
    test("Test lineDashOffset property support", function () {        
        ok('lineDashOffset' in ctx, "Context has no lineDashOffset support");        
    });

    test("Test set/get/LineDash(...) functionality", function () {        
        
        var pattern = [1,2];
        ctx.setLineDash(pattern);
        ok(pattern.toString() === ctx.getLineDash().toString(), "Line dash operation failed")
    });
    
    
    test("Test lineDashOffset functionality", function () {        
        
        var offset = 4;
        
        //NOTE: without calling setLineDash(...) lineDashOffset is not available
        var pattern = [1,2];
        ctx.setLineDash(pattern);
        
        ctx.lineDashOffset = offset;
        
        ok(ctx.lineDashOffset === offset, "lineDashOffset setup failed")
    });

})();
