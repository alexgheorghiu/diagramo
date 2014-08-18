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
 *This functions detects if a browser supports
 *  - <canvas> tag (tests to see if baasic drawing features are supported)
 *  - standard new event system (older then IE9 browsers will basically fail this test)
 *@return {Boolean}  false - means no support, true - means supported
 *@author Alex <alex@scriptoid.com>
 *@author Augustin <cdaugustin@yahoo.com>
 **/
function isBrowserReady()
{
    var ready = true;
    
    ready &= checkHTML5();
    
    ready &= checkEventSystem();

    return ready;
}


/**Checks if we have all HTML5 features we need
 *@return true - if all if fine, false - otherwise
 *@author Alex <alex@scriptoid.com>
 **/
function checkHTML5(){
    var html5ready = true;
    
    var canvas;
    var ctx;
    var retTxtDebug = '';
    try {
        canvas = document.createElement("canvas");  
        if( !("getContext" in canvas) ){
            html5ready = false;
            retTxtDebug = "No  HTML5 ( canvas.getContext() function missing) support\n";
        }
        else{
            ctx = canvas.getContext("2d");
            retTxtDebug = "We have support for canvas\n";
        }        
    } catch(ex){
        html5ready = false;
        retTxtDebug = "No  HTML5 (<canvas> tag) support\n";
    }

    //check if we have all needed functions
    if (html5ready){
        
        //basic canvas functions
        var functionUsed = ["fill", "arc", "beginPath", "moveTo", "lineTo",
            "stroke", "bezierCurveTo", "quadraticCurveTo", "closePath", "save",
            "restore", "translate", "rotate", "drawImage", "strokeText",
            "fillText", "measureText"];

        for (var idx in functionUsed){
            if (typeof( ctx[functionUsed[idx]]) != "function"){
                retTxtDebug = retTxtDebug + functionUsed[idx] + " function missing\n"; //collect all missing functions
                html5ready = false;
            }
        }
    }
    
    return html5ready;
}


/**Checks if event system fits our needs
* @return true - if all if fine, false - otherwise
* @author Alex <alex@scriptoid.com>
 **/
function checkEventSystem(){
    var eventready = true;
    
    var retTxtDebug = '';
    
    //basic DOM Level 2 event handlers
    var functionUsed = ["addEventListener", "removeEventListener"];
    
    for (var idx in functionUsed){
        if ( !(functionUsed[idx] in window) || typeof( window[functionUsed[idx]]) != "function"){
            retTxtDebug = retTxtDebug + functionUsed[idx] + " function missing\n"; //collect all missing functions
            eventready = false;
        }
    }
        
    return eventready;
}

/**
 * Displays a modal window with information about the browser HTML5 support
 * Note: requires jquery.simplemodal-1.3.5.min.js to be loaded
 **/
function modal(){
    var msg = "<div style=\"background-color: #EDEDED; border:1px dotted gray; padding: 5px;\" >\
                    <h1>Browser problem</h1>\
                    <div>Your browser does not fully support HTML5</div>\
                    <div>Please use one of the following browsers for best experience</div>\
                    <ul> \
                        <li> <a href=\"http://www.mozilla.com/firefox/\" target=\"_blank\">Firefox</a></li> \
                        <li> <a href=\"www.google.com/chrome/\" target=\"_blank\">Chrome</a></li> \
                        <li> <a href=\"http://www.opera.com\" target=\"_blank\">Opera</a></li> \
                        <li> <a href=\"http://www.apple.com/safari\" target=\"_blank\">Safari</a></li> \
                    </ul> \
                   Press <span style=\"color:red;\">Escape</span> to close this message</div>";
    $.modal(msg, {
        closeHTML:'Close'
    });
}