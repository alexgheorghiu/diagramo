<?php
/**Downloads a diagram source file*/
require_once dirname(__FILE__) . '/common/delegate.php';


if (!isset($_SESSION)) {
    session_start();
}

if (is_numeric($_REQUEST['diagramId'])) {
    $d = new Delegate();
    
    $diagram = $d->diagramGetById($_REQUEST['diagramId']);    
    $d->close();
    
    if (is_numeric($_SESSION['userId']) || $diagram->public) {
        $filePath = dirname(__FILE__) . '/data/diagrams/' . $_REQUEST['diagramId'] . '.dmo';


        if (file_exists($filePath)) {
            $fileSize = filesize($filePath);

            $fh = fopen($filePath, 'rb');
            $data = fread($fh, $fileSize);
            fclose($fh);


            header('Content-Type: application/json'); //see http://stackoverflow.com/questions/477816/what-is-the-correct-json-content-type
            
            //TODO: I do not know if I do not have to change it @see http://www.php.net/manual/en/function.header.php#107044
            header('Content-Transfer-Encoding: binary');
            header('Expires: 0');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Content-Disposition: attachment; filename="' . $_REQUEST['diagramId'] . '.dmo' . '"');
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
