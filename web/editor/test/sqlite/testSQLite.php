<?php
print uniqid() . "\n";

class Delegate extends SQLite3 {

    function __construct() {
        $this->open( dirname(__FILE__) .  '/test.db');
    }

    /**a wrapper method for executing a query*/
    public function executeSQL($query) {
        $result = $this->query($query);

        return $result;
    }
}

$d = new Delegate();

$qCreate = <<<EOQ
CREATE TABLE `entry` (
`id` INTEGER PRIMARY KEY,
`title` VARCHAR(255),
`description` TEXT
);
EOQ;

#$d->executeSQL($qCreate);

for($i=0; $i<10; $i++){
    $qAdd = sprintf("insert into `entry` (title, description) values ('%s','%s') ", uniqid(), uniqid());
    $d->executeSQL($qAdd);
}

$qGet = sprintf("select * from entry limit 0, 10");
$result = $d->executeSQL($qGet);

while ($row = $result->fetchArray()) {
    print_r($row);
}

$d->close();