<?php


include_once dirname(__FILE__) . '/settings.php';
#echo(dirname(__FILE__) . '/settings.php');

if(DEVELOPMENT){
    error_reporting(E_ALL ^ E_NOTICE); //all by Notices
    ini_set('display_errors', '1');
}
?>
