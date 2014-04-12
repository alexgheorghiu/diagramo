"use strict";

/**
 * Used to do/undo actions when the canvas changes his size.
 * Function will also translate everything on canvas on (-startX, -startY).
 * @this {CanvasChangeSizeCommand}
 * @constructor
 * @param {Number} newWidth - the new width of the canvas
 * @param {Number} newHeight - the new height of the canvas
 * @param {Number} startX - the new X coordinate to shift start point
 * @param {Number} startY - the new Y coordinate to shift start point
 * @author Alex
 */
function CanvasChangeSizeCommand(newWidth, newHeight, startX, startY){
    
    this.previousWidth = canvasProps.width;
    this.previousHeight = canvasProps.height;
    
    this.width = newWidth;
    this.height = newHeight;

    this.startX = typeof(startX) !== 'undefined' ? startX : 0;
    this.startY = typeof(startY) !== 'undefined' ? startY : 0;

    this.oType = "CanvasChangeSizeCommand";
}

CanvasChangeSizeCommand.prototype = {

    constructor : CanvasChangeSizeCommand,

    /**This method got called every time the Command must execute*/
    execute : function(){
        /*TODO: translate everything on canvas on (-startX, -startY)*/
        if (this.startX !== 0 || this.startY !== 0) {

        }

        //Attention: canvasProps is a global variable
        canvasProps.setWidth(this.width);
        canvasProps.setHeight(this.height);

        setUpEditPanel(canvasProps);
    },


    /**This method should be called every time the Command should be undone*/
    undo : function(){
        canvasProps.setWidth(this.previousWidth);
        canvasProps.setHeight(this.previousHeight);

        /*TODO: translate everything on canvas on (startX, startY)*/
        if (this.startX !== 0 || this.startY !== 0) {

        }

        setUpEditPanel(canvasProps);
    }
};


