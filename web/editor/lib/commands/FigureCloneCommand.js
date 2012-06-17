/** 
 * This command just clones an existing {Figure}. All it needs is an id of
 * cloned {Figure}
 * @this {FigureCloneCommand} 
 * @constructor
 * @param {Number} parentFigureId - the Id of parent {Figure}
 * @author Alex <alex@scriptoid.com>
 * @author Janis Sejans <janis.sejans@towntech.lv>
 */
function FigureCloneCommand(parentFigureId){
    this.oType = 'FigureCloneCommand';
    
    this.firstExecute = true;
    
    /**This will keep the newly created  Figure id*/
    this.figureId = null; 
    
    /**This keeps the cloned figure Id*/
    this.parentFigureId = parentFigureId;    
}


FigureCloneCommand.prototype = {
    
    /**This method got called every time the Command must execute*/
    execute : function(){
        if(this.firstExecute){
            //get old figure and clone it
            var createdFigure = STACK.figureGetById(this.parentFigureId).clone();
            
            //move it 10px low and 10px right
            createdFigure.transform(Matrix.translationMatrix(10,10));
            
            //store newly created figure
            STACK.figureAdd(createdFigure);
            
            //store newly created figure id
            this.figureId = createdFigure.id;
            
            //update diagram state
            selectedFigureId = this.figureId;
            setUpEditPanel(createdFigure);
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