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

require_once dirname(__FILE__) . '/common/delegate.php';



if (!isset($_SESSION)) {
    session_start();
}

if(!is_numeric ($_REQUEST['diagramId'])){
    echo 'No diagram Id';
    exit();
}

$delegate = new Delegate();
$diagram = $delegate->diagramGetById($_REQUEST['diagramId']);
$diagramdata = $delegate->diagramdataGetByDiagramIdAndType($_REQUEST['diagramId'], Diagramdata::TYPE_CSV);


$links = array();
if($diagramdata->fileSize > 0){ 
    $fh = fopen(getStorageFolder() . '/' . $diagramdata->diagramId . '.csv', 'r');
    $data = fread($fh, $diagramdata->fileSize);    
    fclose($fh);
    
    $csvLines = explode("\n", $data);
    
    foreach($csvLines as $csvLine){
    $shards = explode(',', $csvLine);
        $links[] = $shards;
    }
}




//check if diagram is public
if(!is_object($diagram)){
    print "No diagram found";
    exit();
}

if(!$diagram->public){
    print "Diagram is not public. A Diagram must be public to be publicly visible.";
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
        <title><?php echo $diagram->title?></title>
        <meta charset="UTF-8">
        <meta name="description" content="<?php echo $diagram->description?>" />
        <meta http-equiv="X-UA-Compatible" content="IE=9" />
        <link rel="stylesheet" media="screen" type="text/css" href="http://<?php echo $WEBADDRESS?>/assets/css/style.css" />
    </head>
    <body>
        <div id="content" style="margin-left: 30px;">
            <h1><?php echo $diagram->title?></h1>
            <div><?php echo $diagram->description?></div>
            <div>Public </div>
            <p/>
            <div id="container">
                <img usemap="#linkLayer" src="<?php echo $WEBADDRESS?>/editor/png.php?diagramId=<?php echo $diagram->id?>" width="800" height="600" border="0"/>            
            </div>
            <map name="linkLayer" id="linkLayer">
                <!-- <area shape="rect" coords="100,100,200,200" href="http://scriptoid.com" alt="Scriptoid"> -->
                <?php foreach($links as $link){?>
                <area shape="rect" coords="<?php echo $link[0]?>, <?php echo $link[1]?>, <?php echo $link[2]?>, <?php echo $link[3]?>" href="<?php echo $link[4]?>" alt="<?php echo $link[4]?>" target="_blank">
                <?php }?>
            </map>
            <!-- <textarea><?php echo $data?></textarea> -->
        </div>
    </body>
</html>