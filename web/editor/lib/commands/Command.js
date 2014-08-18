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
 * An 'interface' for undoable actions, implemented by classes that specify 
 * how to handle action
 * 
 * QUESTION: Should we have something like no undoable actions (ex: delete a group)
 * @this {Command} 
 * @constructor
 * @author Alex <alex@scriptoid.com>
 */
function Command(){
    this.oType = 'Command';
    
    /**Any sequence of many mergeable actions that can be packed (merged into a single) by the history.
     *Example: all figure moves can be merges into a single command*/
    this.mergeable = true;
    
    /**Keeps track if we are executing this command for the first time.
     *Usually it there can be differences between first execute and a later execeut (redo)*/
    this.firstExecute = true;
    /*........*/
}


Command.prototype = {
    /**This method got called every time the Command must execute*/
    execute : function(){
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){
    }
}