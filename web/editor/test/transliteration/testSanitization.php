<?php

/**
 * Links:
 * http://gnuwin32.sourceforge.net/packages/libiconv.htm - Download the .exe installer with all dependencies included
 * http://en.wikipedia.org/wiki/Iconv
 * http://www.gnu.org/software/libiconv/
 */
setlocale(LC_ALL, 'en_GB');
//setlocale(LC_ALL, 'en_US');
//setlocale(LC_ALL, 'de_DE');
//setlocale(LC_CTYPE, 'en_US.UTF8');

print("\nlibrary version:" . ICONV_VERSION);
print("\nimplementation name:" . ICONV_IMPL);
print("\ninput encoding:" . ini_get('iconv.input_encoding'));
print("\ninternal encoding: " . ini_get('iconv.internal_encoding'));
print("\noutput encoding: " . ini_get('iconv.output_encoding'));


$strings = array(
    'Weiß, Goldmann, Göbel, Weiss, Göthe, Goethe und Götz', //not ok
    'Aegyptian first   dinasty deaths 2011 o\'la. They were pretty fucked',
    " Tragedia rutieră din Ungaria, soldată cu 14 morți",
//    'Знакомства LovePlanet.ru',
    '¿Alguien la estará esperando?'
);

function seo($str){
        

    
	//transliterate
	$translit = @iconv("utf-8","ASCII//TRANSLIT",$str);
//	$translit = @iconv("utf-8","ISO-8859-1//TRANSLIT",$str);
        //	$translit = iconv("utf-8","ISO-8859-1//TRANSLIT",$str);
        if($translit === false){
            print "Mama.....";
        }

	
	//trim spaces
	$trimmed = trim($translit);
        
        return $trimmed;
	
//	$compressSpaces = '/\s+/';
//	$s1 =  preg_replace($compressSpaces , ' ', $trimmed);
//	
//	$nonsToMinus = '/[^a-zA-Z0-9]+/';
//	$s2 = preg_replace($nonsToMinus, '-', $s1);
//	
//	return $s2;
}

//foreach($strings as $string){
//    print "\n<br/>" . seo($string);
//    
//}


?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset='utf-8'>  
        <meta http-equiv="X-UA-Compatible" content="IE=9" >        
    </head>
    <body>
        <form action="" method="post">
            <textarea name="text" cols="30" rows="10"></textarea>
            <p/>
            <input type="submit"/>
        </form>
        
        <div style="background-color: beige;">
            <?
            if( isset($_REQUEST['text']) ){
                print seo($_REQUEST['text']);
            }
            ?>                        
        </div>
        <div>
            <?
            foreach($strings as $string){
                print $string . "<p/>";
            }
            ?>
        </div>
    </body>
</html>
