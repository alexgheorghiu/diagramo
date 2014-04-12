"use strict";

/*
 * This is triggered when a connector was translated
 * @this {ConnectorTranslateCommand}
 * @constructor
 * @param {Integer} connectorId - the id of the connector translated
 * @param {Array} matrix - the transformation matrix of translation
 * @author Artyom Pokatilov <artyom.pokatilov@gmail.com>
 */
function ConnectorTranslateCommand(connectorId, matrix){
    this.oType = 'ConnectorTranslateCommand';

    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = true;

    this.connectorId = connectorId;

    //compute the translation matrix
    this.matrix = matrix

    //compute the reverse matrix
    this.reverseMatrix = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ];
    this.reverseMatrix[0][2] = -this.matrix[0][2];
    this.reverseMatrix[1][2] = -this.matrix[1][2];

}


ConnectorTranslateCommand.prototype = {

    /**This method got called every time the Command must execute*/
    execute : function(){
        var connector = CONNECTOR_MANAGER.connectorGetById(this.connectorId);
        connector.transform(this.matrix);
    },


    /**This method should be called every time the Command should be undone*/
    undo : function(){
        var connector = CONNECTOR_MANAGER.connectorGetById(this.connectorId);
        connector.transform(this.reverseMatrix);
    }
}


