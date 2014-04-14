"use strict";

/**
 * Used to do/undo actions when the canvas gets fitted.
 * Function will translate everything on canvas on (-startX, -startY).
 * @this {CanvasFitCommand}
 * @constructor
 * @param {Number} newWidth - the new width of the canvas
 * @param {Number} newHeight - the new height of the canvas
 * @param {Number} startX - the new X coordinate to shift start point
 * @param {Number} startY - the new Y coordinate to shift start point
 * @author Arty
 */
function CanvasFitCommand(newWidth, newHeight, startX, startY){

    this.previousWidth = canvasProps.width;
    this.previousHeight = canvasProps.height;

    this.width = newWidth;
    this.height = newHeight;

    this.startX = typeof(startX) !== 'undefined' ? startX : 0;
    this.startY = typeof(startY) !== 'undefined' ? startY : 0;

    // define if canvas should change size or become translated
    this.canvasResizing = this.previousWidth !== this.width || this.previousHeight !== this.height;
    this.canvasTranslation = this.startX !== 0 || this.startY !== 0;

    this.oType = "CanvasFitCommand";
}

CanvasFitCommand.prototype = {

    constructor : CanvasFitCommand,

    /**This method got called every time the Command must execute*/
    execute : function(){
        // Does canvas should be translated?
        if (this.canvasTranslation) {
            // get translation matrix
            var translationMatrix = Matrix.translationMatrix(-this.startX, -this.startY);
            // apply translation to objects in STACK
            STACK.transform(translationMatrix);
        }

        // Does canvas should be resized?
        if (this.canvasResizing) {
            // set new size of canvas
            canvasProps.setWidth(this.width);
            canvasProps.setHeight(this.height);
        }

        setUpEditPanel(canvasProps);
    },


    /**This method should be called every time the Command should be undone*/
    undo : function(){
        // Canvas was resized?
        if (this.canvasResizing) {
            // set previous size of canvas
            canvasProps.setWidth(this.previousWidth);
            canvasProps.setHeight(this.previousHeight);
        }

        // Canvas was translated?
        if (this.canvasTranslation) {
            // get backward translation matrix
            var translationMatrix = Matrix.translationMatrix(this.startX, this.startY);
            // apply translation to objects in STACK
            STACK.transform(translationMatrix);
        }

        setUpEditPanel(canvasProps);
    }
};
