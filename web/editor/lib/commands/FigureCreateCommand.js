/** 
 * An 'interface' for undoable actions, implemented by classes that specify 
 * how to handle action
 * 
 * 
 * @this {FigureCreateCommand} 
 * @constructor
 * @param {Function} factoryFunction - the function that will create the {Figure}. It will be local copy (of original pointer)
 * @param {Number} x - the x coordinates
 * @param {Number} y - the x coordinates
 * @author Alex <alex@scriptoid.com>
 */
function FigureCreateCommand(factoryFunction, x, y){
    this.oType = 'FigureCreateCommand';
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = false;
    this.factoryFunction = factoryFunction;
    this.x = x; 
    this.y = y;
    this.firstExecute = true;
    this.figureId = null;
}


FigureCreateCommand.prototype = {
    /**This method got called every time the Command must execute*/
    execute : function(){
        if(this.firstExecute){
            //create figure
            var createdFigure = this.factoryFunction(this.x, this.y);
              
            //move it into position
            createdFigure.transform(Matrix.translationMatrix(this.x - createdFigure.rotationCoords[0].x, this.y - createdFigure.rotationCoords[0].y))
            createdFigure.style.lineWidth = defaultLineWidth;
        
            //store id for later use
            //TODO: maybe we should try to recreate it with same ID (in case further undo will recreate objects linked to this)
            this.figureId = createdFigure.id;
        
            //add to STACK
            STACK.figureAdd(createdFigure);
        
            //make this the selected figure
            selectedFigureId = createdFigure.id;
        
            //set up it's editor
            setUpEditPanel(createdFigure);
        
            //move to figure selected state
            state = STATE_FIGURE_SELECTED;
        
            this.firstExecute = false;
        }
        else{ //redo
            throw "Not implemented";
        }
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){ 
        STACK.figureRemoveById(this.figureId);
        state = STATE_NONE;
    }
}