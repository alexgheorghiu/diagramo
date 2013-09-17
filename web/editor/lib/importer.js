/* 
 * This is a small library the will help import from older version
 * of Diagramo
 */

/**Import first first Diagramo file format.
 * @param {JSONObject} o - the old version file JSON object
 * @returns {JSONObject} the new JSON version
 * */
function importFile(o){
    //initially we did not have Containers
    
    if('s' in o){ // 's' stands for Stack
        var jsonStack = o.s;
        if( !('containers' in jsonStack) ){
            jsonStack.containers = []; //add an empty container array
        }
    }
    
    if( !('p' in o) ){ // 'p' stands for ContainerFigureManager
        o.p = new ContainerFigureManager() ; //emptry ContainerFigureManager
    }
    
    return o;
}


