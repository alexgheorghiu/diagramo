
function ensurePackage(package_name, package_block) {
	var package_parts = package_name.split(".");
	var package_so_far = this;
	for(var i=0; i<package_parts.length; i++) {
		var package_part = package_parts[i];
		if( ! package_so_far[ package_part ] ) {
			package_so_far[ package_part ] = {};
		}
		package_so_far = package_so_far[ package_part ];
	}
	if( package_block ) {
		package_block( package_so_far );
	}
	return package_so_far;
}


function forEachElementOf(list, doThis){
    var listLength = list.length;
    for (var i = 0; i < listLength; i++) {
        doThis(list[i], i);
    }
}

/*              Utility functions                    */

var isIE6 = false;
var isIE7 = false;
/*@cc_on @*/

/*@if (@_jscript_version <= 5.6)
 // The above conditional compilation for IE is equivalent to
 // a conditional comment in HTML of 'if lte IE 6'
 isIE6 = true;
 /*@end @*/

/*@if (@_jscript_version > 5.6)
 // The above conditional compilation for IE is equivalent to
 // a conditional comment in HTML of 'if lte IE 6'
 isIE7 = true;
 /*@end @*/

function addEvent(obj, eventType, fn){

	if (typeof obj === "string") {
		obj = document.getElementById(obj);
	}

    /* adds an eventListener for browsers which support it
     Written by Scott Andrew: nice one, Scott */
    if (eventType === "load") {
        //hack me
        loadEventList.addLoadEvent(fn);
        return true;
    }
	if (!obj) {
		return null;
	}
    
    if (obj.addEventListener) {
        obj.addEventListener(eventType, fn, false);
        return true;
    }
    else 
        if (obj.attachEvent) {
            var r = obj.attachEvent("on" + eventType, fn);
            return r;
        }
        else {
            return false;
        }
}


var loadEventList = [];
loadEventList.addLoadEvent = function(fn){
    loadEventList[loadEventList.length] = fn;
};

loadEventList.hasFired = false;
loadEventList.fireLoadEvents = function(){
    for (var i = 0; i < loadEventList.length; i++) {
        loadEventList[i]();
    }
    loadEventList.hasFired = true;
};

/* the following is a hack to replicate DOMContentLoaded in browsers
 other than Firefox.  It is basically copied from
 http://dean.edwards.name/weblog/2006/06/again/
 */
if (/WebKit/i.test(navigator.userAgent)) { // Safari
    var _timer = setInterval(function(){
        if (/loaded|complete/.test(document.readyState)) {
            clearInterval(_timer);
            loadEventList.fireLoadEvents(); // call the onload handler
        }
    }, 100);
}
else 
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", loadEventList.fireLoadEvents, false);
    }
    else {
    // IE HACK
    /*@cc_on @*/
    /*@if (@_win32)
     document.write("<script id='__ie_onload' defer='defer' src='//:'><\/script>");
     var script = document.getElementById("__ie_onload");
     script.onreadystatechange = function() {
	     if (this.readyState == "complete") {
		     loadEventList.fireLoadEvents(); // call the onload handler
	     }
     };
     /*@end @*/
    }

var safeLoadEventList = [];
function addSafeLoadEvent(fn) {
	if (!(isIE6 || isIE7)) {
		addEvent(document, 'load', fn);
		return true;
	} else {
		// This is IE6 or 7 and therefore can't have document.body.appendChilds or innerHTMLs until the whole page has loaded.
		// See http://support.microsoft.com/kb/927917 for more information
		safeLoadEventList.push(fn);
		return true;
	}
}

safeLoadEventList.hasFired = false;
safeLoadEventList.fireLoadEvents = function() {
    for (var i = 0; i < safeLoadEventList.length; i++) {
        safeLoadEventList[i]();
    }
    safeLoadEventList.hasFired = true;
};

if ((isIE6 || isIE7)) {
	window.attachEvent("onload", safeLoadEventList.fireLoadEvents);
}

function getElementsByClassName(className, tag, elm) {
	tag = tag || "*";
	elm = elm || document;
	className = new RegExp('\\b' + className + '\\b');
	var elements = elm.getElementsByTagName(tag);
	var returnElements = [];

	forEachElementOf(elements, function(element) {
		if(className.test(element.className)) {
			returnElements.push(element);
		}
	});
	return returnElements;
};

