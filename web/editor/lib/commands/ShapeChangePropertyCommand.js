/**
 * Object that is used to undo actions when the property editor is used
 * @this {ShapeChangePropertyCommand} 
 * @constructor
 * @param figureId {Numeric} -  the id of the object
 * @param property {String} - property name that is being edited on the figure
 * @param newValue {Object} - the value to set the property to
 * @author Alex
 */
function ShapeChangePropertyCommand(figureId, property, newValue){
    this.figureId = figureId;
    this.property = property;    
    this.newValue = newValue;
    this.previousValue = this._getValue(figureId, property);
    this.firstExecute = true;
    
    this.oType = "ShapeChangePropertyCommand";
}

ShapeChangePropertyCommand.prototype = {
    
    /**This method got called every time the Command must execute*/
    execute : function(){
        if(this.firstExecute){
            this._setValue(this.figureId, this.property, this.newValue);
            this.firstExecute = false; 
            //setUpEditPanel(STACK.figureGetById(this.figureId)); 
        }
        else{
            throw "Redo not implemented.";
        }
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){
        this._setValue(this.figureId, this.property, this.previousValue);
        setUpEditPanel(STACK.figureGetById(this.figureId)); 
    },
    
    
    /**Get */
    _getValue : function(figureId, property){
        //gel old value
        var shape = STACK.figureGetById(figureId);
        if(shape == null){
            shape = CONNECTOR_MANAGER.connectorGetById(figureId);
        }

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
        var shape = STACK.figureGetById(figureId);
        
        if(shape == null){
            shape = CONNECTOR_MANAGER.connectorGetById(figureId);
        }

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
    }
}


