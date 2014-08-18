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


$delegate = new Delegate();

$loggedUser = $delegate->userGetById($_SESSION['userId']);

//only Admin can edit another user
if($loggedUser->level != User::LEVEL_ADMIN){
    echo "No right to edit user";
    exit();
}

if(!is_numeric($_REQUEST['userId'])){
    echo "Wrong user";
    exit();
}

$user = $delegate->userGetById($_REQUEST['userId']);

?>

<!DOCTYPE html>
<html>
    <!--Copyright 2010 Scriptoid s.r.l-->
    <head>
        <title>Users - Diagramo</title>
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
    </head>
    <body>
        <? require_once dirname(__FILE__) . '/header.php'; ?>

        <div id="content" style="text-align: left; /*border: solid 1px red;*/ padding-left: 100px;">
            <? require_once dirname(__FILE__) . '/common/messages.php'; ?>
            <br/>
            
           
            <p/>

            <!--Edit user-->
            <?if($loggedUser->level == User::LEVEL_ADMIN){?>
            <div class="form"  style="width: 600px;">
                <div class="formTitle" >
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td width="400"><span class="formLabel" style="font-size: 14px; font-family: Arial; color: #6E6E6E;">Edit user</span></td>
                            <td colspan="2">&nbsp;</td>
                        </tr>
                    </table>
                </div>
                
                <form action="./common/controller.php" method="POST">
                    <input type="hidden" name="action" value="editUserExe"/>
                    <input type="hidden" name="userId" value="<?=$user->id?>"/>
                    <table>
                        <tr>
                            <td><label for="email">Email</label></td>
                            <td><?=$user->email?></td>
                        </tr>
                        <tr>
                            <td><label for="email">Password <br/>(leave it blank to keep current one)</label></td>
                            <td><input type="text" name="password" id="password" /></td>
                        </tr>
                        <tr>
                            <td><a href="./users.php">Cancel</a></td>
                            <td><input type="submit" value="Update"/></td>
                        </tr>
                    </table>
                </form>
            </div>
            <?}?>
            <!--End edit user-->
            
        </div>
        

    </body>
</html>
