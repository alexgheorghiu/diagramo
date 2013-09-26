<?php
//This is tiggered "AFTER" the image was saved

$filePath = './data.png';
$handle = fopen($filePath, "rb");
$fileSize = filesize($filePath);
$data = fread($handle, $fileSize);
fclose($handle);
/* See: 
 * http://php.net/manual/en/function.readfile.php (see example)
 * http://php.net/manual/en/function.header.php 
 */
header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="data.png"');
header('Content-Transfer-Encoding: binary');
header('Expires: 0');
header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
header('Pragma: public');
header('Content-Length: ' . $fileSize);
flush();
print $data;
?>
