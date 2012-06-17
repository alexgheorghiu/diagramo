<?php
    $url = $_GET["url"];
    $parts = explode(".",$url);
    header("Content-Type: image/".$parts[sizeof($parts)-1]);
    if(strstr($url,"http://")){
        echo file_get_contents($url);
    }
    else{
        echo file_get_contents(dirname(__FILE__)."/".$url);
    }

?>
