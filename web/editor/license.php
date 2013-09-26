<?php
require_once dirname(__FILE__) . '/common/delegate.php';

if (!isset($_SESSION)) {
    session_start();
}

require_once dirname(__FILE__) . '/common/rememberme.php';

if (!isset($_SESSION['userId']) || !is_numeric($_SESSION['userId'])) {
    addError("Access denied");
    //redirect('./index.php');
}

$delegate = new Delegate();

$loggedUser = $delegate->userGetById($_SESSION['userId']);

$rawLicense = $delegate->settingsGetByKeyNative('LICENSE');

$page = "license";

$DIAGRAMO = $delegate->settingsGetByKeyNative('DIAGRAMO');

?>

<!DOCTYPE html>
<html>
    <head>
        <title>Diagramo - manage license</title>
        <meta http-equiv="X-UA-Compatible" content="IE=9" />
        <meta http-equiv="Content-Type" content="application/xhtml+xml; charset=UTF-8" />
        <link rel="shortcut icon" href="./favicon.ico" type="image/x-icon" />
        <link href="./assets/css/style.css" type="text/css" rel="stylesheet"/>
        
        <script type="text/javascript" src="./assets/javascript/dropdownmenu.js?<?=time()?>"></script>    
        <script type="text/javascript" src="./lib/browserReady.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/log.js?<?=time()?>"></script>
    </head>
    <body>
        <div id="page">
            <?require_once dirname(__FILE__) . '/header.php'; ?>
            
            
            <div id="content"  style="text-align: center; background-color: #F6F6F6">
                <?require_once dirname(__FILE__) . '/common/messages.php';?>
                <br/>

                <?if($rawLicense == ''){?>
                <div class="form" style="width: 400px; text-align: left; ">
                    <div class="formTitle" >
                        <span class="menuText" style="font-size: 14px; font-family: Arial; color: #6E6E6E;">License</span>
                    </div>
                    <div style="text-align: left; /*letter-spacing: 0.1em;*/ line-height: 200%; padding-left: 10px;">
                        Please copy/paste the serial you got in the form bellow.
                        If you do not have a serial please <a href="<?=$DIAGRAMO?>/buy.php" target="_blank"><img style="vertical-align: middle;" src="assets/images/buy.png" /></a> one.<br/>                        
                    </div>
                    
                    <p/>
                    
                    <form action="./common/controller.php" method="post" style="padding-left: 10px;">
                        <input type="hidden" name="action" value="saveLicense"/>
                        <input type="hidden" name="host" value="<?=$_SERVER['SERVER_NAME']?>"/>
                        Serial key<br/>
                        <input type="text" name="serial" id="serial" style="width: 300px;"/>
                        <p/>
                        <input type="image" src="./assets/images/save.gif" style="vertical-align: middle;"  value="Save"/>
                    </form>
                </div>
                <?} else {
                    $l = new License();
                    $l->load($rawLicense);
                ?>
                    Ok, you have a license.
                    <br/>
                    Host: <?=$l->host?>
                    <br/>
                    Serial: <?=$l->serial?>
                <?}?>
            </div>

            <p/>

            <div class="copyright">&copy; <?=date('Y')?> Diagramo</div>
        </div>
    </body>
</html>

