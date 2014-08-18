"use strict";

/*
Copyright [2014] [Diagramo]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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

        // if current connector is in text editing state
        if (state == STATE_TEXT_EDITING) {
            // remove current text editor
            currentTextEditor.destroy();
            currentTextEditor = null;
        }
        
        state = STATE_NONE;
        selectedConnectorId = -1;
    }
}