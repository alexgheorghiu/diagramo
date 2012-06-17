<?php
//Do not allow any other installation if we have settings.php
if (file_exists(dirname(__FILE__) . '/../common/settings.php')) {
    print 'Application already installed';
    exit();
}
//else{
//    print "File doesn't exist.";
//}
?>
