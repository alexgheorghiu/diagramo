<?php
/**
 * Basic model for SQLite
 */

$db = new SQLite3('diagramo.db');

/**
 * Find all tables in a database
 * @see http://www.sqlite.org/faq.html#q7
 */
$tables = array();
$stm = "select distinct tbl_name from sqlite_master";
$result = $db->query($stm);
while ($row = $result->fetchArray()) {
    $tables[] = $row['tbl_name'];
}

/**
 * Find all columns for a table
 * @see http://stackoverflow.com/questions/928865/find-sqlite-column-names-in-empty-table
 */
foreach($tables as $table){
    print "\n" . $table;
    $stm = sprintf("pragma table_info(%s)", $table);
    $result = $db->query($stm);
    while ($row = $result->fetchArray()) {
        print "\n\t" . $row['name'];
        print "\t" . $row['type'];
    }
}
?>
