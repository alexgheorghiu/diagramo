<?
    $fname = time();
    $parts = explode(".",$_FILES["fileToUpload"]["name"]);
    move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], dirname(__FILE__)."/userimages/".$fname.".".$parts[sizeof($parts)-1]);
    echo '{"File":"userimages/'.$fname.".".$parts[sizeof($parts)-1].'","figure":"'.$_GET["figureID"].'","primitive":"'.$_GET["primitive"].'"}';
?>