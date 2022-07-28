<?php

/*
Copyright [2014] [Scriptoid s.r.l]

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


$page = 'mydiagrams';

require_once dirname(__FILE__) . '/common/delegate.php';

if (!isset($_SESSION)) {
    session_start();
}

require_once dirname(__FILE__) . '/common/rememberme.php';

if (!isset($_SESSION['userId']) || !is_numeric($_SESSION['userId'])) {
    addError("Access denied");
    redirect('./editor.php');
}

$delegate = new Delegate();

$loggedUser = $delegate->userGetById($_SESSION['userId']);
$allDiagrams = $delegate->diagramGetAll();


/**Exctracts the name of an email address*/
function firstName($email){
    $rez = strpos($email, '@');
    if($rez){
        return substr($email, 0, $rez);
    }
    else{
        return substr($email, 0, 5);
    }
}
?>

<!DOCTYPE html>
<html>
    <!--Copyright 2010 Scriptoid s.r.l-->
    <head>
        <title>My diagrams - Diagramo</title>
        <meta http-equiv="X-UA-Compatible" content="IE=9" />
        <link rel="stylesheet" media="screen" type="text/css" href="assets/css/style.css" />
        
        <script type="text/javascript" src="./assets/javascript/dropdownmenu.js?<?php echo time()?>"></script>    
        <script type="text/javascript" src="./lib/browserReady.js?<?php echo time()?>"></script>
        <script type="text/javascript" src="./lib/log.js?<?php echo time()?>"></script>
        
        <script type="text/javascript">
            function confirmation(message){
                var answer = confirm(message);
                if(answer){
                    return true;
                }

                return false;
            }
        </script>
    </head>
    <body>
        <?php require_once dirname(__FILE__) . '/header.php'; ?>
        
        <div id="content" style="text-align: center; margin-left: auto; margin-right: auto;">
            <?php require_once dirname(__FILE__) . '/common/messages.php'; ?>
            <br/>
            
            
            
            <p/>
            
            <!--My diagrams-->
            <div style="width: 600px; margin-left: auto; margin-right: auto;">
                <div class="formTitle" >
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td width="200"><span class="formLabel" style="font-size: 14px; font-family: Arial; color: #6E6E6E;">My diagrams</span></td>
                            <td>&nbsp;</td>
                            <td width="200" align="right"><a style="text-decoration: none;" href="./common/controller.php?action=newDiagramExe"><img style="vertical-align:middle; margin-right: 3px; margin-top: -5px;" src="./assets/images/newdiagram.png" border="0" width="91" height="27"/></a></td>
                        </tr>
                    </table>
                </div>
                
                <table style="position:relative; /*background-color:#F6F6F6;*/ top: 0px; width: 596px; border: 1px solid gray;"  border="0" align="center" cellpadding="5" cellspacing="0" width="100%">
                    <!--Columns-->
                    <tr style="background-color:#EBEBEB;" >
                        <td align="center" ><span class="formLabel">Thumb</span></td>
                        <td align="left" ><span class="formLabel">Name</span></td>
                        <td align="left" ><span class="formLabel">View</span></td>
                        <td align="left" ><span class="formLabel">Export / Download</span></td>
                        <td align="left" ><span class="formLabel">Last Edit</span></td>                        
                        <td><span class="formLabel">Public</span></td>
                        <td><span class="formLabel">Settings</span></td>
                        <td><span class="formLabel">Delete</span></td>
                    </tr>     
                    
                    <!--Data-->
                    <?php for ($i=0; $i < count($allDiagrams); $i++) {
                         $myDiagram = $allDiagrams[$i];
                        //$svgLink = $url . '/diagram/' . $allDiagrams->hash . '.svg';
                        $svgLink = sprintf('./png.php?type=svg&diagramId=%d', $myDiagram->id);
                        $pngLink = sprintf('./png.php?diagramId=%d', $myDiagram->id);
                    ?>
                        <tr>
                            <td align="center">
                                <a href="./editor.php?diagramId=<?php echo $myDiagram->id ?>">               
                                    <img style="background-color: white; border: 1px solid #CCCCCC;" width="100" height="100" src="<?php echo $pngLink?>"/>
                                </a>
                            </td>
                            <td style="border-bottom: 1px solid white;" align="left" ><a href="./editor.php?diagramId=<?php echo $myDiagram->id ?>"><span class="formLabel"><?php echo $myDiagram->title ?></span></a></td>
                            <td align="center">
                                <a href="./viewDiagram.php?diagramId=<?php echo $myDiagram->id ?>">
                                    as PNG
                                </a>
                            </td>
                            <td align="center">
                                <a href="./dmo.php?diagramId=<?php echo $myDiagram->id ?>">
                                    export
                                </a>
                            </td>
                            
                            <td style="border-bottom: 1px solid white;" align="left" ><span class="formLabel"><?php echo strtolower(date('F', strtotime($myDiagram->lastUpdate))) . date(',d Y', strtotime($myDiagram->lastUpdate)) ?></span></td>                            
                            <td style="border-bottom: 1px solid white;" align="center" ><span class="formLabel"><?php echo $myDiagram->public ? 'public' : 'private' ?></span></td>
                            <td style="border-bottom: 1px solid white;" align="center"><a href="./editDiagram.php?diagramId=<?php echo $myDiagram->id ?>"><img style="vertical-align:middle; margin-right: 3px;" src="./assets/images/editdiagram.png" border="0" width="22" height="22"/></a></td>
                            <td style="border-bottom: 1px solid white;" align="center" ><a onclick="javascript: return confirmation('Do you really want to delete diagram?');" href="./common/controller.php?diagramId=<?php echo $myDiagram->id ?>&action=deleteDiagramExe"><img style="vertical-align:middle; margin-right: 3px;" src="./assets/images/deletediagram.png" border="0" width="22" height="22"/></a></td>
                        </tr>
                    
                        <tr>
                            <td colspan="3">&nbsp;</td>                            
                        </tr>
                    
                        <?php if($i < count($allDiagrams) - 1){ ?>
                        <tr>
                            <td colspan="6" style="border-top: 1px solid gray;">&nbsp;</td>
                        </tr>
                        <?php }?>
                    
                    <?php } ?>
                </table>
            </div>

            <p/>
            &nbsp;
            <p/>
  
            
            
        </div>
        <p></p>
        <div class="copyright">&copy; <?php echo date('Y')?> Diagramo</div>
                
    </body>
</html>
