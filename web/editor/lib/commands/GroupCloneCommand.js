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
 * This command just clones an existing {Group}. All it needs is an id of
 * cloned {Group}. 
 * 
 * If cloned group was permanent created group will be permanent too. Old
 * group will continue to be the selected group in diagram.
 * 
 * If cloned group was temporary then what is cloned are only the contained 
 * figures. They will not belong to any new group.
 * Old temporary group will continue to be the selected group in diagram.
 * 
 *
 * @this {GroupCloneCommand} 
 * @constructor
 * @param {Number} parentGroupId - the Id of parent {Group}
 * @author Alex <alex@scriptoid.com>
 * @author Janis Sejans <janis.sejans@towntech.lv>
 */
function GroupCloneCommand(parentGroupId){
    this.oType = 'GroupCloneCommand';
    
    this.firstExecute = true;
    
    /**This will keep the newly created  Group id*/
    this.groupId = null;
    
    /**This keeps the cloned group Id*/
    this.parentGroupId = parentGroupId;
    
    /**This keeps the cloned figures Id*/
    this.parentFiguresId = [];
}


GroupCloneCommand.prototype = {
    
    /**This method got called every time the Command must execute*/
    execute : function(){
        if(this.firstExecute){
            /**
             *TODO: see the class description above, this should change the behaviour a little
             *
            * The result of duplicating group is many separate figures, not the group, 
            * but these figures are selected as permanent group
            * so incase the user will want to duplicate group as group, he just needs
            * to group copied figures, which are already selected
            **/
            var createdFigure = null;
            var figuresToAdd = [];
            var groupFigures = STACK.figureGetByGroupId(this.parentGroupId);

            for(var i=0; i<groupFigures.length; i++ ){
                createdFigure = STACK.figureGetById(groupFigures[i].id).clone();
                createdFigure.transform(Matrix.translationMatrix(10,10));
                STACK.figureAdd(createdFigure);
                figuresToAdd.push(createdFigure.id);
                this.parentFiguresId.push(createdFigure.id);
            }
            
            var selectedGroup = STACK.groupGetById(this.parentGroupId);
            if(!selectedGroup.permanent){
                STACK.groupDestroy(this.parentGroupId);
            }
            
            this.groupId = STACK.groupCreate(figuresToAdd);
            selectedGroupId = this.groupId;
            setUpEditPanel(null);
            state = STATE_GROUP_SELECTED;
            
            this.firstExecute = false;
        }
        else{ //redo
            throw "Not implemented";
        }
    },
    
    
    /**This method should be called every time the Command should be undone*/
    undo : function(){ 
        var groupFigures = this.parentFiguresId;
        for(var i=0; i<groupFigures.length; i++ ){
            STACK.figureRemoveById(groupFigures[i]);
        }
        state = STATE_NONE;
    }
}