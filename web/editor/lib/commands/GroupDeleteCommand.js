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
 * This is triggered when you delete a Group.
 * When you do that it will trigger many FigureDeleteCommands so
 * this Command is a composite command.
 * @this {GroupDeleteCommand} 
 * @constructor
 * @author Alex Gheorghiu <alex@scriptoid.com>
 */
function GroupDeleteCommand(groupId){
    this.oType = 'GroupDeleteCommand';
    
    /**Any sequence of many mergeable actions can be packed by the history*/
    this.mergeable = false;
    
    this.groupId = groupId;
    
    //undo data 
    this.deletedGroup = null;
    this.deletedFiguresCommands = [];
    
        
    this.firstExecute = true;
}


GroupDeleteCommand.prototype = {
    
    /**This method got called every time the Command must execute*/
    execute : function(){  
        if(this.firstExecute){
            
            this.deletedGroup = STACK.groupGetById(this.groupId);
            
            var figuresIds = STACK.figureGetIdsByGroupId(this.groupId);
            for(var i=0; i<figuresIds.length; i++){
                var tmpDelFig = new FigureDeleteCommand(figuresIds[i]);
                tmpDelFig.execute();
                this.deletedFiguresCommands.push(tmpDelFig);
            }
                                    
            
            //delete it
            STACK.groupDestroy(this.groupId);            
            
            //interface settings            
            selectedGroupId = -1;
            state = STATE_NONE;
            setUpEditPanel(canvasProps);
            
            this.firstExecute = false;
        }
        else{ //a redo
            throw "Not implemented";
        }
    },

    
    /**This method should be called every time the Command should be undone*/
    undo : function(){        
        if(this.deletedGroup){
            //add back figures
            for(var i=0; i< this.deletedFiguresCommands.length; i++){
                this.deletedFiguresCommands[i].undo();
            }
            
            //add back group
            STACK.groups.push(this.deletedGroup);
            
            
            selectedGroupId = this.groupId;
            state = STATE_GROUP_SELECTED;
            
        }
        else{
            throw "No soted deleted figure";
        }
    }
}

