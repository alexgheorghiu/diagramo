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
 * An 'interface' for undoable actions, implemented by classes that specify
 * how to handle action
 *
 *
 * @this {InsertedImageFigureCreateCommand}
 * @constructor
 * @param {String} imgFileName - filename of inserted image
 * @param {Number} x - the x coordinates
 * @param {Number} y - the x coordinates
 *
 * @author Artyom Pokatilov <artyom.pokatilov@gmail.com>, Alex
 */
function InsertedImageFigureCreateCommand(imgFileName, x, y){
    this.oType = 'InsertedImageFigureCreateCommand';

    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = false;
    this.imgFileName = imgFileName;
    this.x = x;
    this.y = y;
    this.firstExecute = true;
    this.figureId = null;
}


InsertedImageFigureCreateCommand.prototype = {
    /**This method got called every time the Command must execute*/
    execute : function(){
        if(this.firstExecute){
            //create figure
            //Log.info("InsertedImageFigureCreateCommand> execute> factoryFunction=" + this.factoryFunction);
            var imageURL = appURL  + '/editor/data/import/' + this.imgFileName;
            var createdFigure = ImageFrame.figure_InsertedImage(imageURL, this.x, this.y);
//            var createdFigure = this.factoryFunction(this.imgFileName, this.x, this.y);

            //move it into position
            createdFigure.transform(Matrix.translationMatrix(this.x - createdFigure.rotationCoords[0].x, this.y - createdFigure.rotationCoords[0].y))
            createdFigure.style.lineWidth = defaultLineWidth;

            //store id for later use
            //TODO: maybe we should try to recreate it with same ID (in case further undo will recreate objects linked to this)
            this.figureId = createdFigure.id;

            //add to STACK
            STACK.figureAdd(createdFigure);

            //See if we need to add it to a container if we dropped it inside one
            var containerId = STACK.containerGetByXY(this.x, this.y);
            if(containerId !== -1){ //
                var container = STACK.containerGetById(containerId);
                if( Util.areBoundsInBounds( createdFigure.getBounds(), container.getBounds() ) ){
                    CONTAINER_MANAGER.addFigure(containerId, this.figureId);
                }
            }


            //make this the selected figure
            selectedFigureId = createdFigure.id;

            //set up it's editor
            setUpEditPanel(createdFigure);

            //move to figure selected state
            state = STATE_FIGURE_SELECTED;

            this.firstExecute = false;
        }
        else{ //redo
            throw "Not implemented";
        }
    },


    /**This method should be called every time the Command should be undone*/
    undo : function(){

        // if current figure is in text editing state
        if (state == STATE_TEXT_EDITING) {
            // remove current text editor
            currentTextEditor.destroy();
            currentTextEditor = null;
        }

        //remove it from container (if belongs to one)
        var containerId = CONTAINER_MANAGER.getContainerForFigure(this.figureId);
        if(containerId !== -1){
            CONTAINER_MANAGER.removeFigure(containerId, this.figureId);
        }

        //remove figure
        STACK.figureRemoveById(this.figureId);

        //change state
        state = STATE_NONE;

        // set properties panel to canvas because current figure doesn't exist anymore
        setUpEditPanel(canvasProps);
    }
}