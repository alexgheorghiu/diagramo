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

/**This is the main JavaScript module.
 *We move it here so it will not clutter the index.php with a lot of JavaScript
 *
 *ALL VARIABLES DEFINED HERE WILL BE VISIBLE IN ALL OTHER MODULES AND INSIDE INDEX.PHP
 *SO TAKE CARE!
 **/

/**Diagramo namespace. We must place as much "global application" variables in here to avoid
 * conflict and to achieve better management*/
var DIAGRAMO = {
    /**Set it on true if you want visual debug clues.
    * Note: See to set the Connector's visualDebug (Connector.visualDebug) to false too
    **/
    debug : false,

    /**Keeps temporary connector solution.
     * TODO: move to CONNECTOR_MANAGER?!*/
    debugSolutions : [],

    /** enables/disables rendering of currentCloud
    * TODO: in further can be used for option like "Show Cloud" or "Highlight about to connect points" */
    visualMagnet : true,

    /** enables/disables rendering fill color as gradient*/
    gradientFill : true,

    /**On canvas fit action this will be the distance between canvas work area and it's border*/
    CANVAS_FIT_PADDING : 10
};


/**Switch on/off debug
 * @param {Boolean} value optional value
 * */
DIAGRAMO.switchDebug = function(value) {
    if(value == undefined){
        DIAGRAMO.debug = !DIAGRAMO.debug;
    }
    else{
        DIAGRAMO.debug = value;
    }
    
    var iconDebug = document.getElementById('iconDebug');
    
    if(DIAGRAMO.debug){
        iconDebug.src = './assets/images/icon_debug_true.gif';
    }
    else{
        iconDebug.src = './assets/images/icon_debug_false.gif';
    }

    draw();
};


/*Activate the bellow block of code if anything else fails
 *Helped me a lot on a remote iPad (https://bitbucket.org/scriptoid/diagramo/issue/118)
 *with no available OSX around.
 *TODO: Could be added as normal lister into a future verbosity option
 **/
if(false){
    /**@see http://stackoverflow.com/questions/10197895/ipad-javascript-error-not-helpful*/
    window.onerror = function (desc, page, line, chr){
        alert('Description: ' + desc
                + ' Page: ' + page
                + ' Line: '+ line
                + ' Position: '+ chr
        ); 
    };
}


/**Describe the file version of the file
 * This will make easier to make upgrades in the future.
 * Any time change in file format will be appear this number
 * must be increased and also update the importer.js
 * library
 * */
DIAGRAMO.fileVersion = 4;


/**Activate or deactivate the undo feature
 *@deprecated
 ***/
var doUndo = true; 

/**Usually an instance of a Command (see /lib/commands/*.js)*/
var currentMoveUndo = null; 

var CONNECTOR_MANAGER = new ConnectorManager();
var CONTAINER_MANAGER = new ContainerFigureManager();

/**An currentCloud - {Array} of 2 {ConnectionPoint} ids.
 * Cloud highlights 2 {ConnectionPoint}s whose are able to connect. */
var currentCloud = [];

/**The width of grid cell. 
 *Must be an odd number.
 *Must coincide with the size of the image used as canvas tile 
 **/
var GRIDWIDTH = 30; 

/**The distance (from a snap line) that will trigger a snap*/
var SNAP_DISTANCE = 5;

/**The half of light distance between upper and lower border for gradient filling*/
var gradientLightStep = 0.06;

var fillColor=null;
var strokeColor='#000000';
var currentText=null;

/** Instance of Browser Class for defining browser */
var Browser = new Browser();

/**Default top&bottom padding of Text editor's textarea*/
var defaultEditorPadding = 6;

/**Default border width of Text editor's textarea*/
var defaultEditorBorderWidth = 1;

/**
 *Scrollbar width
 *19px is the width added to a scrollable area (Zack discovered this into Chrome)
 *We might compute this dimension too but for now it's fine
 *even if we are wrong by a pixel or two
 **/
var scrollBarWidth = 19;

var FIGURE_ESCAPE_DISTANCE = 30; /**the distance by which the connectors will escape Figure's bounds*/

/**the distance by which the connectors will be able to connect with Figure*/
var FIGURE_CLOUD_DISTANCE = 4;

/*It will store a reference to the function that will create a figure( ex: figureForKids:buildFigure3()) will be stored into this
 *variable so upon click on canvas this function will create the object*/
var createFigureFunction = null;

/**A variable that tells us if CTRL is pressed*/
var CNTRL_PRESSED = false;

/**A variable that tells us if SHIFT is pressed*/
var SHIFT_PRESSED = false;

/**Current connector. It is null if no connector selected
 * @deprecated
 * TODO: we should base ONLY on selectedConnectorId
 **/
var connector = null;


/**Connector type
 * TODO: this should not be present here but retrieved from Connector object
 **/
var connectorType = '';


/**It contains all the figure sets. Each figure set upon loading it will add a new
 * entry to this array*/
var figureSets = [];

/**Used to generate nice formatted SVG files */
var INDENTATION = 0;

/**Export the Canvas as SVG. It will descend to whole graph of objects and ask
 *each one to convert to SVG (and use the proper indentation)
 *Note: Placed out of editor.php so we can safelly add '<?...' string
 *@author Alex
 *@deprecated
 **/
function toSVG(){
    return '';
    
    /* Note: Support for SVG is suspended 
     * 
    var canvas = getCanvas();
    //@see http://www.w3schools.com/svg/svg_example.asp
    var v2 = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    v2 += "\n" + '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' 
        + canvas.width +'" height="' + canvas.height 
        + '" viewBox="0 0 ' + canvas.width + ' ' + canvas.height + '" version="1.1">';
    INDENTATION++;
    v2 += STACK.toSVG();
    v2 += CONNECTOR_MANAGER.toSVG();
    INDENTATION--;
    v2 += "\n" + '</svg>';
    
    return v2;
    */
}
            

/**
 *Supposelly stop any selection from happening
 */
function stopselection(ev){
    
    /*If we are selecting text within anything with the className text, we allow it
    * This gives us the option of using textareas, inputs and any other item we
    * want to allow text selection in.
    **/
    if(ev.target.className == "text"){
        return true;
    }
    return false;
}

var STACK  = new Stack();


/**keeps track if the MLB is pressed*/    
var mousePressed = false; 

/**the default application state*/
var STATE_NONE = 'none'; 

/**we have figure to be created**/
var STATE_FIGURE_CREATE = 'figure_create'; 

/**we selected a figure (for further editing for example)*/
var STATE_FIGURE_SELECTED = 'figure_selected'; 

/**we are selecting the start of a connector*/
var STATE_CONNECTOR_PICK_FIRST = 'connector_pick_first'; 

/**we are selecting the end of a connector*/
var STATE_CONNECTOR_PICK_SECOND = 'connector_pick_second'; 

/**we selected a connector (for further editing for example)*/
var STATE_CONNECTOR_SELECTED = 'connector_selected';

/**move a connection point of a connector*/
var STATE_CONNECTOR_MOVE_POINT = 'connector_move_point';

/**we are dragging the mouse over a group of figures.*/
var STATE_SELECTING_MULTIPLE = 'selecting_multiple';

/**we have a group selected (either temporary or permanent)*/
var STATE_GROUP_SELECTED = 'group_selected';

/**we have a container selected*/
var STATE_CONTAINER_SELECTED = 'container_selected';

/**we have a text editing*/
//var STATE_TEXT_EDITING = STATE_FIGURE_SELECTED;
var STATE_TEXT_EDITING = 'text_editing';

/**Keeps current state*/
var state = STATE_NONE;

/**The (current) selection area*/
var selectionArea = new Polygon(); 
selectionArea.points.push(new Point(0,0));
selectionArea.points.push(new Point(0,0));
selectionArea.points.push(new Point(0,0));
selectionArea.points.push(new Point(0,0));
selectionArea.style.strokeStyle = 'grey';
selectionArea.style.gradientBounds = [];
selectionArea.style.lineWidth = '1';

/**Toggle grid visible or not*/
var gridVisible = false;

/**Makes figure snap to grid*/
var snapTo = false;

/**Keeps last coodinates while dragging*/
var lastClick = [];

/**Default line width*/
var defaultLineWidth = 2;

/**Default handle line width*/
var defaultThinLineWidth = 1;

/**Current instance of TextEditorPopup*/
var currentTextEditor = null;

/**Current selected figure id ( -1 if none selected)*/
var selectedFigureId = -1;

/**Currently selected figure thumbnail (for D&D)*/
var selectedFigureThumb = null

/**Current selected group (-1 if none selected)*/
var selectedGroupId = -1;

/**Current selecte connector (-1 if none selected)*/
var selectedConnectorId = -1;

/**Current selectet container (-1 if none selected)*/
var selectedContainerId = -1;

/**Currently selected ConnectionPoint (if -1 none is selected)*/
var selectedConnectionPointId = -1;

/**Set on true while we drag*/
var dragging = false;

/**Currently inserted image filename*/
var insertedImageFileName = null;

/**Holds a wrapper around canvas object*/
var canvasProps = null;

/**Currently holds two elements the type: figure|group and the id*/
var clipboardBuffer = [];

/**Return current canvas.
 * Current canvas will ALWAYS have the 'a' as DOM id
 * @return {HTMLCanvasElement} the DOM element of <canvas> tag
 * @author Alex Gheorghiu <alex@scriptoid.com>
 **/
function getCanvas(){
    var canvas = document.getElementById("a");
    return canvas;
}


/**Return work area container.
 * Work area container will ALWAYS have the 'container' as DOM id
 * @return {HTMLElement} the DOM element of work area container
 * @author Artyom Pokatilov <artyom.pokatilov@gmail.com>
 **/
function getWorkAreaContainer(){
    /**Id of work area HTML element, which includes canvas*/
    var workAreaContainer = document.getElementById("container");
    return workAreaContainer;
}


/**Return the 2D context of current canvas
 * @author Alex Gheorghiu <alex@scriptoid.com>
 **/
function getContext(){
    var canvas = getCanvas();
    if(canvas.getContext){
        return canvas.getContext("2d");
    }
    else{
        alert('You need a HTML5 web browser. Any Safari,Firefox, Chrome or Explorer supports this.');
    }
}

/**Keeps current figure set id*/
var currentSetId = 'basic';

/**
 * Reveals the figure set named by 'name' and hide previously displayed set
 * @param {String} id - the (div) id value of the set
 * @author Alex
 **/
function setFigureSet(id){
    Log.info("main.js id = " + id);
    
    //alert(name);
    var div = document.getElementById(id);
    if(div != null){
        if(currentSetId != null){
            Log.info("main.js currentSetId = " + currentSetId);
            var currentFigureSet = document.getElementById(currentSetId);
            currentFigureSet.style.display = 'none';
        }
        div.style.display = 'block';
        currentSetId = id;
    }
}


/**Update an object (Figure or Connector)
 *@param {Number} shapeId - the id of the updating object
 *@param {String} property - (or an {Array} of {String}s). The 'id' under which the property is stored
 *TODO: is there any case where we are using property as an array ?
 *@param {String} newValue - the new value of the property
 *@param {Boolean} [skipCommand = false] - if true than current {Command} won't be added to the {History}
 *@param {String} [previousValue] - the previous value of the property
 *@author Zack, Alex, Artyom
 **/
function updateShape(shapeId, property, newValue, skipCommand, previousValue){
    //Log.group("main.js-->updateFigure");
    //Log.info("updateShape() figureId: " + figureId + " property: " + property + ' new value: ' + newValue);

    // set default values of optional params
    skipCommand = skipCommand || false;

    var obj = STACK.figureGetById(shapeId); //try to find it inside {Figure}s


    //TODO: this horror must dissapear
    if(!obj){
        obj = CONNECTOR_MANAGER.connectorGetById(shapeId);
    }
    
    
    //container?
    if(!obj){
        obj = STACK.containerGetById(shapeId);
    }

    var objSave = obj; //keep a reference to initial shape

    /*Example of property 'primitives.1.str' */
    var props = property.split(".");
    //Log.info("Splitted props: " + props);


    /*Going down the object's hierarchy down to the property's parent
     *Example:
     *  for props = ['primitives','1','str'] 
     *  figure
     *      |_primitives
     *          |_1 (it's a Text)
     *             |_str
     */
    //Log.info("Object before descend: " +  obj.oType);
    var figure = obj; //TODO: Why this variable when we already have objSave?
    for(var i = 0; i<props.length-1; i++){
        obj = obj[props[i]];
    }

    //the property name
    var propName = props[props.length -1];
    //Log.info("updateShape(): last property: " + propName);
    //Log.info("updateShape(): last object in hierarchy: " + obj.oType);


    /*Now we are located at Figure level or somewhere in a primitive or another object.
     *Here we will search for setXXX (where XXX is the property name) method first and if we find one we will use it
     *if not we will simply update the property directly.
     **/
    
    /**Compute setXXX and getXXX*/
    var propSet = "set" + Util.capitaliseFirstLetter(propName);
    var propGet = "get" + Util.capitaliseFirstLetter(propName);
    
    if(propSet in obj){ //@see https://developer.mozilla.org/en/JavaScript/Reference/Operators/Special_Operators/in_Operator
        /*If something is complicated enough to need a function,
         *  likelyhood is it will need access to its parent figure.
         *So we will let the parent to do the update as it likes, if it has
         * a method of form set<property_name> in place
         */
        
        if((typeof(previousValue) !== 'undefined' && previousValue != obj[propGet])
            || (typeof(previousValue) === 'undefined' && newValue != obj[propGet]())){ //update ONLY if new value differ from the old one
            //Log.info('updateShape() : penultimate propSet: ' +  propSet);
                var undo = new ShapeChangePropertyCommand(shapeId, property, newValue, previousValue);
                undo.execute();

                if (!skipCommand) {
                    History.addUndo(undo);
                }
            }
            //Log.info('updateShape() : call setXXX on object: ' +  propSet + " new value: " + newValue);
            //            obj[propSet](figure,newValue);
            //TODO: Do we really need this anymore?
            obj[propSet](newValue);
    }
    else{
        if( (typeof(previousValue) !== 'undefined' && obj[propName] != previousValue)
            || (typeof(previousValue) === 'undefined' && obj[propName] != newValue)){ //try to change it ONLY if new value is different than the last one
                var undo = new ShapeChangePropertyCommand(shapeId, property, newValue, previousValue);
                undo.execute();

                if (!skipCommand) {
                    History.addUndo(undo);
                }
            obj[propName] = newValue;
        }
    }

    //connector's text special case
    if(objSave instanceof Connector && propName == 'str'){
        //Log.info("updateShape(): it's a connector 2");
        objSave.updateMiddleText();
    }
    
    //Log.groupEnd();

    draw();
}


/**Setup the editor panel for a special shape. 
 *@param shape - can be either Connector or Figure. If null is provided the
 *editor panel will be disabled
 **/
function setUpEditPanel(shape){
    //var propertiesPanel = canvas.edit; //access the edit div
    var propertiesPanel = document.getElementById("edit");
    propertiesPanel.innerHTML = "";
    if(shape == null){
    //do nothing
    }
    else{
        switch(shape.oType){
            case 'Group':
                //do nothing. We do not want to offer this to groups
                break;
            case 'Container':
                Builder.constructPropertiesPanel(propertiesPanel, shape);
                break;
            case 'CanvasProps':
                Builder.constructCanvasPropertiesPanel(propertiesPanel, shape);
                break;
            default: //both Figure and Connector
                Builder.constructPropertiesPanel(propertiesPanel, shape);
        }
    }
}

/**Setup edit mode for Text primitive.
 *@param shape - parent of Text primitive. Can be either {Connector} or {Figure}.
 *@param {Number} textPrimitiveId - the id value of Text primitive (from {Stack}
 *@author Artyom
 **/
function setUpTextEditorPopup(shape, textPrimitiveId) {
    // get elements of Text Editor and it's tools
    var textEditor = document.getElementById('text-editor'); //a <div> inside editor page
    var textEditorTools = document.getElementById('text-editor-tools'); //a <div> inside editor page

    // set current Text editor to use it further in code
    currentTextEditor = Builder.constructTextPropertiesPanel(textEditor, textEditorTools, shape, textPrimitiveId);
}


/**Setup the creation function (that -later, upon calling - will create the actual {Figure}
 * Note: It will also set the current state to STATE_FIGURE_CREATE
 * @param  {Function} fFunction - the function used to create the figure
 * @param  {String} thumbURL - the URL to the thumb of the image
 **/
function createFigure(fFunction, thumbURL){
    //Log.info('createFigure (' + fFunction + ',' + thumbURL + ')');
    
    createFigureFunction = fFunction;
    
    selectedFigureThumb = thumbURL;
    

    selectedFigureId = -1;
    selectedConnectorId = -1;
    selectedConnectionPointId = -1;

    if (state == STATE_TEXT_EDITING) {
        currentTextEditor.destroy();
        currentTextEditor = null;
    }

    state = STATE_FIGURE_CREATE;
    draw();

}

/*
* Resets any state to STATE_NONE
*/
function resetToNoneState() {
    // clear text editing mode
    if (state == STATE_TEXT_EDITING) {
        currentTextEditor.destroy();
        currentTextEditor = null;
    }

    // deselect everything
    selectedFigureId = -1;
    selectedConnectionPointId = -1;
    selectedConnectorId = -1;
    selectedContainerId = -1;

    // if group selected
    if (state == STATE_GROUP_SELECTED) {
        var selectedGroup = STACK.groupGetById(selectedGroupId);

        // if group is temporary then destroy it
        if(!selectedGroup.permanent){
            STACK.groupDestroy(selectedGroupId);
        }

        //deselect current group
        selectedGroupId = -1;
    }

    state = STATE_NONE;
}

// Id of the DOM object for errors of image upload
var uploadImageErrorDivId = 'upload-image-error';

/** Show "Insert image" dialog
 * Insert image dialog can be triggered in 1 case:
 *  1 - from quick toolbar

 *  Description:
 *  Call popup to get image from url or upload target image from local
 *  @author Artyom Pokatilov <artyom.pokatilov@gmail.com>
 **/
function showInsertImageDialog(){
    resetToNoneState();

    draw();

    setUploadedImagesList();

    var dialogContent = document.getElementById('insert-image-dialog');
    $.modal(dialogContent,{minWidth:'380px', containerId: 'upload-image-dialog', overlayClose: true});
    // update dialog's position
    $.modal.setPosition();

    // empty upload errors in dialog
    var errorDiv = document.getElementById(uploadImageErrorDivId);
    errorDiv.innerHTML = '';
}

/** Show filenames of uploaded images in "Insert image" dialog
 * Get filenames from server and insert them into dialog
 *  @author Artyom Pokatilov <artyom.pokatilov@gmail.com>
 **/
function setUploadedImagesList(){
    //see: http://api.jquery.com/jQuery.get/
    $.post("./common/controller.php",
        {action: 'getUploadedImageFileNames'},
        function(data){
            var list = document.getElementById('insert-image-reuse');
            var reuseGroup = document.getElementById('insert-image-reuse-group');

            data = JSON.parse(data);

            if (data != null && data.length) {
                var i,
                    length = data.length,
                    option;

                // add options with filenames to select
                for (i = 0; i < length; i++) {
                    option = document.createElement('option');
                    option.value = data[i];
                    option.textContent = data[i];
                    list.appendChild(option);
                }

                // enable reuse select and group button
                list.disabled = false;
                reuseGroup.disabled = false;
            } else {
                // disable reuse select and group button
                list.disabled = true;
                reuseGroup.disabled = true;
            }
        }
    );
}

/** Insert image into current diagram
 * Insert image can be triggered in 1 case:
 *  1 - from insert image dialog
 *
 * @param {String} imageFileName - filename of uploaded image
 * @param {String} errorMessage - error message
 *
 *  Description:
 *  1) Call popup to get image from url or upload target image from local
 *  2) Save image to backend
 *  3) Close popup
 *  4) If there were errors - go to 5 else - go to 6
 *  5) Alert error message
 *  6) Create figure with target image and text caption
 *
 *  @author Artyom Pokatilov <artyom.pokatilov@gmail.com>
 **/
function insertImage(imageFileName, errorMessage){
    if (errorMessage) {
        // set upload errors to dialog
        var errorDiv = document.getElementById(uploadImageErrorDivId);
        errorDiv.innerHTML = errorMessage;

        // update dialog's position
        $.modal.setPosition();
    } else {
        // close current insert image dialog
        $.modal.close();

        insertedImageFileName = imageFileName;
        action('insertImage');
    }
}

    /**Activate snapToGrip  option*/
function snapToGrid(){	
	Log.info("snapToGrid called;");
	snapTo =! snapTo;
	
	if(snapTo){
            if(!gridVisible){
                gridVisible = true;
                backgroundImage = null; // reset cached background image of canvas
                document.getElementById("gridCheckbox").checked = true;

                //trigger a repaint;
                draw();
            }
	}
}


/**Makes grid visible or invisible, depedinding of previous value
 *If the "snap to" was active and grid made invisible the "snap to"
 *will be disabled
 **/
function showGrid(){
	
	/**If grid was visible and snap to was check we need to take measures*/
	if(gridVisible){ 
            if(snapTo){
                snapTo = false;
                document.getElementById("snapCheckbox").checked = false;        
            }
    }
	
    gridVisible = !gridVisible;
    backgroundImage = null; // reset cached background image of canvas
    
	//trigger a repaint;
	draw();
}


/**Click is disabled because we need to handle mouse down and mouse up....etc etc etc*/
function onClick(ev){
    var coords = getCanvasXY(ev);
    var x = coords[0];
    var y = coords[1];

//here is the problem....how do we know we clicked on canvas
/*var fig=STACK.figures[STACK.figureGetMouseOver(x,y,null)];
    if(CNTRL_PRESSED && fig!=null){
        TEMPORARY_GROUP.addPrimitive();
        STACK.figureRemove(fig);
        STACK.figureAdd(TEMPORARY_GROUP);
    }
    else if(STACK.figureGetMouseOver(x,y,null)!=null){
        TEMPORARY_GROUP.primitives=[];
        TEMPORARY_GROUP.addPrimitive(fig);
        STACK.figureRemove(fig);
    }*/
//draw();
}


/**
 * @deprecated Does not seem to be used
 * */
function onDoubleClick(ev){
    var coords = getCanvasXY(ev);
    var HTMLCanvas = getCanvas();
    var x = coords[0];
    var y = coords[1];
    lastClick = [x,y];
//    Log.info("onMouseDown at (" + x + "," + y + ")");
    //alert('lastClick: ' + lastClick + ' state: ' + state);

    //mousePressed = true;
    alert("Double click triggered");
}


/**Receives the ASCII character code but not the keyboard code
 *@param {Event} ev - the event generated when kay is pressed
 *@see <a href="http://www.quirksmode.org/js/keys.html">http://www.quirksmode.org/js/keys.html</a>
 **/
function onKeyPress(ev){


    //ignore texts
    if(ev.target.className == "text"){
        return true;
    }


    draw();
    return false;
}


/**
 *Receives the key code of keyboard but not the ASCII
 *Treats the key pressed event
 *@param {Event} ev - the event generated when key is down
 *@see <a href="http://www.quirksmode.org/jskey/keys.html">http://www.quirksmode.org/js/keys.html</a>
 **/
function onKeyDown(ev){
    
    //Log.info("main.js->onKeyDown()->function call. Event = " + ev.type + " IE = " + IE ); //Janis: comout because messes log on SHIFT
    
    
    //1 - avoid text elements (if you are on a text area and you press the arrow you do not want the figures to move on canvas)
    if( ev.target.className == "text"){
        return true;
    }
    
    
    //2 - "enhance" event TODO: I'm not sure this is really necessary
    ev.KEY = ev.keyCode;
        
    
    //Log.info("e.keyCode = " + ev.keyCode + " ev.KEY = " + ev.KEY); //Janis: comout because messes log on SHIFT
    
    
    switch(ev.KEY){
        case KEY.ESCAPE: //Esc
            //alert('So do you want to escape me');
            //cancel any figure creation
            createFigureFunction = null;

            if(selectedFigureId != -1 || selectedConnectionPointId != -1 || selectedConnectorId!=-1){
                redraw = true;
            }
            
            //deselect any figure
            selectedFigureId = -1;
            selectedConnectionPointId = -1;
            selectedConnectorId = -1;

            // clear current text editor
            if (state == STATE_TEXT_EDITING) {
                currentTextEditor.destroy();
                currentTextEditor = null;
            }

            state = STATE_NONE;
            break;

        case KEY.DELETE: //Delete
            //delete any Figure or Group
            //            alert('Delete pressed' + this);
            switch(state){

                case STATE_FIGURE_SELECTED: //delete a figure ONLY when the figure is selected
                    if(selectedFigureId != -1){
                        var cmdDelFig = new FigureDeleteCommand(selectedFigureId);
                        cmdDelFig.execute();
                        History.addUndo(cmdDelFig);
                    }                    
                    break;
                    
                case STATE_GROUP_SELECTED:
                    if(selectedGroupId != -1){
                        var cmdDelGrp = new GroupDeleteCommand(selectedGroupId);
                        cmdDelGrp.execute();
                        History.addUndo(cmdDelGrp);
                    }

                    break;    

                case STATE_CONNECTOR_SELECTED:
                    Log.group("Delete connector");
                    if(selectedConnectorId != -1){
                        var cmdDelCon = new ConnectorDeleteCommand(selectedConnectorId);
                        cmdDelCon.execute();
                        History.addUndo(cmdDelCon);                                                
                    }
                    Log.groupEnd();
                    break;
                    
                case STATE_CONTAINER_SELECTED:
                    Log.group("Delete container");
                    if(selectedContainerId != -1){
                        var cmdDelContainer = new ContainerDeleteCommand(selectedContainerId);
                        cmdDelContainer.execute();
                        History.addUndo(cmdDelContainer);                                                
                    }
                    Log.groupEnd();
                    break;                                    
            }
            break;

        case KEY.SHIFT: //Shift
            SHIFT_PRESSED = true;
            break;

        case KEY.CTRL: //Ctrl
        case KEY.COMMAND_LEFT:
        case KEY.COMMAND_FIREFOX:
            CNTRL_PRESSED = true;
            break;

        case KEY.LEFT://Arrow Left
            action("left");
            return false;
            break;

        case KEY.UP://Arrow Up
//            alert('up');
            action("up");
            return false;
            break;

        case KEY.RIGHT://Arrow Right
            action("right");
            return false;
            break;

        case KEY.DOWN://Arrow Down
            action("down");
            return false;
            break;

        case KEY.Z:
            if(CNTRL_PRESSED){
                action('undo');
            }
            break;

//        case KEY.Y:
//            if(CNTRL_PRESSED){
//                action('redo');
//            }
//            break;
            
        case KEY.G:
            if(CNTRL_PRESSED){
                action('group');
            }
            break;

        case KEY.U:
            if(CNTRL_PRESSED){
                action('ungroup');
            }
            break;

        case KEY.D:
            if(CNTRL_PRESSED){
                if (ev.preventDefault){ 
                    ev.preventDefault(); 
                   } 
                else { 
                    ev.returnValue = false; 
                    } 
                action('duplicate');
            }
            break;

        case KEY.C:
            if(CNTRL_PRESSED){
                if(selectedFigureId != -1){
                    clipboardBuffer[0] = "figure";
                    clipboardBuffer[1] = selectedFigureId;
                } else if(selectedGroupId != -1){
                    clipboardBuffer[0] = "group";
                    clipboardBuffer[1] = selectedGroupId;
                } else {
                    clipboardBuffer[0] = "";
                    clipboardBuffer[1] = -1;
                }
            }
            break;
            
        case KEY.V:
            if(CNTRL_PRESSED){
                /*Description:
                 * If figure or group copied here is what can happen:
                 * - if no selection -> STATE_NONE:
                 *      - if figure copied then duplicate it
                 *      - if group copied then check if it`s not permanent, becase then we have lost it, and if not, then duplicate it
                 * - if figure selected (ONLY if figure copied):
                 *      - if it is same figure as copied, then duplicate it
                 *        also because the duplicate will become selected, add it to the clipboard thus allowing another paste
                 *      - if it is another figure, then apply style to it
                 * - if group selected:
                 *      //TODO: for Janis see comments/description on GroupCloneCommands
                 *      - if it is same group as copied, then duplicate it, in this case we can also duplicate permanent group
                 *        also because the duplicate will become selected, add it to the clipboard thus allowing another paste
                 *      - if it is another group, and if we have COPIED THE FIGURE, then apply its style to all group
                 * 
                 */                
                if(clipboardBuffer[0]){// if something was copied
                    switch(state){
                        case STATE_NONE:
                            if(clipboardBuffer[0] == "figure"){
                                selectedFigureId = clipboardBuffer[1];
                                action('duplicate');
                            }else if(clipboardBuffer[0] == "group"){
                                selectedGroupId = clipboardBuffer[1];
                                if(STACK.groupGetById(selectedGroupId)){ //if this is true, then the group isn`t permanent
                                    action('duplicate');    
                                }
                            }                            
                            break;
                        case STATE_FIGURE_SELECTED:
                            if(clipboardBuffer[0] == "figure"){
                                if(clipboardBuffer[1] == selectedFigureId){
                                    action('duplicate');
                                    //this means we add the copied to the clipboard, thus allowing another paste (it is ok, since the style is same)
                                    clipboardBuffer[1] = selectedFigureId;
                                }else{ //apply style
                                    //TODO: I do think style should be applied by users directly.
                                    var copiedFigure = STACK.figureGetById(clipboardBuffer[1]);
                                    var selectedFigure = STACK.figureGetById(selectedFigureId);
                                    selectedFigure.applyAnotherFigureStyle(copiedFigure);
                                }
                            }
                            break;
                        case STATE_GROUP_SELECTED:
                            if(clipboardBuffer[1] == selectedGroupId){
                                action('duplicate');
                                //this means we add the copied to the clipboard, thus allowing another paste (it is ok, since the style is same)
                                clipboardBuffer[1] = selectedGroupId;
                            }else{
                                //TODO: I do think style should be applied by users directly, even less to spread a figure's style to a whole group
                                if(clipboardBuffer[0] == "figure"){ //if we have copied the figure, apply style to group
                                    var copiedFigure = STACK.figureGetById(clipboardBuffer[1]);
                                    var groupFigures = STACK.figureGetByGroupId(selectedGroupId);
                                    for(var i=0; i<groupFigures.length; i++ ){
                                        groupFigures[i].applyAnotherFigureStyle(copiedFigure);
                                    }
                                }
                            }
                            break;
                    }
                }
            }
            break;
            
        case KEY.S:
            if(CNTRL_PRESSED){
                //Log.info("CTRL-S pressed  ");
                save();
                ev.preventDefault();
            }
            break;

        case KEY.P:
            if (currentDiagramId !== null) {
                if(CNTRL_PRESSED){
                    Log.info("CTRL-P pressed  ");
                    print_diagram();
                    ev.preventDefault();
                }
            }
            break;
    }
    draw();
    return false;
}


/**
 *Treats the key up event
 *@param {Event} ev - the event generated when key is up
 **/
function onKeyUp(ev){    
    switch(ev.keyCode){
        case KEY.SHIFT: //Shift
            SHIFT_PRESSED = false;
            break;

        case KEY.ALT: //Alt
            CNTRL_PRESSED = false;
            break;

        case KEY.CTRL: //Ctrl
            CNTRL_PRESSED = false;
            break;
    }
    return false;
}


/**
 *Treats the mouse down event
 *@param {Event} ev - the event generated when button is pressed
 **/
function onMouseDown(ev){
    var coords = getCanvasXY(ev);
    var HTMLCanvas = getCanvas();
    var x = coords[0];
    var y = coords[1];
    lastClick = [x,y];
//    Log.info("onMouseDown at (" + x + "," + y + ")");
    //alert('lastClick: ' + lastClick + ' state: ' + state);

    mousePressed = true;
    //alert("onMouseDown() + state " + state + " none state is " + STATE_NONE);
    
    switch(state){
        case STATE_TEXT_EDITING:

            /*Description:
             * If we have active text editor in popup and we click mouse.  Here is what can happen:
             * - if we clicked inside current text editor that nothing is happening
             * - if we clicked canvas:
             *      - we trigger onblur of text editor for IE and FF manually
             *      - we will remove text editor
             *      - we will switch to STATE_NONE
             *      - we will run STATE_NONE case next (without break;)
             */

            if (currentTextEditor.mouseClickedInside(ev)) {
                break;
            } else {
                // IE and Firefox doesn't trigger blur event when mouse clicked canvas
                // that is why we trigger this event manually
                if (Browser.msie || Browser.mozilla) {
                    currentTextEditor.blurTextArea();
                }

                currentTextEditor.destroy();
                currentTextEditor = null;

                state = STATE_NONE;
            }

        // TODO: Further needs to be the same behaviour as for the STATE_NONE case
        // to avoid repeating of the code next "break" statement commented to let execution flow down
        // break;


        case STATE_NONE:
            //alert("onMouseDown() - STATE_NONE");
            snapMonitor = [0,0];
            
            
            /*Description:
             * We are in None state when no action was done....yet.  Here is what can happen:
             * - if we clicked a Connector than that Connector should be selected  
             *  (Connectors are more important than Figures :p)
             * - if we clicked a Group:
             *      - select the Group
             * - if we clicked a Figure:
             *      - select the Figure
             * - if we clicked a Container (Figures more important than Container)
             *      - select the Container
             * - if we did not clicked anything....
             *      - we will stay in STATE_NONE
             *      - allow to edit canvas
             *      
             */

            var selectedObject = Util.getObjectByXY(x,y); // get object under cursor
            switch(selectedObject.type) {
                case 'Connector':
                    selectedConnectorId = selectedObject.id;
                    state = STATE_CONNECTOR_SELECTED;
                    setUpEditPanel(CONNECTOR_MANAGER.connectorGetById(selectedConnectorId));
                    Log.info('onMouseDown() + STATE_NONE  - change to STATE_CONNECTOR_SELECTED');
                    redraw = true;
                    break;
                case 'Group':
                    selectedGroupId = selectedObject.id;
                    state = STATE_GROUP_SELECTED;
                    setUpEditPanel(null);
                    Log.info('onMouseDown() + STATE_NONE + group selected  =>  change to STATE_GROUP_SELECTED');
                    break;
                case 'Figure':
                    selectedFigureId = selectedObject.id;
                    state = STATE_FIGURE_SELECTED;
                    setUpEditPanel(STACK.figureGetById(selectedFigureId));
                    Log.info('onMouseDown() + STATE_NONE + lonely figure => change to STATE_FIGURE_SELECTED');
                    redraw = true;
                    break;
                case 'Container':
                    selectedContainerId = selectedObject.id;
                    state = STATE_CONTAINER_SELECTED;
                    setUpEditPanel(STACK.containerGetById(selectedContainerId));
                    Log.info('onMouseDown() + STATE_NONE  - change to STATE_CONTAINER_SELECTED');
                    redraw = true;
                    break;
                default:
                    //DO NOTHING
                    break;
            }
            break;


        case STATE_FIGURE_CREATE:
//            selectedConnectorId = -1;
//            createFigureFunction = null;
//
//            mousePressed = false;
//            redraw = true;
            throw "canvas> onMouseDown> STATE_FIGURE_CREATE> : this should not happen";  
            break;

        case STATE_FIGURE_SELECTED:
            snapMonitor = [0,0];
            
            /*Description:
             * If we have a figure selected and we do click here is what can happen:
             * - if we clicked a handle of current selected shape (it should be Figure) then just select that Handle
             * - if we clicked a Connector than it should be selected  (Connectors are more important than Figures :p)
             * - if we clicked a Group:
             *      - if SHIFT is pressed
             *              create a new group of (selectedFigure + parent group of clicked figure)
             *      - else (SHIFT not pressed)
             *              select that group
             * - if we clicked a Figure:
             *      - did we click same figure?
             *          - do nothing
             *      - did we clicked another figure?
             *          - if SHIFT is pressed
             *              create a new group of (selectedFigure + clicked figure)
             *          - else (SHIFT not pressed)
             *              select that figure
             * - if we clicked a Container than it should be selected
             * - if we click on nothing -> 
             *      - if SHIFT pressed then State none
             *      - else just keep current state (maybe just missed what we needed)    
             *      
             */
            
            //CONNECTOR
            if(HandleManager.handleGet(x, y) != null){ //Clicked a handler (of a Figure or Connector)
                Log.info("onMouseDown() + STATE_FIGURE_SELECTED - handle selected");       
                /*Nothing important (??) should happen here. We just clicked the handler of the figure*/
                HandleManager.handleSelectXY(x, y);
            }
            else{ //We did not clicked a handler
                var selectedObject = Util.getObjectByXY(x,y); // get object under cursor
                switch(selectedObject.type) {
                    case 'Connector':
                        state = STATE_CONNECTOR_SELECTED;
                        selectedConnectorId = selectedObject.id;
                        selectedFigureId = -1;
                        var con = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId);
                        HandleManager.shapeSet(con);
                        setUpEditPanel(con);
                        Log.info('onMouseDown() + STATE_FIGURE_SELECTED  - change to STATE_CONNECTOR_SELECTED');
                        redraw = true;
                        break;
                    case 'Group':
                        if (SHIFT_PRESSED){
                            var figuresToAdd = [];
                            /* TODO: for what reason we have this condition in STATE_FIGURE_SELECTED?
                             * Seems like escaping of bigger problem */
                            if (selectedFigureId != -1){ //add already selected figure
                                figuresToAdd.push(selectedFigureId);
                            }

                            var groupFigures = STACK.figureGetByGroupId(selectedObject.id);
                            for(var i=0; i<groupFigures.length; i++ ){
                                figuresToAdd.push(groupFigures[i].id);
                            }

                            // create group for current figure joined with clicked group
                            selectedGroupId = STACK.groupCreate(figuresToAdd);
                            Log.info('onMouseDown() + STATE_FIGURE_SELECTED + SHIFT + another group => STATE_GROUP_SELECTED');
                        }else{
                            selectedGroupId = selectedObject.id;
                            Log.info('onMouseDown() + STATE_FIGURE_SELECTED + group figure => change to STATE_GROUP_SELECTED');
                        }

                        selectedFigureId = -1;
                        state = STATE_GROUP_SELECTED;
                        setUpEditPanel(null);
                        redraw = true;
                        break;
                    case 'Figure': //lonely figure
                        if (SHIFT_PRESSED){
                            var figuresToAdd = [];
                            /* TODO: for what reason we have this condition in STATE_FIGURE_SELECTED?
                             * Seems like escaping of bigger problem */
                            if (selectedFigureId != -1){ //add already selected figure
                                figuresToAdd.push(selectedFigureId);
                            }

                            figuresToAdd.push(selectedObject.id); //add ONLY clicked selected figure

                            selectedFigureId = -1;
                            // we have two figures, create a group
                            selectedGroupId = STACK.groupCreate(figuresToAdd);
                            state = STATE_GROUP_SELECTED;
                            setUpEditPanel(null);
                            Log.info('onMouseDown() + STATE_FIGURE_SELECTED + SHIFT  + min. 2 figures => STATE_GROUP_SELECTED');
                        }else{
                            selectedFigureId = selectedObject.id;
                            HandleManager.clear();
                            setUpEditPanel(STACK.figureGetById(selectedFigureId));
                            Log.info('onMouseDown() + STATE_FIGURE_SELECTED + single figure => change to STATE_FIGURE_SELECTED (different figure)');
                        }

                        redraw = true;
                        break;
                    case 'Container':
                        selectedFigureId = -1;
                        selectedContainerId = selectedObject.id;
                        state = STATE_CONTAINER_SELECTED;
                        Log.info('onMouseDown() + STATE_FIGURE_SELECTED + single container  - change to STATE_CONTAINER_SELECTED');

                        setUpEditPanel(STACK.containerGetById(selectedContainerId));
                        redraw = true;
                        break;
                    default:    //mouse down on empty space
                        if (!SHIFT_PRESSED){ //if Shift isn`t pressed
                            selectedFigureId = -1;
                            state = STATE_NONE;
                            setUpEditPanel(canvasProps);
                            Log.info('onMouseDown() + STATE_FIGURE_SELECTED  - change to STATE_NONE');
                        }
                        redraw = true;
                        break;
                }
            }                
            
            break;

        case STATE_GROUP_SELECTED:
            /*Description:
             * If we have a selected group and we pressed the mouse this what can happen:
             * - if we clicked a handle of current selected shape (asset: it should be Group) then just select that Handle
             * - if we clicked a Connector than it should be selected  (Connectors are more important than Figures or Groups :p) :
             *      - deselect current group
             *      - if current group is temporary (destroy it)
             *      - select that Connector
             * - if we clicked a Group:
             *      - Clicked the same group as current?
             *          - do nothing
             *      - Clicked another group
             *          - SHIFT is pressed
             *              if current group is temporary
             *                  destroy it
             *              merge those 2 groups
             *          - SHIFT not pressed
             *              if current group is temporary
             *                  destroy it
             *              clicked group become new selected group
             * - if we clicked a Figure:
             *      - SHIFT is pressed
             *          add figure to current group
             *      - else (SHIFT not pressed)
             *          if current group is temporary
             *              destroy it
             *          select that figure
             * - if we clicked a Container than it should be selected
             * - if we clicked on empty space
             *      -  SHIFT _NOT_ pressed
             *          - current group is temporary
             *              delete it
             *          - move to state none
             */
            
            //GROUPS
            
            //if selected group is temporary and we pressed outside of it's border we will destroy it
            var selectedGroup = STACK.groupGetById(selectedGroupId);
            
            if( HandleManager.handleGet(x,y) != null){ //handle ?
                HandleManager.handleSelectXY(x, y);
                redraw = true;
                Log.info('onMouseDown() + STATE_GROUP_SELECTED  + handle selected => STATE_GROUP_SELECTED');                
            }
            else {
                // get object under cursor
                var selectedObject = Util.getObjectByXY(x,y);
                switch(selectedObject.type) {
                    case 'Connector':
                        //destroy current group (if temporary)
                        if(!selectedGroup.permanent){
                            STACK.groupDestroy(selectedGroupId);
                        }

                        //deselect current group
                        selectedGroupId = -1;

                        selectedConnectorId = selectedObject.id;
                        state = STATE_CONNECTOR_SELECTED;
                        redraw = true;
                        Log.info('onMouseDown() + STATE_GROUP_SELECTED  + handle selected => STATE_CONNECTOR_SELECTED');
                        break;
                    case 'Group':
                        if(selectedObject.id != selectedGroupId){
                            if (SHIFT_PRESSED){
                                var figuresToAdd = [];

                                //add figures from current group
                                var groupFigures = STACK.figureGetByGroupId(selectedGroupId);
                                for(var i=0; i<groupFigures.length; i++ ){
                                    figuresToAdd.push(groupFigures[i].id);
                                }

                                //add figures from clicked group
                                groupFigures = STACK.figureGetByGroupId(selectedObject.id);
                                for(var i=0; i<groupFigures.length; i++ ){
                                    figuresToAdd.push(groupFigures[i].id);
                                }

                                //destroy current group (if temporary)
                                if(!selectedGroup.permanent){
                                    STACK.groupDestroy(selectedGroupId);
                                }

                                selectedGroupId = STACK.groupCreate(figuresToAdd);
                            }else{
                                //destroy current group (if temporary)
                                if(!selectedGroup.permanent){
                                    STACK.groupDestroy(selectedGroupId);
                                }

                                selectedGroupId = selectedObject.id;
                            }

                            redraw = true;
                            Log.info('onMouseDown() + STATE_GROUP_SELECTED  + (different) group figure => STATE_GROUP_SELECTED');
                        }
                        else{ //figure from same group
                            //do nothing
                        }
                        break;
                    case 'Figure': //lonely figure
                        if (SHIFT_PRESSED){
                            var figuresToAdd = [];
                            var groupFigures = STACK.figureGetByGroupId(selectedGroupId);
                            for(var i=0; i<groupFigures.length; i++ ){
                                figuresToAdd.push(groupFigures[i].id);
                            }
                            figuresToAdd.push(selectedObject.id);

                            //destroy current group (if temporary)
                            if(!selectedGroup.permanent){
                                STACK.groupDestroy(selectedGroupId);
                            }

                            selectedGroupId = STACK.groupCreate(figuresToAdd);

                            Log.info('onMouseDown() + STATE_GROUP_SELECTED + SHIFT  + add lonely figure to other');
                        }else{
                            //destroy current group (if temporary)
                            if(!selectedGroup.permanent){
                                STACK.groupDestroy(selectedGroupId);
                            }

                            //deselect current group
                            selectedGroupId = -1;

                            state = STATE_FIGURE_SELECTED;
                            selectedFigureId = selectedObject.id;
                            Log.info('onMouseDown() + STATE_GROUP_SELECTED  + lonely figure => STATE_FIGURE_SELECTED');

                            setUpEditPanel(STACK.figureGetById(selectedFigureId));
                            redraw = true;
                        }
                        break;
                    case 'Container':
                        //destroy current group (if temporary)
                        if(!selectedGroup.permanent){
                            STACK.groupDestroy(selectedGroupId);
                        }

                        //deselect current group
                        selectedGroupId = -1;

                        state = STATE_CONTAINER_SELECTED;
                        selectedContainerId = selectedObject.id;
                        Log.info('onMouseDown() + STATE_GROUP_SELECTED  + container => STATE_CONTAINER_SELECTED');

                        setUpEditPanel(STACK.containerGetById(selectedContainerId));
                        redraw = true;
                        break;
                    default:    //mouse down on empty space
                        if (!SHIFT_PRESSED){ //if Shift isn`t pressed
                            if(!selectedGroup.permanent){
                                STACK.groupDestroy(selectedGroupId);
                            }

                            selectedGroupId = -1;
                            state = STATE_NONE;
                            setUpEditPanel(canvasProps);
                            redraw = true;
                            Log.info('onMouseDown() + STATE_GROUP_SELECTED  + mouse on empty => STATE_NONE');
                        }
                        break;
                }
            }
            
            break;

        
        case STATE_CONNECTOR_PICK_FIRST:
            //moved so it can be called from undo action
            connectorPickFirst(x,y,ev);
            break;

        case STATE_CONNECTOR_PICK_SECOND:
            state  = STATE_NONE;
            break;


        case STATE_CONNECTOR_SELECTED:
            /*
             *Description:
             *If we have a connector selected and we press mouse here is what is happening:
             *- mouse down over a connection point? (trat first current connector)
             *      - select connection point 
             *      - set state to STATE_CONNECTOR_MOVE_POINT 
             *      (and wait mouseMove to alter and mouseUp to finish the modification)
             *      - store original state of the connector (to be able to create the undo command later)
             *- mouse down over a handler?
             *      - select handle
             *- mouse down over a connector?
             *      - same connector (do nothing)
             *      - different connector?
             *          - selected clicked connector
             *- mouse down over a group, figure, container?
             *      - deselect connector
             *      - select clicked object
             *- mouse down over empty space?
             *      - deselect connector
             *      - select canvasProps
             **/
                        
            var cps = CONNECTOR_MANAGER.connectionPointGetAllByParent(selectedConnectorId);
            var start = cps[0];
            var end = cps[1];
            var figureConnectionPointId;

            //did we click any of the connection points?
            if(start.point.near(x, y, 3)){
                Log.info("Picked the start point");
                selectedConnectionPointId = start.id;
                state = STATE_CONNECTOR_MOVE_POINT;
                HTMLCanvas.style.cursor = 'default';
                
                //this acts like clone of the connector
                var undoCmd = new ConnectorAlterCommand(selectedConnectorId); 
                History.addUndo(undoCmd);

                // check if current cloud for connection point
                figureConnectionPointId = CONNECTOR_MANAGER.connectionPointGetByXYRadius(x,y, FIGURE_CLOUD_DISTANCE, ConnectionPoint.TYPE_FIGURE, end);
                if (figureConnectionPointId !== -1) {
                    currentCloud = [selectedConnectionPointId, figureConnectionPointId];
                }
            }
            else if(end.point.near(x, y, 3)){
                Log.info("Picked the end point");
                selectedConnectionPointId = end.id;
                state = STATE_CONNECTOR_MOVE_POINT;
                HTMLCanvas.style.cursor = 'default';
                
                //this acts like clone of the connector
                var undoCmd = new ConnectorAlterCommand(selectedConnectorId); 
                History.addUndo(undoCmd);

                // check if current cloud for connection point
                figureConnectionPointId = CONNECTOR_MANAGER.connectionPointGetByXYRadius(x,y, FIGURE_CLOUD_DISTANCE, ConnectionPoint.TYPE_FIGURE, start);
                if (figureConnectionPointId !== -1) {
                    currentCloud = [selectedConnectionPointId, figureConnectionPointId];
                }
            }
            else{ //no connection point selected
                
                //see if handler selected
                if(HandleManager.handleGet(x,y) != null){
                    Log.info("onMouseDown() + STATE_CONNECTOR_SELECTED - handle selected");
                    HandleManager.handleSelectXY(x,y);
                    
                    //TODO: just copy/paste code ....this acts like clone of the connector
                    var undoCmd = new ConnectorAlterCommand(selectedConnectorId); 
                    History.addUndo(undoCmd);
                }
                else{
                    // get object under cursor
                    var selectedObject = Util.getObjectByXY(x,y);
                    switch(selectedObject.type) {
                        case 'Connector':
                            if (selectedObject.id != selectedConnectorId) { // select another Connector
                                selectedConnectorId = selectedObject.id;
                                setUpEditPanel(CONNECTOR_MANAGER.connectorGetById(selectedConnectorId));
                                redraw = true;
                            }
                            break;
                        case 'Group':
                            selectedConnectorId = -1;
                            selectedGroupId = selectedObject.id; // set Group as active element
                            state = STATE_GROUP_SELECTED;
                            setUpEditPanel(null);
                            redraw = true;
                            break;
                        case 'Figure':
                            selectedConnectorId = -1;
                            selectedFigureId = selectedObject.id; // set Figure as active element
                            state = STATE_FIGURE_SELECTED;
                            setUpEditPanel(STACK.figureGetById(selectedFigureId));
                            redraw = true;
                            break;
                        case 'Container':
                            selectedConnectorId = -1;
                            selectedContainerId = selectedObject.id; // set Container as active element
                            state = STATE_CONTAINER_SELECTED;
                            setUpEditPanel(STACK.containerGetById(selectedContainerId));
                            redraw = true;
                            break;
                        default:    // nothing else selected
                            selectedConnectorId = -1;
                            state = STATE_NONE;
                            setUpEditPanel(canvasProps); // set canvas as active element
                            redraw = true;
                            break;
                    }
                }                                                    
            }                        
            break; //end case STATE_CONNECTOR_SELECTED 
            
            
            
        case STATE_CONTAINER_SELECTED:

            /*Description:
             * If we have a Container selected and we do click here is what can happen:
             * - if we clicked a handle of current selected shape (it should be Container) then just select that Handle
             * - if we clicked a Connector, Group or than it should be selected  (Connectors, Groups and Figures are more important than Containers :p)
             * - if we clicked a Container:
             *      - did we clicked another Container?
             *          - select that Container
             *      - did we click same Container?
             *          - do nothing
             */

            if(HandleManager.handleGet(x, y) != null){ //Clicked a handler (of a Figure or Connector)
                Log.info("onMouseDown() + STATE_CONTAINER_SELECTED - handle selected");       
                /*Nothing important (??) should happen here. We just clicked the handler of the figure*/
                HandleManager.handleSelectXY(x, y);
            }
            else{
                // get object under cursor
                var selectedObject = Util.getObjectByXY(x,y);
                switch(selectedObject.type) {
                    case 'Connector':
                        selectedContainerId = -1;
                        selectedConnectorId = selectedObject.id;
                        state = STATE_CONNECTOR_SELECTED;
                        Log.info('onMouseDown() + STATE_CONTAINER_SELECTED  - change to STATE_CONNECTOR_SELECTED');
                        setUpEditPanel(CONNECTOR_MANAGER.connectorGetById(selectedConnectorId));
                        redraw = true;
                        break;
                    case 'Group':
                        selectedContainerId = -1;
                        selectedGroupId = selectedObject.id;
                        state = STATE_GROUP_SELECTED;
                        Log.info('onMouseDown() + STATE_CONTAINER_SELECTED + group selected  =>  change to STATE_GROUP_SELECTED');
                        setUpEditPanel(null);
                        redraw = true;
                        break;
                    case 'Figure':
                        selectedContainerId = -1;
                        selectedFigureId = selectedObject.id;
                        state = STATE_FIGURE_SELECTED;
                        Log.info('onMouseDown() + STATE_CONTAINER_SELECTED + lonely figure => change to STATE_FIGURE_SELECTED');
                        setUpEditPanel(STACK.figureGetById(selectedFigureId));
                        redraw = true;
                        break;
                    case 'Container':
                        if(selectedObject.id != selectedContainerId){ //a different one
                            selectedContainerId = selectedObject.id;
                            Log.info('onMouseDown() + STATE_NONE  - change to STATE_CONTAINER_SELECTED');
                            setUpEditPanel(STACK.containerGetById(selectedContainerId));
                            redraw = true;
                        }
                        break;
                    default:    // nothing else selected
                        selectedContainerId = -1;
                        state = STATE_NONE;
                        setUpEditPanel(canvasProps);
                        HandleManager.clear();
                        Log.info('onMouseDown() + STATE_CONTAINER_SELECTED + click on nothing - change to STATE_NONE');
                        redraw = true;
                        break;
                }
            }
            break; //end STATE_CONTAINER_SELECTED

            
        default:
            //alert("onMouseDown() - switch default - state is " + state);
    }

    draw();

    return false;
}


/**
 *Treats the mouse up event
 *@param {Event} ev - the event generated when key is up
 **/
function onMouseUp(ev){
    Log.info("main.js>onMouseUp()");
    
    var coords = getCanvasXY(ev);
    var x = coords[0];
    var y = coords[1];

    lastClick = [];
    mousePressed = true;
    
    switch(state){

        case STATE_NONE:
            /*Description:
             * TODO: Nothing should happen here
             */
            
            if(HandleManager.handleGetSelected()){
                HandleManager.clear();
            }
            break;
        
        /* treated on the dragging figure
        case STATE_FIGURE_CREATE:
            Log.info("onMouseUp() + STATE_FIGURE_CREATE");
            
            snapMonitor = [0,0];
            
            //treat new figure
            //do we need to create a figure on the canvas?
            if(createFigureFunction){
                Log.info("onMouseUp() + STATE_FIGURE_CREATE--> new state STATE_FIGURE_SELECTED");
                
                var cmdCreateFig = new FigureCreateCommand(createFigureFunction, x, y);
                cmdCreateFig.execute();
                History.addUndo(cmdCreateFig);
                
                HTMLCanvas.style.cursor = 'default';

                selectedConnectorId = -1;
                createFigureFunction = null;

                mousePressed = false;
                redraw = true;
            }
            else{
                Log.info("onMouseUp() + STATE_FIGURE_CREATE--> but no 'createFigureFunction'");
            }
            break;
        */
       
        case STATE_FIGURE_SELECTED:
            /*Description:
             * This means that we have a figure selected and just released the mouse:
             * - if we were altering (rotate/resize) the Figure that will stop (Handler will be deselected)
             * - if we were moving the figure .... that will stop (but figure remains selected)
             */
            
            mousePressed = false;
            HandleManager.handleSelectedIndex = -1; //reset only the handler....the Figure is still selected
                       
            break;
            
            
        case STATE_CONTAINER_SELECTED:
            /*Description:
             * This means that we have a Container selected and just released the mouse:
             * - if we were altering (rotate/resize) the Container that will stop (Handler will be deselected)
             * - if we were moving the Container .... that will stop (but figure remains selected)
             */
            
            mousePressed = false;
            HandleManager.handleSelectedIndex = -1; //reset only the handler....the Figure is still selected
                       
            break;


        case STATE_GROUP_SELECTED:
            Log.info('onMouseUp() + STATE_GROUP_SELECTED ...');
            
            mousePressed = false;
            HandleManager.handleSelectedIndex = -1; //reset only the handler....the Group is still selected
            
            break;

        case STATE_SELECTING_MULTIPLE:
            /*Description
             *From figures select only those that do not belong to any group
             **/
            Log.info('onMouseUp() + STATE_SELECTING_MULTIPLE => STATE_NONE');
            Log.info('onMouseUp() selection area: ' + selectionArea);
            
            state = STATE_NONE;
            
            var figuresToAdd = [];
            
            /* 
             * If SHIFT pressed add the new selection to the already selected figures, 
             * so here add to array already selected ones
             */            
            if(SHIFT_PRESSED){
                
                //if one figure already selected add it
                if (selectedFigureId != -1){ 
                    figuresToAdd.push(selectedFigureId);
                }
                
                //if group already selected add it
                if(selectedGroupId != -1){
                    var selectedGroup = STACK.groupGetById(selectedGroupId);
                    var groupFigures = STACK.figureGetByGroupId(selectedGroupId);
                    for(var i=0; i<groupFigures.length; i++ ){
                      figuresToAdd.push(groupFigures[i].id);
                    }
                }
            }

            //add free figures (not belonging to any group) that overlaps with selection region
            /*TODO: 
             * From Janis to Alex: Why we are selecting only figures that 
             *  doesn`t belong to any group, I think we must also add grouped 
             *  figures
             * From Alex to Janis: We do not support groups in groups neither 
             *  figures that belong to more than one group
            */
            for(var i = 0; i < STACK.figures.length; i++){
                if(STACK.figures[i].groupId == -1){ //we only want ungrouped items
                    var points = STACK.figures[i].getPoints();
                    if(points.length == 0){ //if no  point at least to add bounds TODO: lame 'catch all' condition
                        points.push( new Point(STACK.figures[i].getBounds()[0], STACK.figures[i].getBounds()[1]) ); //top left
                        points.push( new Point(STACK.figures[i].getBounds()[2], STACK.figures[i].getBounds()[3]) ); //bottom right
                        points.push( new Point(STACK.figures[i].getBounds()[0], STACK.figures[i].getBounds()[3]) ); //bottom left
                        points.push( new Point(STACK.figures[i].getBounds()[2], STACK.figures[i].getBounds()[1]) ); //top right
                    }

                    // flag shows if figure added to figuresToAdd array
                    var figureAddFlag = false;
                    
                    
                    /**Idea: We want to select both figures completely encompassed by 
                     * selection (case 1) and those that are intersected by selection (case 2)*/

                    //1 - test if any figure point inside selection
                    for(var a = 0; a < points.length; a++){
                        if( Util.isPointInside(points[a], selectionArea.getPoints()) ){
                            figuresToAdd.push(STACK.figures[i].id);
                            // set flag not to add figure twice
                            figureAddFlag = true;
                            break;
                        }
                    }
                    
                    //2 - test if any figure intersected by selection
                    if(!figureAddFlag){ //run this ONLY if is not already proposed for addition
                        figureAddFlag = Util.polylineIntersectsRectangle(points, selectionArea.getBounds(), true);
                    }
                    
                    //select figures whose line intersects selectionArea
                    if (figureAddFlag){
                        figuresToAdd.push(STACK.figures[i].id);
                    }
                } //end if
            } //end for

            if(selectedGroupId != -1){
                var selectedGroup = STACK.groupGetById(selectedGroupId);
                //destroy current group (if temporary)
                if(!selectedGroup.permanent){
                    STACK.groupDestroy(selectedGroupId);
                }
            }

            //See what to do with collected figures
            if(figuresToAdd.length >= 2){ //if we selected at least 2 figures then we can create a group
                selectedGroupId = STACK.groupCreate(figuresToAdd);
                state = STATE_GROUP_SELECTED;
                setUpEditPanel(null); //because of shift in this case we also need to reset the edit panel
                Log.info('onMouseUp() + STATE_SELECTING_MULTIPLE  + min. 2 figures => STATE_GROUP_SELECTED');
            }
            else if (figuresToAdd.length == 1){ // if we only select one figure, then it is not a group, it's a simple selection
                selectedFigureId = figuresToAdd[0];
                selectedGroupId = -1;
                state = STATE_FIGURE_SELECTED;
                Log.info('onMouseUp() + STATE_SELECTING_MULTIPLE  + 1 figure => STATE_FIGURE_SELECTED');
            }
            break;
            
            
        case STATE_CONNECTOR_PICK_SECOND:

            //store undo command
            var cmdCreateCon = new ConnectorCreateCommand(selectedConnectorId);
            History.addUndo(cmdCreateCon);
            
            //reset all {ConnectionPoint}s' color
            CONNECTOR_MANAGER.connectionPointsResetColor();

            //reset current connection cloud
            currentCloud = [];

            //select the current connector
            state = STATE_CONNECTOR_SELECTED;
            var con = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId);
            setUpEditPanel(con);
            redraw = true;
            break;

        

        case STATE_CONNECTOR_MOVE_POINT:
            /**
             *Description:
             *Simply alter the connector until mouse will be released 
             **/
            
            //reset all {ConnectionPoint}s' color
            CONNECTOR_MANAGER.connectionPointsResetColor();

            //reset current connection cloud
            currentCloud = [];

            state = STATE_CONNECTOR_SELECTED; //back to selected connector
            selectedConnectionPointId = -1; //but deselect the connection point
            redraw = true;
            break;
            
            
        case STATE_CONNECTOR_SELECTED:
            if(currentMoveUndo){
                var turns = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId).turningPoints;
                var newTurns = [turns.length];
                for(var i = 0; i < turns.length; i ++){
                    newTurns[i] = turns[i].clone();
                }
                currentMoveUndo.currentValue = newTurns;
                History.addUndo(currentMoveUndo);
                state = STATE_NONE;
                selectedConnectorId = -1;
                HandleManager.clear(); //clear current selection
            }
            break;
    }
    currentMoveUndo = null;
    mousePressed = false;
    draw();
}

/**Remembers last move. Initially it's null but once set it's a [x,y] array*/
var lastMove = null;

/**It will accumulate the changes on either X or Y coordinates for snap effect.
 *As we need to escape the "gravity/attraction" of the grid system we need to "accumulate" more changes
 *and if those changes become greater than a certain threshold we will initiate a snap action
 *Zack : "Because of the snap to grid function we need to move more than a certain amount of pixels
 *so we will not be snapped back to the old location"
 *Initially it's [0,0] but once more and more changes got added a snap effect will be triggered
 *and some of it's elements will be reset to 0.
 *So snapMonitor = [sumOfChagesOnX, sumOfChangesOnY]
 **/
var snapMonitor = [0,0];

/**Treats the mouse move event
 *@param {Event} ev - the event generated when key is up
 **/
function onMouseMove(ev){
    //    //resize canvas.
    //    if(lastMousePosition != null){
    //        resize(ev);
    //    }
    var redraw = false;
    var coords = getCanvasXY(ev);
    
    if(coords == null){
        Log.error("main.js onMouseMove() null coordinates");
        return;
    }
    
    var x = coords[0];
    var y = coords[1];
    
    var canvas = getCanvas();

    /*change cursor
     *More here: http://www.javascriptkit.com/dhtmltutors/csscursors.shtml
     */
    Log.debug("onMouseMoveCanvas: test if over a figure: " + x + "," + y);


    switch(state){

        case STATE_NONE:
            
            /*Description:
             * We are in None state when no action was done....yet.  Here is what can happen:
             * - if the mouse is pressed, through onMouseDown(), then it's the begining of a multiple selection
             * - if mouse is not pressed then change the cursor type to:
             *      - "move" if  over a figure or connector
             *      - "default" if over "over a connector "empty" space
             */
            if(mousePressed){
                state = STATE_SELECTING_MULTIPLE;
                selectionArea.points[0] = new Point(x,y);
                selectionArea.points[1] = new Point(x,y);
                selectionArea.points[2] = new Point(x,y);
                selectionArea.points[3] = new Point(x,y);//the selectionArea has no size until we start dragging the mouse
                Log.debug('onMouseMove() - STATE_NONE + mousePressed = STATE_SELECTING_MULTIPLE');
            }
            else{
                if(STACK.figureIsOver(x,y)){ //over a figure
                    canvas.style.cursor = 'move';
                    Log.debug('onMouseMove() - STATE_NONE - mouse cursor = move (over figure)');
                }
                else if(CONNECTOR_MANAGER.connectorGetByXY(x, y) != -1){ //over a connector
                    canvas.style.cursor = 'move';
                    Log.debug('onMouseMove() - STATE_NONE - mouse cursor = move (over connector)');
                }
                else if(STACK.containerGetByXY(x,y) != -1){ //container has a lower priority than figure
                    canvas.style.cursor = 'move';
                    Log.debug("onMouseMove() - STATE_NONE - mouse cursor = move (over container)");
                }
                else{ //default cursor
                    canvas.style.cursor = 'default';
                    Log.debug('onMouseMove() - STATE_NONE - mouse cursor = default');
                }
            }                                    
            
            break;


        case STATE_SELECTING_MULTIPLE:
            selectionArea.points[1].x = x; //top right

            selectionArea.points[2].x = x; //bottom right
            selectionArea.points[2].y = y;
                
            selectionArea.points[3].y = y;//bottom left
            redraw = true;
            break;

            
        case STATE_FIGURE_CREATE:
            if(createFigureFunction){ //creating a new figure
                canvas.style.cursor = 'crosshair';
            }
            break;



        case STATE_FIGURE_SELECTED:
            
            /*Description:
             * We have a figure selected.  Here is what can happen:
             * - if the mouse is pressed
             *      - if over a Figure's Handler then execute Handler's action
             *      - else (it is over the Figure)
             *          if SHIFT _NOT_ pressed
             *              then move figure
             *          else (SHIFT pressed)
             *              enter STATE_SELECTING_MULTIPLE state 
             * - if mouse is not pressed then change the cursor type to :
             *      - "move" if over a figure or connector
             *      - "handle" if over current figure's handle
             *      - "default" if over "nothing"
             */
            
            if(mousePressed){ // mouse is (at least was) pressed
                if(lastMove != null){ //we are in dragging mode
                    /*We need to use handleGetSelected() as if we are using handleGet(x,y) then 
                     *as we move the mouse....it can move faster/slower than the figure and we 
                     *will lose the Handle selection.
                     **/
                    var handle = HandleManager.handleGetSelected();
                    
                    if(handle != null){ //We are over a Handle of selected Figure               
                        canvas.style.cursor = handle.getCursor();
                        handle.action(lastMove,x,y);
                        redraw = true;
                        Log.info('onMouseMove() - STATE_FIGURE_SELECTED + drag - mouse cursor = ' + canvas.style.cursor);
                    }
                    else{ /*no handle is selected*/
                        if (!SHIFT_PRESSED){//just translate the figure                            
                            canvas.style.cursor = 'move';
                            var translateMatrix = generateMoveMatrix(STACK.figureGetById(selectedFigureId), x, y);
                            Log.info("onMouseMove() + STATE_FIGURE_SELECTED : translation matrix" + translateMatrix);
                            var cmdTranslateFigure = new FigureTranslateCommand(selectedFigureId, translateMatrix);
                            History.addUndo(cmdTranslateFigure);
                            cmdTranslateFigure.execute();
                            
                            
                            /*Algorithm described:
                            if figure belong to an existing container: 
                                if we moved it outside of current container (even partially?!)
                                        unglue it from container
                                           
                            if figure dropped inside a container
                                add it to the (new) container        
                             */
                            var figure = STACK.figureGetById(selectedFigureId);
                            var figBounds = figure.getBounds();
                            
                            var containerId = CONTAINER_MANAGER.getContainerForFigure(selectedFigureId);
                            if(containerId !== -1){ //we are glued to a container
                                                                
                                var container = STACK.containerGetById(containerId);
                                var contBounds = container.getBounds();
                                
                                //Test if figure' bounds are inside container's bounds?                                
                                if(Util.areBoundsInBounds(figBounds, contBounds)){
                                    //do nothing we are still in same container
                                }
                                else{
                                    //TODO: CONTAINER_MANAGER.removeFigure(containerId, selectedFigureId);
                                    //throw "main->onMouseMove->FigureSelected: removed from a container";
                                    CONTAINER_MANAGER.removeFigure(containerId, selectedFigureId);
                                }
                            }
                            else{ //not in any container
                                var newContainerId = -1;
                                for(var c=0; c<STACK.containers.length; c++){
                                    var tempCont = STACK.containers[c];
                                    if( Util.areBoundsInBounds(figBounds, tempCont.getBounds()) ){
                                        newContainerId = STACK.containers[c].id;
                                        break;
                                    }
                                }
                                
                                if(newContainerId !== -1){
                                    //TODO: add figure to container
                                    //throw "main->onMouseMove->FigureSelected: add figure to container";
                                    CONTAINER_MANAGER.addFigure(newContainerId, selectedFigureId);
                                }
                                
                            }
                            
                            redraw = true;
                            Log.info("onMouseMove() + STATE_FIGURE_SELECTED + drag - move selected figure");
                        }else{ //we are entering a figures selection sesssion
                            state = STATE_SELECTING_MULTIPLE;
                            selectionArea.points[0] = new Point(x,y);
                            selectionArea.points[1] = new Point(x,y);
                            selectionArea.points[2] = new Point(x,y);
                            selectionArea.points[3] = new Point(x,y);//the selectionArea has no size until we start dragging the mouse
                            redraw = true;
                            Log.info('onMouseMove() - STATE_GROUP_SELECTED + mousePressed + SHIFT => STATE_SELECTING_MULTIPLE');
                        }
                    }
                }
            }
            else{ //no mouse press (only change cursor)
                var handle = HandleManager.handleGet(x,y); //TODO: we should be able to replace it with .getSelectedHandle()
                    
                if(handle != null){ //We are over a Handle of selected Figure               
                    canvas.style.cursor = handle.getCursor();
                    Log.info('onMouseMove() - STATE_FIGURE_SELECTED + over a Handler = change cursor to: ' + canvas.style.cursor);
                }
                else{
                    /*move figure only if no handle is selected*/
                    var tmpFigId = STACK.figureGetByXY(x, y); //pick first figure from (x, y)
                    if(tmpFigId != -1){
                        canvas.style.cursor = 'move';                            
                        Log.info("onMouseMove() + STATE_FIGURE_SELECTED + over a figure = change cursor");
                    }
                    else{
                        canvas.style.cursor = 'default';                            
                        Log.info("onMouseMove() + STATE_FIGURE_SELECTED + over nothin = change cursor to default");
                    }
                }
            }
            
            break;

        case STATE_TEXT_EDITING:

            /*Description:
             * We have a text editor.  Here is what can happen:
             * - if the mouse is pressed
             *      - this should never happen
             * - if mouse is not pressed then change the cursor type to :
             *      - "move" if over a figure or connector
             *      - "handle" if over current figure's handle
             *      - "default" if over "nothing"
             */

            if (!mousePressed) {

                var handle = HandleManager.handleGet(x,y); //TODO: we should be able to replace it with .getSelectedHandle()

                if(handle != null){ //We are over a Handle of selected Figure
                    canvas.style.cursor = handle.getCursor();
                    Log.info('onMouseMove() - STATE_TEXT_EDITING + over a Handler = change cursor to: ' + canvas.style.cursor);
                }
                else{
                    /*move figure only if no handle is selected*/
                    var tmpFigId = STACK.figureGetByXY(x, y); //pick first figure from (x, y)
                    if(tmpFigId != -1){
                        canvas.style.cursor = 'move';
                        Log.info("onMouseMove() + STATE_TEXT_EDITING + over a figure = change cursor");
                    }
                    else{
                        canvas.style.cursor = 'default';
                        Log.info("onMouseMove() + STATE_TEXT_EDITING + over nothin = change cursor to default");
                    }
                }
            } else {
                throw "main:onMouseMove() - this should never happen";
            }

            break;
            
        case STATE_CONTAINER_SELECTED:
           //throw "main.js onMouseMove() + STATE_CONTAINER_SELECTED:  Not implemented";           
           
           //BRUTE COPY FROM FIGURE
           if(mousePressed){ // mouse is (at least was) pressed
                if(lastMove != null){ //we are in dragging mode
                    /*We need to use handleGetSelected() as if we are using handleGet(x,y) then 
                     *as we move the mouse....it can move faster/slower than the figure and we 
                     *will lose the Handle selection.
                     **/
                    var handle = HandleManager.handleGetSelected();
                    
                    if(handle != null){ //We are over a Handle of selected Container               
                        canvas.style.cursor = handle.getCursor();
                        handle.action(lastMove,x,y);
                        redraw = true;
                        Log.info('onMouseMove() - STATE_CONTAINER_SELECTED + drag - mouse cursor = ' + canvas.style.cursor);
                    }
                    else{ /*no handle is selected*/
//                        if (!SHIFT_PRESSED){//just translate the figure                            
                            canvas.style.cursor = 'move';
                            var translateMatrix = generateMoveMatrix(STACK.containerGetById(selectedContainerId), x, y);
                            Log.info("onMouseMove() + STATE_CONTAINER_SELECTED : translation matrix" + translateMatrix);
                            var cmdTranslateContainer = new ContainerTranslateCommand(selectedContainerId, translateMatrix);
                            History.addUndo(cmdTranslateContainer);
                            cmdTranslateContainer.execute();
                            redraw = true;
                            Log.info("onMouseMove() + STATE_CONTAINER_SELECTED + drag - move selected container");
//                        }else{ //we are entering a figures selection sesssion
//                            state = STATE_SELECTING_MULTIPLE;
//                            selectionArea.points[0] = new Point(x,y);
//                            selectionArea.points[1] = new Point(x,y);
//                            selectionArea.points[2] = new Point(x,y);
//                            selectionArea.points[3] = new Point(x,y);//the selectionArea has no size until we start dragging the mouse
//                            redraw = true;
//                            Log.info('onMouseMove() - STATE_CONTAINER_SELECTED + mousePressed + SHIFT => STATE_SELECTING_MULTIPLE');
//                        }
                    }
                }
            }
            else{ //no mouse press (only change cursor)
                var handle = HandleManager.handleGet(x,y); //TODO: we should be able to replace it with .getSelectedHandle()
                    
                if(handle != null){ //We are over a Handle of selected Figure               
                    canvas.style.cursor = handle.getCursor();
                    Log.info('onMouseMove() - STATE_CONTAINER_SELECTED + over a Handler = change cursor to: ' + canvas.style.cursor);
                }
                else{
//                    throw "main.js onMouseMove() + STATE_CONTAINER_SELECTED:  Not implemented";
                    
                    /*move figure only if no handle is selected*/
                    if(STACK.containerGetByXY(x, y) !== -1){//pick first container from (x, y)
                        canvas.style.cursor = 'move';                            
                        Log.info("onMouseMove() + STATE_CONTAINER_SELECTED + over a container's edge = change cursor");
                    }
                    else{
                        canvas.style.cursor = 'default';                            
                        Log.debug("onMouseMove() + STATE_CONTAINER_SELECTED + over nothing = change cursor to default");
                    }
                }
            }
            //END BRUTE COPY FROM FIGURE
            
           break;


        case STATE_GROUP_SELECTED:
            //Log.info('onMouseMove() - STATE_GROUP_SELECTED ...');
            /*Description:
             *TODO: implement
             * We have a group selected.  Here is what can happen:
             * - if the mouse is pressed
             *      - if over a Group's Handler then execute Handler's action
             *      - else (it is over one of Group's Figures):
             *          if SHIFT _NOT_ pressed:
             *              then move whole group
             *          else (SHIFT pressed)
             *              enter STATE_SELECTING_MULTIPLE state         
             * - if mouse is not pressed then change the cursor type to :
             *      - drag group?
             *      - cursor ? 
             *          - "move" if over a figure or connector or group
             *          - "handle" if over current group's handle
             *          - "default" if over "nothing"
             */
            
            if(mousePressed){
                if(lastMove != null){
                    //Log.debug('onMouseMove() - STATE_GROUP_SELECTED + mouse pressed');
                    /*We need to use handleGetSelected() as if we are using handleGet(x,y) then 
                     *as we move the mouse....it can move faster/slower than the figure and we 
                     *will lose the Handle selection.
                     **/
                    var handle = HandleManager.handleGetSelected();
                    
                    if(handle != null){ //over a handle
                        Log.info('onMouseMove() - STATE_GROUP_SELECTED + mouse pressed  + over a Handle');
                        //HandleManager.handleSelectXY(x, y);
                        canvas.style.cursor = handle.getCursor();
                        handle.action(lastMove, x, y);
                        redraw = true;
                    }
                    else{ //not over any handle -so it must be translating
                        if (!SHIFT_PRESSED){
                            Log.info('onMouseMove() - STATE_GROUP_SELECTED + mouse pressed + NOT over a Handle');
                            canvas.style.cursor = 'move';
                            var mTranslate = generateMoveMatrix(STACK.groupGetById(selectedGroupId), x, y);
                            var cmdTranslateGroup = new GroupTranslateCommand(selectedGroupId, mTranslate);
                            cmdTranslateGroup.execute();
                            History.addUndo(cmdTranslateGroup);
                            redraw = true;
                        }else{
                            state = STATE_SELECTING_MULTIPLE;
                            selectionArea.points[0] = new Point(x,y);
                            selectionArea.points[1] = new Point(x,y);
                            selectionArea.points[2] = new Point(x,y);
                            selectionArea.points[3] = new Point(x,y);//the selectionArea has no size until we start dragging the mouse
                            redraw = true;
                            Log.info('onMouseMove() - STATE_GROUP_SELECTED + mousePressed + SHIFT => STATE_SELECTING_MULTIPLE');
                        }
                    }
                }
            }
            else{ //mouse not pressed (only change cursor)
                Log.debug('onMouseMove() - STATE_GROUP_SELECTED + mouse NOT pressed');
                if(HandleManager.handleGet(x,y) != null){
                    canvas.style.cursor = HandleManager.handleGet(x,y).getCursor();
                }
                else if(CONNECTOR_MANAGER.connectorGetByXY(x, y) != -1){
                    //nothing for now
                }
                else if(STACK.figureIsOver(x,y)){
                    canvas.style.cursor = 'move';
                }
                else{
                    canvas.style.cursor = 'default';
                }
            }                       

            break;

            
        case STATE_CONNECTOR_PICK_FIRST:
            //change FCP (figure connection points) color
            var fCpId = CONNECTOR_MANAGER.connectionPointGetByXY(x, y, ConnectionPoint.TYPE_FIGURE); //find figure's CP

            if(fCpId != -1){ //we are over a figure's CP
                var fCp = CONNECTOR_MANAGER.connectionPointGetById(fCpId);
                fCp.color = ConnectionPoint.OVER_COLOR;
                //                canvas.style.cursor = 'crosshair';
                selectedConnectionPointId = fCpId;
            }
            else{ //change back old connection point to normal color
                if(selectedConnectionPointId != -1){
                    var oldCp = CONNECTOR_MANAGER.connectionPointGetById(selectedConnectionPointId);
                    oldCp.color = ConnectionPoint.NORMAL_COLOR;
                    //                    canvas.style.cursor = 'normal';
                    selectedConnectionPointId = -1;
                }
            }
            redraw = true;
            break;


        case STATE_CONNECTOR_PICK_SECOND:
            //moved to allow undo to access it
            connectorPickSecond(x,y,ev);
            redraw = true;
            break;


        case STATE_CONNECTOR_SELECTED:
            /*Description:
             *In case you move the mouse and you have the connector selected:
             *  - if adjusting the endpoints
             *      - alter the shape of connector in real time (gluing and unglued it, etc)
             *      (EXTRA option: do as little changes as possible to existing shape
             *  - if adjusting the handlers
             *      - alter the shape of connector in real time
             **/
            
            //alert('Move but we have a connector');
            //change cursor to move if over a connector's CP
            //var connector = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId);
            var cps = CONNECTOR_MANAGER.connectionPointGetAllByParent(selectedConnectorId);
            var start = cps[0];
            var end = cps[1];
            if(start.point.near(x, y, 3) || end.point.near(x, y, 3)){
                canvas.style.cursor = 'move';
            }
            else if(HandleManager.handleGet(x,y) != null){ //over a handle?. Handles should appear only for selected figures
                canvas.style.cursor = HandleManager.handleGet(x,y).getCursor();
            }
            else{
                canvas.style.cursor = 'default';
            }
            
            /*if we have a handle action*/
            if(mousePressed==true && lastMove != null && HandleManager.handleGetSelected() != null){
                Log.info("onMouseMove() + STATE_CONNECTOR_SELECTED - trigger a handler action");
                var handle = HandleManager.handleGetSelected();
//                alert('Handle action');

                /*We need completely new copies of the turningPoints in order to restore them,
                 *this is simpler than keeping track of the handle used, the direction in which the handle edits
                 *and the turningPoints it edits*/

                //store old turning points
                var turns = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId).turningPoints;
                var oldTurns = [turns.length];
                for(var i = 0; i < turns.length; i++){
                    oldTurns[i] = turns[i].clone();
                }


                //DO the handle action
                handle.action(lastMove,x,y);

                //store new turning points
                turns = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId).turningPoints;
                var newTurns = [turns.length];
                for(var i = 0; i < turns.length; i++){
                    newTurns[i] = turns[i].clone();
                }


                //see if old turning points are the same as the new turning points
                var difference = false;
                for(var k=0;k<newTurns.length; k++){
                    if(! newTurns[k].equals(oldTurns[k])){
                        difference = true;
                    }
                }

//                //store the Command in History
//                if(difference && doUndo){
//                    currentMoveUndo = new ConnectorHandleCommand(selectedConnectorId, History.OBJECT_CONNECTOR, null, oldTurns, newTurns);
//                    History.addUndo(currentMoveUndo);
//                }

                redraw = true;
            }
            break;


        case STATE_CONNECTOR_MOVE_POINT:
            /**
             *Description: 
             *Adjust on real time - WYSIWYG
             *-compute the solution
             *-update connector shape
             *-update glues
             *TODO: add description*/
            Log.info("Easy easy easy....it's fragile");
            if(mousePressed){ //only if we are dragging
                
                /*update connector - but not unglue/glue it (Unglue and glue is handle in onMouseUp)
                 *as we want the glue-unglue to produce only when mouse is released*/   
                connectorMovePoint(selectedConnectionPointId, x, y, ev);

                redraw = true;
            }
            break;
    }


    lastMove = [x, y];
    
    if(redraw){
        draw();
    }
    return false;
}


/**Treats the mouse double click event
 *@param {Event} ev - the event generated when key is clicked twice
 *@author Artyom, Alex
 **/
function onDblClick(ev) {
    var coords = getCanvasXY(ev);
    var x = coords[0];
    var y = coords[1];
    lastClick = [x,y];

    // store clicked figure or connector
    var shape = null;

    // store id value (from Stack) of clicked text primitive
    var textPrimitiveId = -1;


    /*Description:
     *In case you double clicked the mouse:
     *  - if clicked a connector
     *          - save connector to shape
     *          - save id value of text primitive (0 by default) to textPrimitiveId
     *  - else
     *      - if clicked a text inside connector
     *          - save connector to shape
     *          - save id value of text primitive (0 by default) to textPrimitiveId
     *      - else
     *          - if clicked a figure
     *              - if clicked a text primitive of figure
     *                  - save figure to shape
     *                  - save id value of text primitive to textPrimitiveId
     *  - if connector, text primitive inside connector or figure clicked
     *          - if group selected
     *              - if group is temporary then destroy it
     *              - deselect current group
     *          - deselect current figure
     *          - deselect current connector
     *          - set current state as STATE_TEXT_EDITING
     *          - set up text editor and assign it to currentTextEditor variable
     *  - else do nothing
     **/

    //find Connector at (x,y)
    var cId = CONNECTOR_MANAGER.connectorGetByXY(x, y);
    var connector = null;

    // check if we clicked a connector
    if(cId != -1){
        connector = CONNECTOR_MANAGER.connectorGetById(cId);
        shape = connector;
        textPrimitiveId = 0; // (0 by default)
    } else {
        cId = CONNECTOR_MANAGER.connectorGetByTextXY(x, y);
        
        // check if we clicked a text of connector
        if (cId != -1) {
            connector = CONNECTOR_MANAGER.connectorGetById(cId);
            shape = connector;
            textPrimitiveId = 0; // (0 by default)
        } else {
            //find Figure at (x,y)
            var fId = STACK.figureGetByXY(x,y);

            // check if we clicked a figure
            if (fId != -1) {
                var figure = STACK.figureGetById(fId);
                var tId = STACK.textGetByFigureXY(fId, x, y);

                // if we clicked text primitive inside of figure
                if (tId !== -1) {
                    shape = figure;
                    textPrimitiveId = tId;
                }
            } else {
                //find Container at (x,y)
                var contId = STACK.containerGetByXY(x, y);

                // check if we clicked a container
                if(contId !== -1){
                    var container = STACK.containerGetById(contId);
                    var tId = STACK.textGetByContainerXY(contId, x, y);

                    // if we clicked text primitive inside of figure
                    if (tId !== -1) {
                        shape = container;
                        textPrimitiveId = tId;
                    }
                }
            }
        }
    }

    // check if we clicked a text primitive inside of shape
    if (textPrimitiveId != -1) {
        // if group selected
        if (state == STATE_GROUP_SELECTED) {
            var selectedGroup = STACK.groupGetById(selectedGroupId);

            // if group is temporary then destroy it
            if(!selectedGroup.permanent){
                STACK.groupDestroy(selectedGroupId);
            }

            //deselect current group
            selectedGroupId = -1;
        }

        // deselect current figure
        selectedFigureId = -1;

        // deselect current container
        selectedContainerId = -1;

        // deselect current connector
        selectedConnectorId = -1;

        // set current state
        state = STATE_TEXT_EDITING;

        // set up text editor
        setUpTextEditorPopup(shape, textPrimitiveId);
        redraw = true;
    }

    draw();

    return false;
}


/**Pick the first connector we can get at (x,y) position
 *@param {Number} x - the x position 
 *@param {Number} y - the y position 
 *@param {Event} ev - the event triggered
 *@author Alex, Artyom
 **/
function connectorPickFirst(x, y, ev){
    Log.group("connectorPickFirst");
    //create connector
    var conId = CONNECTOR_MANAGER.connectorCreate(new Point(x, y),new Point(x+10,y+10) /*fake cp*/, connectorType);
    selectedConnectorId = conId;
    var con = CONNECTOR_MANAGER.connectorGetById(conId);
    

    //TRY TO GLUE IT
    //1.get CP of the connector
    var conCps = CONNECTOR_MANAGER.connectionPointGetAllByParent(conId);

    //get Figure's id if over it
    var fOverId = STACK.figureGetByXY(x,y);
    //get the ConnectionPoint's id if we are over it (and belonging to a figure)
    var fCpOverId = CONNECTOR_MANAGER.connectionPointGetByXY(x, y, ConnectionPoint.TYPE_FIGURE); //find figure's CP

    //see if we can snap to a figure
    if(fCpOverId != -1){ //Are we over a ConnectionPoint from a Figure?
        var fCp = CONNECTOR_MANAGER.connectionPointGetById(fCpOverId);

        //update connector' cp
        conCps[0].point.x = fCp.point.x;
        conCps[0].point.y = fCp.point.y;

        //update connector's turning point
        con.turningPoints[0].x = fCp.point.x;
        con.turningPoints[0].y = fCp.point.y;

        var g = CONNECTOR_MANAGER.glueCreate(fCp.id, conCps[0].id, false);
        Log.info("First glue created : " + g);
        //alert('First glue ' + g);
    } else if (fOverId !== -1) { //Are we, at least, over the {Figure}?
        
        /*As we are over a {Figure} but not over a {ConnectionPoint} we will switch
         * to automatic connection*/
        var point = new Point(x,y);
        var candidate = CONNECTOR_MANAGER.getClosestPointsOfConnection(
            true,    // automatic start
            true,    // automatic end 
            fOverId, //start figure's id
            point,   //start point 
            fOverId, //end figure's id
            point    //end point
        );

        var connectionPoint = candidate[0];

        //update connector' cp
        conCps[0].point.x = conCps[1].point.x = connectionPoint.x;
        conCps[0].point.y = conCps[1].point.y = connectionPoint.y;

        //update connector's turning point
        con.turningPoints[0].x = con.turningPoints[1].x = connectionPoint.x;
        con.turningPoints[0].y = con.turningPoints[1].y = connectionPoint.y;

        var g = CONNECTOR_MANAGER.glueCreate(candidate[2], conCps[0].id, true);
        Log.info("First glue created : " + g);
    }
    state = STATE_CONNECTOR_PICK_SECOND;
    Log.groupEnd();
}


/**Pick the second {ConnectorPoint}  we can get at (x,y) position
 *@param {Number} x - the x position 
 *@param {Number} y - the y position 
 *@param {Event} ev - the event triggered
 **/
function connectorPickSecond(x, y, ev){
    Log.group("main: connectorPickSecond");
    
    //current connector
    var con = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId); //it should be the last one
    var cps = CONNECTOR_MANAGER.connectionPointGetAllByParent(con.id);

    //get the ConnectionPoint's id if we are over it (and belonging to a figure)
    var fCpOverId = CONNECTOR_MANAGER.connectionPointGetByXY(x, y, ConnectionPoint.TYPE_FIGURE); //find figure's CP
    //get Figure's id if over it
    var fOverId = STACK.figureGetByXY(x,y);

    //TODO: remove 
    //play with algorithm
    {
        //We will try to find the startFigure, endFigure, startPoint, endPoint, etc
        //start point
        var rStartPoint = con.turningPoints[0].clone();
        var rStartGlues = CONNECTOR_MANAGER.glueGetBySecondConnectionPointId(cps[0].id);
        var rStartFigure = STACK.figureGetAsFirstFigureForConnector(con.id);
        if(rStartFigure){
            Log.info(":) WE HAVE A START FIGURE id = " + rStartFigure.id);
        }
        else{
            Log.info(":( WE DO NOT HAVE A START FIGURE");
        }
        
        //end point
        var rEndPoint = new Point(x, y);
        var rEndFigure = null;

        if(fCpOverId != -1){ //Are we over a ConnectionPoint from a Figure?
            var r_figureConnectionPoint = CONNECTOR_MANAGER.connectionPointGetById(fCpOverId);
            Log.info("End Figure's ConnectionPoint present id = " + fCpOverId);
            
            //As we found the connection point by a vicinity (so not exactly x,y match) we will adjust the end point too
            rEndPoint = r_figureConnectionPoint.point.clone();
            
            rEndFigure = STACK.figureGetById(r_figureConnectionPoint.parentId);
            Log.info(":) WE HAVE AN END FIGURE id = " + rEndFigure.id);
        } else if (fOverId != -1) {  //Are we, at least, over a Figure?
            Log.info("End Figure connected as automatic");

            rEndPoint = new Point(x,y);

            rEndFigure = STACK.figureGetById(fOverId);
            Log.info(":) WE HAVE AN END FIGURE id = " + rEndFigure.id);
        } else{
            Log.info(":( WE DO NOT HAVE AN END FIGURE " );
        }
        
        var rStartBounds = rStartFigure ? rStartFigure.getBounds() : null;
        var rEndBounds = rEndFigure ? rEndFigure.getBounds() : null;


        // if start point has automatic glue => connection has automatic start
        var automaticStart = rStartGlues.length > 0 && rStartGlues[0].automatic;

        // if end point is over a {Figure}'s {ConnectionPoint} => connection is not automatic
        // else if end point is over a {Figure} -> connection has automatic end
        //      else -> connection has no automatic end
        var automaticEnd = fCpOverId != -1 ? false : fOverId != -1;

        var candidate = CONNECTOR_MANAGER.getClosestPointsOfConnection(
            automaticStart, //start automatic
            automaticEnd, //end automatic
            rStartFigure ? rStartFigure.id : -1, //start figure's id
            rStartPoint, //start figure's point
            rEndFigure ? rEndFigure.id : -1, //end figure's id
            rEndPoint //end figure's point
            );
        
        DIAGRAMO.debugSolutions = CONNECTOR_MANAGER.connector2Points(
            con.type, 
            candidate[0], /*Start point*/
            candidate[1], /*End point*/
            rStartBounds, 
            rEndBounds
        );

    }
    
    //end remove block

    //COLOR MANAGEMENT FOR {ConnectionPoint}
    //Find any {ConnectionPoint} from a figure at (x,y). Change FCP (figure connection points) color
    if (fCpOverId != -1 || fOverId != -1) { //Are we over a ConnectionPoint from a Figure or over a Figure?
        cps[1].color = ConnectionPoint.OVER_COLOR;
    } else {
        cps[1].color = ConnectionPoint.NORMAL_COLOR;
    }

    
    var firstConPoint = CONNECTOR_MANAGER.connectionPointGetFirstForConnector(selectedConnectorId);
    var secConPoint = CONNECTOR_MANAGER.connectionPointGetSecondForConnector(selectedConnectorId);
    //adjust connector
    Log.info("connectorPickSecond() -> Solution: " + DIAGRAMO.debugSolutions[0][2]);
    
    con.turningPoints = Point.cloneArray(DIAGRAMO.debugSolutions[0][2]);
    //CONNECTOR_MANAGER.connectionPointGetFirstForConnector(selectedConnectorId).point = con.turningPoints[0].clone();
    firstConPoint.point = con.turningPoints[0].clone();
    secConPoint.point = con.turningPoints[con.turningPoints.length-1].clone();

    // MANAGE TEXT
    // update position of connector's text
    con.updateMiddleText();

    // before defining of {ConnectionPoint}'s position we reset currentCloud
    currentCloud = [];
        
    //GLUES MANAGEMENT
    //remove all previous glues to {Connector}'s second {ConnectionPoint}
    CONNECTOR_MANAGER.glueRemoveAllBySecondId(secConPoint.id);

    //recreate new glues and currentCloud if available
    if(fCpOverId != -1){ //Are we over a ConnectionPoint from a Figure?
        CONNECTOR_MANAGER.glueCreate(fCpOverId, CONNECTOR_MANAGER.connectionPointGetSecondForConnector(selectedConnectorId).id, false);
    } else if(fOverId != -1){ //Are we, at least, over a Figure?
        CONNECTOR_MANAGER.glueCreate(candidate[3]/*end Figure's ConnectionPoint Id*/, CONNECTOR_MANAGER.connectionPointGetSecondForConnector(selectedConnectorId).id, true);
    } else { //No ConnectionPoint, no Figure (I'm lonely)
        fCpOverId = CONNECTOR_MANAGER.connectionPointGetByXYRadius(x,y, FIGURE_CLOUD_DISTANCE, ConnectionPoint.TYPE_FIGURE, firstConPoint);
        if(fCpOverId !== -1){
            currentCloud = [fCpOverId, secConPoint.id];
        }
    }
    
    Log.groupEnd();
}


/**
 *Alter the {Connector}  in real time
 *@param {Number} connectionPointId - the id of the current dragged {ConnectionPoint} 
 *@param {Number} x - the x position 
 *@param {Number} y - the y position 
 *@param {Event} ev - the event triggered
 **/
function connectorMovePoint(connectionPointId, x, y, ev){
    Log.group("main: connectorMovePoint");


    //current connector
    var con = CONNECTOR_MANAGER.connectorGetById(selectedConnectorId);
    var cps = CONNECTOR_MANAGER.connectionPointGetAllByParent(con.id);

    //get the ConnectionPoint's id if we are over it (and belonging to a figure)
    var fCpOverId = CONNECTOR_MANAGER.connectionPointGetByXY(x,y, ConnectionPoint.TYPE_FIGURE);

    //get Figure's id if over it
    var fOverId = STACK.figureGetByXY(x,y);

    // MANAGE TEXT
    // update position of connector's text
    con.updateMiddleText();
    
    //MANAGE COLOR
    //update cursor if over a figure's cp
    if(fCpOverId != -1 || fOverId != -1){ //Are we over a ConnectionPoint from a Figure or over a Figure?
        //canvas.style.cursor = 'default';
        if(cps[0].id == selectedConnectionPointId){
            cps[0].color = ConnectionPoint.OVER_COLOR;
        }
        else{
            cps[1].color = ConnectionPoint.OVER_COLOR;
        }
    }
    else{
        //canvas.style.cursor = 'move';
        if(cps[0].id == selectedConnectionPointId){
            cps[0].color = ConnectionPoint.NORMAL_COLOR;
        }
        else{
            cps[1].color = ConnectionPoint.NORMAL_COLOR;
        }
    }

    /*Variables used in finding solution. As we only know the ConnectionPoint's id
     * (connectionPointId) and the location of event (x,y) we need to find
     * who is the start Figure, end Figure, starting Glue, ending Glue, etc*/
    var rStartPoint = con.turningPoints[0].clone();
    var rStartFigure = null; //starting figure (it can be null - as no Figure)
    var rEndPoint = con.turningPoints[con.turningPoints.length-1].clone();
    var rEndFigure = null; //ending figure (it can be null - as no Figure)
    var rStartGlues = CONNECTOR_MANAGER.glueGetBySecondConnectionPointId(cps[0].id);
    var rEndGlues = CONNECTOR_MANAGER.glueGetBySecondConnectionPointId(cps[1].id);

    // before solution we reset currentCloud
    currentCloud = [];
    
    if(cps[0].id == connectionPointId){ //FIRST POINT
        if(fCpOverId != -1){ //Are we over a ConnectionPoint from a Figure?
            var r_figureConnectionPoint = CONNECTOR_MANAGER.connectionPointGetById(fCpOverId);
                
            //start point and figure
            rStartPoint = r_figureConnectionPoint.point.clone();                
            rStartFigure = STACK.figureGetById(r_figureConnectionPoint.parentId);
        }     
        else if (fOverId != -1) { //Are we, at least, over a Figure?
            //start point and figure
            rStartPoint = new Point(x, y);
            rStartFigure = STACK.figureGetById(fOverId);
        } else {
            rStartPoint = new Point(x, y);
        }
         
        //end figure
        rEndFigure = STACK.figureGetAsSecondFigureForConnector(con.id);


        var rStartBounds = rStartFigure ? rStartFigure.getBounds() : null;
        var rEndBounds = rEndFigure ? rEndFigure.getBounds() : null;

        /** define connection type **/
        // if end point has automatic glue -> connection has automatic end
        var automaticEnd = rEndGlues.length && rEndGlues[0].automatic;

        // if start point is over figure's connection point -> connection has no automatic start
        // else if start point is over figure -> connection has automatic start
        //      else -> connection has no automatic start
        var automaticStart = fCpOverId != -1 ? false : fOverId != -1;

        var candidate = CONNECTOR_MANAGER.getClosestPointsOfConnection(
            automaticStart, //start automatic
            automaticEnd, //end automatic
            rStartFigure ? rStartFigure.id : -1, //start figure's id
            rStartPoint, //start figure's point
            rEndFigure ? rEndFigure.id : -1, //end figure's id
            rEndPoint //end figure's point
        );

        //solutions
        DIAGRAMO.debugSolutions = CONNECTOR_MANAGER.connector2Points(con.type, candidate[0], candidate[1], rStartBounds, rEndBounds);


        //UPDATE CONNECTOR 
        var firstConPoint = CONNECTOR_MANAGER.connectionPointGetFirstForConnector(selectedConnectorId);
        var secondConPoint = CONNECTOR_MANAGER.connectionPointGetSecondForConnector(selectedConnectorId);
        //adjust connector
        Log.info("connectorMovePoint() -> Solution: " + DIAGRAMO.debugSolutions[0][2]);

        con.turningPoints = Point.cloneArray(DIAGRAMO.debugSolutions[0][2]);
        
        firstConPoint.point = con.turningPoints[0].clone();
        secondConPoint.point = con.turningPoints[con.turningPoints.length - 1].clone();



        //GLUES MANAGEMENT
        //remove all previous glues to {Connector}'s second {ConnectionPoint}
        CONNECTOR_MANAGER.glueRemoveAllBySecondId(firstConPoint.id);

        //recreate new glues and currentCloud if available
        if(fCpOverId != -1){ //Are we over a ConnectionPoint from a Figure?
            CONNECTOR_MANAGER.glueCreate(fCpOverId, firstConPoint.id, false);
        } else if(fOverId != -1){ //Are we, at least, over a Figure?
            CONNECTOR_MANAGER.glueCreate(candidate[2], firstConPoint.id, true);
        } else {
            fCpOverId = CONNECTOR_MANAGER.connectionPointGetByXYRadius(x,y, FIGURE_CLOUD_DISTANCE, ConnectionPoint.TYPE_FIGURE, secondConPoint);
            if(fCpOverId !== -1){
                currentCloud = [fCpOverId, firstConPoint.id];
            }
        }
    }     
    else if (cps[1].id == connectionPointId){ //SECOND POINT
        if(fCpOverId != -1){ //Are we over a ConnectionPoint from a Figure?
            var r_figureConnectionPoint = CONNECTOR_MANAGER.connectionPointGetById(fCpOverId);
                
            //end point and figure
            rEndPoint = r_figureConnectionPoint.point.clone();                
            rEndFigure = STACK.figureGetById(r_figureConnectionPoint.parentId);
        }
        else if (fOverId != -1) { //Are we, at least, over a Figure?
            //end point and figure
            rEndPoint = new Point(x, y);
            rEndFigure = STACK.figureGetById(fOverId);
        } else {
            rEndPoint = new Point(x, y);
        }
         
        //start figure
        rStartFigure = STACK.figureGetAsFirstFigureForConnector(con.id);


        var rStartBounds = rStartFigure ? rStartFigure.getBounds() : null;
        var rEndBounds = rEndFigure ? rEndFigure.getBounds() : null;


        /** define connection type **/
        // if start point has automatic glue -> connection has automatic start
        var automaticStart = rStartGlues.length && rStartGlues[0].automatic;

        // if end point is over figure's connection point -> connection has no automatic end
        // else if end point is over figure -> connection has automatic end
        //      else -> connection has no automatic end
        var automaticEnd = fCpOverId != -1 ? false : fOverId != -1;

        var candidate = CONNECTOR_MANAGER.getClosestPointsOfConnection(
            automaticStart, //start automatic
            automaticEnd, //end automatic
            rStartFigure ? rStartFigure.id : -1, //start figure's id
            rStartPoint, //start figure's point
            rEndFigure ? rEndFigure.id : -1, //end figure's id
            rEndPoint //end figure point
        );

        //solutions
        DIAGRAMO.debugSolutions = CONNECTOR_MANAGER.connector2Points(con.type, candidate[0], candidate[1], rStartBounds, rEndBounds);


        //UPDATE CONNECTOR
        var firstConPoint = CONNECTOR_MANAGER.connectionPointGetFirstForConnector(selectedConnectorId);
        var secondConPoint = CONNECTOR_MANAGER.connectionPointGetSecondForConnector(selectedConnectorId);
        
        //adjust connector
        Log.info("connectorMovePoint() -> Solution: " + DIAGRAMO.debugSolutions[0][2]);

        con.turningPoints = Point.cloneArray(DIAGRAMO.debugSolutions[0][2]);
        firstConPoint.point = con.turningPoints[0].clone();
        secondConPoint.point = con.turningPoints[con.turningPoints.length - 1].clone();


        //GLUES MANAGEMENT
        //remove all previous glues to {Connector}'s second {ConnectionPoint}
        CONNECTOR_MANAGER.glueRemoveAllBySecondId(secondConPoint.id);

        //recreate new glues and currentCloud if available
        if(fCpOverId != -1){ //Are we over a ConnectionPoint from a Figure?
            CONNECTOR_MANAGER.glueCreate(fCpOverId, secondConPoint.id, false);
        } else if(fOverId != -1){ //Are we, at least, over a Figure?
            CONNECTOR_MANAGER.glueCreate(candidate[3], secondConPoint.id, true);
        } else {
            fCpOverId = CONNECTOR_MANAGER.connectionPointGetByXYRadius(x,y, FIGURE_CLOUD_DISTANCE, ConnectionPoint.TYPE_FIGURE, firstConPoint);
            if(fCpOverId !== -1){
                currentCloud = [fCpOverId, secondConPoint.id];
            }
        }
    } else{
        throw "main:connectorMovePoint() - this should never happen";
    }   
    
    
    Log.groupEnd();
}


/** Creates a moving matrix taking into consideration the snapTo option
 * The strange stuff is that Dia (http://projects.gnome.org/dia/) is using a top/left align
 * but OpenOffice's Draw is using something similar to Diagramo
 * @return {Matrix} - translation matrix
 * @param {Object} fig - could be a figure, or a Connector
 * @param {Number} x - mouse position
 * @param {Number} y - mouse position
 * @author Zack Newsham
 * @author Alex Gheorghiu
 */
function generateMoveMatrix(fig, x,y){
    //    Log.group("generateMoveMatrix");
    if(typeof x === 'undefined'){
        throw "Exception in generateMoveMatrix, x is undefined";
    }
    
    if(typeof y === 'undefined'){
        throw "Exception in generateMoveMatrix,  is undefined";
    }
    
    Log.info("main.js --> generateMoveMatrix x:" + x + ' y:' + y + ' lastMove=[' + lastMove + ']' );
    var dx = x - lastMove[0];
    var dy = y - lastMove[1];
    //    Log.info("generateMoveMatrix() - delta  " + dx + ',  ' + dy);
    
    var moveMatrix = null;
        
    if(snapTo){ //snap effect
        moveMatrix = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
        ];
                    
        //Log.info("generateMoveMatrix() - old snapMonitor : " + snapMonitor);
        //Log.info("generateMoveMatrix() - dx : " + dx + " dy: " + dy);
        snapMonitor[0] += dx;
        snapMonitor[1] += dy;
        //Log.info("generateMoveMatrix() - new snapMonitor : " + snapMonitor);
        //Log.info("generateMoveMatrix() - figure bounds : " + fig.getBounds());

        var jump = GRIDWIDTH / 2; //the figure will jump half of grid cell width
        
        //HORIZONTAL
        if(dx != 0){ //dragged to right
            
            /*Idea:
             *As you move the shape to right it might snap to next snap line  
             *regarding figure's start bounds (startNextGridX)
             *or snap to the snap line regarding figure's end bounds (endNextGridX)
             *We just need to see to which snap line will actually snap (the one that is closer)
             **/
                       
            var startGridX = ( Math.floor( (fig.getBounds()[0] + snapMonitor[0])  / jump ) + 1 ) * jump;            
            var deltaStart = startGridX - fig.getBounds()[0];
//            Log.info("snapMonitor: [" + snapMonitor +  "] Start grid X: " + startGridX + "Figure start x: " + fig.getBounds()[0] + " deltaStart: " + deltaStart );
            
            
            
            var endGridX = (Math.floor( (fig.getBounds()[2] + snapMonitor[0])  / jump ) + 1) * jump;
            var deltaEnd = endGridX - fig.getBounds()[2];
            
            if(deltaStart < deltaEnd){
                if( fig.getBounds()[0] + snapMonitor[0]  >= startGridX - SNAP_DISTANCE ){
                    moveMatrix[0][2] = deltaStart;
                    snapMonitor[0] -= deltaStart;
                }
                else if( fig.getBounds()[2] + snapMonitor[0]  >= endGridX - SNAP_DISTANCE ){ 
                    moveMatrix[0][2] = deltaEnd;
                    snapMonitor[0] -= deltaEnd;
                }
            }
            else{
                if( fig.getBounds()[2] + snapMonitor[0]  >= endGridX - SNAP_DISTANCE ){ 
                    moveMatrix[0][2] = deltaEnd;
                    snapMonitor[0] -= deltaEnd;
                }
                else if( fig.getBounds()[0] + snapMonitor[0]  >= startGridX - SNAP_DISTANCE ){
                    moveMatrix[0][2] = deltaStart;
                    snapMonitor[0] -= deltaStart;
                }
            }            
        }


        //VERTICAL
        if(dy != 0){ //dragged to bottom
            var upperGridY = ( Math.floor( (fig.getBounds()[1] + snapMonitor[1])  / jump ) + 1 ) * jump;            
            var deltaUpper = upperGridY - fig.getBounds()[1];
//            Log.info("snapMonitor: [" + snapMonitor +  "] Upper grid Y: " + upperGridY + "Figure start y: " + fig.getBounds()[1] + " deltaUpper: " + deltaUpper );
            
            
            
            var lowerGridY = (Math.floor( (fig.getBounds()[3] + snapMonitor[1])  / jump ) + 1) * jump;
            var deltaLower = lowerGridY - fig.getBounds()[3];
            
            if(deltaUpper < deltaLower){
                if( fig.getBounds()[1] + snapMonitor[1]  >= upperGridY - SNAP_DISTANCE ){
                    moveMatrix[1][2] = deltaUpper;
                    snapMonitor[1] -= deltaUpper;
                }
                else if( fig.getBounds()[3] + snapMonitor[1]  >= lowerGridY - SNAP_DISTANCE ){ 
                    moveMatrix[1][2] = deltaLower;
                    snapMonitor[1] -= deltaLower;
                }
            }
            else{
                if( fig.getBounds()[3] + snapMonitor[1]  >= lowerGridY - SNAP_DISTANCE ){ 
                    moveMatrix[1][2] = deltaLower;
                    snapMonitor[1] -= deltaLower;
                }
                else if( fig.getBounds()[1] + snapMonitor[1]  >= upperGridY - SNAP_DISTANCE ){
                    moveMatrix[1][2] = deltaUpper;
                    snapMonitor[1] -= deltaUpper;
                }
            }               
        }


    //Log.info("generateMoveMatrix() - 'trimmed' snapMonitor : " + snapMonitor);
        
    } else{ //normal move
        moveMatrix = [
        [1, 0, dx],
        [0, 1, dy],
        [0, 0, 1]
        ];
    }

    Log.groupEnd();
    return moveMatrix;
}


/**Computes the bounds of the canvas
 **@return {Array} of {Integer} - [xStart, yStart, xEnd, yEnd]
 **/
function getCanvasBounds(){
    var canvasMinX = $("#a").offset().left;
    var canvasMaxX = canvasMinX + $("#a").width();
    
    var canvasMinY = $("#a").offset().top;
    var canvasMaxY = canvasMinY + $("#a").height();

    return [canvasMinX, canvasMinY, canvasMaxX, canvasMaxY];
}

/**Computes the (x,y) coordinates of an event in page
 *@param {Event} ev - the event
 **/
function getBodyXY(ev){
    return [ev.pageX,ev.pageY];//TODO: add scroll
}


/**
 *Extracts the X and Y from an event (for canvas)
 *@param {Event} ev - the event
 *@return {Array} of {Integer} - or null if event not inside the canvas
 **/
function getCanvasXY(ev){
    var position = null;
    var canvasBounds = getCanvasBounds();
//    Log.group("main.js->getCanvasXY()");
    Log.debug("Canvas bounds: [" + canvasBounds + ']');
    
    var tempPageX = null;
    var tempPageY = null;
    
    if(ev.touches){ //iPad 
        if(ev.touches.length > 0){
            tempPageX = ev.touches[0].pageX;
            tempPageY = ev.touches[0].pageY;
        }
    }
    else{ //normal Desktop
        tempPageX = ev.pageX; //Retrieves the x-coordinate of the mouse pointer relative to the top-left corner of the document.
        tempPageY = ev.pageY; //Retrieves the y-coordinate of the mouse pointer relative to the top-left corner of the document.          
        Log.debug("ev.pageX:" + ev.pageX + " ev.pageY:" + ev.pageY);
    }
    
    if(canvasBounds[0] <= tempPageX && tempPageX <= canvasBounds[2]
        && canvasBounds[1] <= tempPageY && tempPageY <= canvasBounds[3])
    {
//        Log.info('Inside canvas');
        position = [tempPageX - $("#a").offset().left, tempPageY - $("#a").offset().top];
        //alert("getXT : " + position);
    }
//    Log.groupEnd();

    return position;
}

/**Buffered image for background of canvas
 * It is set to null in CanvasProps::sync() method*/
var backgroundImage = null;

/**Adds a background to a canvas
 * @param {HTMLCanvasElement} canvasElement the <canvas> DOM element
 * */
function addBackground(canvasElement){
	Log.info("addBackground: called");

    var ctx = canvasElement.getContext('2d');

    // set background image if backgroundImage is null
    if (!backgroundImage) {

        // fill canvas with fill color
        ctx.rect(0,0,canvasElement.width,canvasElement.height);
        ctx.fillStyle = canvasProps.getFillColor();
        ctx.fill();

        // draw grid if it's visible
        if(gridVisible){
            var columns = Math.floor(canvasElement.width / GRIDWIDTH) + 1;
            //console.info("Columns: " + columns );

            var rows = Math.floor(canvasElement.height / GRIDWIDTH) + 1;
            //console.info("Rows: " + rows );

            for(var i=0;i<rows; i++){
                for(var j=0; j<columns; j++){
                    ctx.beginPath();
                    ctx.strokeStyle = '#C0C0C0';

                    //big cross
                    ctx.moveTo(j * GRIDWIDTH - 2, i * GRIDWIDTH);
                    ctx.lineTo(j * GRIDWIDTH + 2, i * GRIDWIDTH);

                    ctx.moveTo(j * GRIDWIDTH, i * GRIDWIDTH - 2);
                    ctx.lineTo(j * GRIDWIDTH, i * GRIDWIDTH + 2);


                    //small dot
                    ctx.moveTo(j * GRIDWIDTH + GRIDWIDTH/2 - 1, i * GRIDWIDTH +  GRIDWIDTH/2);
                    ctx.lineTo(j * GRIDWIDTH + GRIDWIDTH/2 + 1, i * GRIDWIDTH +  GRIDWIDTH/2);

                    ctx.stroke();
                }
            }
        }

        // set new buffered background image
        backgroundImage = new Image();
        backgroundImage.src = canvasElement.toDataURL();

    } else {
    //	backgroundImage.onload = function(e){
    //		ctx.drawImage(this, 0, 0);
    //	} //end onload

        // draw buffered background image on canvas
        ctx.drawImage(backgroundImage, 0, 0);
    }

}//end function
			
			

/**Cleans up the canvas. It also add a white background to avoid "transparent"
 *background issue in PNG
 *@param {HTMLCanvasElement} canvas - the canvas to reset
 *@author Alex
 **/
function reset(canvas){
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0,0,canvas.width,canvas.height);   
	ctx.fillStyle = '#FFFFFF';
	ctx.fillRect(0,0,canvas.width,canvas.height);			
}


/**Draws all the stuff on the canvas*/
function draw(){

    var ctx = getContext();

    //    Log.group("A draw started");
    //alert('Paint 1')
    reset(getCanvas());    
	
	//if grid visible paint it
//	if(gridVisible){ //paint grid
		addBackground(getCanvas());
//	}
	
    //alert('Paint 2')
    STACK.paint(ctx);
    
    minimap.updateMinimap();
//    Log.groupEnd();
//alert('Paint 3')
}


/**
*Returns the canvas data but without the selections and grid.
*@return {DOMString} - the result of a toDataURL() call on the temporary canvas
*@author Alex
*@author Artyom
**/
function renderedCanvas(){
   var canvas = getCanvas();

   //render the canvas without the selection and stuff
   var tempCanvas = document.getElementById('tempCanvas');
   if(tempCanvas === null){
           tempCanvas = document.createElement('canvas');
           tempCanvas.setAttribute('id', 'tempCanvas');					
           tempCanvas.style.display = 'none';

           //it seems that there is no need to actually add it to the dom tree to be able to render (tested: IE9, FF9, Chrome 19)
           //canvas.parentNode.appendChild(tempCanvas);
   }

   //adjust temp canvas size to main canvas (as it migh have been changed)
   tempCanvas.setAttribute('width', canvas.width);
   tempCanvas.setAttribute('height', canvas.height);
   reset(tempCanvas);
   addBackground(tempCanvas);
   STACK.paint(tempCanvas.getContext('2d'), true);
   //end render

   return tempCanvas.toDataURL();
}

/*Returns a text containing all the URL in a diagram */
function linkMap(){
    var csvBounds = '';
    var first = true;
    for(f in STACK.figures){
        var figure = STACK.figures[f];
        if(figure.url != ''){
            var bounds = figure.getBounds();
            if(first){
                first = false;                                                        
            }
            else{
                csvBounds += "\n";
            }

            csvBounds += bounds[0] + ',' + bounds[1] + ',' + bounds[2] + ',' + bounds[3] + ',' + figure.url;
        }
    }
    Log.info("editor.php->linkMap()->csv bounds: " + csvBounds);

    return csvBounds;
}


/** Save current diagram
 * Save can be triggered in 3 cases:
 *  1 - from menu
 *  2 - from quick toolbar
 *  3 - from shortcut Ctrl-S (onKeyDown)
 *See:
 *http://www.itnewb.com/renderedCanvasv/Introduction-to-JSON-and-PHP/page3
 *http://www.onegeek.com.au/articles/programming/javascript-serialization.php
 **/
function save(){
    
    //alert("save triggered! diagramId = " + diagramId  );
    Log.info('Save pressed');
    
    if (state == STATE_TEXT_EDITING) {
        currentTextEditor.destroy();
        currentTextEditor = null;
        state = STATE_NONE;
    }
    
    var dataURL = null;
    try{
        dataURL = renderedCanvas();
    } 
    catch(e){                
        if(e.name === 'SecurityError' && e.code === 18){
            /*This is usually happening as we load an image from another host than the one Diagramo is hosted*/
            alert("A figure contains an image loaded from another host. \
                \n\nHint: \
                \nPlease make sure that the browser's URL (current location) is the same as the one saved in the DB.");
        }
    }

//                Log.info(dataURL);
//                return false;
    if(dataURL == null){
        Log.info('save(). Could not save. dataURL is null');
        alert("Could not save. \
            \n\nHint: \
            \nCanvas's toDataURL() did not functioned properly ");
        return;
    }

    var diagram = { c: canvasProps, s:STACK, m:CONNECTOR_MANAGER, p:CONTAINER_MANAGER, v: DIAGRAMO.fileVersion };
    //Log.info('stringify ...');
//    var serializedDiagram = JSON.stringify(diagram,  Util.operaReplacer);
    var serializedDiagram = JSON.stringify(diagram);
//    Log.error("Using Util.operaReplacer() somehow break the serialization. o[1,2] \n\
//        is transformed into o.['1','2']... so the serialization is broken");
//    var serializedDiagram = JSON.stringify(diagram);
    //Log.info('JSON stringify : ' + serializedDiagram);

    var svgDiagram = toSVG();

//                alert(serializedDiagram);
//                alert(svgDiagram);
    //Log.info('SVG : ' + svgDiagram);

    //save the URLs of figures as a CSV 
    var lMap = linkMap();

    //see: http://api.jquery.com/jQuery.post/
    $.post("./common/controller.php",
        {action: 'save', diagram: serializedDiagram, png:dataURL, linkMap: lMap, svg: svgDiagram, diagramId: currentDiagramId},
        function(data){
            if(data === 'firstSave'){
                Log.info('firstSave!');
                window.location = './saveDiagram.php';                            
            }
            else if(data === 'saved'){
                //Log.info('saved!');
                alert('saved!');
            }
            else{
                alert('Unknown: ' + data );
            }
        }
    );


}

/** Print current diagram
 * Print can be triggered in 3 cases only after diagram was saved:
 *  1 - from menu
 *  2 - from quick toolbar
 *  3 - from Ctrl + P shortcut
 *
 *  Copy link to saved diagram's png file to src of image,
 *  add it to iframe and call print of last.
 *
 *  @author Artyom Pokatilov <artyom.pokatilov@gmail.com>
 **/
function print_diagram() {
    var printFrameId = "printFrame";

    var iframe = document.getElementById(printFrameId);

    // if iframe isn't created
    if (iframe == null) {
        iframe = document.createElement("IFRAME");
        iframe.id = printFrameId;

        document.body.appendChild(iframe);
    }

    // get DOM of iframe
    var frameDoc = iframe.contentDocument;

    var diagramImages = frameDoc.getElementsByTagName('img');
    var diagramImage;
    if(diagramImages.length > 0) {     // if image is already added
        diagramImage = diagramImages[0];

        // set source of image to png of saved diagram
        diagramImage.setAttribute('src', "data/diagrams/" + currentDiagramId + ".png");

    } else {                        // if image isn't created yet
        diagramImage = frameDoc.createElement('img');

        // set source of image to png of saved diagram
        diagramImage.setAttribute('src', "data/diagrams/" + currentDiagramId + ".png");

        if (frameDoc.body !== null) {
            frameDoc.body.appendChild(diagramImage);
        } else {
            // IE case for more details
            // @see http://stackoverflow.com/questions/8298320/correct-access-of-dynamic-iframe-in-ie
            // create body of iframe
            frameDoc.src = "javascript:'<body></body>'";
            // append image through html of <img>
            frameDoc.write(diagramImage.outerHTML);
            frameDoc.close();
        }
    }

    // adjust iframe size to main canvas (as it might have been changed)
    iframe.setAttribute('width', canvasProps.getWidth());
    iframe.setAttribute('height', canvasProps.getHeight());

    // print iframe
    iframe.contentWindow.print();
}

/**Exports current canvas as SVG*/
function exportCanvas(){
    //export canvas as SVG
    var v = '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg" version="1.1">\
            <rect x="0" y="0" height="200" width="300" style="stroke:#000000; fill: #FFFFFF"/>\
                    <path d="M100,100 C200,200 100,50 300,100" style="stroke:#FFAAFF;fill:none;stroke-width:3;"  />\
                    <rect x="50" y="50" height="50" width="50"\
                      style="stroke:#ff0000; fill: #ccccdf" />\
            </svg>';



    //get svg
    var canvas = getCanvas();

    var v2 = '<svg width="' + canvas.width +'" height="' + canvas.height + '" xmlns="http://www.w3.org/2000/svg" version="1.1">';
    v2 += STACK.toSVG();
    v2 += CONNECTOR_MANAGER.toSVG();
    v2 += '</svg>';
    alert(v2);

    //save SVG into session
    //see: http://api.jquery.com/jQuery.post/
    $.post("../common/controller.php", {action: 'saveSvg', svg: escape(v2)},
        function(data){
            if(data == 'svg_ok'){
                //alert('SVG was save into session');
            }
            else if(data == 'svg_failed'){
                Log.info('SVG was NOT save into session');
            }
        }
    );

    //open a new window that will display the SVG
    window.open('./svg.php', 'SVG', 'left=20,top=20,width=500,height=500,toolbar=1,resizable=0');
}
            

/**Loads a saved diagram
 *@param {Number} diagramId - the id of the diagram you want to load
 **/
function load(diagramId){
    //alert("load diagram [" + diagramId + ']');
    
    $.post("./common/controller.php", {action: 'load', diagramId: diagramId},
        function(data){
//                        alert(data);
            try{
                var obj  = eval('(' + data + ')');
                if( !('v' in obj) || obj.v != DIAGRAMO.fileVersion){
                    Importer.importDiagram(obj);//import 1st version of Diagramo files
                }

                STACK = Stack.load(obj['s']);
                canvasProps = CanvasProps.load(obj['c']);
                canvasProps.sync();
                setUpEditPanel(canvasProps);

                CONNECTOR_MANAGER = ConnectorManager.load(obj['m']);
                CONTAINER_MANAGER = ContainerFigureManager.load(obj['p']);
                draw();

                //alert("loaded");
            } catch(error) {
                alert("main.js:load() Exception: " + error);
            }
        }
    );
}

/**Loads a saved diagram
 *@param {String} tempDiagramName - the name of temporary diagram
 **/
function loadTempDiagram(tempDiagramName){
//    alert("load diagram [" + tempDiagramName + ']');

    $.post("./common/controller.php", {action: 'loadTemp', tempName: tempDiagramName},
        function(data){
//                        alert(data);
            try{
                var obj  = eval('(' + data + ')');

                if( !('v' in obj) || obj.v != DIAGRAMO.fileVersion){
                    Importer.importDiagram(obj);//import 1st version of Diagramo files
                }

                STACK = Stack.load(obj['s']);
                canvasProps = CanvasProps.load(obj['c']);
                canvasProps.sync();
                setUpEditPanel(canvasProps);

                CONNECTOR_MANAGER = ConnectorManager.load(obj['m']);            
                CONTAINER_MANAGER = ContainerFigureManager.load(obj['p']);
                draw();

                //alert("loaded");
            } catch(error) {
                alert("main.js:load() Exception: " + error);
            }
        }
    );
}

function loadQuickStartDiagram(){
    $.post("./common/controller.php", {action: 'loadQuickStart'},
        function(data){
//                        alert(data);
            try{
                var obj  = eval('(' + data + ')');

                if( !('v' in obj) || obj.v != DIAGRAMO.fileVersion){
                    Importer.importDiagram(obj);//import 1st version of Diagramo files
                }

                STACK = Stack.load(obj['s']);
                canvasProps = CanvasProps.load(obj['c']);
                canvasProps.sync();
                setUpEditPanel(canvasProps);

                CONNECTOR_MANAGER = ConnectorManager.load(obj['m']);            
                CONTAINER_MANAGER = ContainerFigureManager.load(obj['p']);
                draw();

                //alert("loaded");
            } catch(error) {
                alert("main.js:load() Exception: " + error);
            }
        }
    );
}


/**Saves a diagram. Actually send the serialized version of diagram
*for saving
**/
function saveAs(){
   var dataURL = renderedCanvas();

//                var $diagram = {c:canvas.save(), s:STACK, m:CONNECTOR_MANAGER};
   var $diagram = {c:canvasProps, s:STACK, m:CONNECTOR_MANAGER, p:CONTAINER_MANAGER, v: DIAGRAMO.fileVersion };
   var $serializedDiagram = JSON.stringify($diagram);
//   $serializedDiagram = JSON.stringify($diagram,  Util.operaReplacer);
   var svgDiagram = toSVG();

   //save the URLs of figures as a CSV 
   var lMap = linkMap();

   //alert($serializedDiagram);

   //see: http://api.jquery.com/jQuery.post/
   $.post("./common/controller.php", {action: 'saveAs', diagram: $serializedDiagram, png:dataURL, linkMap: lMap, svg: svgDiagram},
       function(data){
           if(data == 'noaccount'){
               Log.info('You must have an account to use that feature');
               //window.location = '../register.php';
           }
           else if(data == 'step1Ok'){
               Log.info('Save as...');
               window.location = './saveDiagram.php';
           }
       }
   );
}


/**Add listeners to elements on the page*/
// TODO: set dblclick handler for mobile (touches)
function addListeners(){
    var canvas = getCanvas();

    //add event handlers for Document
    document.addEventListener("keypress", onKeyPress, false);
    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp, false);
    document.addEventListener("selectstart", stopselection, false);                

    //add event handlers for Canvas
    canvas.addEventListener("mousemove", onMouseMove, false);
    canvas.addEventListener("mousedown", onMouseDown, false);
    canvas.addEventListener("mouseup", onMouseUp, false);
    canvas.addEventListener("dblclick", onDblClick, false);


    if(false){
        //add listeners for iPad/iPhone
        //As this was only an experiment (for now) it is not well supported nor optimized
        ontouchstart="touchStart(event);"
        ontouchmove="touchMove(event);"
        ontouchend="touchEnd(event);"
        ontouchcancel="touchCancel(event);"
    }

}

/**Minimap section*/
var minimap; //stores a refence to minimap object (see minimap.js)

//TODO: remove reference to JQuery and add a normal listener (for "onmouseup" event)
$(document).mouseup(
    function(){
        minimap.selected = false;
    }
);

//TODO: convert to a normal listener (for "onresize" event)
window.onresize = function(){
    minimap.initMinimap()
};

var currentDiagramId = null;

/**Initialize the page
* @param {Integer} diagramId (optional) the diagram Id to load
* */
function init(diagramId){
   var canvas = getCanvas();

   minimap = new Minimap(canvas, document.getElementById("minimap"), 115);
   minimap.updateMinimap();


   //Canvas properties (width and height)
   if(canvasProps == null){//only create a new one if we have not already loaded one
       canvasProps = new CanvasProps(CanvasProps.DEFAULT_WIDTH, CanvasProps.DEFAULT_HEIGHT, CanvasProps.DEFAULT_FILL_COLOR);
   }
   //lets make sure that our canvas is set to the correct values
   canvasProps.setWidth(canvasProps.getWidth());
   canvasProps.setHeight(canvasProps.getHeight());




   //Browser support and warnings
   if(isBrowserReady() == 0){ //no support at all
       modal();
   }

   //Edit panel
   setUpEditPanel(canvasProps);

   //loads diagram ONLY if the parameter is numeric
   if(isNumeric(diagramId)){
       currentDiagramId = diagramId;
       load(diagramId);       
   }
   else if(diagramId.substring && diagramId.substring(0, 3) === 'tmp'){ //it is a string and starts with "tmp"
       loadTempDiagram(diagramId);
   }
   else if(diagramId === 'quickstart'){
       loadQuickStartDiagram();
   }



   // close layer when click-out

   addListeners();
   
    window.addEventListener("mousedown", documentOnMouseDown, false);
    window.addEventListener("mousemove", documentOnMouseMove, false);
    window.addEventListener("mouseup", documentOnMouseUp, false);
}

/**Flag to inform if to drew or not the diagram. Similar to "Dirty pattern" */
var redraw = false;

/**
 *Dispatch actions. Detect the action needed and trigger it.
 *@param {String} action - the action name
 **/
function action(action){
    redraw = false;
    switch(action){
        
        case 'undo':
            Log.info("main.js->action()->Undo. Nr of actions in the STACK: " + History.COMMANDS.length);
            History.undo();
            redraw = true;
            break;
            
//        case 'redo':
//            Log.info("main.js->action()->Redo. Nr of actions in the STACK: " + History.COMMANDS.length);
//            History.redo();
//            redraw = true;
//            break;
            
        case 'group':
            /*After we pressed Ctrl-G any temporary group will became permanent*/
            if(selectedGroupId != -1){
                var group = STACK.groupGetById(selectedGroupId);
                if(!group.permanent){ //group only temporary groups
                    var cmdGroup = new GroupCreateCommand(selectedGroupId);
                    cmdGroup.execute();
                    History.addUndo(cmdGroup);
                    Log.info("main.js->action()->Group. New group made permanent. Group id = " + selectedGroupId);
                }
                else{
                    Log.info("main.js->action()->Group. Group ALREADY permanent.  Group id = " + selectedGroupId);
                }
                
            }
            redraw = true;
            break;
            
        case 'container':
            Log.info("main.js->action()->container. Nr of actions in the STACK: " + History.COMMANDS.length);

            if (state == STATE_TEXT_EDITING) {
                currentTextEditor.destroy();
                currentTextEditor = null;
            }

            //creates a container
            var cmdContainerCreate = new ContainerCreateCommand(300, 300);
            cmdContainerCreate.execute();
            History.addUndo(cmdContainerCreate);
            
            redraw = true;
            
            break;

        case 'insertImage':
            Log.info("main.js->action()->insertImage. Nr of actions in the STACK: " + History.COMMANDS.length);

            if (state == STATE_TEXT_EDITING) {
                currentTextEditor.destroy();
                currentTextEditor = null;
            }

            //creates a container
            var cmdFigureCreate = new InsertedImageFigureCreateCommand(insertedImageFileName, 100, 100);
            cmdFigureCreate.execute();
            History.addUndo(cmdFigureCreate);

            redraw = true;

            break;
        
        case 'ungroup':
            if(selectedGroupId != -1){
                var group = STACK.groupGetById(selectedGroupId);
                if(group.permanent){ //split only permanent groups
                    var cmdUngroup = new GroupDestroyCommand(selectedGroupId);
                    cmdUngroup.execute();
                    History.addUndo(cmdUngroup);
                    Log.info("main.js->action()->Ungroup. New group made permanent. Group id = " + selectedGroupId);
                }
                else{
                    Log.info("main.js->action()->Ungroup. Ignore. Group is not permanent.  Group id = " + selectedGroupId);
                }
                
                redraw = true;
            }
            break;
       
        case 'connector-jagged':
            if (state == STATE_TEXT_EDITING) {
                currentTextEditor.destroy();
                currentTextEditor = null;
            }
            selectedFigureId = -1;
            state  = STATE_CONNECTOR_PICK_FIRST;
            connectorType = Connector.TYPE_JAGGED;
            redraw = true;
            break;

        case 'connector-straight':
            if (state == STATE_TEXT_EDITING) {
                currentTextEditor.destroy();
                currentTextEditor = null;
            }
            selectedFigureId = -1;            
            state  = STATE_CONNECTOR_PICK_FIRST;
            connectorType = Connector.TYPE_STRAIGHT;
            redraw = true;
            break;
            
        case 'connector-organic':
            if (state == STATE_TEXT_EDITING) {
                currentTextEditor.destroy();
                currentTextEditor = null;
            }
            selectedFigureId = -1;            
            state  = STATE_CONNECTOR_PICK_FIRST;
            connectorType = Connector.TYPE_ORGANIC;
            redraw = true;
            break;

        case 'rotate90':
        case 'rotate90A':
            if(selectedFigureId){
                //alert("Selected figure index: " + STACK.figureSelectedIndex);
                var figure = STACK.figureGetById(selectedFigureId);
                var bounds = figure.getBounds();
                var dx = bounds[0] + (bounds[2] - bounds[0]) / 2
                var dy = bounds[1] + (bounds[3] - bounds[1]) / 2
                //alert(dx + '  ' + dy);
                //alert("Selected figure is: " + figure);
                var TRANSLATE = [
                [1, 0, dx * -1],
                [0, 1, dy * -1],
                [0, 0, 1]
                ]
                /*
                var dx = bounds[0] + (bounds[3] - bounds[1]) / 2
                var dy = bounds[1] + (bounds[2] - bounds[0]) / 2
                 */
                //TODO: figure out why we have to -1 off the dx, we have to do this regardless of rotation angle
                var TRANSLATEBACK = [
                [1, 0, dx],
                [0, 1, dy],
                [0, 0, 1]
                ]
                figure.transform(TRANSLATE);
                if(action=="rotate90"){
                    figure.transform(R90);
                }
                else{
                    figure.transform(R90A);
                }
                figure.transform(TRANSLATEBACK);

                redraw = true;
            }
            break;

        case 'up': //decrease Y                                   
            switch(state){
                case STATE_FIGURE_SELECTED:
                    var cmdFigUp = new FigureTranslateCommand(selectedFigureId, Matrix.UP);
                    History.addUndo(cmdFigUp);
                    cmdFigUp.execute();
                    redraw = true;
                    break;

                case STATE_GROUP_SELECTED:
                    var cmdGrpUp = new GroupTranslateCommand(selectedGroupId, Matrix.UP);
                    History.addUndo(cmdGrpUp);
                    cmdGrpUp.execute();
                    redraw = true;
                    break;

                case STATE_CONTAINER_SELECTED:
                    var cmdContUp = new ContainerTranslateCommand(selectedContainerId, Matrix.UP);
                    History.addUndo(cmdContUp);
                    cmdContUp.execute();
                    redraw = true;
                    break;
            }
                        
            break;

        case 'down': //increase Y
            switch(state){
                case STATE_FIGURE_SELECTED:
                    var cmdFigDown = new FigureTranslateCommand(selectedFigureId, Matrix.DOWN);
                    History.addUndo(cmdFigDown);
                    cmdFigDown.execute();
                    redraw = true;
                    break;

                case STATE_GROUP_SELECTED:
                    var cmdGrpDown = new GroupTranslateCommand(selectedGroupId, Matrix.DOWN);
                    History.addUndo(cmdGrpDown);
                    cmdGrpDown.execute();
                    redraw = true;
                    break;

                case STATE_CONTAINER_SELECTED:
                    var cmdContDown = new ContainerTranslateCommand(selectedContainerId, Matrix.DOWN);
                    History.addUndo(cmdContDown);
                    cmdContDown.execute();
                    redraw = true;
                    break;
            }                        
            break;

        case 'right': //increase X
            switch(state){
                case STATE_FIGURE_SELECTED:
                    var cmdFigRight = new FigureTranslateCommand(selectedFigureId, Matrix.RIGHT);
                    History.addUndo(cmdFigRight);
                    cmdFigRight.execute();
                    redraw = true;
                    break;
                    
                case STATE_GROUP_SELECTED:
                    var cmdGrpRight = new GroupTranslateCommand(selectedGroupId, Matrix.RIGHT);
                    History.addUndo(cmdGrpRight);
                    cmdGrpRight.execute();
                    redraw = true;
                    break;

                case STATE_CONTAINER_SELECTED:
                    var cmdContRight = new ContainerTranslateCommand(selectedContainerId, Matrix.RIGHT);
                    History.addUndo(cmdContRight);
                    cmdContRight.execute();
                    redraw = true;
                    break;
            } 
            break;

        case 'left': //decrease X
            switch(state){
                case STATE_FIGURE_SELECTED:
                    var cmdFigLeft = new FigureTranslateCommand(selectedFigureId, Matrix.LEFT);
                    History.addUndo(cmdFigLeft);
                    cmdFigLeft.execute();
                    redraw = true;
                    break;
                    
                case STATE_GROUP_SELECTED:
                    var cmdGrpLeft = new GroupTranslateCommand(selectedGroupId, Matrix.LEFT);
                    History.addUndo(cmdGrpLeft);
                    cmdGrpLeft.execute();
                    redraw = true;
                    break;

                case STATE_CONTAINER_SELECTED:
                    var cmdContLeft = new ContainerTranslateCommand(selectedContainerId, Matrix.LEFT);
                    History.addUndo(cmdContLeft);
                    cmdContLeft.execute();
                    redraw = true;
                    break;
            }
            break;

        case 'grow':
            if(selectedFigureId != -1){
                //alert("Selected figure index: " + STACK.figureSelectedIndex);
                var figure = STACK.figureGetById(selectedFigureId);
                var bounds = figure.getBounds();
                var dx = bounds[0] + (bounds[2] - bounds[0]) / 2
                var dy = bounds[1] + (bounds[3] - bounds[1]) / 2
                //alert(dx + '  ' + dy);
                //alert("Selected figure is: " + figure);
                var TRANSLATE = [
                [1, 0, dx * -1],
                [0, 1, dy * -1],
                [0, 0, 1]
                ]
                /*
                var dx = bounds[0] + (bounds[3] - bounds[1]) / 2
                var dy = bounds[1] + (bounds[2] - bounds[0]) / 2
                 */
                var TRANSLATEBACK = [
                [1, 0, dx],
                [0, 1, dy],
                [0, 0, 1]
                ]

                var GROW = [
                [1 + 0.2, 0,   0],
                [0,   1 + 0.2, 0],
                [0,   0,   1]
                ]
                figure.transform(TRANSLATE);
                figure.transform(GROW);
                figure.transform(TRANSLATEBACK);
                redraw = true;
            }
            break;

        case 'shrink':
            if(selectedFigureId != -1){
                //alert("Selected figure index: " + STACK.figureSelectedIndex);
                var figure = STACK.figureGetById(selectedFigureId);
                var bounds = figure.getBounds();
                var dx = bounds[0] + (bounds[2] - bounds[0]) / 2
                var dy = bounds[1] + (bounds[3] - bounds[1]) / 2
                //alert(dx + '  ' + dy);
                //alert("Selected figure is: " + figure);
                var TRANSLATE = [
                [1, 0, dx * -1],
                [0, 1, dy * -1],
                [0, 0, 1]
                ]
                /*
                var dx = bounds[0] + (bounds[3] - bounds[1]) / 2
                var dy = bounds[1] + (bounds[2] - bounds[0]) / 2
                 */
                var TRANSLATEBACK = [
                [1, 0, dx],
                [0, 1, dy],
                [0, 0, 1]
                ]
                var SHRINK = [
                [1 - 0.2, 0,   0],
                [0,   1 - 0.2, 0],
                [0,   0,   1]
                ]
                figure.transform(TRANSLATE);
                figure.transform(SHRINK);
                figure.transform(TRANSLATEBACK);
                redraw = true;
            }
            break;
            
        case 'duplicate':
            //TODO: From Janis: Connectors are not cloned
            
            if(selectedFigureId != -1){ //duplicate one figure
                var cmdDupl = new FigureCloneCommand(selectedFigureId);
                cmdDupl.execute();
                History.addUndo(cmdDupl);                
            }
            
            if(selectedGroupId != -1){ //copies a group or multiple figures
                var cmdDupl = new GroupCloneCommand(selectedGroupId);
                cmdDupl.execute();
                History.addUndo(cmdDupl);
            }
            getCanvas().style.cursor = "default";
            redraw = true;
            break;

        case 'back':
            if(selectedFigureId != -1){
                var cmdBack = new FigureZOrderCommand(selectedFigureId, 0);
                cmdBack.execute();
                History.addUndo(cmdBack);
                //STACK.setPosition(selectedFigureId, 0);
                redraw = true;
            }
            break;

        case 'front':
            if(selectedFigureId != -1){
                var cmdFront = new FigureZOrderCommand(selectedFigureId, STACK.figures.length-1);
                cmdFront.execute();
                History.addUndo(cmdFront);                
                redraw = true;
            }            
            break;

        case 'moveback':
            if(selectedFigureId != -1){
                var cmdMoveBack = new FigureZOrderCommand(selectedFigureId, STACK.idToIndex[selectedFigureId] - 1);
                cmdMoveBack.execute();
                History.addUndo(cmdMoveBack);
                redraw = true;
            }
            break;

        case 'moveforward':
            if(selectedFigureId != -1){
                var cmdMoveForward = new FigureZOrderCommand(selectedFigureId, STACK.idToIndex[selectedFigureId] + 1);
                cmdMoveForward.execute();
                History.addUndo(cmdMoveForward);
                redraw = true;
            }            
            break;

    }//end switch

    if(redraw){
        draw();
    }
}

/**Stores last mouse position. Null initially.*/
var lastMousePosition = null;


//function startResize(ev){
//    lastMousePosition = getBodyXY(ev);
//    currentMoveUndo = new Action(null, null, History.ACTION_CANVAS_RESIZE, null, lastMousePosition, null);
//}
//
//
//function stopResize(ev){
//    if(lastMousePosition != null){
//        currentMoveUndo.currentValue = [lastMousePosition[0],lastMousePosition[1]];
//        History.addUndo(currentMoveUndo);
//        currentMoveUndo = null;
//        lastMousePosition = null;
//    }
//}


//function resize(ev){
//    if(lastMousePosition != null){
//        var currentMousePosition
//        if(ev instanceof Array){
//            //we are undoing this
//            currentMousePosition = ev;
//        }
//        else{
//            currentMousePosition = getBodyXY(ev);
//        }
//        var width = canvas.getwidth() - (lastMousePosition[0] - currentMousePosition[0]);
//        var height = canvas.getheight() - (lastMousePosition[1] - currentMousePosition[1]);
//        canvas.setwidth(canvas,width);
//        canvas.setheight(canvas, height);
//        setUpEditPanel(canvas);
//        lastMousePosition = currentMousePosition;
//        /*if(canvas.width >= document.body.scrollWidth-370){
//        }
//        else {
//            //document.getElementById("container").style.width = "";
//        }*/
//        draw();
//    }
//}


function documentOnMouseDown(evt){
    //Log.info("documentOnMouseDown");
    //evt.preventDefault();
}

var draggingFigure = null;
function documentOnMouseMove(evt){
    //Log.info("documentOnMouseMove");

    switch(state){
        case STATE_FIGURE_CREATE:
            //Log.info("documentOnMouseMove: trying to draw the D'n'D figure");

            if(!draggingFigure){
                draggingFigure = document.createElement('img');
                draggingFigure.setAttribute('id', 'draggingThumb');
                draggingFigure.style.position = 'absolute';
                draggingFigure.style.zIndex = 3;  // set it in front of editor
                body.appendChild(draggingFigure);
            }


            //Log.info("editor.php>documentOnMouseMove>STATE_FIGURE_CREATE: selectedFigureThumb=" + selectedFigureThumb);
            draggingFigure.setAttribute('src', selectedFigureThumb);                        
            draggingFigure.style.width = '100px';
            draggingFigure.style.height = '100px';
            draggingFigure.style.left = (evt.pageX - 50) + 'px';
            draggingFigure.style.top = (evt.pageY - 50) + 'px';
            //draggingFigure.style.backgroundColor  = 'red';
            draggingFigure.style.display  = 'block';

            draggingFigure.addEventListener('mousedown', function (event){
                //Log.info("documentOnMouseMove: How stupid. Mouse down on dragging figure");
            }, false);

            draggingFigure.addEventListener('mouseup', function (ev){
                var coords = getCanvasXY(ev);

                if(coords == null){
                    return;
                }

                var x = coords[0];
                var y = coords[1];
                switch(state){                                
                    case STATE_FIGURE_CREATE:
                        Log.info("draggingFigure>onMouseUp() + STATE_FIGURE_CREATE");

                        snapMonitor = [0,0];

                        //treat new figure
                        //do we need to create a figure on the canvas?
                        if(window.createFigureFunction){
                            //Log.info("draggingFigure>onMouseUp() + STATE_FIGURE_CREATE--> new state STATE_FIGURE_SELECTED + createFigureFunction = " + window.createFigureFunction);

                            var cmdCreateFig = new FigureCreateCommand(window.createFigureFunction, x, y);
                            cmdCreateFig.execute();
                            History.addUndo(cmdCreateFig);

                            //HTMLCanvas.style.cursor = 'default';

                            selectedConnectorId = -1;
                            createFigureFunction = null;
                            mousePressed = false;
                            redraw = true;

                            draw();

                            //TODO: a way around to hide this dragging DIV
                            document.getElementById('draggingThumb').style.display  = 'none';

                            //TODO: the horror 
                            //body.removeChild(document.getElementById('draggingThumb'));

                        }
                        else{
                            Log.info("draggingFigure>onMouseUp() + STATE_FIGURE_CREATE--> but no 'createFigureFunction'");
                        }
                        break;
                }

                //stop canvas from gettting this event
                evt.stopPropagation();
            }, false);
            break;

        case STATE_NONE:
            //document.removeChild(document.getElementById('draggingThumb'));
            break;
    }
}


function documentOnMouseUp(evt){
    Log.info("documentOnMouseUp");

    switch(state){
        case STATE_FIGURE_CREATE:
            var eClicked = document.elementFromPoint(evt.clientX, evt.clientY);
            if(eClicked.id != 'a'){
                if(draggingFigure){
                    //draggingFigure.style.display  = 'none';
                    draggingFigure.parentNode.removeChild(draggingFigure);
                    state = STATE_NONE;
                    draggingFigure = null;
                    //evt.stopPropagation();
                }
            }
            break;
    }
}
            
            
/*Returns a text containing all the URL in a diagram */
function linkMap(){
    var csvBounds = '';
    var first = true;
    for(var f in STACK.figures){
        var figure = STACK.figures[f];
        if(figure.url != ''){
            var bounds = figure.getBounds();
            if(first){
                first = false;                                                        
            }
            else{
                csvBounds += "\n";
            }

            csvBounds += bounds[0] + ',' + bounds[1] + ',' + bounds[2] + ',' + bounds[3] + ',' + figure.url;
        }
    }
    Log.info("editor.php->linkMap()->csv bounds: " + csvBounds);

    return csvBounds;
}            
/*======================APPLE=====================================*/
/**Triggered when an touch is initiated (iPad/iPhone).
 *Simply forward to onMouseDown
 *@param {Event} event - the event triggered
 **/
function touchStart(event){
    event.preventDefault();

    onMouseDown(event);                                                
}


/**Triggered while touching and moving is in progress (iPad/iPhone).
 *Simply forward to onMouseMove
 *@param {Event} event - the event triggered
 **/
function touchMove(event){
    event.preventDefault();

    onMouseMove(event);                
}


/**Triggered when touch ends (iPad/iPhone).
 *Simply forward to onMouseUp
 *@param {Event} event - the event triggered
 **/
function touchEnd(event){
    onMouseUp(event);
}

/**Triggered when touch is canceled (iPad/iPhone).
 *@param {Event} event - the event triggered
 **/
function touchCancel(event){
//nothing
}
/*======================END APPLE=================================*/

