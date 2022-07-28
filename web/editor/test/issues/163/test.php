<?php
// read proxy configuration from file
$proxyConfig = parse_ini_file('proxy.ini');

// get user-defined flag for proxy usage
$useProxy = $proxyConfig['use_proxy'];
#print($useProxy);

// proxy enabled?
if ($useProxy == '1') {
    // get user-defined address, port, authorization flag, login and password for proxy
    $proxyAddress = $proxyConfig['proxy_address'];
    $proxyPort = $proxyConfig['proxy_port'];
    $proxyAuth = $proxyConfig['proxy_auth'];
    $proxyLogin = $proxyConfig['proxy_login'];
    $proxyPassword = $proxyConfig['proxy_password'];

    // construct http context
    $aContext = array(
        'http' => array(
            'proxy' => "tcp://$proxyAddress:$proxyPort",
            'request_fulluri' => true,
        ),
    );

    // proxy authorization enabled?
    if ($proxyAuth == '1') {
        // set proxy authorization header
        $aContext['http']['header'] = "Proxy-Authorization: Basic " . base64_encode($proxyLogin . ':' . $proxyPassword);
    }

    $cxContext = stream_context_create($aContext);

    // echo ping answer
    echo file_get_contents("http://diagramo.com/echo.php?voice=ping", FALSE, $cxContext);
} else {
    // echo ping answer
    echo file_get_contents("http://diagramo.com/echo.php?voice=ping");
}
?>