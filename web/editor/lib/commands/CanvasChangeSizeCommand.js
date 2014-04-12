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

    // commands used for translation of Figures and Containers
    this.translationCommands = [];

    this.oType = "CanvasChangeSizeCommand";
}

CanvasChangeSizeCommand.prototype = {

    constructor : CanvasChangeSizeCommand,

    /**This method got called every time the Command must execute*/
    execute : function(){
        // Does canvas should be translated?
        if (this.startX !== 0 || this.startY !== 0) {
            var translationMatrix = Matrix.translationMatrix(-this.startX, -this.startY);
            this.translationCommands = [];  // clear translation commands set

            // translate Containers
            var i;
            var containerLength = STACK.containers.length;
            for (i = 0; i < containerLength; i++) {
                // create ContainerTranslateCommand and add it to translationCommands set
                this.translationCommands.push(new ContainerTranslateCommand(STACK.containers[i].id, translationMatrix));
            }

            // translate Figures
            var figureLength = STACK.figures.length;
            for (i = 0; i < figureLength; i++) {
                // Does Figure is outside of container?
                if (CONTAINER_MANAGER.getContainerForFigure(STACK.figures[i].id) === -1) {
                    // create FigureTranslateCommand and add it to translationCommands set
                    this.translationCommands.push(new FigureTranslateCommand(STACK.figures[i].id, translationMatrix));
                }
            }

            // execute translation commands
            var commandLength = this.translationCommands.length;
            for (i = 0; i < commandLength; i++) {
                this.translationCommands[i].execute();
            }
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

        // Canvas was translated?
        if (this.startX !== 0 || this.startY !== 0) {
            // undo translation commands
            var i;
            var commandLength = this.translationCommands.length;
            for (i = 0; i < commandLength; i++) {
                this.translationCommands[i].undo();
            }
        }

        setUpEditPanel(canvasProps);
    }
};


