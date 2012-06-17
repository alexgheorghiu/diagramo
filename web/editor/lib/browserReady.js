/**
 *This functions detects if a browser supports <canvas> tag and if
 *it does it tests to see if beasic drawring features are supported
 *@return {Number}  0 - means no support at all, 1-means simulated support IE 2-means full support
 *@author Augustin <cdaugustin@yahoo.com>
 *@author Alex <alex@scriptoid.com>
 *
 *TODO: some functions might be present but empty....
 **/
function isBrowserReady()
{

    var canvas = document.createElement("canvas");
    var retVal = 0; //0 - means no support at all, 1-means simulated support IE 2-means full support
    var retTxtDebug = "";
    var ctx = "";
    try {
        ctx = canvas.getContext("2d");

        retTxtDebug = "We have support for canvas\n";
        retVal = 2;
    //weve got no context maybe IE ?

    } catch(errx){
        try{
            G_vmlCanvasManager.initElement(canvas);
            ctx = canvas.getContext('2d');

            if (ctx){
                retTxtDebug = "IE with excanvas\n";
                retVal = 1;
            }else{
                //no canvas or excanvas
                retTxtDebug = "no html5 or excanvas working\n";
            }
        }catch(err){
            retTxtDebug = "no html5 or excanvas working -- possible not an IE browser too\n";
        }
    }

    if (retVal > 0){
        //we have basic canvas lets see if we have working functions

        var functionUsed = ["fill", "arc", "beginPath", "moveTo", "lineTo",
            "stroke", "bezierCurveTo", "quadraticCurveTo", "closePath", "save",
            "restore", "translate", "rotate", "drawImage", "strokeText",
            "fillText", "measureText"];

        for (var idx in functionUsed){
            if (typeof( ctx[functionUsed[idx]]) != "function"){
                retTxtDebug = retTxtDebug + functionUsed[idx] + " function missing\n";
                retVal = 0;
            }
        }
    }

    //alert('Debug: ' + retTxtDebug + ' retVal = ' + retVal);

    return retVal;
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