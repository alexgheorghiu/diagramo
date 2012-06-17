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

$page = "mysqttings";
?>

<!DOCTYPE html>
<html>
    <head>
        <title>Diagramo - Settings</title>
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
            
            
            <div id="content"  style="text-align: center;">
                <?require_once dirname(__FILE__) . '/common/messages.php';?>
                <br/>

                <div class="form" style="width: 400px;">
                    <div class="formTitle" >
                        <span class="menuText" style="font-size: 14px; font-family: Arial; color: #6E6E6E;">Settings</span>
                    </div>
                    <form action="./common/controller.php" method="post">
                        <input type="hidden" name="action" value="saveSettingsExe"/>
                        <table align="center" width="380" style="margin-bottom: 10px;">
                            <tr>
                                <td align="left"><span class="formLabel">Email</span></td>
                                <td align="right"><span class="formLabel"><?=$loggedUser->email?></span></td>
                            </tr>
                            <tr>
                                <td align="left"><span class="formLabel">Name</span></td>
                                <td align="right"><span class="formLabel"><?=$loggedUser->name?></span></td>
                            </tr> 
                            <tr>
                                <td align="left"><span class="formLabel">Current password</span></td>
                                <td align="right"><input  class="formField" size="40"   type="password" name="currentPassword"/></td>
                            </tr>
                            <tr>
                                <td align="left"><span class="formLabel">New password</span></td>
                                <td align="right"><input  class="formField" size="40"   type="password" name="newPassword"/></td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <div style="vertical-align: middle; text-align: right;">
                                        <a href="./editor.php"><img src="./assets/images/cancel.gif" border="0" style="vertical-align: middle;" /></a>
                                       <input type="image" src="./assets/images/save.gif" style="vertical-align: middle;"  value="Save"/>
                                    </div>
                                </td>
                            </tr>
                        </table>
                        
                    </form>
                </div>
            </div>

            <p/>

            <div class="copyright">&copy; <?=date('Y')?> Diagramo</div>
        </div>
    </body>
</html>

