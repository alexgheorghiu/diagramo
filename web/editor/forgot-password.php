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

require_once dirname(__FILE__) . '/common/delegate.php';

if (!isset($_SESSION)) {
    session_start();
}

$title = "Forgot password | Diagramo";
$description = $title;

$key = explode(" ", $description);
$keywords = trim($key[0]);
for ($i = 1; $i < count($key); $i++){
    $keywords .= "," . trim($key[$i]);
}
?>

<!DOCTYPE html>
<html>

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

        <h1>Forgot password</h1>

        <div class="content">

            <? require_once './common/messages.php'; ?>
            <form action="./common/controller.php" method="POST">
                <input type="hidden" name="action" value="forgotPasswordExe"/>
                Email:<br />
                <input type="text" name="email" class="myinput"/><br /><br />
                Add the text in image:<br />
                <input type="text" name="captcha" class="myinput"/><br /><br />
                <img src="./common/captcha.php" alt="To see this image use the latest version of any browser."/>                
                <br/><br />
                <input type="submit" value="Send" class="mysubmit" />
            </form>

        </div>

        <? include "footer.php"; ?>

    </body>
</html>