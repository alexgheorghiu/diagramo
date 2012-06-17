<?php

require_once "Mail.php";
require_once "Mail/mime.php";

$from = "scriptoid2010@gmail.com";
$to = "alex@scriptoid.com";
$subject = "Hi!";
$body = "Hi,\n\nHow are <b>you</b>?";

$mime = new Mail_mime("\n");
$mime->setHTMLBody($body);

$body = $mime->get();


$host = "ssl://smtp.gmail.com";
$port = "465";
$username = "scriptoid2010@gmail.com";
$password = "###";

$headers = array('From' => $from,
    'To' => $to,
    'Subject' => $subject);
$headers = $mime->headers($headers);

$smtp = Mail::factory('smtp', array('host' => $host,
            'port' => $port,
            'auth' => true,
            'username' => $username,
            'password' => $password));

$mail = $smtp->send($to, $headers, $body);

if (PEAR::isError($mail)) {
    echo("<p>" . $mail->getMessage() . "</p>");
} else {
    echo("<p>Message successfully sent!</p>");
}
?>
