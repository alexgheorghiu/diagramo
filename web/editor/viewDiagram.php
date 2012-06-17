<?php
require_once dirname(__FILE__) . '/common/delegate.php';



if (!isset($_SESSION)) {
    session_start();
}

if(!is_numeric ($_REQUEST['diagramId'])){
    echo 'No hash';
    exit();
}

$delegate = new Delegate();
$diagram = $delegate->diagramGetById($_REQUEST['diagramId']);

//check if diagram is public
if(!is_object($diagram)){
    print "No diagram found";
    exit();
}

if(!$diagram->public){
    print "Diagram is not public";
    exit();
}
//end check
$WEBADDRESS = $delegate->settingsGetByKeyNative('WEBADDRESS');

//exit("here");
?>

<!DOCTYPE html>
<html>
    <!--Copyright 2010 Scriptoid s.r.l-->
    <head>
        <title><?=$diagram->title?></title>
        <meta name="description" content="<?=$diagram->description?>" />
        <meta http-equiv="X-UA-Compatible" content="IE=9" />
        <link rel="stylesheet" media="screen" type="text/css" href="http://<?=$WEBADDRESS?>/assets/css/style.css" />
    </head>
    <body>
        <div id="content" style="margin-left:  30px;">
            <h1><?=$diagram->title?></h1>
            <div><?=$diagram->description?></div>
            <div>Public </div>
            <p/>
            <div id="container">
                <img src="<?=$WEBADDRESS?>/editor/png.php?diagramId=<?=$diagram->id?>" width="800" height="600" border="1"/>            
            </div>            
        </div>
    </body>
</html>