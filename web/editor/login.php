<?php

require_once dirname(__FILE__) . '/common/delegate.php';

if (!isset($_SESSION)) {
    session_start();
}

$delegate = new Delegate();

$VERSION = $delegate->settingsGetByKeyNative('VERSION');


/**
 * Redirect to 'draw' if we are alredy logged or if we have 'remember me' option active
 * 
 * [1] Session method
 * Check is user id session is set and is numeric
 */
if (isset($_SESSION['userId']) AND is_numeric($_SESSION['userId'])) {

    // Load user as object, from SQL by id
    $loggedUser = $delegate->userGetById(abs(intval($_SESSION['userId'])));

    // If exists a logged user
    if (isset($loggedUser) && is_numeric($loggedUser->id)) {
        redirect('./editor.php');
    }

    /**
     * [2] Cookie method
     * Check if user cookie is set
     */
} elseif (isset($_COOKIE['biscuit'])) {

    // Decode the cookie data
    $userCookie = packer($_COOKIE['biscuit'], PACKER_UNPACK);

    // Validate data
    if (validateEmail($userCookie['email'], null) AND validateString($userCookie['password'], null, 1)) {
        // Load user as object, from SQL by id
        $loggedUser = $delegate->userGetByEmailAndCryptedPassword($userCookie['email'], $userCookie['password']);

        // If user is an object
        if (is_object($loggedUser)) {
            $_SESSION['userId'] = $loggedUser->id;
            redirect('./editor.php');
        }
    }
}
?>

<!DOCTYPE html>
<html>

<?
$title = "Login | Diagramo";
$description = $title;

$key = explode(" ", $description);
$keywords = trim($key[0]);
for ($i = 1; $i < count($key); $i++)
    $keywords .= "," . trim($key[$i]);
?>
    <head>
        <title><? echo $title; ?></title>
        <meta http-equiv="X-UA-Compatible" content="IE=9" />
        <meta name="description" content="<? echo $description; ?>" />
        <meta name="keywords" content="<? echo $keywords; ?>" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        <meta name="author" content="http://diagramo.com" />
        <meta name="language" content="en-us" />
        <meta name="robots" content="index,follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />

        <link rel="stylesheet" type="text/css" href="./assets/css/style.css" />
        <link rel="stylesheet" type="text/css" href="./assets/css/style_1.css" />
    </head>

    <body>

<? include "outsideheader.php"; ?>

        <h1>Login</h1>

        <div class="content">
            <?require_once './common/messages.php';?>
            <form action="./common/controller.php" method="POST">
                <input type="hidden" name="action" value="loginExe"/>
                <table>
                    <tr>
                        <td>Email:<br /><input type="text" name="email" value="<?=@$_REQUEST['email']?>" class="myinput" /></td>
                    </tr>
                    <tr>
                        <td><br />Password:<br /><input type="password" name="password" size="15" class="myinput" value="<?=@$_REQUEST['password']?>" /></td>
                    </tr>
                    <tr>
                        <td><input type="checkbox" checked name="rememberMe" value="true" /> Stay signed in</td>
                    </tr>
                    <tr>
                        <td valign="middle"><br /><input type="submit" value="Login" class="mysubmit" /></td>
                    </tr>
                </table>
                <br/>
                <!-- <a style="font-size: smaller;" href="./register.php">Create account</a> | -->
                <!-- <a style="font-size: smaller;" href="./forgot-password.php">Forgot password?</a>                 -->
            </form>

        </div>

        <? include "footer.php"; ?>

    </body>
</html>