<?php

$r = exec('java Echo', $out, $retval);
#$r = exec('dir', $out, $retval);
print($r);

?>