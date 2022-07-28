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
 * A singleton object used to log all messages in Diagramo.
 * It will adjust to any know (by us) browser and try to behave nice :)
 * 
 * This acts like a wrapper to Firebug
 * as if you do not have Firebug installed (or no FF used)
 * the application crashes due to the fact that 'console'
 * object is not present.
 * 
 * 
 * @constructor
 * @this {Log}
 * @see For IE9  <a href="http://msdn.microsoft.com/en-us/library/dd565625%28v=vs.85%29.aspx#consolelogging">http://msdn.microsoft.com/en-us/library/dd565625%28v=vs.85%29.aspx#consolelogging</a>
 **/
var Log  = {
    /**no debug at all*/
    LOG_LEVEL_NONE  : 0,

    /**show even the debug messages*/
    LOG_LEVEL_DEBUG : 1,

    /**show all up to (and including) info
     *Setting the log level at info level will slow your browser a lot....so use it carefully
     **/
    LOG_LEVEL_INFO : 2,

    /**show only errors*/
    LOG_LEVEL_ERROR : 3,

    /**It will keep the log level (anything above this level will be printed)*/
    level : this.LOG_LEVEL_ERROR,
    
    /**
    * The less important of all messages
    * @param {String} message - the message to be logged
    **/
    debug: function (message){
        if(typeof console !== 'undefined'){
            if(this.level <= this.LOG_LEVEL_DEBUG){
                
                //in FF is debug
                if(typeof console.debug == 'function'){
                    console.debug(message);
                }
                else{//TODO: in IE is log
//                    console.info(message);
                }
            }
        }
    },


    /**
    * The commonly used log message
    * @param {String} message - the message to be logged
    **/
    info : function (message){
        if(typeof console !== 'undefined'){
            if(this.level <= this.LOG_LEVEL_INFO){
                console.info(message);
            }
        }
    },

    /**
    * The worse kind of message. Usually a crash
    * @param {String} message - the message to be logged
    **/
    error : function (message){
        if(typeof console !== 'undefined'){
            if(this.level <= this.LOG_LEVEL_ERROR){
                console.error(message);
            }
        }
    },

    /**
     *Start grouping the log messages
     *@param {String} title - the title of the group
     *@see <a href="http://getfirebug.com/logging">http://getfirebug.com/logging</a>
     **/
    group : function(title){
        if(this.level <= this.LOG_LEVEL_INFO){ //ignore group if level not debug or info
            if(typeof console !== 'undefined'){           
                /**If we do not test for group() function you will get an error in Opera
                 *as Opera has it's own console...which does not have a group() function*/
                if(typeof console.group === 'function'){
                    console.group(title);
                }
            }
        }
    },

    /**Ends current message grouping*/
    groupEnd : function(){
        if(this.level <= this.LOG_LEVEL_INFO){ //ignore group if level not debug or info
            if(typeof console !== 'undefined'){
                /**If we do not test for groupEnd() function you will get an error in Opera
                 *as Opera has it's own console...which does not have a group() function*/
                if(typeof console.groupEnd === 'function'){
                    console.groupEnd();
                }
            }
        }
    }

}

/*Set the log level*/
//Log.level = Log.LOG_LEVEL_DEBUG; 
Log.level = Log.LOG_LEVEL_ERROR; 
//Log.level = Log.LOG_LEVEL_ERROR;
//Log.level = Log.LOG_LEVEL_NONE;

