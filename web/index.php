<?php

//Check if already installed
if (!file_exists(dirname(__FILE__) . '/editor/data/diagramo.db') ) { //no settings file
    #print 'Application already installed';
    header("Location: ./install/step1.php");
    exit();
}
//End Check installation

header("Location: ./editor/login.php");
?>
