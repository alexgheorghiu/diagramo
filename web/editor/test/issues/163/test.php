<?php
// read proxy configuration from file
$lines = parse_ini_file('proxy.ini');

// get user-defined address, port, authentification flag, login and password for proxy
$proxyAddress = $lines['proxy_address'];
$proxyPort = $lines['proxy_port'];
$proxyAuth = $lines['proxy_auth'];
$proxyLogin = $lines['proxy_login'];
$proxyPassword = $lines['proxy_password'];

// construct http context
$aContext = array(
    'http' => array(
        'proxy' => "tcp://$proxyAddress:$proxyPort",
        'request_fulluri' => true,
    ),
);

// proxy authentification enabled?
if ($proxyAuth == '1') {
    // set proxy authentification header
    $aContext['http']['header'] = "Proxy-Authorization: Basic " . base64_encode($proxyLogin . ':' . $proxyPassword);
}

$cxContext = stream_context_create($aContext);

// echo ping answer
echo file_get_contents("http://diagramo.com/echo.php?voice=ping", False, $cxContext);
?>