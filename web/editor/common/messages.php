<?php

//display collected errors
if( isset($_SESSION['errors']) && is_array($_SESSION['errors'])) {
    echo '<div>';

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
    echo '<div>';
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
