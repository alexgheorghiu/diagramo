<?php
/**This file simply seach the /lib/sets folder and try to load all the figure sets
 */
$WEBADDRESS = $delegate->settingsGetByKeyNative('WEBADDRESS');
?>
<script language = "javascript1.2" type="text/javascript">
    var figureSets = [];
    
    /*Option 1:
     *We can use window.location like this:
     * url = window.location.protocol + window.location.hostname + ":" + window.location.port + ....
     * @see http://www.w3schools.com/jsref/obj_location.asp
     * 
     * Option 2:
     * Use http://code.google.com/p/js-uri/
     **/
    var figureSetsURL = '<?=$WEBADDRESS?>' + '/editor/lib/sets';
</script>
<?
$dirName = dirname(__FILE__);
$files = scandir($dirName);

foreach($files as $file){
    if($file != '.' && $file != '..'){
//        if(in_array($file, array('experimental')) ){ //skip this as experimental
//            continue;
//        }
        
        $fullPath = $dirName . '/' . $file;
        if(is_dir($fullPath)){
            echo '<script language = "javascript1.2" type="text/javascript" src="lib/sets/' . $file . '/' . $file.'.js"></script>' . "\n";
        }
    }
}
?>
