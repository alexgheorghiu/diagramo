/** 
 * As Connector is not a single action command
 * we will store only the "already ready" made connector. (IT will take place when
 * on (main: onMouseUp + STATE_CONNECTOR_PICK_SECOND state)
 * 
 * @this {ConnectorCreateCommand} 
 * @constructor
 * @author Alex <alex@scriptoid.com>
 */
function ConnectorCreateCommand(connectorId){
    this.oType = 'ConnectorCreateCommand';
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = false;
    
    this.firstExecute = true;
    
    this.connectorId = connectorId;

}


ConnectorCreateCommand.prototype = {
    /**This method got called every time the Command must execute*/
    execute : function(){
        throw "Should not be implemented";
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){ 
        CONNECTOR_MANAGER.connectorRemoveById(this.connectorId, true);
        
        state = STATE_NONE;
        selectedConnectorId = -1;
    }
}