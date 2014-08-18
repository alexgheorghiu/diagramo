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
 * Used to do/undo actions when the canvas changes his size
 * @this {CanvasChangeSizeCommand}
 * @constructor
 * @param {Number} newWidth - the new width of the canvas
 * @param {Number} newHeight - the new height of the canvas
 * @author Alex
 */
function CanvasChangeSizeCommand(newWidth, newHeight){

    this.previousWidth = canvasProps.width;
    this.previousHeight = canvasProps.height;

    this.width = newWidth;
    this.height = newHeight;

    this.oType = "CanvasChangeSizeCommand";
}

CanvasChangeSizeCommand.prototype = {

    constructor : CanvasChangeSizeCommand,

    /**This method got called every time the Command must execute*/
    execute : function(){
        //Attention: canvasProps is a global variable
        canvasProps.setWidth(this.width);
        canvasProps.setHeight(this.height);

        setUpEditPanel(canvasProps);
    },


    /**This method should be called every time the Command should be undone*/
    undo : function(){
        canvasProps.setWidth(this.previousWidth);
        canvasProps.setHeight(this.previousHeight);

        setUpEditPanel(canvasProps);
    }
};
