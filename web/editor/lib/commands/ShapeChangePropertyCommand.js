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
 * Object that is used to undo actions when the property editor is used
 * @this {ShapeChangePropertyCommand} 
 * @constructor
 * @param figureId {Numeric} -  the id of the object
 * @param property {String} - property name that is being edited on the figure
 * @param newValue {Object} - the value to set the property to
 * @param [previousValue] {Object} - the previous value of property
 * @author Alex, Artyom
 */
function ShapeChangePropertyCommand(figureId, property, newValue, previousValue){
    this.figureId = figureId;
    this.property = property;    
    this.newValue = newValue;
    this.previousValue = typeof(previousValue) !== 'undefined' ? previousValue : this._getValue(figureId, property);
    this.firstExecute = true;

    // check if property corresponds to a Text primitive
    // isTextPrimitiveProperty property used for calling TextEditorPopup callback on property change
    this.textPrimitiveId = this._getTextPrimitiveId();
    this.isTextPrimitiveProperty = this.textPrimitiveId !== -1;
    
    this.oType = "ShapeChangePropertyCommand";
}

ShapeChangePropertyCommand.prototype = {
    
    /**This method got called every time the Command must execute*/
    execute : function(){
        if(this.firstExecute){
            this._setValue(this.figureId, this.property, this.newValue);
            this.firstExecute = false; 
            //setUpEditPanel(STACK.figureGetById(this.figureId));

            // if property change of Text primitive executed
            // then state must be equal to text editing
            // and we call it's setProperty method to provide WYSIWYG functionality
            if (this.isTextPrimitiveProperty) {
                if (state == STATE_TEXT_EDITING) {
                    currentTextEditor.setProperty(this.property, this.newValue);
//                } else {
//                    throw "ShapeChangePropertyCommand:execute() - this should never happen";
                }
            }
        }
        else{
            throw "Redo not implemented.";
        }
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){
        this._setValue(this.figureId, this.property, this.previousValue);
        
        var shape = this.__getShape(this.figureId);
        
        setUpEditPanel(shape);

        // if property of Text primitive is changing back
        // then we need to set this change on TextEditorPopup
        // to provide WYSIWYG functionality
        if (this.isTextPrimitiveProperty) {

            // if we already in text editing state
            if (state == STATE_TEXT_EDITING) {
                // if currentTextEditor refers to another shape/primitive
                // then we destroy current and create new TextEditorPopup
                if (!currentTextEditor.refersTo(shape, this.textPrimitiveId)) {
                    currentTextEditor.destroy();
                    setUpTextEditorPopup(shape, this.textPrimitiveId);
                    // and we call setProperty of currentTextEditor method to provide WYSIWYG functionality
                    currentTextEditor.setProperty(this.property, this.previousValue);
                }
            }
//            } else {
//                //if group selected
//                if (state == STATE_GROUP_SELECTED) {
//                    var selectedGroup = STACK.groupGetById(selectedGroupId);
//
//                    //if group is temporary then destroy it
//                    if(!selectedGroup.permanent){
//                        STACK.groupDestroy(selectedGroupId);
//                    }
//
//                    //deselect current group
//                    selectedGroupId = -1;
//                }
//
//                //deselect current figure
//                selectedFigureId = -1;
//
//                //deselect current connector
//                selectedConnectorId = -1;
//            }
        }
    },
    
    
    /**As 
     *@param id {Numeric} the id of the shape (Figure, Connector, Container)
     **/
    __getShape : function(id){
        var shape = STACK.figureGetById(id);
        if(shape == null){
            shape = CONNECTOR_MANAGER.connectorGetById(id);
        }
        
        if(shape == null){
            shape = STACK.containerGetById(id);
        }
        
        return shape;
    },
    
    
    /**Get */
    _getValue : function(figureId, property){
        //gel old value
        var shape = this.__getShape(this.figureId);

        var propertyObject = shape;
        var propertyAccessors = property.split(".");
        for(var i = 0; i<propertyAccessors.length-1; i++){
            propertyObject = propertyObject[propertyAccessors[i]];
        }

        if(propertyObject[propertyAccessors[propertyAccessors.length -1]] === undefined){
            /*if something is complicated enough to need a function, 
             *likelyhood is it will need access to its parent figure*/
            return propertyObject["get"+propertyAccessors[propertyAccessors.length -1]];
        }
        else{
            return propertyObject[propertyAccessors[propertyAccessors.length -1]];
        }  
    },
    
    /**Set */
    _setValue : function(figureId, property, value){
        //gel old value
        var shape = this.__getShape(this.figureId);

        var propertyObject = shape;
        var propertyAccessors = property.split(".");
        for(var i = 0; i<propertyAccessors.length-1; i++){
            propertyObject = propertyObject[propertyAccessors[i]];
        }

        if(propertyObject[propertyAccessors[propertyAccessors.length -1]] === undefined){
            /*if something is complicated enough to need a function, 
             *likelyhood is it will need access to its parent figure*/
            propertyObject["set"+propertyAccessors[propertyAccessors.length -1]](value);
        }
        else{
            propertyObject[propertyAccessors[propertyAccessors.length -1]] = value;                
        }  
    },

    /**
     * Checks if property applied to Text primitive
     * @return -1 if property didn't apply to Text primitive or id of the corresponding Text primitive otherwise
    **/
    _getTextPrimitiveId : function() {
        var textPrimitiveId = -1;

        // check by RegExp - is property applying to a Text primitive
        // typical examples: "primitives.3.size", "primitives.1.str", "primitives.5.font" and "middleText.str" for a Connector
        if (/(primitives\.\d+|middleText)\.(str|size|font|align|underlined|style\.fillStyle)/g.test(this.property)) {
            // according to RegExp this (between first and second dots) part is a number
            var id = this.property.split('.')[1];

            textPrimitiveId = parseInt(id, 10);
        }
        return textPrimitiveId;
    }
}


