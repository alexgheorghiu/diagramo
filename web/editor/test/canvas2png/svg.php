<?php

/* * As the embedded web server of php 5.4.3 does not properly set contect type 
 * for SVG we will dump the file directly + headers */


$filePath = dirname(__FILE__) . "/" . $_REQUEST['file'];
if (file_exists($filePath)) {
    $fileSize = filesize($filePath);

    $fh = fopen($filePath, 'r');
    $data = fread($fh, $fileSize);
    fclose($fh);


    header('Content-Type: image/svg+xml');
	//header('Content-Type: image/jpeg');
    header('Expires: 0');
    header('Pragma: public');
    header('Content-Length: ' . $fileSize);

    print $data;
    flush();
} else {
    print "No file";
}
?>