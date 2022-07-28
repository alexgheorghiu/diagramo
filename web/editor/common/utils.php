<?php

/*
Copyright [2014] [Diagramo]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

date_default_timezone_set('America/New_York');
################################################################################
###   ERRORS   AND   SUCCESSFULLY   MESSAGES   #################################


/**
  * Returns the path to the data folder.
  * The path does not contain the trailing /
  */
function getDataFolder(){
    return dirname(__FILE__) . '/../data';
}

/**
  * Returns the path to the diagrams storage folder.
  * The path does not contain the trailing /
  */
 function getStorageFolder(){
     return getDataFolder() . '/diagrams';
 }

/**
 * Returns the path to the uploaded images storage folder.
 * The path does not contain the trailing /
 *
 *  @author Artyom Pokatilov <artyom.pokatilov@gmail.com>
 */
function getUploadedImageFolder(){
    return getDataFolder() . '/import';
}

/**
 * Returns the path to the proxy configuration file.
 * The path does not contain the trailing /
 * 
 * Note: Open default-proxy.ini file for more information
 * @see https://bitbucket.org/scriptoid/diagramo/issue/163/installation-step2-failing-on-internet
 * @author Artyom Pokatilov <artyom.pokatilov@gmail.com>
 */
function getProxyConfigPath(){
    return getDataFolder() . '/proxy.ini';
}

// Set a error message into session
function addError($error) {
    if(!empty($error)) {
        if(!isset($_SESSION['errors']) || !is_array($_SESSION['errors'])){
            $_SESSION['errors'] = array();
        }
        $_SESSION['errors'][] = $error;
    }
//    print_r($_SESSION);
//    exit();
}


// Set a successfully message into session
function addMessage($message) {
    if(!empty($message)) {
        if(!isset($_SESSION['errors']) || !is_array($_SESSION['messages'])){
            $_SESSION['messages'] = array();
        }
        $_SESSION['messages'][] = $message;
    }
}


// Check if we have errors messages into session
function errors() {
    if( isset($_SESSION['errors']) && is_array($_SESSION['errors']) AND count($_SESSION['errors']) >= 1) {        
        return true;
    } else {
        return false;
    }
}


/**
 * Pack/Unpack a string or an array
 *
 * @param string/array $string
 * @param string/array $theWay (can be 'encode' or 'decode')
 *
 * @author Alex
 * @since January, 2010
 */
define('PACKER_PACK', 'pack');
define('PACKER_UNPACK', 'unpack');
function packer($string, $theWay = PACKER_PACK) {

    if($theWay == PACKER_PACK) { //PACK
        if(is_array($string)) { //first serialize it
            $string = serialize($string);
        }
        $result = base64_encode(convert_uuencode(strrev(base64_encode($string))));
        return $result;

    } else { //UNPACK
        $string = base64_decode(strrev(convert_uudecode(base64_decode($string))));
        $string = unserialize($string);
        return $string;
    }
}


################################################################################
###   VALIDATORS   #############################################################



/**
 * Validate an integer
 *
 * @access	public
 * @param	integer
 * @param	integer/null
 * @param	integer/null
 * @return	boolean
 *
 * @author	Liviu
 * @since 	Oct 2, 2008
 */
function validateInteger($value, $message = null, $lowerLimit = null, $upperLimit = null) {

    $value = abs(intval($value));

    if($lowerLimit != null AND $value < $lowerLimit) {
        ($message != null) ? addError($message) : null;
        return false;
    }

    if($upperLimit != null AND $value > $upperLimit) {
        ($message != null) ? addError($message) : null;
        return false;
    }

    return true;
}



/**
 * Validate a php object
 *
 * @access	public
 * @param	object
 * @param	string
 * @return	boolean
 *
 * @author	Liviu
 * @since 	April 28, 2009
 */
function validateObject($object, $message) {
    if(!is_object($object)) {
        addError($message);
        return false;
    }

    return true;
}



/**
 * Validate a string
 *
 * @param	$value string - the string
 * @param	$lowerLimit integer/null - the lower limit
 * @param	$upperLimit integer/null - the upper limit
 * @return	boolean
 *
 * @author	Liviu
 * @since 	Oct 2, 2008
 */
function validateString($value, $message = null, $lowerLimit = null, $upperLimit = null) {

    if(empty($value)) {
        ($message != null) ? addError($message) : null;
        return false;
    }

    if(!empty($value) AND $lowerLimit != null AND strlen($value) < $lowerLimit) {
        ($message != null) ? addError($message) : null;
        return false;
    }

    if($upperLimit != null AND strlen($value) > $upperLimit) {
        ($message != null) ? addError($message) : null;
        return false;
    }

    return true;
}



/**
 * Validate an email address
 *
 * @access	public
 * @param	string
 * @param	integer/null
 * @param	integer/null
 * @return	boolean
 *
 * @author	Liviu
 * @since 	Oct 2, 2008
 */
function validateEmail($value, $message = null, $lowerLimit = null, $upperLimit = null) {

    if(empty($value)) {
        $message != null ? addError($message) : null;
        return false;
    }

    if(!empty($value) AND !preg_match("/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i", $value)) {
        ($message != null) ? addError($message) : null;
        return false;
    }

    if($lowerLimit != null AND strlen($value) < $lowerLimit) {
        ($message != null) ? addError($message) : null;
        return false;
    }

    if($upperLimit != null AND strlen($value) > $upperLimit) {
        ($message != null) ? addError($message) : null;
        return false;
    }

    return true;
}



/**
 * Validate if two strings are equal
 *
 * @param	string/integer $string1
 * @param	string/integer $string2
 * @param	string $message
 * @param	integer/null $lowerLimit
 * @param	integer/null $upperLimit
 * @return	boolean
 *
 * @author	Liviu
 * @since	April 28, 2009
 */
function validateEqual($string1, $string2, $message = null, $lowerLimit = null, $upperLimit = null) {

    if($string1 != $string2) {
        ($message != null) ? addError($message) : null;
        return false;
    }

    if($lowerLimit != null AND strlen($string1) < $lowerLimit) {
        ($message != null) ? addError($message) : null;
        return false;
    }

    if($upperLimit != null AND strlen($string1) > $upperLimit) {
        ($message != null) ? addError($message) : null;
        return false;
    }

    return true;
}



/**
 * Validate a date
 *
 * @param	string $date (eg DATE: 2009-09-27)
 * @param	string $message
 * @param	string/null $lowerLimit (date should be highter that that limit - eg DATE: 2009-09-27)
 * @param	string/null $upperLimit (date can't be highter that that limit - eg DATE: 2009-09-27)
 */
function validateDate($date, $message, $lowerLimit = null, $upperLimit = null) {

    if(empty($date)) {
        addError($message);
        return false;
    }

    list($year, $month, $day) = explode('-', $date);
    if(!checkdate($month, $day, $year)) {
        addError($message);
        return false;
    }

    if($lowerLimit != null AND strtotime($date) < strtotime($lowerLimit)) {
        addError($message);
        return false;
    }

    if($upperLimit != null AND strtotime($date) > strtotime($upperLimit)) {
        addError($message);
        return false;
    }

    return true;
}



/**
 * Validate an IP
 *
 * @param	string $ip
 * @param	streing $message
 * @return	boolean
 *
 * @author	Liviu
 * @since	May 01, 2009
 */
function validateIp($ip, $message = false) {
    if(preg_match("^([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3}^", $ip)) {
        return true;
    } else {
        addError($message);
        return false;
    }
}



/**
 * Validate an array
 *
 * @param	array	$array
 * @param	string $message
 * @param	integer/null $lowerLimit
 * @param	integer/null $upperLimit
 * @return	boolean
 *
 * @author	Liviu
 * @since	May 07, 2009
 */
function validateArray($array, $message = null, $lowerLimit = null, $upperLimit = null) {

    if(!is_array($array)) {
        ($message != null) ? addError($message) : null;
        return false;
    }

    if(is_array($array) AND $lowerLimit != null AND count($array) < $lowerLimit) {
        ($message != null) ? addError($message) : null;
        return false;
    }

    if(is_array($array) AND $upperLimit != null AND count($array) > $upperLimit) {
        ($message != null) ? addError($message) : null;
        return false;
    }

    return true;
}


function validateSerialized($data) {
    return (@unserialize($data) !== false);
}

################################################################################
################################################################################

/**Sends an email
 * @author Alex <alex@scriptoid.com>
 */
function sendEmail($to, $from, $subject, $body) {
    require_once(dirname(__FILE__) . "/settings.php"); 
    if(SMTP_ENABLE){
        return sendAdvanceEmail($to, $from, $subject, $body);
    }
    else{
        return sendDefaultEmail($to, $from, $subject, $body);
    }
}

/**
 * Send email function
 *
 * @author alex <alex@scriptoid.com>
 * @since March 23, 2010
 */
function sendDefaultEmail($to, $from, $subject, $body) {
    // Set email headers
    $headers .= "MIME-Version: 1.0" . "\r\n";
    #$headers .= "Content-type: text/html; charset=utf-8" . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
    $headers .= "To: <{$to}>" . "\r\n";
    $headers .= "From: Diagramo  <{$from}>" . "\r\n";
    $headers .= "Reply-To: {$from}". "\r\n";
            

    // Try to send email
    $sendEmail = @mail($to, $subject, $body, $headers);

    // If email was sended, return true
    if($sendEmail) {
        return true;
    } else {
        return false;
    }
}

/**Sends and advanced email
 * @see http://pear.php.net/manual/en/package.mail.mail-mime.example.php
 */
function sendAdvanceEmail($to, $from, $subject, $body) {
    require_once "Mail.php"; //you need to have pear and Mail installed (read INSTALL.txt file)
    require_once "Mail/mime.php"; //you need to have pear and Mail_Mime installed (read INSTALL.txt file)
    require_once(dirname(__FILE__) . "/settings.php"); //load SMTP settings
    
//    $host = $settings['host'];
//    $port = $settings['port'];
//    //$from = $settings['username'];        
//    $username = $settings['username'];
//    $password = $settings['password'];

    $mime = new Mail_mime("\n");
    $mime->setHTMLBody($body);

    $headers = array('From' => $from,
        'To' => $to,
        'Subject' => $subject);
    
    $headers = $mime->headers($headers); //update headers
    $body = $mime->get(); //update body
    
    $smtp = Mail::factory('smtp', array('host' => SMTP_HOST,
                'port' => SMTP_PORT,
                'auth' => true,
                'username' => SMTP_USERNAME,
                'password' => SMTP_PASSWORD));

    $mail = $smtp->send($to, $headers, $body);

    if (PEAR::isError($mail)) {
        //echo("<p>" . $mail->getMessage() . "</p>");
        return false;
    } else {
        //echo("<p>Message successfully sent!</p>");
        return true;
    }
}


/**
 * Get a date (GMTTIME) with a timezone offset
 *
 *	gmtTime() will return the current gmt 0 time
 *	gmtTime(3) will return the current gmt time +3 hours
 *	gmtTime(-3) will return the current gmt time -3 hours
 *
 * @param $tzOffset - number of hours from 0 GMT
 * @returns an integer - the unix timespan
 *
 * @author Alex
 * @since February, 2010
 * 
 * Here there is a problem as function time() get called under current timezone
 * (you can get it with date_default_timezone_get()).
 * This is good internally (to function) but what is returned is not correct under the
 * current timezone....so you do not have to use timezone at all
 */
function gmtTime($tzOffset = 0) {
    //get server time
    $serverTime = time();

    /* Server's offset in seconds
     * Timezone offset in seconds. The offset for timezones west of UTC is 
     * always negative, and for those east of UTC is always positive
     */
    $serverOffset = date('Z');


    return $serverTime - $serverOffset + 60 * $tzOffset;
}


/**
 * * @author Liviu, Alex
 */
function deprecated_gmtTime($tzOffset = 0) {


    //get the GMT present time
    $gmtString = gmdate('Y-m-d H:i:s', time());

    //convert GMT present time to integer
    $gmtInteger = strtotime($gmtString);

    //add the time zone offset to te GMT present time
    return $gmtInteger + 60*60*$tzOffset;
}


/**Returns day & time*/
function now($tzOffset = 0) {
    return date('Y-m-d H:i:s', gmtTime($tzOffset));
}


/**Returns today ONLY as date*/
function today($tzOffset = 0) {
    return date('Y-m-d', gmtTime($tzOffset));
}

/**Returns tomorrow ..ONLY DATE*/
function tomorrow($tzOffset = 0) {
    $localTime = gmtTime($tzOffset);
    //return date('Y-m-d', mktime(0, 0, 0, date("m")  , date("d")+1, date("Y")));
    return date('Y-m-d', mktime(0, 0, 0, date("m", gmtTime($tzOffset))  , date("d", gmtTime($tzOffset))+1, date("Y", gmtTime($tzOffset))));
}



function utf_8_sprintf ($format) {
    $args = func_get_args();

    for ($i = 1; $i < count($args); $i++) {
        $args [$i] = iconv('UTF-8', 'ISO-8859-2', $args [$i]);
    }

    return iconv('ISO-8859-2', 'UTF-8', call_user_func_array('sprintf', $args));
}


function generateRandom($length = 10, $vals = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabchefghjkmnpqrstuvwxyz0123456789-') {
    $r = "";
        
    $i = 0;
    while($i < $length){       
        $r .= $vals[rand(0, strlen($vals)-1)];        
        $i++;
    }    
    
    return $r;
}


// Make keywords
function makeMetaKeywords($string) {
    $badWords = array('-', ',', 'si', '&');
    $str = str_replace($badWords, ' ', $string);
    $str = compressSpaces($str);
    $str = str_replace(' ', ', ', $str);

    if($str[0] == ',') {
        $str = substr($str, 2);
    }
    return $str;
}


/**
 * Compress spaces
 *
 * @param	string $input
 * @return	string
 *
 * @author	Liviu
 * @since	May, 2009
 */
function compressSpaces($input) {
    return preg_replace('/\s+/', ' ', $input);
}


/**
 * Make a jTip
 *
 * @author	Liviu
 * @since	Dec 03, 2008
 */
function makeJTip($section, $title = null, $width = null, $lang = null) {
    if(!empty($title)) {
        $title = 'name="'. $title .'"';
    }

    if($lang != null) {
        $lang = '&amp;lang='.$lang;
    }

    echo '<a href="./../help.php?section='. $section .''. $lang .'" class="jTip" id="jTip'. mt_rand(001,999).'" '. $title .'><img src="./../assets/images/icons/help.png" border="0" /></a>';
}


/**
 * Fast redirect
 *
 * @param	string (full location)
 *
 * @author	Liviu
 * @since 	Feb 20, 2009
 */
function redirect($location, $isUrl = false) {

    if($isUrl) {
        if(!eregi('http', $location)) {
            $location = 'http://'. $location;
        }
    }

    header('Location: '. $location);
    exit();
}


/**Remove a folder recursively
 * @param $dir - the path to the folder
 * @see http://www.php.net/manual/en/function.rmdir.php
 * @author gianluca.toso@gmail.com
 * @author alex@scriptoid.com
 */
function rrmdir($dir) {
    $r = true;
    
    $fp = opendir($dir);
    
    if(!fp){
        return false;
    }
    
    while ($f = readdir($fp)) {
        $file = $dir . "/" . $f;
        if ($f == "." || $f == "..") {
            continue;
        } else if (is_dir($file) && !is_link($file)) {
            $r &= rrmdir($file);
        } else {
            $r &= unlink($file);
        }
    }
    
    closedir($fp);
    $r &= rmdir($dir);
    
    return $r;
}


/*Computes the MD5 for a a file
 * author : alex
*/
function md5ForFile($path) {
    $str = file($path);
    $result = md5(implode('', $str));
    return $result;
}

/**Returns the size of data (provided in bytes) in a human readable
 * format
 * @size - the the size of data in bytes
 * @author alex from scriptoid.com
 */
function humanSize($size) {
    if($size < pow(1024, 1)) {
        return $size . 'Bytes';
    }
    else if ($size < pow(1024, 2)) {
        return sprintf("%.2f", $size/pow(1024, 1)) . 'Kb'; //Kilo
    }
    else if ($size < pow(1024, 3)) {
        return  sprintf("%.2f", $size/pow(1024, 2)) . 'Mb'; //Mega
    }
    else if ($size < pow(1024, 4)) {
        return  sprintf("%.2f",$size/pow(1024, 3)) . 'Gb'; //Giga
    }
    else if ($size < pow(1024, 5)) {
        return  sprintf("%.2f",$size / pow(1024, 4)) . 'Tb'; //Tera
    }
    else if ($size < pow(1024, 6)) {
        return  sprintf("%.2f",$size / pow(1024, 5)) . 'Pb'; //Peta
    }
    else if ($size < pow(1024, 7)) {
        return  sprintf("%.2f",$size / pow(1024, 6)) . 'Eb'; //Exa
    }
    else if ($size < pow(1024, 8)) {
        return  sprintf("%.2f",$size /pow(1024, 7)) . 'Zb'; //Zeta
    }
    else if ($size < pow(1024, 9)) {
        return  sprintf("%.2f",$size /pow(1024, 8)) . 'Yb'; //Yota
    }
    else {
        return 'too big'; //:D
    }
}

/**
* Returns an array of NON empty string or returns an empty string
*/
function asplit($delimiter,$string){
	if(strlen($delimiter) == 0 || strlen($string) ==0 ){
		return array();
	}

	$r = split($delimiter,$string);
//	if(count($r) == 1 && $r[0] === $string){
//		return array();
//	}

	$result = array();
	foreach($r as $w){
		if(strlen(trim($w)) > 0){
			$result[] = $w;
		}
	}
	return $result;
}

/**
 * Find the URL under which the current PHP file is run
 * @see http://dev.kanngard.net/Permalinks/ID_20050507183447.html
 */
function selfURL() {
    $s = empty($_SERVER["HTTPS"]) ? '' : ($_SERVER["HTTPS"] == "on") ? "s" : "";
    
    $protocol = strleft(strtolower($_SERVER["SERVER_PROTOCOL"]), "/") . $s;
    
    $port = ($_SERVER["SERVER_PORT"] == "80") ? "" : (":" . $_SERVER["SERVER_PORT"]);
    
    return $protocol . "://" . $_SERVER['SERVER_NAME'] . $port . $_SERVER['REQUEST_URI'];
}


function strleft($s1, $s2) {
    return substr($s1, 0, strpos($s1, $s2));
}


/**s
 * Try to transform a string from UTF8 to ASCII version
 */
function sanitize($str){
            
        //trim (start/end)
	$trimmed = trim($str);
        #print "\n\t [Trimmed: >" . $trimmed . '< ]';
        
        //compress spaces (more into a single one)
	$compressSpaces = '/\s+/';
	$compressed =  preg_replace($compressSpaces , ' ', $trimmed);
        
        
	//transliterate (accents, special characters to ASCII - as much as possible)
	$translit = @iconv("utf-8","ASCII//TRANSLIT",$compressed);
        #print "\n\t [Translit: " . $translit . ' ]';

	
        
        //lower case
        $lowered = strtolower($translit);
	
        //replace any non accepted string to -
	$nonsDeleted = '/[^a-z0-9 ]+/';
	$s2 = preg_replace($nonsDeleted, '', $lowered);
        
        //replace spaces with dash
	$dashed = preg_replace('/\s+/', '-', $s2);
        
	
	return $dashed;
}


/**Computes the most common display name for an user
 * @param $user - an User object
 */
function displayName($user){
    $displayName = substr($user->email, 0, strpos($user->email, '@'));
    if(strlen($user->name ) > 0 ){
        $displayName = $user->name;
    }
    
    return $displayName;
}

/**
 * Gets data from a specific URL
 * It will try several methods before fails.
 * 
 * First we will see if there is any proxy.ini file set inside [data] folder
 * and then if the proxy is activated.
 * 
 * Then we will try with 
 *
 * @param $url - the URL to get data from
 * @return data if accessible or false if not accessible
 */
function get($url) {
    $proxyFilePath = getProxyConfigPath();
    
    $use_proxy = FALSE;
    
    if(file_exists($proxyFilePath)){ //use proxy settings only if proxy.ini is present
        $use_proxy = TRUE;
    }
                
    // Try to get the url content with file_get_contents()
    $getWithFileContents = getWithFileContents($url, $use_proxy);
    if ($getWithFileContents !== false) {
        return trim($getWithFileContents);
    }

    // Try to get the url content with cURL library
    $getWithCURL = getWithCURL($url);
    if ($getWithCURL !== false) {
        return trim($getWithCURL);
    }

    // Default, return false
    return false;
}

/**
 * Use file_get_contents to access data from URL
 * @return data if accessible or false if not accessible
 */
function getWithFileContents($fileLocation, $proxy = false) {
    // proxy enabled?
    if ($proxy) {
        
        // read proxy configuration from file
        $proxyConfig = parse_ini_file(getProxyConfigPath());
        
        if($proxyConfig['use_proxy'] === '1'){ //see if the proxy.ini file wants to use proxy :)
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

            return file_get_contents($fileLocation, False, $cxContext);
        }
        else{ //maybe not ;)
            return file_get_contents($fileLocation);
        }
    } else {
        return file_get_contents($fileLocation);
    }
}

/**
 * Use cURL to access data from URL
 * @return data if accessible or false if not accessible
 */
function getWithCURL($fileLocation) {
    if (function_exists('curl_init') AND function_exists("curl_exec")) {
        $ch = curl_init($fileLocation);

        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        curl_setopt($ch, CURLOPT_POST, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $data = curl_exec($ch);
        curl_close($ch);

        return $data ? $data : false;
    } else {
        return false;
    }
}


/**
 * Takes a special formatted sql file and split into commands
 * !!! THE COMMANDS ARE SPLIT BY COMMENTS !!!
 * @param $fileName - the file name of the SQL file
 */
function getSQLCommands($fileName) {
    $commands = array();

    $fh = fopen($fileName, 'r');
    if ($fh) {
        $command = '';
        while (($buffer = fgets($fh, 4096)) !== false) {
            if (strpos($buffer, '--') === 0) {  //we have a 'special' comment
                //add current command to commands
                if (count(trim($command)) > 0) {
                    $commands[] = $command;
                }

                //reset current command
                $command = '';
            } else if (count(trim($buffer)) > 0) { //we have a command (fragment), try to ignore blank lines
                $command .= ' ' . $buffer;
            }
        }

        //add last line command to commands
        if (count(trim($command)) > 0) {
            $commands[] = $command;
        }

        if (!feof($fh)) {
            echo "Error: unexpected fgets() fail\n";
        }

        fclose($fh);
    }

    return $commands;
}
?>