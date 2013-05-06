/**The dropdown space*/
var dropdownSpace = {
    /**the interval of time after which the menu will auto close*/ 
    timeout : 500,
                
    /**last close thread id*/
    closeTimerId : 0,
                
    /**last menu panel opened*/
    eMenuItem : null,
                
    /*Open hidden layer*/
    menuOpen : function(id){
                    
        // cancel close timer
        dropdownSpace.menuCancelCloseTime();

        // close old layer
        if(dropdownSpace.eMenuItem) {                    
            dropdownSpace.eMenuItem.style.visibility = 'hidden';
        }

        // get new layer and show it
        dropdownSpace.eMenuItem = document.getElementById(id);
        dropdownSpace.eMenuItem.style.visibility = 'visible';
    },
                
    /*Close showed layer*/
    menuClose: function ()
    {
        Log.info('Triggered ' + this);
        if(dropdownSpace.eMenuItem) {
            Log.info("Try to close it");
            dropdownSpace.eMenuItem.style.visibility = 'hidden';
        }
        else{
            Log.info("dropdownmenu.js: Nothing to close");
        }
    },

            
            
    /*Go close timer*/
    menuCloseTime:function ()
    {
        
        this.closeTimerId = window.setTimeout(dropdownSpace.menuClose, dropdownSpace.timeout);
    },


    /*Cancel close timer*/
    menuCancelCloseTime : function()
    {
        if(this.closeTimerId)
        {
            window.clearTimeout(dropdownSpace.closeTimerId);
            dropdownSpace.closeTimerId = 0;
        }
    }
}                 

document.addEventListener('click', dropdownSpace.menuClose, false);

//alert('loaded');