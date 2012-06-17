<?php
$url = 'http://pipes.yahoo.com/pipes/pipe.run?_id=b04132218e9acce710f970eeefee2522&_render=php';

// Make the request
$phpserialized = file_get_contents($url);
// Parse the serialized response
$phparray = unserialize($phpserialized);

print('<pre>');
print_r($phparray);
print('</pre>')
?>
