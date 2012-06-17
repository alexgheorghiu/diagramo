<?php

/* * This script parses a .csv file into an SQL file.
 * 
 */

function parseFile($filePath) {
    //this will keep parsed records
    $records = array();

    //parse file
    $row = 0;
    if (($handle = fopen($filePath, "r")) !== FALSE) {
        //echo '<tr>';
        while (($data = fgetcsv($handle, 1000, "\t")) !== FALSE) {
            $num = count($data);
            //echo "\n$num fields in line $row: \n";

            for ($c = 0; $c < $num; $c++) {
                //echo $data[$c] . "\t";
            }

            $record = array('id' => $data[0],
                'email' => $data[1],
                'password' => $data[2],
                'name' => $data[3]
            );

            #if ($row > 1) { //just skip the column name
                $records[] = $record;
            #}

            $row++;
        }
        fclose($handle);
        //echo '</tr>';
    }
    
    return $records;
}

$records = parseFile('users.csv');
print_r($records);

?>
