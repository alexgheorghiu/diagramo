"use strict";

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
    
    3: "Stated to be used beginning with version 2.3 final"
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
            Log.error("Importer.importDiagram exception: " + error)
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
                // old version has fillStyle underfined
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
}


/**
 * Apply patch no. 4 to file structure
 * @param {JSONObject} o - the old version file JSON object
 * @returns {JSONObject} the new JSON version
 * Warning: It does modify the original {JSONObject}
 * */
Importer.patch4 = function(o){
    o.v = 4;
    
    //Add code here
    
    return o;
}


