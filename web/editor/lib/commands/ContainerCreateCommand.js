"use strict";

/* 
 * Creates a new {Container}
 * 
 * 
 * @this {ContainerCreateCommand} 
 * @constructor
 * @param {Number} x - the x coordinates
 * @param {Number} y - the x coordinates
 * @author Alex <alex@scriptoid.com>
 */

function ContainerCreateCommand(x, y) {
    
    this.x = x; 
    this.y = y;
    this.firstExecute = true;
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = false;
    
    this.id = null;
}

ContainerCreateCommand.prototype = {
    execute: function() {
        if(this.firstExecute){
            
            var p1 = new Point(this.x - 50, this.y - 50);
            var p2 = new Point(this.x + 50,this.y + 50);
            
            var container = new Container(null, p1, p2);
            
            STACK.containerAdd(container);
            
            state = STATE_CONTAINER_SELECTED;
            selectedContainerId = container.id;
            
            this.id = container.id;

            //set up it's editor
            setUpEditPanel(container);
        }
        else{ //redo
            throw "ContainerCreateCommand:execute(). Redo not implemented";
        }
    },
        
    
    undo: function() {
        //remove container
        
        //set state to NONE (?)        
        
        //set STACK.selectedContainerId to -1
    }
}

