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

/* This page is used for both logged users and outsiders to */

if (!isset($_SESSION)) {
    session_start();
}

require_once dirname(__FILE__) . '/common/rememberme.php';

#print_r($_SESSION['userId']);
$loggedUser = null;
if(isset($_SESSION['userId']) && is_numeric($_SESSION['userId'])){
    $loggedUser = $delegate->userGetById($_SESSION['userId']);
}

//guardian
#require_once dirname(__FILE__).'/common/guardian.php';
//TODO: use guardian instead
if (!isset($_SESSION['userId'])) {
    echo "Sic";
    exit();
}
$page = "save";
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Diagramo - Save diagram</title>
        <meta http-equiv="X-UA-Compatible" content="IE=9" />
        <meta http-equiv="Content-Type" content="application/xhtml+xml; charset=UTF-8" />
        <link rel="shortcut icon" href="./favicon.ico" type="image/x-icon" />
        <link href="./assets/css/style.css" type="text/css" rel="stylesheet"/>
        
        <script type="text/javascript">
            
            /**Trims a string
             *@param {String} str - the string to trim
             *@return {String} the trimmed string
             **/
            function trim(str){
                var res = str.replace(/^\s+/, '');
                res = res.replace(/\s+$/, '');
                
                return res;
            }
            
            function validateForm(){
                var title = document.getElementById('title');
                
                if(trim(title.value).length == 0){
                    alert('Title can not be empty');
                    return false;
                }
                else{
                    return true;
                }
                
            }
        </script>
        
        <script type="text/javascript" src="./assets/javascript/dropdownmenu.js?<?php echo time()?>"></script>    
        <script type="text/javascript" src="./lib/browserReady.js?<?php echo time()?>"></script>
        <script type="text/javascript" src="./lib/log.js?<?php echo time()?>"></script>
    </head>
    <body>
        <div id="page">
            <?php require_once dirname(__FILE__) . '/header.php'; ?>


            <div id="content" style="text-align: center;">
                <?php require_once dirname(__FILE__) . '/common/messages.php'; ?>
                <br/>
                <div class="form" style="width: 400px;">
                    <div class="formTitle" >
                        <span class="menuText" style="font-size: 14px; font-family: Arial; color: #6E6E6E;">Save</span>
                    </div>
                    
                    <form style="position: relative; height: 280px;" action="./common/controller.php" method="post">
                        <input type="hidden" name="action" value="firstSaveExe"/>
                        <div style="position: absolute; top: 10px; left: 20px; right: 20px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td><span class="formLabel">Title</span></td>
                                    <td width="100%">&nbsp;</td>
                                    <td> <input class="formField" style="margin-right: 0;" type="text" name="title" id="title" size="40"/></td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style="position: absolute; top: 50px; left: 20px;">
                             <span class="formLabel">Description(optional)</span>
                        </div>

                        <div style="position: absolute; top: 70px; left: 20px; right: 20px; text-align: right;">
                            <textarea name="description" style="left: 0; right: 0; width: 100%; height: 75px;"></textarea>
                        </div>

                        <div style="position: absolute; top: 160px; left: 20px;">
                            <input type="checkbox" name="public" value="true" /><span class="formLabel">Public</span>                            
                        </div>

                        <div style="position: absolute; top: 190px; left: 20px; color: gray; text-align: left;">
                            A <b>public</b> diagram will have direct links (<a href="http://en.wikipedia.org/wiki/Permalink" target="new">permalinks</a>) to anyone
                            but only the authors can edit it.
                        </div>

                        <div style="position: absolute; top: 240px; left: 20px; right: 20px;">
                            <input onclick="return validateForm();" type="image" src="./assets/images/save.gif" style="display: block; margin-left: auto; margin-right: 0;" value="Save"/>
                        </div>
                        
                    </form>
                </div>
                <p>&nbsp;</p>
            </div>

            <p/>

            <div class="copyright">&copy; <?php echo date('Y') ?> Diagramo</div>
           

        </div>

    </body>
</html>

