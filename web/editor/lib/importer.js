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

/* 
 * This is a small library the will help import from older version
 * of Diagramo
 */

var Importer = {};


/**Contains description of all versions an main changes they brought to Diagramo
 * file format*/
Importer.fileVersions = {
    1: "This version did not have any version number. \n\
        Originally used on Diagramo.com\n\
        File extension named .dia",
    
    2: "This version did not have any version number.\n\
        Originally used on version 2.3beta\n\
        ",
    
    3: "Started to be used beginning with version 2.3 final",

    4: "Started to be used beginning with version 2.4 final"
};

/**Import previous Diagramo file format.
 * @param {JSONObject} o - the old version file JSON object
 * @returns {JSONObject} the new JSON version
 * Warning: It does modify the original {JSONObject}
 * */
Importer.importDiagram = function(o){
    if( !('v' in o) ){
        this.patch3(o);
    }
    
    /*As now we should have the o.v present
    we will allow bigger patches than 3 to be applied*/
    
    //apply all patches until the fileVersion reaches latest version
    for(var i = o.v + 1; i <= DIAGRAMO.fileVersion; i++){
        try{
            this['patch' + i](o);       
        } catch(error){
            Log.error("Importer.importDiagram exception: " + error);
//            alert("Importer.importDiagram exception: " + error);
        }
    }
    
    return o;
};

/**
 * Apply patch no. 3 to file structure
 * @param {JSONObject} o - the old version file JSON object
 * @returns {JSONObject} the new JSON version
 * Warning: It does modify the original {JSONObject}
 * */
Importer.patch3 = function(o){
    //initially we did not have Containers    
    if('s' in o){ // 's' stands for Stack
        var jsonStack = o.s;
        
        //If not containers array present
        if( !('containers' in jsonStack) ){
            jsonStack.containers = []; //add an empty container array
        }                        
        
        if( 'figures' in jsonStack ){   // replace deprecated property value with new one
            var deprecatedPropertyValue = 'textSize';
            var deprecatedReplacer = 'size';
            var figures = jsonStack.figures;
            var figureLength = figures.length;
            for (var i = 0; i < figureLength; i++) {
                var properties = figures[i].properties;
                var propertiesLength = properties.length;
                for (var j = 0; j < propertiesLength; j++) {
                    if (properties[j].property && properties[j].property.indexOf(deprecatedPropertyValue) != -1) {
                        properties[j].property = properties[j].property.replace(deprecatedPropertyValue, deprecatedReplacer);
                    }
                }
            }
        }
    }
    
    if( !('p' in o) ){ // 'p' stands for ContainerFigureManager
        o.p = new ContainerFigureManager() ; //empty ContainerFigureManager
    }

    if( 'm' in o ){ // 'm' stands for ConnectorManager
        var jsonConnectorManager = o.m;
        if ( 'connectors' in jsonConnectorManager ) {
            // properties that may absent
            var lineStyleProperty = new BuilderProperty('Line Style','style.lineStyle', BuilderProperty.TYPE_LINE_STYLE);
            var textSizeProperty = new BuilderProperty('Text Size', 'middleText.size', BuilderProperty.TYPE_TEXT_FONT_SIZE);
            var fontProperty = new BuilderProperty('Font', 'middleText.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY);
            var textAlignProperty = new BuilderProperty('Alignment', 'middleText.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT);
            var textColorProperty = new BuilderProperty('Text Color', 'middleText.style.fillStyle', BuilderProperty.TYPE_COLOR);

            // flags to mark if properties are defined
            var lineStylePropertyDefined;
            var textSizePropertyDefined;
            var fontPropertyDefined;
            var textAlignPropertyDefined;
            var textColorPropertyDefined;

            var connectors = jsonConnectorManager.connectors;
            var connectorLength = connectors.length;
            for (var i = 0; i < connectorLength; i++) {
                // old version has fillStyle undefined
                if (!connectors[i].middleText.style.fillStyle) {
                    connectors[i].middleText.style.fillStyle = connector_defaultConnectorTextFillStyle;
                }

                lineStylePropertyDefined = false;
                textSizePropertyDefined = false;
                fontPropertyDefined = false;
                textAlignPropertyDefined = false;
                textColorPropertyDefined = false;

                var properties = connectors[i].properties;
                var propertiesLength = properties.length;
                for (var j = 0; j < propertiesLength; j++) {
                    if (lineStyleProperty.equals(properties[j])) {
                        lineStylePropertyDefined = true;
                    }
                    if (textSizeProperty.equals(properties[j])) {
                        textSizePropertyDefined = true;
                    }
                    if (fontProperty.equals(properties[j])) {
                        fontPropertyDefined = true;
                    }
                    if (textAlignProperty.equals(properties[j])) {
                        textAlignPropertyDefined = true;
                    }
                    if (textColorProperty.equals(properties[j])) {
                        textColorPropertyDefined = true;
                    }
                }

                // add properties that are not defined
                if (!lineStylePropertyDefined) {
                    properties.push(lineStyleProperty);
                }
                if (!textSizePropertyDefined) {
                    properties.push(textSizeProperty);
                }
                if (!fontPropertyDefined) {
                    properties.push(fontProperty);
                }
                if (!textAlignPropertyDefined) {
                    properties.push(textAlignProperty);
                }
                if (!textColorPropertyDefined) {
                    properties.push(textColorProperty);
                }
            }
        }
    }
    
    o.v = 3;
    
    return o;
};


/**
 * Apply patch no. 4 to file structure
 * @param {JSONObject} o - the old version file JSON object
 * @returns {JSONObject} the new JSON version
 * Warning: It does modify the original {JSONObject}
 * */
Importer.patch4 = function(o){
    o.v = 4;

    /**
     * Adds support for text underline feature
     * @param {JSONObject} o - the old version file JSON object
     * Warning: It does modify the original {JSONObject}
     * Details:
     *  - Set Text::underlined to false (only Figures, Containers - in primitives and Connectors - in middleText field have it)
     *  - Add text underlined property to all objects with Text primitives (only Figures, Containers - in primitives and Connectors - in middleText field have it)
     * */
    function addTextUnderline(o){
        if('s' in o){ // 's' stands for Stack
            var jsonStack = o.s;

            // go through containers
            for (var i = 0; i < jsonStack.containers.length; i++) {
                var currentContainer = jsonStack.containers[i];

                // go through primitives of container
                var primitives = currentContainer.primitives;
                for (var j = 0; j < primitives.length; j++) {
                    var currentPrimitive = primitives[j];

                    // search for Text instances in primitives
                    if (currentPrimitive.oType === "Text") {
                        currentPrimitive.underlined = false;
                        // if primitive with j index is Text - than it's text underlined property is
                        var textUnderlinedProperty = new BuilderProperty('Text Underlined', 'primitives.' + j + '.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED);
                        currentContainer.properties.push(textUnderlinedProperty);
                    }
                }
            }

            // go through figures
            for (var i = 0; i < jsonStack.figures.length; i++) {
                var currentFigure = jsonStack.figures[i];

                // Text used only in primitives
                var primitives = currentFigure.primitives;
                for (var j = 0; j < primitives.length; j++) {
                    var currentPrimitive = primitives[j];

                    // search for Text instances in primitives
                    if (currentPrimitive.oType === "Text") {
                        currentPrimitive.underlined = false;
                        // if primitive with j index is Text - than it's text underlined property is
                        var textUnderlinedProperty = new BuilderProperty('Text Underlined', 'primitives.' + j + '.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED);
                        currentFigure.properties.push(textUnderlinedProperty);
                    }
                }
            }
        }

        if( 'm' in o ){ // 'm' stands for ConnectorManager
            var jsonConnectorManager = o.m;

            // define typical text underlined property
            var textUnderlinedProperty = new BuilderProperty('Text Underlined', 'middleText.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED);

            // go through connectors
            for (var i = 0; i < jsonConnectorManager.connectors.length; i++) {
                var currentConnector = jsonConnectorManager.connectors[i];

                // Text used as middleText property
                currentConnector.middleText.underlined = false;
                currentConnector.properties.push(textUnderlinedProperty);
            }
        }
    }


    /**
     * Adds support for gradient feature as a fill color
     * @param {JSONObject} o - the old version file JSON object
     * Warning: It does modify the original {JSONObject}
     * Details:
     *  - Add to all Style instances fields Style::gradientBounds and Style::colorStops
     *  - Initialize Style::gradientBounds and Style::colorStops fields as an empty arrays
     * */
    function addFillGradient(o){
        if('s' in o){ // 's' stands for Stack
            var jsonStack = o.s;

            // go through containers
            for (var i = 0; i < jsonStack.containers.length; i++) {
                var currentContainer = jsonStack.containers[i];

                // old version  has Style::gradientBounds and Style::colorStops undefined
                currentContainer.style.gradientBounds = [];
                currentContainer.style.colorStops = [];

                // go through primitives of container
                var primitives = currentContainer.primitives;
                for (var j = 0; j < primitives.length; j++) {
                    var currentPrimitive = primitives[j];

                    // old version has Style::gradientBounds and Style::colorStops undefined
                    currentPrimitive.style.gradientBounds = [];
                    currentPrimitive.style.colorStops = [];
                }
            }

            // go through figures
            for (var i = 0; i < jsonStack.figures.length; i++) {
                var currentFigure = jsonStack.figures[i];

                // old version has Style::gradientBounds and Style::colorStops undefined
                currentFigure.style.gradientBounds = [];
                currentFigure.style.colorStops = [];

                // go through primitives of figure
                var primitives = currentFigure.primitives;
                for (var j = 0; j < primitives.length; j++) {
                    var currentPrimitive = primitives[j];

                    // old version has Style::gradientBounds and Style::colorStops undefined
                    currentPrimitive.style.gradientBounds = [];
                    currentPrimitive.style.colorStops = [];

                    // go through points of primitive if it's defined
                    var points = currentPrimitive.points /* for: Polyline, Polygon, etc*/
                            || currentPrimitive.vector /*for: ImageFrame, Text, etc*/;
                    if (points) {
                        for (var k = 0; k < points.length; k++) {
                            var currentPoint = points[k];

                            // old version has Style::gradientBounds and Style::colorStops undefined
                            currentPoint.style.gradientBounds = [];
                            currentPoint.style.colorStops = [];
                        }
                    }
                }


                // go through rotation coordinates of figure
                var rotationCoords = currentFigure.rotationCoords /*for: Figure, Group, etc*/;
                for (var j = 0; j < rotationCoords.length; j++) {
                    var currentCoord = rotationCoords[j];

                    // old version has Style::gradientBounds and Style::colorStops undefined
                    currentCoord.style.gradientBounds = [];
                    currentCoord.style.colorStops = [];
                }
            }
        }

        if( 'm' in o ){ // 'm' stands for ConnectorManager
            var jsonConnectorManager = o.m;

            // go through connectors
            for (var i = 0; i < jsonConnectorManager.connectors.length; i++) {
                var currentConnector = jsonConnectorManager.connectors[i];

                // old version has Style::gradientBounds and Style::colorStops undefined
                currentConnector.style.gradientBounds = [];
                currentConnector.style.colorStops = [];

                // go through turning points of connector
                var turningPoints = currentConnector.turningPoints;
                for (var j = 0; j < turningPoints.length; j++) {
                    var currentTurningPoint = turningPoints[j];

                    // old version has Style::gradientBounds and Style::colorStops undefined
                    currentTurningPoint.style.gradientBounds = [];
                    currentTurningPoint.style.colorStops = [];
                }
            }

            // go through connection points
            for (var i = 0; i < jsonConnectorManager.connectionPoints.length; i++) {
                var currentCp = jsonConnectorManager.connectionPoints[i];

                // old version has Style::gradientBounds and Style::colorStops undefined
                currentCp.point.style.gradientBounds = [];
                currentCp.point.style.colorStops = [];
            }
        }
    }

    /** call functions to add support for a new features of release version 4:
     * - Text underline
     * - Gradient as a fill color
    */
    addTextUnderline(o);
    addFillGradient(o);

    return o;
};
