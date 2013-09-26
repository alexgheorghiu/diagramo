<?php
include '../../common/utils.php';

//setlocale(LC_ALL, 'en_GB');
//setlocale(LC_ALL, 'en_US');
//setlocale(LC_ALL, 'de_DE');
//setlocale(LC_CTYPE, 'en_US.UTF8');

print("\nlibrary version:" . ICONV_VERSION);
print("\nimplementation name:" . ICONV_IMPL);
print("\ninput encoding:" . ini_get('iconv.input_encoding'));
print("\ninternal encoding: " . ini_get('iconv.internal_encoding'));
print("\noutput encoding: " . ini_get('iconv.output_encoding'));

print("\n");

$strings = array(
    "   Aegyptian first   dinasty deaths 2011 . O'Reilly. They were pretty fucked", // English + weird chars
    'Weiß, Goldmann, Göbel, Weiss, Göthe, Goethe und Götz', //german    
    " Tragedia rutieră din Ungaria, soldată cu 14 morți", //romanian
    "Vanessa Hessler, l'égérie d'Alice ADSL, a révélé avoir eu une liaison avec l'un des fils Kadhafi. Rihanna hospitalisée en Suède", //french
    'Sneijder nog steeds in de race voor Gouden Bal', //holland
    'Grekisk omröstning väcker ilska i Europa', //swidish
    'Svensk back tæt på AGF?', //danish / denmark
    'Brad Pitt już nie pali. Jak został przyłapany z papierosem przez swoje córki.', //polish
    'Česká republika. Pravda vítězí', //cech
    'Cooperante italiana rapita in Algeria è in Mali, in mano ad al-Qaeda', //italian ?
    'Bebê de Wanessa não processará Rafinha', //portughese
    'Знакомства LovePlanet.ru', //russian
    'Σενάρια για επιστροφή στη δραχμή από τον Ξένο Τύπο' //greek

);



foreach($strings as $string){
    print "\n -->" . sanitize($string);    
}

?>