/**
 * Used to undo actions when the canvas is resized
 * @this {CanvasResizeCommand} 
 * @constructor
 * @param {CanvasProps} canvasProp - the {CanvasProps} we want to store
 * @author Alex
 */
function CanvasResizeCommand(canvasProp){
    
    this.canvasProp = canvasProp.clone();
    
    this.oType = "CanvasResizeCommand";
}

CanvasResizeCommand.prototype = {
    /**This method got called every time the Command must execute*/
    execute : function(){
        throw "Not implemented";
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){
        //attentions: canvasProps is a global variable
        canvasProps = this.canvasProp.clone();
        
        canvasProps.sync();
        setUpEditPanel(canvasProps);
    }
}


