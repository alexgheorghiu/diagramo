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

//display collected errors
if( isset($_SESSION['errors']) && is_array($_SESSION['errors'])) {
//    echo '<div>';

    // Remove duplicate values
    $_SESSION['errors'] = array_unique($_SESSION['errors']);

    echo '<div class="error">';
    foreach($_SESSION['errors'] as $key => $error) {
        echo "{$error}<br />";
    }
    echo '</div>';
    unset($_SESSION['errors']); //clear errors
}

//display colected messages
if(isset($_SESSION['messages']) && is_array($_SESSION['messages'])) {
//    echo '<div>';
    // Remove duplicate values
    $_SESSION['messages'] = array_unique($_SESSION['messages']);

    echo '<div class="message">';
    foreach($_SESSION['messages'] as $key => $message) {
        echo "{$message}<br />";
    }
    echo '</div>';
    unset($_SESSION['messages']); //clear messages
}

?>
