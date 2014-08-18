<?php

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
