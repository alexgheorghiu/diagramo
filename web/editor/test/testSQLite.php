<?php
/**
 * Simple script to play with SQLite
 *
 * Be nible;
 * @author alex@scriptoid.com
 */

$user_table = <<<EUT
CREATE TABLE user (
	id INTEGER PRIMARY KEY,
	email varchar(20)	
);
EUT;

#print $user_table;

if ($db = sqlite_open('mysqlitedb', 0666, $sqliteerror)) {
    #create table
    sqlite_query($db, $user_table);

    #insert some data
    sqlite_query($db, "INSERT INTO user (email) VALUES ('alex@scriptoid.com') ");

    #run select query
    $query = sqlite_query($db, 'SELECT * FROM user LIMIT 25');
    $result = sqlite_fetch_all($query, SQLITE_ASSOC);

    #display results
    foreach ($result as $entry) {
        echo "\nId: " . $entry['id'] . '  E-mail: ' . $entry['email'];
    }
} else {
    die($sqliteerror);
}
?> 
?>