"use strict";

/**
 * Small library to smooth the dashed line support in <canvas>
 * Dotted line is made available through:
 * 
 * Basic canvas support for dashed lines is based on following CanvasRenderingContext2D's
 * methods and properties: 
 *  - CanvasRenderingContext2D.setLineDash();
 *  - CanvasRenderingContext2D.getLineDash();
 *  - CanvasRenderingContext2D.lineDashOffset; 
 * 
 * @see http://www.rgraph.net/blog/2013/january/html5-canvas-dashed-lines.html
 * */


var dashSupport = false;
(function() {

    /*Add setLineDash(...) to Canvas context
     * */
    if (typeof CanvasRenderingContext2D.prototype.setLineDash !== 'function') {
        CanvasRenderingContext2D.prototype.setLineDash = function() {

            if (CanvasRenderingContext2D.prototype.hasOwnProperty("mozDash")) { //Mozilla
                /*If you got an error "NS_ERROR_ILLEGAL_VALUE:" this is because 
                 * Util.operaReplacer from main.js->save() breaks serialization*/
                this.mozDash = arguments[0];
            }
            else { //others
                console.info("no setLineDash");
                //TODO: implement fall back option. Right now do nothing :)
                /**You are more than welcome to offer a fallback implementation. */
            }
        };
    }


    /*Add getLineDash(...) to Canvas context*/
    if (typeof CanvasRenderingContext2D.prototype.getLineDash  !== 'function') {
        CanvasRenderingContext2D.prototype.getLineDash = function() {
            var _dash = null;

            //check if is a Mozilla variant
            if (CanvasRenderingContext2D.prototype.hasOwnProperty("mozDash")) {
                _dash = this.mozDash;
            }
            else {
                console.info("no setLineDash");
                /**You are more than welcome to offer a fallback implementation. */
            }

            return _dash;
        };
    }
    

    /**Creates lineDashOffset property for context that miss it*/
    if (!CanvasRenderingContext2D.prototype.hasOwnProperty("lineDashOffset")) {
        if (CanvasRenderingContext2D.prototype.hasOwnProperty("mozDashOffset")) { //Mozilla
            Object.defineProperty(CanvasRenderingContext2D.prototype, "lineDashOffset", {
                /**ATTENTION: You must first set mozDash in order to use mozDashOffset*/
                get: function() {                    
//                    console.info("mozDashOffset get");
                    return this.mozDashOffset;
                },
                set: function(val) {
                    this.mozDashOffset = val;
//                    console.info("mozDashOffset set");
                },
                enumerable: true
            });
        }
        else{ //other browsers
            Object.defineProperty(CanvasRenderingContext2D.prototype, "lineDashOffset", {
                get: function() {
                    //TODO: add your own implementation
                },
                set: function(val) {
                    //TODO: add your own implementation
                },
                enumerable: true
            });
        }
    }    

    console.info("Context enhanced with dotted line");
    
    dashSupport = true;
})();