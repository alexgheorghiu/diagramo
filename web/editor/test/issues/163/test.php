<?php
// read proxy configuration from file
$lines = file('proxy.config');

// get user-defined address, port, login and password for proxy
$proxyAddress = str_replace('ADDRESS:', '', $lines[0]);
$proxyPort = str_replace('PORT:', '', $lines[1]);
$proxyLogin = str_replace('LOGIN:', '', $lines[2]);
$proxyPassword = str_replace('PASSWORD:', '', $lines[3]);

// get proxy authentification header
$auth = base64_encode($proxyLogin . ':' . $proxyPassword);

// construct http context
$aContext = array(
    'http' => array(
        'proxy' => "tcp://$proxyAddress:$proxyPort",
        'request_fulluri' => true,
        'header' => "Proxy-Authorization: Basic $auth",
    ),
);
$cxContext = stream_context_create($aContext);

// echo ping answer
echo file_get_contents("http://diagramo.com/echo.php?voice=ping", False, $cxContext);
?>