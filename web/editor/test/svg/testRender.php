<?php
header('Content-type: text/xml');
echo '<?xml version="1.0" encoding="UTF-8"?>';

?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <style type="text/css">
        td {background-color: #D2D2D2;}
    </style>
</head>
<body>

    <table border="1">
        <tr>
            <td>Simple</td>
            <td><?php include './example1.svg'?></td>
        </tr>
        <tr>
            <td>Rotate group of figure</td>
            <td><?php include './example2.svg'?></td>
        </tr>
        <tr>
            <td>Rotate a containing SVG</td>
            <td><?php include './example3.svg'?></td>
        </tr>	
    </table>
  
</body>
</html>
