<?php
/**
Small program to encode a PHP file
(humble) author: Alex Gheorghiu <galex@22plus.net>
TODO: Now a php file can start only with "<?php" and end with "?>". Remove this limitation if possible
*/

if(count($argv) != 3 && count($argv) != 2){
    printf("\nSyntax is: php %s input_file output_file ", $argv[0]);
    printf("\nOr: php %s input_file (input file will be replaced with encoded version of it ", $argv[0]);
    exit();    
}

$input = null;
$outputFile = null;
if(count($argv) == 3){ //case: encoder.php  input_file output_file 
    $input = $argv[1];
    print "Input: " . $input;

    $outputFile = $argv[2];
    print "Output: " . $outputFile;    
}
else if (count($argv) == 2){ //case: encoder.php input_file 
    $input = $argv[1];
    print "Input: " . $input;

    $outputFile = $input;
    print "Output (the same): " . $outputFile;    
}

$time = 'o' . md5(time());

#Load source file content
$content = file_get_contents($input);

#Open output file
$out = fopen($outputFile, 'w');




#eliminate the starting & ending of the file
$len = strlen($content);
$content = substr($content, 5, $len - 5 - 2); 
$encodedContent = encode($content);

#add preambul
fwrite($out, "<?php ");



#split function names
$e64s = stringtochar("base64_encode"); 
$e64v = 'o' . md5($time . "base64_encode"); 

$d64s = stringtochar("base64_decode");
$d64v = 'o' . md5($time . "base64_decode"); 

$ezips = stringtochar("gzdeflate");
$ezipv = 'o' . md5($time . "gzdeflate");

$dzips = stringtochar("gzinflate");
$dzipv = 'o' . md5($time . "gzinflate");

$rot13s = stringtochar("str_rot13");
$rot13v = 'o' . md5($time . "str_rot13");

#continue preambul
fwrite($out, sprintf("\$%s=\"%s\";", $time,stringtohex("base64_decode")) );

##CREATE SECOND LEVEL OF CONTENT
$secondLevelContent = '';

#generate variable name building
for($i=0;$i<15;$i++){    
    if(isset($e64s[$i])){
	if($i==0){
		$secondLevelContent .= sprintf("\$%s=\"\\x%s\";\n", $e64v, dechex(ord($e64s[$i])) ) ;
	}
	else{
		$secondLevelContent .= sprintf("\$%s.=\"\\x%s\";\n", $e64v, dechex(ord($e64s[$i])) ) ;
	}
        
    }    
    
    if(isset($d64s[$i])){
	if($i==0){
		$secondLevelContent .= sprintf("\$%s=\"\\x%s\";\n", $d64v, dechex(ord($d64s[$i])) ) ;
	}
	else{
		$secondLevelContent .= sprintf("\$%s.=\"\\x%s\";\n", $d64v, dechex(ord($d64s[$i])) ) ;
	}
        
    }
    
    if(isset($ezips[$i])){
	if($i==0){
		$secondLevelContent .= sprintf("\$%s=\"\\x%s\";\n", $ezipv, dechex(ord($ezips[$i])) ) ;
	}
	else{
		$secondLevelContent .= sprintf("\$%s.=\"\\x%s\";\n", $ezipv, dechex(ord($ezips[$i])) ) ;
	}
        
    }
    
    if(isset($dzips[$i])){
	if($i==0){
		$secondLevelContent .= sprintf("\$%s=\"\\x%s\";\n", $dzipv, dechex(ord($dzips[$i])) ) ;
	}
	else{
		$secondLevelContent .= sprintf("\$%s.=\"\\x%s\";\n", $dzipv, dechex(ord($dzips[$i])) ) ;
	}
        
    }        
    
    if(isset($rot13s[$i])){
	if($i==0){
		$secondLevelContent .= sprintf("\$%s=\"\\x%s\";\n", $rot13v, dechex(ord($rot13s[$i])) ) ;
	}
	else{
		$secondLevelContent .= sprintf("\$%s.=\"\\x%s\";\n", $rot13v, dechex(ord($rot13s[$i])) ) ;
	}
        
    }    
}

#test : print what we got
/*
fwrite($out, sprintf("print \$%s . \"\\n\";\n", $e64v) );
fwrite($out, sprintf("print \$%s . \"\\n\";\n", $ezipv) );
fwrite($out, sprintf("print \$%s . \"\\n\";\n", $d64v) );
fwrite($out, sprintf("print \$%s . \"\\n\";\n", $e64v) );
fwrite($out, sprintf("print \$%s . \"\\n\";\n", $rot13v) );
*/

#evaluate the rest
$secondLevelContent .= sprintf("eval(\$%s(\$%s(\$%s(\"%s\"))));", $rot13v, $dzipv, $d64v, $encodedContent) ;
print $secondLevelContent;

#encode second level too
$encodedSecondLevel = base64_encode($secondLevelContent);
#print $encodedSecondLevel;

#test
#fwrite($out, $secondLevelContent);

#write evaluate for second level
fwrite($out, sprintf("eval(\$%s(\"%s\"));", $time, $encodedSecondLevel) );





//a simple encode function used for testing
function encode($str){
    return base64_encode(gzdeflate(str_rot13($str)));
}

//a simple decode function used for testing
function decode($str){
    return str_rot13(gzinflate(base64_decode($str)));
}

//convert a string to an array of hex codes
function stringtohex($str){
    $r = '';
    for($i=0;$i<strlen($str); $i++){
        $r .= "\\x".dechex(ord($str[$i]));
    }
    return $r;
}


//convert a string to an array of chars
function stringtochar($str){
    $chars = array();
    for($i=0;$i<strlen($str); $i++){
        $chars[] = $str[$i];
    }
    
    return $chars;
}

fwrite($out, "?>");
fclose($out);
?>