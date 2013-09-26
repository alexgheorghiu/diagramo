<?php
/**As /data/import folder is protected by .htaccess
 * and we need to expose some uploaded/imported images
 * we use this script to go into that folder and pick the right image
 */
require_once dirname(__FILE__) . '/common/delegate.php';


if (!isset($_SESSION)) {
    session_start();
}

if (isset($_REQUEST['imgFileName'])) {
//    $d = new Delegate();
    
//    $diagram = $d->diagramGetById($_REQUEST['diagramId']);    
//    $d->close();
    
    if (true /*is_numeric($_SESSION['userId']) || $diagram->public*/) {
        $filePath = dirname(__FILE__) . '/data/import/' . $_REQUEST['imgFileName'];


        if (file_exists($filePath)) {
            $fileSize = filesize($filePath);

            $fh = fopen($filePath, 'rb');
            $data = fread($fh, $fileSize);
            fclose($fh);

            $ext = pathinfo($filePath, PATHINFO_EXTENSION);
            $mimetype = 'image/' . $ext;
            
            header('Content-Type: ' .  $mimetype );
            header('Content-Transfer-Encoding: binary');
            header('Expires: 0');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Content-Disposition: attachment; filename="' . $_REQUEST['imgFileName'] . '"');
            header('Pragma: public');
            header('Content-Length: ' . $fileSize);

            print $data;
            //print 'Alex';
            flush();
        } else {
            print "No file";
        }
    }
}
?>
