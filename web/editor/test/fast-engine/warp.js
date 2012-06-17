/* 
 * Create / edit / update
 * 
 * User sort to sort (by types ?!?)
 */

function Animal(id, name){
    this.id = id;
    this.ids = ['id'];
    
    this.name = name;    
}

Animal.prototype = {
    ids : function(){
        return this.ids;
    }
}


var records = [];


/**
 *@param {Array} records
 *@param {Array} criteria
 **/
function find(records, criteria){
    
}

function addRecord(object){
    records.push(object);
}

function removeRecord(records, object){
    //records.splice(index, howMany, element1, elementN);
}





