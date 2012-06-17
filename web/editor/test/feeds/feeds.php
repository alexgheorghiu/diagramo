<?php
/**A simple snipped to retrieve the blog entries
 * @author <alex@scriptoid.com>
 */
include_once('./simple_html_dom.php');

define('NR_OF_POSTS',3);

$xml = simplexml_load_file("http://blog.diagramo.com/feeds/posts/default");
$entries = $xml->entry;

for($i=0; $i < NR_OF_POSTS; $i++){
    $entry = $entries[$i];
    $title = $entry->title; 
    $url = $entry->link[4]->attributes()->href; 
    
    print('<div><a href="' . $url . '">' .  $title . '</a></div>'); 
    print("\n");
    
    $htmlContent = new simple_html_dom('' . $entry->content); 
    $txtContent = $htmlContent->plaintext;
    
    //find a cutting position
    $cutPos = 100;
    while($cutPos > 0 ){
        if($txtContent[$cutPos] != ' '){
            $cutPos--;
        }
        else{
            break;
        }
    }
    
    print('<div>' . substr($txtContent, 0, $cutPos) . ' <a href="' . $url . '"> ... </a>' . '</div>'); 
    print("\n");
}
?>
