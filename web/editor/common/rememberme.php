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
