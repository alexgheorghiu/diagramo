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
 * Created once the Connector changed one of the edges ( {ConnectionPoint} )
 * 
 * @this {ConnectorAlterCommand} 
 * @constructor
 * @param {Number} connectorId - the id of the Connector
 * @author Alex <alex@scriptoid.com>
 */
function ConnectorAlterCommand(connectorId){
    this.oType = 'ConnectorAlterCommand';
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = false;
    
    this.firstExecute = true;
    
    this.connectorId = connectorId;
    
    var con = CONNECTOR_MANAGER.connectorGetById(this.connectorId);
    
    
    
    //-------------------store previous state-------------------------------
    
    //TODO: totally inefficient (massive storage) - we should store deltas
    this.turningPoints = Point.cloneArray(con.turningPoints);
    this.userChanges = con.cloneUserChanges();
    this.glues = Glue.cloneArray(CONNECTOR_MANAGER.glues);
    this.connectionPoints = ConnectionPoint.cloneArray(CONNECTOR_MANAGER.connectionPoints);            
    
}


ConnectorAlterCommand.prototype = {
    /**This method got called every time the Command must execute*/
    execute : function(){
        throw "Not implemented";
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){ 
        var con = CONNECTOR_MANAGER.connectorGetById(this.connectorId);
        con.turningPoints = this.turningPoints;
        con.userChanges = this.userChanges;
        /*TODO: make changes to DIAGRAMO.debugSolutions here
         * because, otherwise, those changes are not reflected in debug painting of Connector
         */
        CONNECTOR_MANAGER.glues = this.glues;
        CONNECTOR_MANAGER.connectionPoints = this.connectionPoints;
        
        
        
        draw();
    }
}