<?php

function logx($msg) {
    if (false) {
        $filePath = dirname(__FILE__) . '/log.txt';
        #print $filePath;
        $fh = fopen($filePath, 'a');
        if (!$fh) {
            print "Not able to open $filePath file";
            exit();
        }

        fwrite($fh, "\n" . $msg);
        fclose($fh);
    }
}

//logx('test');
?>
