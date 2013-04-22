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
        if (/primitives\.\d+\.(str|size|font|align|style\.fillStyle)/g.test(shape.properties[i].property) === false) {
            shape.properties[i].injectInputArea(DOMObject, shape.id);
        }
    }
}

/**
 *Creates the property panel for a Text primitive of shape {Figure}
 *@param {DOMObject} textEditor - the div of the properties panel
 *@param {Figure} shape - the figure - parent of Text primitive
 *@param {Number} textPrimitiveId - the id value of Text primitive child of figure for which the properties will be displayed
 **/
Builder.constructTextPropertiesPanel = function(textEditor, shape, textPrimitiveId){
    (new TextEditorPopup(textEditor, shape, textPrimitiveId)).init();
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
        //Did we change width or height?
        if(canvasProps.getWidth() != inputWidth.value || canvasProps.getHeight() != inputHeight.value){            
            var undo = new CanvasResizeCommand(canvasProps);
            canvasProps.width = inputWidth.value;
            canvasProps.height = inputHeight.value;
            History.addUndo(undo);
        }
        

        //Log.info('Nr of actions in Undo system: ' + History.ACTIONS.length);
        Log.groupEnd();
        
        canvasProps.setWidth(inputWidth.value);
        canvasProps.setHeight(inputHeight.value);
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
     *@param {Function} callback - callback to call on property change
     */
    injectInputArea:function(DOMObject, figureId, callback){
        if(this.name == BuilderProperty.SEPARATOR){
            DOMObject.appendChild(document.createElement("hr"));
            return;
        }
        else if(this.type == BuilderProperty.TYPE_COLOR){
            this.generateColorCode(DOMObject, figureId, callback);
        }
        else if(this.type == BuilderProperty.TYPE_TEXT){
            this.generateTextCode(DOMObject, figureId, callback);
        }
        else if(this.type == BuilderProperty.TYPE_SINGLE_TEXT){
            this.generateSingleTextCode(DOMObject,figureId);
        }
        else if(this.type == BuilderProperty.TYPE_TEXT_FONT_SIZE){            
            this.generateArrayCode(DOMObject,figureId, BuilderProperty.FONT_SIZES, callback);
//            this.generateFontSizesCode(DOMObject,figureId);
        }
        else if(this.type == BuilderProperty.TYPE_TEXT_FONT_FAMILY){
            this.generateArrayCode(DOMObject,figureId, Text.FONTS, callback);
        }
        else if(this.type == BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT){
            this.generateArrayCode(DOMObject,figureId, Text.ALIGNMENTS, callback);
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
     *@param {Function} callback - callback to call on property change
     **/
    generateTextCode:function(DOMObject, shapeId, callback){
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
                updateShape(shapeId, property, this.value, callback)
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
                updateShape(figureId, property, this.value)
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
     *@param {Function} callback - callback to call on property change
     */
    generateArrayCode:function(DOMObject, figureId, v, callback){
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
            updateShape(figureId, selProperty, this.options[this.selectedIndex].value, callback);
        };

        DOMObject.appendChild(div);
    },
    

    /**
     *Used to generate a color picker
     *
     *@param{HTMLElement} DOMObject - the div of the properties panel
     *@param{Number} figureId - the id of the figure we are using
     *@param {Function} callback - callback to call on property change
     */
    generateColorCode: function(DOMObject, figureId, callback){
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
            updateShape(figureId, propExposedToAnonymous, $('#colorpickerHolder'+uniqueId).val(), callback);
        });
    },
    


    /**We use this to return a value based on the figure and the property string,
     *similar to Javas Class.forname...sort of anyway
     *We need this because passing direct references to simple data types (including strings) 
     *only passes the value, not a reference to that value
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
 * This instance is responsable for creating and updating Text Editor Popup
 *
 * @constructor
 * @this {TextEditorPopup}
 * @param {HTMLElement} element - the DOM object to create Text Editor Popup
 *@param {Figure} shape - the figure - parent of Text primitive
 *@param {Number} textPrimitiveId - the id value of Text primitive child of figure for which the properties will be displayed
 */
function TextEditorPopup(element, shape, textPrimitiveId){
    this.element = element;
    this.shape = shape;
    this.textPrimitiveId = textPrimitiveId;

    // beginning of property string of BuilderProperty for primitive with id = primitiveId
    var propertyPrefix = "primitives." + this.textPrimitiveId + ".";

    // value of BuiderProperty::property
    this.stringPropertyName = propertyPrefix + 'str';
    this.sizePropertyName = propertyPrefix + 'size';
    this.fontPropertyName = propertyPrefix + 'font';
    this.alignPropertyName = propertyPrefix + 'align';
    this.colorPropertyName = propertyPrefix + 'style.fillStyle';
}

/**
 *Creates DOM structure and bind events
 **/
TextEditorPopup.prototype.init = function (){
    var textarea;

    // <div> for text tools (font size, font family, alignment and color)
    var toolContainer = document.createElement("div");
    toolContainer.className = 'text-edit-tools-container';

    var toolDiv = document.createElement("div");
    toolDiv.className = 'text-edit-tools';

    toolContainer.appendChild(toolDiv);
    this.element.appendChild(toolContainer);

    // changing property inside Text Editor
    // provides WYSIWYG functionality
    var self = this;

    // wrapper for calling setProperty in TextEditorPopup closure
    var setPropertyWrapper = function (property, value) {
        self.setProperty(property, value);
    };

    for(var i = 0; i < this.shape.properties.length; i++){
        var curProperty = this.shape.properties[i].property;
        if (curProperty != null) {
            var curValue = this.shape.properties[i].getValue(this.shape.id);
            switch (curProperty){
                case this.stringPropertyName:
                    this.shape.properties[i].injectInputArea(this.element, this.shape.id, setPropertyWrapper);
                    textarea = this.element.getElementsByTagName('textarea')[0];

                    // remove <br> tags from text-editor
                    removeNodeList(this.element.getElementsByTagName('br'));

                    // set Text editor properties on initialization
                    setPropertyWrapper(curProperty, curValue);

                    break;

                case this.sizePropertyName:
                case this.fontPropertyName:
                case this.alignPropertyName:
                case this.colorPropertyName:
                    this.shape.properties[i].injectInputArea(toolDiv, this.shape.id, setPropertyWrapper);

                    // set Text editor properties on initialization
                    setPropertyWrapper(curProperty, curValue);

                    break;
            }
        }
    }

    this.placeAndAutoSize();

    // select all text inside textarea (like in Visio)
    setSelectionRange(textarea, 0, textarea.value.length);

    // wrapper for calling mouseDownHandler in TextEditorPopup closure
    var mouseDownWrapper = function (e){
        self.mouseDownHandler(e);
    };

    // temporary handler for firing first click outside of Text editor
    bindEvent(document, 'mousedown', mouseDownWrapper);

    // wrapper for calling keyDownHandler in TextEditorPopup closure
    var keyDownWrapper = function (e){
        self.keyDownHandler(e);
    };

    // temporary handler to stop bubbling keydown event outside of inputs of Text editor
    // for example, figure moving on arrow keys
    bindEventToNodeList(this.element.getElementsByTagName('select'), 'keydown', keyDownWrapper);
}

/**
 *Removes DOM structure and unbind events
 **/
TextEditorPopup.prototype.destroy = function (){
    this.element.className = '';
    this.element.style.cssText = '';
    this.element.innerHTML = '';
//
//    unBindEvent(document, 'mousedown', this.mouseDownHandler);
//    unBindEventFromNodeList(this.element.getElementsByTagName('select'), 'keydown', this.keyDownHandler);
}


/**
 *Handler to stop bubbling keydown event outside of inputs
 *@param {Event} e - event object
 **/
TextEditorPopup.prototype.keyDownHandler = function (e) {
    switch(e.keyCode){
        case KEY.CTRL: //Ctrl
        case KEY.Z:
            break;
        case KEY.ESCAPE: //Esc
            this.destroy();
        default:
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true; // IE
            }

            break;
    }
}

/**
 *Handler for firing first click outside of Text editor
 *@param {Event} e - event object
 **/
TextEditorPopup.prototype.mouseDownHandler = function (e) {
    var target = e.target || e.srcElement;

    // check if user fired mouse down on the part of editor or active color picker
    // actually active color picker in that moment can be only for Text edit
    if (target.className !== 'text-edit-tools'
        && target.parentNode.className !== 'text-edit-tools'
        && target.parentNode.parentNode.className !== 'text-edit-tools'
        && target.parentNode.parentNode.id !== 'text-editor'

        && target.className !== 'color_picker'

        && target.id !== 'color_selector'
        && target.parentNode.id !== 'color_selector'
        && target.parentNode.parentNode.id !== 'color_selector') {

        this.destroy();
    }
}

/**
 *Places and sets size to the property panel
 **/
TextEditorPopup.prototype.placeAndAutoSize = function () {
    var textarea = this.element.getElementsByTagName('textarea')[0];

    // set edit dialog position to top left (first) bound point of Text primitive
    var textBounds = this.shape.primitives[this.textPrimitiveId].getBounds();
    var leftCoord = textBounds[0] - defaultLineWidth * 2 - defaultEditorPadding / 2;

    // get toolbox height, because it's situated at the top of Text editor
    var toolbox = this.element.getElementsByClassName('text-edit-tools-container')[0];
    var toolboxHeight = toolbox.offsetHeight;
    var topCoord = textBounds[1] - toolboxHeight - defaultLineWidth * 2 - defaultEditorPadding / 2;

    var textareaWidth = textBounds[2] - textBounds[0];
    var textareaHeight = textBounds[3] - textBounds[1];

    // Firefox includes border & padding as part of width and height,
    // so width and height should additionally include border and padding twice
    if (Browser.mozilla) {
        textareaHeight += (defaultEditorBorderWidth + defaultEditorPadding) * 2;
        topCoord -= (defaultEditorBorderWidth + defaultEditorPadding);
        textareaWidth += (defaultEditorBorderWidth + defaultEditorPadding) * 2;
        leftCoord -= (defaultEditorBorderWidth + defaultEditorPadding);
    }

    // some of IE magic:
    // enough to add half of font-size to textarea's width to prevent auto-breaking to next line
    // which is wrong in our case
    if (Browser.msie) {
        var fontSize = parseInt(textarea.style['font-size'], 10);
        textareaWidth += fontSize / 2;
        leftCoord -= fontSize / 4;
    }

    this.element.style.left = leftCoord + "px";
    this.element.style.top = topCoord + "px";

    textarea.style.width = textareaWidth + "px";
    textarea.style.height = textareaHeight + "px";
}

/**
 * Changing property inside Text Editor
 * provides WYSIWYG functionality
 **/
TextEditorPopup.prototype.setProperty = function (property, value) {
    if (this.element.className === 'active') {
        var textarea = this.element.getElementsByTagName('textarea')[0];
        switch(property) {
            case this.sizePropertyName:
                // set new property value to editor's textarea
                textarea.style['font-size'] = value + 'px';

                // set new property value to editor's tool
                this.element.getElementsByClassName(property)[0].value = value;
                break;

            case this.fontPropertyName:
                // set new property value to editor's textarea
                textarea.style['font-family'] = value;

                // set new property value to editor's tool
                this.element.getElementsByClassName(property)[0].value = value.toLowerCase();
                break;

            case this.alignPropertyName:
                // set new property value to editor's textarea
                textarea.style['text-align'] = value;

                // set new property value to editor's tool
                this.element.getElementsByClassName(property)[0].value = value;
                break;

            case this.colorPropertyName:
                // set new property value to editor's textarea
                textarea.style['color'] = value;

                // set new property value to editor's tool (colorPicker)
                var colorPicker = this.element.getElementsByClassName('color_picker')[0];
                colorPicker.style['background-color'] = value;
                colorPicker.previousSibling.value = value;
                break;
        }

        this.placeAndAutoSize();
    }
}