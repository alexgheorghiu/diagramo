/* 
 * This is triggered when you delete a figure
 * @this {FigureDeleteCommand} 
 * @constructor
 * @author Alex Gheorghiu <alex@scriptoid.com>
 */
function FigureDeleteCommand(figureId){
    this.oType = 'FigureDeleteCommand';
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = false;
    
    this.figureId = figureId;
    
    this.deletedFigure = null;
    
        
    this.firstExecute = true;
}


FigureDeleteCommand.prototype = {
    
    /**This method got called every time the Command must execute*/
    execute : function(){  
        if(this.firstExecute){
            //store deleted figure (safe copy)
//            this.deletedFigure = STACK.figureGetById(this.figureId).clone();
            this.deletedFigure = STACK.figureGetById(this.figureId);
            
            //delete it
            STACK.figureRemoveById(this.figureId);
            
            //remove clues
            //TODO: implements
            
            //remove connectors
            //TODO: implement
            
            //interface settings            
            selectedFigureId = -1;
            setUpEditPanel(canvasProps);
            state = STATE_NONE;            
            
            this.firstExecute = false;
        }
        else{ //a redo
            throw "Not implemented";
        }
    },

//      Snippet from old delete action (in main)
//                    if(selectedFigureId > -1){
//                        //remove figure
//
//                        if(!ev.noAddUndo && doUndo){//only add an action, if we are not currently undo/redoing an action
//                            var undo = new DeleteCommand(selectedFigureId, History.OBJECT_FIGURE, null, STACK.figureGetById(selectedFigureId),ev)
//
//                            History.addUndo(undo);
//                        }
//                        
//                        STACK.figureRemoveById(selectedFigureId);
//                        
//                        
//                        //remove glues
//                        var xCPs = CONNECTOR_MANAGER.connectionPointGetAllByParent(selectedFigureId);
//                        for(var k=0; k<xCPs.length; k++){
//                            CONNECTOR_MANAGER.glueRemoveAllByFirstId(xCPs[k].id);
//                            
//                        }
//                        
//                        //remove connection points
//                        CONNECTOR_MANAGER.connectionPointRemoveAllByParent(selectedFigureId);
//                        selectedFigureId = -1;
//                        setUpEditPanel(canvasProps);
//                        state = STATE_NONE;
//                        redraw = true;
//                        
//                    //                        alert('Delete done');
//                    }
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){        
        if(this.deletedFigure){
            //add deleted figure back
//            STACK.figureAdd(this.deletedFigure.clone());  //safe copy
            STACK.figureAdd(this.deletedFigure);
        }
        else{
            throw "No soted deleted figure";
        }
    }
}

