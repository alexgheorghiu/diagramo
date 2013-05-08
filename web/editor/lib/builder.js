/**
 * This object is responsable for creating and updating the properties for figures
 *
 * @constructor
 * @this {Builder}
 * 
 *  Builder allows for an {Array} of {BuilderProperty}'s to be displayed in a property panel,
 *  edited values update the owner
 *  @author Zack Newsham <zack_newsham@yahoo.co.uk>
 **/
function Builder(){
    
}


/**Creates a {Builder} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {Builder} a newly constructed Builder
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
Builder.load = function(o){
    var newBuilder = new Builder();
    newBuilder.properties = BuilderProperty.loadArray(o.properties);
    newBuilder.figureId = o.figureId;
    return newBuilder;
}

/**
 *Creates the property panel for a shape {Figure} or {Connector}
 *@param {DOMObject} DOMObject - the div of the properties panel
 *@param {Figure} shape - the figure for which the properties will be displayed
 **/
Builder.constructPropertiesPanel = function(DOMObject, shape){
    for(var i = 0; i < shape.properties.length; i++){
        // regExp to avoid properties of Text editor
        if (/(primitives\.\d+|middleText)\.(str|size|font|align|style\.fillStyle)/g.test(shape.properties[i].property) === false) {
            shape.properties[i].injectInputArea(DOMObject, shape.id);
        }
    }
}

/**
 *Creates the property panel for a Text primitive of shape {Figure} and returns it
 *@param {DOMObject} textEditor - the div of the properties panel
 *@param {DOMObject} textEditorTools - the div of the text editor's tools
 *@param {Figure} shape - the figure - parent of Text primitive
 *@param {Number} textPrimitiveId - the id value of Text primitive child of figure for which the properties will be displayed
 *
 *@return {TextEditorPopup} - new instance of TextEditorPopup after init
 *@author Artyom
 **/
Builder.constructTextPropertiesPanel = function(textEditor, textEditorTools, shape, textPrimitiveId){
    var textEditor = new TextEditorPopup(textEditor, textEditorTools, shape, textPrimitiveId);
    textEditor.init();

    return textEditor;
}

/**
 *Creates the properties for main CanvasProps
 *@param {DOMObject} DOMObject - the div of the properties panel
 *@param {CanvasProps} canvasProps - the CanvasProps for which the properties will be displayed
 **/
Builder.constructCanvasPropertiesPanel = function(DOMObject, canvasProps){
    var div = document.createElement("div");
    //div.innerHTML = '<div></div>';why is this here?

    //width
    var divWidth = document.createElement("div");
    divWidth.innerHTML = '<div class = "label">Width</div>';

    var inputWidth = document.createElement("input");
    inputWidth.type = "text";
    inputWidth.className = "text"; //required for onkeydown
    //inputWidth.style.cssText = "float: right";
    inputWidth.value = canvasProps.getWidth();
    divWidth.appendChild(inputWidth);

    div.appendChild(divWidth);

    //height
    var divHeight = document.createElement("div");
    divHeight.innerHTML = '<div class = "label">Height</div>';

    var inputHeight = document.createElement("input");
    inputHeight.type = "text";
    inputHeight.className = "text"; //required for onkeydown
    //inputHeight.style.cssText = "float: right";
    inputHeight.value = canvasProps.getHeight();
    divHeight.appendChild(inputHeight);

    div.appendChild(divHeight);

    //update button
    var divButton = document.createElement("div");
    divButton.innerHTML = '<div class = "label"></div>';

    var btnUpdate = document.createElement("input");
    btnUpdate.setAttribute("type", "button");
    btnUpdate.setAttribute("value", "Update");

    btnUpdate.onclick = function(){
        //update canvas props
        
        Log.group("builder.js->constructCanvasPropertiesPanel()->Canvas update");
        //Log.info('Nr of actions in Undo system: ' + History.ACTIONS.length);

        // Did we entered number value for width?
        var widthVal = Number(inputWidth.value);
        if (isNaN(widthVal)) {
            widthVal = canvasProps.getWidth();
            inputWidth.value = widthVal;
        }

        var heightVal = Number(inputHeight.value);
        if (isNaN(heightVal)) {
            heightVal = canvasProps.getHeight();
            inputHeight.value = heightVal;
        }

        //Did we change width or height?
        if(canvasProps.getWidth() != widthVal || canvasProps.getHeight() != heightVal){
            var undo = new CanvasResizeCommand(canvasProps);
            canvasProps.setWidth(widthVal);
            canvasProps.setHeight(heightVal);
//            canvasProps.width = inputWidth.value;
//            canvasProps.height = inputHeight.value;
            History.addUndo(undo);
        }
        

        //Log.info('Nr of actions in Undo system: ' + History.ACTIONS.length);
        Log.groupEnd();
        //alert(canvasProps);

        draw();
    };

    divButton.appendChild(btnUpdate);
    div.appendChild(divButton);



    DOMObject.appendChild(div);
}



/** The stucture that will hold any changable property of a shape
 *
 * @constructor
 * @this {Builder}
 * @param {String} name - the name of the property
 * @param {String} property - the property (in dot notation) we are using in the form of 'primitives.0.style.strokeStyle'
 * @param {Object} type - could be either, 'Color', 'Boolean', 'Text' or {Array}
 * In case it's an {Array} it is of type [{Text,Value}] and is used to generate a DD menu
 */
function BuilderProperty(name, property, type){
    this.name = name;
    this.property = property;
    this.type = type;
//    Log.info('BuilderProperty(): ' + 'Propery type: ' + this.type + ' name: ' + this.name + ' property: ' + this.property);
}

/**Color property type*/
BuilderProperty.TYPE_COLOR = 'Color';

/**Text property type*/
BuilderProperty.TYPE_TEXT = 'Text';

/**SingleText property type*/
BuilderProperty.TYPE_SINGLE_TEXT = 'SingleText';

/**Text size property type*/
BuilderProperty.TYPE_TEXT_FONT_SIZE = 'TextFontSize';

/**Font family property type*/
BuilderProperty.TYPE_TEXT_FONT_FAMILY = 'TextFontFamily';

/**Text aligment property type*/
BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT = 'TextFontAlignment';

/**Boolean property type*/
BuilderProperty.TYPE_BOOLEAN = 'Boolean';

/**Line width property type*/
BuilderProperty.TYPE_LINE_WIDTH = 'LineWidth';

/**Image Fill type*/
BuilderProperty.TYPE_IMAGE_FILL = 'ImageFill';

/**File Upload type*/
BuilderProperty.TYPE_IMAGE_UPLOAD = "ImageUpload";

/**Connector's end property type*/
BuilderProperty.TYPE_CONNECTOR_END= 'ConnectorEnd';


/**URL attached to a figure*/
BuilderProperty.TYPE_URL= 'URL';



//BuilderProperty.IMAGE_FILL = [{Text: 'No Scaling', Value: CanvasImage.FIXED_NONE},{Text: 'Fit to Area', Value: CanvasImage.FIXED_BOTH},{Text: 'Fit to Width',Value: CanvasImage.FIXED_WIDTH},{Text: 'Fit to Height',Value: CanvasImage.FIXED_HEIGHT},{Text: ' Auto Fit',Value: CanvasImage.FIXED_AUTO}]

/**Line widths*/
BuilderProperty.LINE_WIDTHS = [
    {Text: '1px', Value: '1'},{Text: '2px',Value: '2'},{Text: '3px',Value: '3'},
    {Text: '4px',Value: '4'},{Text: '5px',Value: '5'},{Text: '6px',Value: '6'},
    {Text: '7px',Value: '7'},{Text: '8px',Value: '8'},{Text: '9px',Value: '9'},
    {Text: '10px',Value: '10'}];

/**Font sizes*/
BuilderProperty.FONT_SIZES = [];
for(var i=0; i<73; i++){
  BuilderProperty.FONT_SIZES.push({Text:i+'px', Value:i});
}

/**Connector ends*/
BuilderProperty.CONNECTOR_ENDS = [{Text:'Normal', Value:'Normal'},{Text:'Arrow', Value:'Arrow'},
    {Text:'Empty Triangle', Value:'Empty'},{Text:'Filled Triangle', Value:'Filled'}];

/**Display separator*/
BuilderProperty.SEPARATOR = 'SEPARATOR';

/**Creates a {BuilderProperty} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {BuilderProperty} a newly constructed Point
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
BuilderProperty.load = function(o){
    var prop = new BuilderProperty();
    prop.name = o.name;
    prop.property = o.property;
    prop.type = o.type;
    return prop;
}


/**Creates an array of BuilderProperties from an array of {JSONObject}s
 *@param {Array} v - the array of JSONObjects
 *@return an {Array} of {BuilderProperty}-ies
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
BuilderProperty.loadArray = function(v){
    var newProps = [];
    for(var i=0; i< v.length; i++){
        newProps.push(BuilderProperty.load(v[i]));
    }
    return newProps;
}

BuilderProperty.prototype = {
    
    constructor : BuilderProperty,

    toString:function(){
        return 'Propery type: ' + this.type + ' name: ' + this.name + ' property: ' + this.property;
    },

    equals : function(anotherBuilderProperty){
        return this.type == anotherBuilderProperty.type
            && this.name == anotherBuilderProperty.name
            && this.property == anotherBuilderProperty.property;
    },
    
    /**
     *Generates a HTML fragment to allow to edit its property.
     *For example if current property is a color then this method will
     *inject a color picker in the specified DOMObject
     *
     *@param {HTMLElement} DOMObject - the div of the properties panel
     *@param {Number} figureId - the id of the figure we are using
     */
    injectInputArea:function(DOMObject, figureId){
        if(this.name == BuilderProperty.SEPARATOR){
            DOMObject.appendChild(document.createElement("hr"));
            return;
        }
        else if(this.type == BuilderProperty.TYPE_COLOR){
            this.generateColorCode(DOMObject, figureId);
        }
        else if(this.type == BuilderProperty.TYPE_TEXT){
            this.generateTextCode(DOMObject, figureId);
        }
        else if(this.type == BuilderProperty.TYPE_SINGLE_TEXT){
            this.generateSingleTextCode(DOMObject,figureId);
        }
        else if(this.type == BuilderProperty.TYPE_TEXT_FONT_SIZE){            
            this.generateArrayCode(DOMObject,figureId, BuilderProperty.FONT_SIZES);
//            this.generateFontSizesCode(DOMObject,figureId);
        }
        else if(this.type == BuilderProperty.TYPE_TEXT_FONT_FAMILY){
            this.generateArrayCode(DOMObject,figureId, Text.FONTS);
        }
        else if(this.type == BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT){
            this.generateArrayCode(DOMObject,figureId, Text.ALIGNMENTS);
        }
        else if(this.type == BuilderProperty.TYPE_CONNECTOR_END){
            this.generateArrayCode(DOMObject,figureId, BuilderProperty.CONNECTOR_ENDS);
        }
        else if(this.type == BuilderProperty.TYPE_LINE_WIDTH){
            this.generateArrayCode(DOMObject,figureId, BuilderProperty.LINE_WIDTHS);
        }
        else if(this.type == BuilderProperty.TYPE_URL){
            this.generateSingleTextCode(DOMObject,figureId);
        }
    },

    /**
     *Creates a boolean editor; usually a chechbox
     *
     *@param {HTMLElement} DOMObject - the div of the properties panel
     *@param {Number} figureId - the id of the figure we are using
     **/
    generateBooleanCode:function(DOMObject,figureId){
        var d = new Date();
        var uniqueId = d.getTime();
        var value = this.getValue(figureId);
        var div = document.createElement("div");
        div.innerHTML = '<div class=label>' + this.name + '</div>';

        var check = document.createElement("input");
        check.type = "checkbox"
        check.className = "text"; //required for onkeydown
        check.style.cssText ="float: right";
        check.checked = value;
        div.children[0].appendChild(check);
        check.onclick = function(figureId,property){
                            return function(){
                                updateShape(figureId, property, this.checked)
                            }
                        }(figureId, this.property);
                        
        DOMObject.appendChild(div);
    },


    /**Generate the code to edit the text.
     *The text got updated when you leave the input area
     *
     *@param {HTMLElement} DOMObject - the div of the properties panel
     *@param {Number} shapeId - the id of the {Figure} or {Connector} we are using
     **/
    generateTextCode:function(DOMObject, shapeId){
        var uniqueId = new Date().getTime();
        var value = this.getValue(shapeId);

        var div = document.createElement("div");
        div.className = "textLine";
        div.innerHTML = '<div class = "label">' + this.name + '</div>';

        var text = document.createElement("textarea");
        text.className = "text"; //required for onkeydown
        //text.style.cssText ="float: right";
        //text.style.cssText ="float: left";
        text.value = value;
        text.spellcheck = false;
        text.style.width = "100%";
        //text.style.float = "left";
        div.appendChild(document.createElement("br"));
        div.appendChild(text);

        text.onchange = function(shapeId,property){
            return function(){
                updateShape(shapeId, property, this.value)
            }
        }(shapeId, this.property);


        text.onmouseout = text.onchange;
        text.onkeyup = text.onchange;
        DOMObject.appendChild(div);
    },


    /**Generate the code to edit the text.
     *The text got updated when you leave the input area
     *
     *@param {HTMLElement} DOMObject - the div of the properties panel
     *@param {Number} figureId - the id of the figure we are using
     **/
    generateSingleTextCode:function(DOMObject,figureId){
        var uniqueId = new Date().getTime();
        var value = this.getValue(figureId);

        var div = document.createElement("div");
        div.className = "line";
        div.innerHTML = '<div class = "label">' + this.name + '</div>';

        var text = document.createElement("input");
        text.type = "text";
        text.className = "text"; //required for onkeydown
        text.style.cssText = "float: right";
        //text.style.cssText ="float: left";
        text.value = value;
        //text.style.width = "100%";
        //text.style.float = "left";
        div.appendChild(text);

        text.onchange = function(figureId,property){
            return function(){
                Log.info("Builder.generateSingleTextCode() value: " + this.value);
                updateShape(figureId, property, this.value);
            }
        }(figureId, this.property);


        text.onmouseout = text.onchange;
        text.onkeyup = text.onchange;
        DOMObject.appendChild(div);
    },


    /**Used to generate a drop down menu
     *
     *@param {HTMLElement} DOMObject - the div of the properties panel
     *@param {Number} figureId - the id of the figure we are using
     *@param {Array} v - a vector or hashes ex: [{Text:'Normal', Value:'Normal'},{Text:'Arrow', Value:'Arrow'}]
     */
    generateArrayCode:function(DOMObject, figureId, v){
//        Log.info("Font size length: " + v.length);
        var uniqueId = new Date().getTime();
        
        var value = this.getValue(figureId);

        var div = document.createElement("div");
        div.className = "line";
        div.innerHTML = '<div class="label">'+this.name+'</div>';
        
        var select = document.createElement("select");
        select.style.cssText ="float: right;";
        select.className = this.property; // for DOM manipulation
        div.appendChild(select);
        
        for(var i=0; i< v.length; i++){
            var option = document.createElement("option");
            option.value = v[i].Value;
//            Log.info("\t Text : " + v[i].Text + " Value : " + v[i].Value);
            option.text = v[i].Text; //see: http://www.w3schools.com/jsref/coll_select_options.asp
            select.options.add(option); //push does not exist in the options array
            if(option.value == value){
                option.selected = true;
            }
        }

        var selProperty = this.property; //save it in a separate variable as if refered by (this) it will refert to the 'select' DOM Object
        select.onchange = function(){
            //alert('Font size triggered. Figure id : ' + figureId + ' property: ' + selProperty + ' new value' + this.options[this.selectedIndex].value);
            updateShape(figureId, selProperty, this.options[this.selectedIndex].value);
        };

        DOMObject.appendChild(div);
    },
    

    /**
     *Used to generate a color picker
     *
     *@param{HTMLElement} DOMObject - the div of the properties panel
     *@param{Number} figureId - the id of the figure we are using
     */
    generateColorCode: function(DOMObject, figureId){
        var value = this.getValue(figureId);
       
        var uniqueId = new Date().getTime();
        var div = document.createElement("div");
        div.className = "line";
        var retVal = '<div class="label">' + this.name + '</div>\n';
        retVal += '<div id="colorSelector' + uniqueId + '" style="/*border: 1px solid #000000;*/ width: 16px; height: 16px; display: block; float: right; padding-right: 3px;">\n';
        retVal += '<input type="text" value="' + value + '" id="colorpickerHolder' + uniqueId + '">\n';
        //retVal+='<div style="background-color: '+value+';  width: 20px; height: 20px;"></div>\n';
        retVal += '</div>\n';
        //very unhappy with this innerHTML thingy
        div.innerHTML = retVal;

        DOMObject.appendChild(div);

        //let plugin do the job
        $('#colorpickerHolder'+uniqueId).colorPicker();

        //on change update the figure
        var propExposedToAnonymous = this.property;
        $('#colorpickerHolder'+uniqueId).change(function() {
            Log.info('generateColorCode(): figureId: ' + figureId + 'type: ' + this.type + ' name: ' + this.name + ' property: ' + this.property);
            updateShape(figureId, propExposedToAnonymous, $('#colorpickerHolder'+uniqueId).val());
        });
    },
    


    /**We use this to return a value of the property for a figure,
     *Similar to Javas Class.forname...sort of anyway
     *We need this because passing direct references to simple data types (including strings) 
     *only passes the value, not a reference to that value (call by value not by reference)
     *
     *@param{Number} figureId - the id of the shape {Figure} or {Connector} we are using, could also be the canvas (figureId = 'a')
     */
    getValue:function(figureId){
        //Is it a Figure? 
        var obj = STACK.figureGetById(figureId);
        
        //Is it a Connector ?
        if(obj == null){ //ok so it's not a Figure...so it should be a Connector
            obj = CONNECTOR_MANAGER.connectorGetById(figureId);
        }                
        
        //Is it the Canvas?
        if(obj == null){
            if(figureId == "canvas"){
                obj = canvas;
            }
        }
        
        //Is it a Container?
        if(obj == null){
            obj = STACK.containerGetById(figureId);
        }
        Log.debug("Unsplit property: " + this.property);
        
        var propertyAccessors = this.property.split(".");
//        Log.info("BuilderProperty::getValue() : propertyAccessors : " + propertyAccessors );
        for(var i = 0; i<propertyAccessors.length-1; i++){
//            Log.info("\tBuilderProperty::getValue() : i = " + i  + ' name= ' + propertyAccessors[i]);
            obj = obj[propertyAccessors[i]];
        }
        
        //Log.info("Object type: " + obj.oType);
        
        
        var propName = propertyAccessors[propertyAccessors.length -1];
        //Log.info("Property name: " + propName);
        
        var propGet = "get" + Util.capitaliseFirstLetter(propName);
        
        //null is allowed, undefined is not
        if(propGet in obj){ //@see https://developer.mozilla.org/en/JavaScript/Reference/Operators/Special_Operators/in_Operator
            return obj[propGet]();
        }
        else{
            //Access the object property's
            return obj[propertyAccessors[propertyAccessors.length -1]];
        }
    }
}



/**
 * This instance is responsible for creating and updating Text Editor Popup
 *
 * @constructor
 * @this {TextEditorPopup}
 * @param {HTMLElement} editor - the DOM object to create Text Editor Popup
 * @param {HTMLElement} tools - the DOM object to create Text Editor Tools
 * @param  shape - the {Figure} or {Connector} - parent of Text primitive
 * @param {Number} textPrimitiveId - the id value of Text primitive child of shape for which the properties will be displayed
 * @author Artyom
 */
function TextEditorPopup(editor, tools, shape, textPrimitiveId){
    this.editor = editor;
    this.tools = tools;
    this.shape = shape;
    this.textPrimitiveId = textPrimitiveId;

    // beginning of property string of BuilderProperty for primitive
    var propertyPrefix;

    if (this.shapeIsAConnector()) {
        // in case of connector with primitive = middleText
        propertyPrefix = "middleText.";
    } else {
        // in case of figure with primitive.id = textPrimitiveId
        propertyPrefix = "primitives." + this.textPrimitiveId + ".";
    }

    // value of BuiderProperty::property
    this.stringPropertyName = propertyPrefix + TextEditorPopup.STRING_PROPERTY_ENDING;
    this.sizePropertyName = propertyPrefix + TextEditorPopup.SIZE_PROPERTY_ENDING;
    this.fontPropertyName = propertyPrefix + TextEditorPopup.FONT_PROPERTY_ENDING;
    this.alignPropertyName = propertyPrefix + TextEditorPopup.ALIGN_PROPERTY_ENDING;
    this.colorPropertyName = propertyPrefix + TextEditorPopup.COLOR_PROPERTY_ENDING;
}

/**A set of predefined properties fragments*/
TextEditorPopup.STRING_PROPERTY_ENDING = 'str';
TextEditorPopup.SIZE_PROPERTY_ENDING = 'size';
TextEditorPopup.FONT_PROPERTY_ENDING = 'font';
TextEditorPopup.ALIGN_PROPERTY_ENDING = 'align';
TextEditorPopup.COLOR_PROPERTY_ENDING = 'style.fillStyle';


/**
 * Checks if TextEditorPopup refers to target shape and id of Text primitive
 * @param  shape - target figure or connector to check
 * @param {Number} textPrimitiveId - the id value of a target Text primitive
 *
 *@return {Boolean} - true if refers to target objects
 **/
TextEditorPopup.prototype.refersTo = function (shape, textPrimitiveId) {
    var result = this.shape.equals(shape);

    // in case of connector textPrimitiveId will be underfined
    if (textPrimitiveId != null) {
        result &= this.textPrimitiveId === textPrimitiveId;
    }
    return result;
}


TextEditorPopup.prototype = {
    
    constructor : TextEditorPopup,
    
    /**
     *Returns true if target shape of TextEditorPopup is a Connector
      *@return {Boolean} - true shape property is a connector
     **/
    shapeIsAConnector : function (){
        return this.shape.oType === "Connector";
    },
            
      

    /**
    *Creates DOM structure and bind events
    *@author Artyom
    **/
    init : function (){
       var textarea;

       // <div> for text tools contains font size, font family, alignment and color
       for(var i = 0; i < this.shape.properties.length; i++){
           var curProperty = this.shape.properties[i].property; //get property in long format ex: primitives.1.style.fillStyle
           if (curProperty != null) {
               var curValue = this.shape.properties[i].getValue(this.shape.id);
               switch (curProperty){
                   case this.stringPropertyName:
                       this.shape.properties[i].injectInputArea(this.editor, this.shape.id);
                       textarea = this.editor.getElementsByTagName('textarea')[0];

                       // remove all <br> tags from text-editor as they were added by injectInputArea method 
                       removeNodeList(this.editor.getElementsByTagName('br')); //defined in util.js

                       // set Text editor properties on initialization
                       this.setProperty(curProperty, curValue);

                       break;

                   case this.sizePropertyName:
                   case this.fontPropertyName:
                   case this.alignPropertyName:
                   case this.colorPropertyName:
                       this.shape.properties[i].injectInputArea(this.tools, this.shape.id);

                       // set Text editor properties on initialization
                       this.setProperty(curProperty, curValue);

                       break;
               }
           }
       }

       this.editor.className = 'active';
       this.tools.className = 'active';

       this.placeAndAutoSize();

       // select all text inside textarea (like in Visio)
       setSelectionRange(textarea, 0, textarea.value.length);
   },
           
           
    /**
     * Changing property inside Text Editor
     * provides WYSIWYG functionality
     * @param {String} property - property name that is being edited (in dotted notation)
     * @param {Object} value - the value to set the property to
     * @author Artyom
     **/
    setProperty : function (property, value) {
        var textarea = this.editor.getElementsByTagName('textarea')[0];
        switch(property) {
            
            //TODO: @Artom: Instead on counting on class name I would like to use DOM's unique IDs
            
            case this.sizePropertyName:
                // set new property value to editor's textarea
                textarea.style.fontSize = value + 'px';

                // set new property value to editor's tool
                this.tools.getElementsByClassName(property)[0].value = value;
                break;

            case this.fontPropertyName:
                // set new property value to editor's textarea
                textarea.style.fontFamily = value;

                // set new property value to editor's tool
                this.tools.getElementsByClassName(property)[0].value = value.toLowerCase();
                break;

            case this.alignPropertyName:
                // set new property value to editor's textarea
                textarea.style.textAlign = value;

                // IE doesn't apply text-align property correctly to all lines of the textarea on a fly
                // that is why we just copy it's text and paste it back to refresh text rendering
                if (Browser.msie) {
                    textarea.value = textarea.value;
                }

                // set new property value to editor's tool
                this.tools.getElementsByClassName(property)[0].value = value;
                break;

            case this.colorPropertyName:
                // set new property value to editor's textarea
                textarea.style['color'] = value;

                // set new property value to editor's tool (colorPicker)
                var colorPicker = this.tools.getElementsByClassName('color_picker')[0];
                colorPicker.style['background-color'] = value; //change the color to the proper one
                colorPicker.previousSibling.value = value; //set the value to the "hidden" text field
                break;
        }

        this.placeAndAutoSize();
    },
            

    /**
     *Places and sets size to the property panel
     *@author Artyom
     **/
    placeAndAutoSize : function () {
        var textarea = this.editor.getElementsByTagName('textarea')[0];

        // set edit dialog position to top left (first) bound point of Text primitive
        var textBounds;

        if (this.shapeIsAConnector()) {
            // in case of connector primitive is a middleText property
            textBounds = this.shape.middleText.getBounds();
        } else {
            // in case of connector primitive is a primitives[this.textPrimitiveId] property
            textBounds = this.shape.primitives[this.textPrimitiveId].getBounds();
        }

        //TODO: @Artyom: Where does this formula comes from?
        var leftCoord = textBounds[0] - defaultLineWidth * 2 - defaultEditorPadding / 2;
        var topCoord = textBounds[1] - defaultLineWidth * 2 - defaultEditorPadding / 2;
        
        // get toolbox height, because it's situated at the top of Text editor
        //@see https://developer.mozilla.org/en/docs/DOM/element.offsetHeight
        //@see http://stackoverflow.com/questions/4106538/difference-between-offsetheight-and-clientheight
        var toolboxHeight = this.tools.offsetHeight; 
        

        var textareaWidth = textBounds[2] - textBounds[0];
        var textareaHeight = textBounds[3] - textBounds[1];

        // Firefox includes border & padding as part of width and height,
        // so width and height should additionally include border and padding twice
        if (Browser.mozilla) {
            textareaHeight += (defaultEditorPadding) * 2;
            topCoord -= (defaultEditorPadding);
            textareaWidth += (defaultEditorPadding) * 2;
            leftCoord -= (defaultEditorPadding);
        }

        // some of IE magic:
        // enough to add half of font-size to textarea's width to prevent auto-breaking to next line
        // which is wrong in our case
        if (Browser.msie) {
            var fontSize = parseInt(textarea.style['font-size'], 10);
            textareaWidth += fontSize / 2;
            leftCoord -= fontSize / 4;
        }

        this.editor.style.left = leftCoord + "px";
        this.editor.style.top = topCoord + "px";

        this.tools.style.left = leftCoord + "px";
        this.tools.style.top = topCoord - toolboxHeight + "px";

        textarea.style.width = textareaWidth + "px";
        textarea.style.height = textareaHeight + "px";
    },
     
    /**
    *Removes DOM structure of editor and it's tools
    *@author Artyom
    **/        
    destroy : function (){
        this.editor.className = '';
        this.editor.style.cssText = '';
        this.editor.innerHTML = '';

        this.tools.className = '';
        this.tools.style.cssText = '';
        this.tools.innerHTML = '';
    },
    
    
    /**
    *Returns true if mouse clicked inside TextEditorPopup
    *@param {Event} e - mouseDown event object
    *@return {boolean} - true if clicked inside
    *@author Artyom
    **/
   mouseClickedInside : function (e) {
       //TODO: @Artyom: Do we still need this old crappy IE detection. In not, please remove it?
       var target = e.target || e.srcElement;

       // check if user fired mouse down on the part of editor, it's tools or active color picker
       // actually active color picker in that moment can be only for Text edit
       var inside = target.id === this.editor.id
           || target.parentNode.id === this.editor.id
           || target.parentNode.parentNode.id === this.editor.id

           || target.id === this.tools.id
           || target.parentNode.id === this.tools.id
           || target.parentNode.parentNode.id === this.tools.id

           || target.className === 'color_picker'

           || target.id === 'color_selector'
           || target.parentNode.id === 'color_selector'
           || target.parentNode.parentNode.id === 'color_selector';
   
       return inside;
   }        
   
};