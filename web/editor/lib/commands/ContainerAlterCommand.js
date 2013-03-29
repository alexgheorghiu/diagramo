/* 
 * Created once the Container altered
 * 
 * @this {ConntainerAlterCommand} 
 * @constructor
 * @param {Number} containerId - the id of the Connector
 * @author Alex <alex@scriptoid.com>
 */
function ConntainerAlterCommand(containerId){
    this.oType = 'ConntainerAlterCommand';
}

ConntainerAlterCommand.prototype = {
    /**This method got called every time the Command must execute*/
    execute : function(){
        throw "Not implemented";
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){ 
        throw "Not implemented";
    }
}

