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
        <script type="text/javascript">
            function init(){
                document.addEventListener('keypress', onKey, false);
            }
            
            function onKey(e){
                if(e.keyCode === 13){
                    var eLinkNext = document.getElementById('linkNext');
                    eLinkNext.click();
                }
            }
            
            window.addEventListener('load', init, false);
        </script>
        
    </head>
    <body>
        
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
                <a id="linkNext" href="step2.php"><img src="./assets/next.png" border="0"/></a>
            </div>
            
            
            <img style="display: none;" src="<?=DIAGRAMO?>/install.php?step=step1&version=<?=VERSION?>&session=<?=session_id()?>&url=<?=urlencode($appUrl)?>"/>
            <?php include 'buildno.php'?>
        </div>
    </body>
</html>