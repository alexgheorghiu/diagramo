
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
    <!--Copyright 2010 Scriptoid s.r.l-->
    <head>
        <title>HTML5 diagram editor</title>
        <link rel="stylesheet" media="screen" type="text/css" href="./assets/css/style.css" />
    </head>
    <body>
        <?php
        /*
         * To change this template, choose Tools | Templates
         * and open the template in the editor.
         */
        if (isset($_REQUEST['i'])) {
            print '<pre>';
            print '1: ' . $_REQUEST['i'];
            print '2: ' . $_GET['i'];
            print '3: ' . $_POST['i'];
            print '</pre>';
            print '4: ' . $_POST['i'];
        }

        print_r($_REQUEST);
        ?>
        <form method="post" action="./testEncoding.php">
            <textarea name="i"></textarea>
            <input type="submit"/>
        </form>
        <?phpinfo()?>
    </body>

</html>