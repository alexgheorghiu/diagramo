<?php
include('start.php');
include('checkinstall.php');
include('../editor/common/utils.php');
include('umbilicus.php');
define('STEP','step1');


$fullURL = selfURL();
$appUrl = substr($fullURL, 0, strpos($fullURL, '/install'));

?>
<!DOCTYPE HTML>
<html>
    <head>
        <title>Step 1 - Welcome | Diagramo</title>
        <link href="./assets/style.css" rel="stylesheet" type="text/css" />        
    </head>
    <body onload="">
        
        <div id="content">            
            <?php include 'logo.php'?>
            <?php include 'breadcrumb.php'?>
            <div id="main">
                <div style="margin-top: 20px; margin-left: 20px;">
                Welcome to Diagramo installation.
                <p/>
                This wizard will try to install the Diagramo application 
                for you. <br/>
                </div>
            </div>
            <div id="navigator">
                <a href="step2.php"><img src="./assets/next.png" border="0"/></a>
            </div>
            
            
            <img style="display: none;" src="<?=DIAGRAMO?>/install.php?step=step1&version=<?=VERSION?>&session=<?=session_id()?>&url=<?=urlencode($appUrl)?>"/>
        </div>
    </body>
</html>