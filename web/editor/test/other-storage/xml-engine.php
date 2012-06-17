<?php
/**
 * @see http://devzone.zend.com/article/1713
 */
$dom = new DomDocument();
$dom->load("./articles.xml");
$titles = $dom->getElementsByTagName("title");
foreach ($titles as $node) {
    print $node->textContent . " ";
}
?>