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

require_once dirname(__FILE__) . '/common/rememberme.php';

if (!isset($_SESSION['userId']) || !is_numeric($_SESSION['userId'])) {
    addError("Access denied");
    redirect('./index.php');
}

if(!is_numeric($_REQUEST['diagramId'])){
    print("Wrond Diagram");
    exit();
}

$delegate = new Delegate();

$loggedUser = $delegate->userGetById($_SESSION['userId']);

$diagram = $delegate->diagramGetById($_REQUEST['diagramId']);

$selfUrl = selfURL(); //find full URL to this script
$url = strleft($selfUrl, '/exportDiagram.php'); //find the URL of the application
$WEBADDRESS = $delegate->settingsGetByKeyNative('WEBADDRESS');
//$svgLink = $WEBADDRESS . '/editor/raster.php?type=svg&diagramId=' . $diagram->id;
$pngLink = $WEBADDRESS . '/editor/png.php?type=png&diagramId=' . $diagram->id;
//$jpgLink = $WEBADDRESS . '/editor/raster.php?type=jpg&diagramId=' . $diagram->id;
$dmoLink = $WEBADDRESS . '/editor/dmo.php?diagramId=' . $diagram->id;

$page = 'export';


$rawLicense = $delegate->settingsGetByKeyNative('LICENSE');
$l = new License();
if(trim($rawLicense) != ''){
    $l->load($rawLicense);
}

$currentHost = $_SERVER['HTTP_HOST'];
if(strpos($currentHost, ':')){
    $currentHost = substr($currentHost, 0, strpos($currentHost, ':'));
}

?>

<!DOCTYPE html>
<html>
    <!--Copyright 2010 Scriptoid s.r.l-->
    <head>
        <title>Export Diagram - Diagramo</title>
        <meta http-equiv="X-UA-Compatible" content="IE=9" />
        <link rel="stylesheet" media="screen" type="text/css" href="assets/css/style.css" />
        <script type="text/javascript">
            function confirmation(message){
                var answer = confirm(message);
                if(answer){
                    return true;
                }

                return false;
            }
        </script>
        
        <script type="text/javascript" src="./assets/javascript/dropdownmenu.js?<?php echo time()?>"></script>    
        <script type="text/javascript" src="./lib/browserReady.js?<?php echo time()?>"></script>
        <script type="text/javascript" src="./lib/log.js?<?php echo time()?>"></script>
    </head>
    <body>
        <?php require_once dirname(__FILE__) . '/header.php'; ?>

        <div id="content" style="text-align: left; /*border: solid 1px red;*/ padding-left: 100px;">
            <?php require_once dirname(__FILE__) . '/common/messages.php'; ?>

            <br/>
            <div class="form"  style="width: 600px;">
                <div class="formTitle" >
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td width="400"><span class="formLabel" style="font-size: 14px; font-family: Arial; color: #6E6E6E;">Export diagram: <?php echo $diagram->title?></span></td>
                            <td colspan="2">&nbsp;</td>
                        </tr>
                    </table>
                </div>
                
                <?php if(false && !$l->checkLicense() ){ ?>    
                    <div>
                        This feature (export as PNG and as DMO) is disable in free version.
                        <p/>
                        Please <a href="./license.php"><img style="vertical-align: middle;" src="assets/images/upgrade-button.png" /></a> to be enable these feature.
                    </div>            
                <?php } else if(false && $l->host != $currentHost) {?>
                    <div style="background-color: yellow; font-size: 30px;">
                        License host (<?php echo $l->host?>) is wrong. It should be: <?php echo $currentHost?> <p/> 
                        Please <a href="./license.php"><img style="vertical-align: middle;" src="assets/images/upgrade-button.png" /></a> to be enable these feature.
                    </div>            
                <?php } else {?>
                    <!--
                    <h3>As SVG</h3>
                    <input type="text" value="<?php echo $svgLink?>"  style="width: 400px;"/> <br/>
                    <a href="<?php echo $svgLink?>" target="_blank"><?php echo $svgLink?></a>
                    <p/>
                    -->

                    <h3>As PNG</h3>
                    <input type="text" onclick="this.select()" onmouseup="return false" value="<?php echo $pngLink?>" style="width: 348px;" readonly="readonly"/><br/>
                    <a href="<?php echo $pngLink?>" target="_blank">Download PNG</a>
                    <p/>

                    <h3>As DMO</h3>
                    <input type="text" onclick="this.select()" onmouseup="return false" value="<?php echo $dmoLink?>" style="width: 289px;" readonly="readonly"/><br/>
                    <a href="<?php echo $dmoLink?>" target="_blank">Download DMO</a>
                    <p/>

                    <!--
                    <h3>As JPG</h3>
                    <input type="text" value="<?php echo $jpgLink?>" style="width: 400px;"/><br/>
                    <a href="<?php echo $jpgLink?>" target="_blank"><?php echo $jpgLink?></a>
                    <p/>
                    -->
                <?php }?>
                
                

                <a href="./editor.php?diagramId=<?php echo $diagram->id?>">back to edit diagram</a>
            </div>
        </div>

    </body>
</html>
