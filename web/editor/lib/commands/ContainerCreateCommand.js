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
}

ContainerCreateCommand.prototype = {
    execute: function() {
        if(this.firstExecute){
            
        }
        else{
            
        }
    },
        
    
    undo: function() {

    }
}

