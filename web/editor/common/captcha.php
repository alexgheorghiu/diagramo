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

session_start();

header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
header('Content-type: image/svg+xml');

$rText = generateRandom();
$_SESSION['captcha'] = $rText;

/**Generates a random text*/
function generateRandom($length = 6, $vals = 'abchefghjkmnpqrstuvwxyz0123456789') {
    $s = "";

    while(strlen($s) < $length) {
        mt_getrandmax();
        $num = rand() % strlen($vals);
        $s .= substr($vals, $num+4, 1);
    }
    return $s;
}

/**Converts a string to SVG*/
function stringToSVG($str){
    $result = '';
        
    $glyphs = array();
    
    $x = 5; //start point --> x
    $y = 30; //start point --> y
    
    //generates glyphs
    for($i=0; $i<strlen($str); $i++){        
        $rotation = rand(-20, 20); //rotation degree
        $size = rand (20, 25); //size in pixels
        $jump = rand(-5, 5); //shift up or down by a number of pixels
        $glyph = sprintf('<text x="%d" y="%d" font-size="%d" transform="translate(%d, %d) rotate(%d) translate(-%d, -%d)">%s</text>%s',
                $x, $y + $jump, $size, $x, $y + $jump, $rotation, $x, $y + $jump, $str[$i], "\n"
                );
        $glyphs[] = $glyph;
        
        $x += 20; //move carret
    }
    
    $indexes = range(0, count($glyphs) - 1);
    shuffle($indexes); //now shuffle them 
    
    foreach($indexes as $index){
        $result .= $glyphs[$index];
    }
    
    return $result;
}

function image($text){
    //xml declaration
    print '<?xml version="1.0" encoding="utf-8"?>';
    
    //headers
    print '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN"
        "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"
             width="200" height="40"
    >';
    
    //background
    print ' <rect x="0" y="0" height="40" width="200"
        style="stroke: none; fill: none;" >
        </rect> ' ;
    
    //the text
    print stringToSVG($text);
    
    //end SVG
    print '</svg>';
}

image($rText);
?>
