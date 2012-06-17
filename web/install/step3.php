<?php
include('start.php');
include('checkinstall.php');
include('../editor/common/utils.php');
include('umbilicus.php');


define('STEP', 'step3');

#we need to redirect to server

$fullURL = selfURL();
$appUrl = substr($fullURL, 0, strpos($fullURL, '/install'));

$errors = array();

//Try to do server side only if the form on the page was submited (action = verify)
if(isset ($_REQUEST['action']) && $_REQUEST['action'] == 'verify'){
    $passed = true;
    
     
    
    //test master admin login
    if(empty($_REQUEST['admin_name'])){
        $errors[] = "Administrator's name can not be empty";
        $passed = false;
    }
    if(empty($_REQUEST['admin_email'])){
        $errors[] = "Administrator's email can not be empty";
        $passed = false;
    }
    if(empty($_REQUEST['admin_pass'])){
        $errors[] = "Administrator's password can not be empty";
        $passed = false;
    }
    
    
    
    
    //Insert Company and Root into the database
    if(count($errors) == 0){
        //path to diagrmo db
        $dbFilePath = '../editor/data/diagramo.db';
        //$dbFilePath = 'diagramo.db';
        
        $db = new SQLite3($dbFilePath);
        
        //load commands
        $commands = getSQLCommands('./sql/sqllite3-schema.sql');
                
        //create tables
        foreach($commands as $command){
            $db->query($command);
            #print($command . "<p/>\n");
        }

        #exit();
        
        //add add admin
        $userSQL = sprintf("insert into `user` (`email`, `password`, `name`, `createdDate`)" 
            . "values('%s', '%s', '%s', '%s')",  
                trim($_REQUEST['admin_email']),
                md5(trim($_REQUEST['admin_pass'])),
                addslashes(trim($_REQUEST['admin_name'])),
                now()
                );
        $db->query($userSQL);
        
        //add path to local url
        $q = sprintf("insert into `setting` (`name`, `value`) values ('WEBADDRESS','%s')", $appUrl);
        $db->query($q);
        
        //add link to Diagramo
        $q =  sprintf("insert into `setting` (`name`, `value`) values ('DIAGRAMO','%s')", DIAGRAMO);
        $db->query($q);
        
        //add version in the database
        $q =  sprintf("insert into `setting` (`name`, `value`) values ('VERSION','%s')", VERSION);
        $db->query($q);
        
        $db->close();
    }
    //end insert Company and Root into the database
    
    
    #exit();
    
    if(count($errors) == 0){
        header('Location: ./step4.php');
        //header(sprintf('Location: %s/scriptStep4.php', ABC_SERVER));
    }
}
?>

<!DOCTYPE HTML>
<html>
    <head>
        <title>Step 3 - Settings | Diagramo</title>
        <link href="./assets/style.css" rel="stylesheet" type="text/css" />
        <script  language="JavaScript" type="text/javascript">            
            /**Detect browser's offset
             *@author Alex Gheorghiu <alex@scriptoid.com>
             **/    
            function getBrowserTimezone() {
                var curdate = new Date()

                var browserOffset = (-curdate.getTimezoneOffset()/60);

                return browserOffset;
            }
            
            /**Set up the browser's timezone for Company Time zone*/
            function defaultTimezome(){
                var timezoneSelect = document.getElementById('timezone');
                var tz = getBrowserTimezone();
                for(var i=0;i<timezoneSelect.length; i++){
                    if(timezoneSelect.options[i].value == tz){
                        timezoneSelect.selectedIndex = i;
                        break;
                    }
                }
            }
            
            /**Trigger a submit of the form*/
            function submitSettingsForm(){
                document.forms['settingsForm'].submit();
            }
        </script>
        <style type="text/css">
            .bigger {
                font-family: sans-serif;
                font-size: 18px;
                font-weight: bold;
                color: #009933;
            }

            
        </style>
    </head>
    <body>

        <div id="content">
            <?php include 'logo.php'?>
            <?php include 'breadcrumb.php' ?>
            <div id="main">
                <?if(count($errors) > 0){?>
                <div style="margin: 5px auto; width: 500px;" >
                    <?
                    foreach($errors as $error){
                        print('<div class="error">' . $error . '</div>');
                    }
                    ?>
                </div>
                <?}?>
                <form action="step3.php" name="settingsForm" method="post">
                    <input type="hidden" name="action" value="verify"/>
                    <table align="center" cellpadding="3" cellspacing="2" border="0">
                                                
                        <tr align="left">
                            <td class="bigger">Administrator account</td>
                        </tr>

                        <tr>
                            <td>
                                <table align="center">
                                    <tr>
                                        <td>Your name:</td>
                                        <td>&nbsp;&nbsp;</td>
                                        <td><input type="text" name="admin_name" value="<?=$_REQUEST['admin_name']?>" /><span class="required">*</span></td>
                                    </tr>

                                    <tr>
                                        <td>Your email:</td>
                                        <td>&nbsp;&nbsp;</td>
                                        <td><input type="text" name="admin_email" value="<?=$_REQUEST['admin_email']?>" /><span class="required">*</span></td>
                                    </tr>

                                    <tr>
                                        <td>Your password:</td>
                                        <td>&nbsp;&nbsp;</td>
                                        <td><input type="password" name="admin_pass" value="<?=$_REQUEST['admin_pass']?>" /><span class="required">*</span></td>

                                    </tr>

                                </table>
                            </td>
                        </tr>                        

                        <tr>
                            <td colspan="4">
                                <span class="required">*</span> mandatory fields</td>
                        </tr>

                    </table>
                    <br />
                </form>

            </div>
            <div id="navigator">
                
                <a href="#" onclick="submitSettingsForm(); return false;">
                    <?if(count($errors) > 0){?>
                        <img src="./assets/retry.png" border="0"/>
                    <?}else{?>
                        <img src="./assets/next.png" border="0"/>
                    <?}?>
                </a>
            </div>            
            
            
            <img src="<?=DIAGRAMO?>/install.php?step=step3&version=<?=VERSION?>&session=<?=session_id()?>&url=<?=urlencode($appUrl)?>"/>
        </div>
    </body>
</html>