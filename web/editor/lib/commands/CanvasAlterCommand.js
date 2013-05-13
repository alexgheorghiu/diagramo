/**
 * Used to undo actions when the canvas is resized
 * @this {CanvasAlterCommand}
 * @constructor
 * @param {CanvasProps} canvasProp - the {CanvasProps} we want to store
 * @author Alex
 */
function CanvasAlterCommand(canvasProp){
    
    this.canvasProp = canvasProp.clone();
    
    this.oType = "CanvasAlterCommand";
}

CanvasAlterCommand.prototype = {
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


