/* 
 * This is triggered when you delete a Container
 * @this {ContainerDeleteCommand} 
 * @constructor
 * @author Alex Gheorghiu <alex@scriptoid.com>
 */
function ContainerDeleteCommand(containerId){
    this.oType = 'ContainerDeleteCommand';
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = false;
    
    this.containerId = containerId;
            
    this.firstExecute = true;
       
}


ContainerDeleteCommand.prototype = {
    
    /**This method got called every time the Command must execute*/
    execute : function(){  
        if(this.firstExecute){
                        
            STACK.containerRemoveById(this.containerId);
            selectedContainerId = -1;
            setUpEditPanel(canvasProps);
            state = STATE_NONE;  
            
            
            redraw = true; 
            this.firstExecute = false;
        }
        else{ //a redo
            throw "Not implemented";
        }
    },

    
    /**This method should be called every time the Command should be undone*/
    undo : function(){        
        throw "Not implemented";
    }
};

