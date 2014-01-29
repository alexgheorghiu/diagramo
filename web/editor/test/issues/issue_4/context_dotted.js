/**
 * Small library to smooth the dashed line support in <canvas>
 * @see http://www.rgraph.net/blog/2013/january/html5-canvas-dashed-lines.html
 * */


/*Add setLineDash(...) to Canvas context
 * */
if (!CanvasRenderingContext2D.prototype.hasOwnProperty("setLineDash")) {
    CanvasRenderingContext2D.prototype.setLineDash = function() {

        if (CanvasRenderingContext2D.prototype.hasOwnProperty("mozDash")) { //Mozilla
            this.mozDash = arguments[0];
        }
        else { //others
            console.info("no setLineDash");
            //TODO: implement fall back option. Right now do nothing :)
            /**You are more than welcome to offer a fallback implementation. */
        }
    };
}

///**Add lineDashOffset property to Canvas context*/
//CanvasRenderingContext2D.prototype.setLineDashOffset = function() {
//    if (CanvasRenderingContext2D.prototype.hasOwnProperty('lineDashOffset')) { //General code
//        this.lineDashOffset = arguments[0];
//    }    
//    else if (CanvasRenderingContext2D.prototype.hasOwnProperty('mozDashOffset')) { //Mozilla code        
//        this.mozDashOffset = arguments[0];
//    }
//    else { //not supported in browser
//        //TODO: implement fall back option. Right now do nothing :)
//    }
//}

/**Attach a property to class mozDashOffset. 
 * TODO: It does not seem to work as for Firefox "mozDashOffset" does not get updated :(*/
Object.defineProperty(CanvasRenderingContext2D.prototype, "lineDashOffset", {
        get: function() {
            console.info("mozDashOffset get");
            return this.mozDashOffset;
        },
        set: function(val) {            
            this.mozDashOffset = val;
            console.info("mozDashOffset set");
        },
        enumerable : true
});



//Add getLineDash(...) to Canvas context
if (!CanvasRenderingContext2D.prototype.hasOwnProperty("getLineDash")) {
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
//

//
//                CanvasRenderingContext2D.prototype.getLineDashOffset  = function() {
//                    var r;
//                    if(CanvasRenderingContext2D.prototype.hasOwnProperty('lineDashOffset')){
//                        r = this.lineDashOffset;
//                    }
//                    else if(CanvasRenderingContext2D.prototype.hasOwnProperty('mozDashOffset')){
//                        r = this.mozDashOffset;
//                    }
//                    else{
//                        //do nothing
//                    }
//
//                    return r;
//                }
console.info("Context dotted Loaded");