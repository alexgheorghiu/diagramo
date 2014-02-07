"use strict";

/**
 * Used to undo actions when the canvas changes his color
 * @this {CanvasChangeColorCommand}
 * @constructor
 * @param {String} newColor - the new Color of canvas
 * @author Alex, Artyom
 */
function CanvasChangeColorCommand(newColor){
    
    this.previousColor = canvasProps.fillColor;
    this.color = newColor;
    
    this.oType = "CanvasChangeColorCommand";
}

CanvasChangeColorCommand.prototype = {
    
    constructor : CanvasChangeColorCommand,
    
    /**This method got called every time the Command must execute*/
    execute : function(){
        //Attention: canvasProps is a global variable
        canvasProps.setFillColor(this.color);
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){
        //Attention: canvasProps is a global variable
        canvasProps.setFillColor(this.previousColor);
        
        setUpEditPanel(canvasProps);
    }
};


