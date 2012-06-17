/** 
 * An 'interface' for undoable actions, implemented by classes that specify 
 * how to handle action
 * 
 * QUESTION: Should we have something like no undoable actions (ex: delete a group)
 * @this {Command} 
 * @constructor
 * @author Alex <alex@scriptoid.com>
 */
function Command(){
    this.oType = 'Command';
    
    /**Any sequence of many mergeable actions that can be packed (merged into a single) by the history.
     *Example: all figure moves can be merges into a single command*/
    this.mergeable = true;
    
    /**Keeps track if we are executing this command for the first time.
     *Usually it there can be differences between first execute and a later execeut (redo)*/
    this.firstExecute = true;
    /*........*/
}


Command.prototype = {
    /**This method got called every time the Command must execute*/
    execute : function(){        
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){        
    }
}