function var_dump(obj) {
    for (prop in obj) {
        //print("obj[" + prop + "] = " + obj[prop]);
    }
}


var I18N = {
    /**The actual data dictionary*/
    data: {},
            
    /**A flag to indicate the dictionary was loaded*/    
    loaded: false,
            
    /**Loads the dictionary. Usually from a file
     * @see http://stackoverflow.com/questions/196498/how-do-i-load-the-contents-of-a-text-file-into-a-javascript-variable
     */
    load: function() {
        //@see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
        var client = new XMLHttpRequest();
        client.open('POST', 'http://127.0.0.1:9999/editor/test/internationalization/i18n.txt', true);
        client.onreadystatechange = function() {
            if(client.readyState == 4){
                alert("Response: " + client.responseText);
                loaded = true;
            }
        }
        client.send();
    },
            
    /**Main function called by the I18N module
     */
    tr: function(key) {
        if (this.loaded) {
            return data[key];
        }

        return '!!! I18N not loaded !!!';
    }
};


function tr(key) {
    return I18N.tr(key);
}

//print(tr('hate'));