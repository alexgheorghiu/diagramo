<?php

/**This fragment tries to make a login based on the cookie stored on the client's browser*/

require_once dirname(__FILE__) . '/delegate.php';

$delegate = new Delegate();

if (!isset($_SESSION['userId']) && isset($_COOKIE['biscuit'])) { //if no user logged and we have a biscuit (cookie with credentials)

    //If we do not have an user logged we are gonna try to see if we have a biscuit (cookie with credentials) */
    // Decode the cookie data
    $userCookie = packer($_COOKIE['biscuit'], PACKER_UNPACK);

    // Validate data
    if (validateEmail($userCookie['email'], null) AND validateString($userCookie['password'], null, 1)) {
        // Load user as object, from SQL by id
        $loggedUser = $delegate->userGetByEmailAndCryptedPassword($userCookie['email'], $userCookie['password']);

        // If user is an object
        if (is_object($loggedUser)) {
            $_SESSION['userId'] = $loggedUser->id;
        }
    }
}

?>
