<?php
/**
 * http://zetcode.com/databases/sqlitephptutorial/
 */

$dbhandle = sqlite_open('test.db', 0666, $error);

//$stm = "DROP TABLE diagram";
//$ok = sqlite_exec($dbhandle, $stm, $error);
//
//
//$stm = "CREATE TABLE diagram (
//id INTEGER PRIMARY KEY,
//title VARCHAR(255),
//description TEXT,
//public BOOL,
//createdDate DATETIME NOT NULL,
//lastUpdate DATETIME NOT NULL,
//size INT UNSIGNED COMMENT 'The size of diagram in bytes'
//)";
//
////$stm = "CREATE TABLE Friends(Id integer PRIMARY KEY, 
////       Name text UNIQUE NOT NULL, Sex text CHECK(Sex IN ('M', 'F')))";
//$ok = sqlite_exec($dbhandle, $stm, $error);
//
//if (!$ok)
//   die("Cannot execute query. $error");
//
//$stm1 = "INSERT INTO diagram (title, description, createdDate, lastUpdate, size) 
//    VALUES('test', 'Test description', '2012-11-23 12:34:56', '2012-11-24 13:34:56', 1023)";
//$ok1 = sqlite_exec($dbhandle, $stm1);
//if (!$ok1) die("Cannot execute statement.");
//
//$stm1 = "INSERT INTO diagram (title, description, createdDate, lastUpdate, size) 
//    VALUES('test2', 'Test description2', '2012-11-23 12:34:56', '2012-11-24 13:34:56', 1023)";
//$ok1 = sqlite_exec($dbhandle, $stm1);
//if (!$ok1) die("Cannot execute statement.");
//
//echo "Table diagram created successfully";
//
//
//$query = "SELECT * FROM diagram";
//$result = sqlite_query($dbhandle, $query);
//if (!$result) die("Cannot execute query.");
//
//while ($row = sqlite_fetch_array($result, SQLITE_ASSOC)) {
//    echo "\n" . $row['id']  . " : " . $row['title'];
//}


class Diagram {

	public $id;
	public $title;
	public $description;
	public $public;
	public $createdDate;
	public $lastUpdate;

	function loadFromSQL($row) {
		$this->id = is_null($row['id']) ? null : $row['id'];
		$this->title = is_null($row['title']) ? null : $row['title'];
		$this->description = is_null($row['description']) ? null : $row['description'];
		$this->public = is_null($row['public']) ? null : $row['public'];
		$this->createdDate = is_null($row['createdDate']) ? null : $row['createdDate'];
		$this->lastUpdate = is_null($row['lastUpdate']) ? null : $row['lastUpdate'];
	}
}


class User {
	public $id;
	public $email;
	public $password;
	public $name;
	public $createdDate;
	public $lastLoginDate;
	public $lastLoginIP;
	public $lastBrowserType;
	public $admin;

	function loadFromSQL($row) {
		$this->id = is_null($row['id']) ? null : $row['id'];
		$this->email = is_null($row['email']) ? null : $row['email'];
		$this->password = is_null($row['password']) ? null : $row['password'];
		$this->name = is_null($row['name']) ? null : $row['name'];
		$this->createdDate = is_null($row['createdDate']) ? null : $row['createdDate'];
		$this->lastLoginDate = is_null($row['lastLoginDate']) ? null : $row['lastLoginDate'];
		$this->lastLoginIP = is_null($row['lastLoginIP']) ? null : $row['lastLoginIP'];
		$this->lastBrowserType = is_null($row['lastBrowserType']) ? null : $row['lastBrowserType'];
		$this->admin = is_null($row['admin']) ? null : $row['admin'];
	}
}

function diagramCreate($dbhandle, $title, $description, $public){
    $stm1 = sprintf("INSERT INTO diagram (title, description, public, createdDate, lastUpdate) 
        VALUES('%s', '%s', '%s', '%s', '%s')", 
            $title, $description, $public, gmdate('Y-m-d H:i:s'), gmdate('Y-m-d H:i:s'));
    #print($stm1);
    $ok1 = sqlite_exec($dbhandle, $stm1);
    if (!$ok1) die("Cannot execute statement.");    
}

function diagramGetById($dbhandle, $diagramId) {
    $d = false;
    $query = sprintf("SELECT * FROM diagram where id=%d", $diagramId);
    $result = sqlite_query($dbhandle, $query);
    if ($result) {
        $row = sqlite_fetch_array($result, SQLITE_ASSOC);
        if($row){
            $d = new Diagram();
            $d->loadFromSQL($row);
        }
    }
        
    return $d;
}


function diagramGetAll($dbhandle) {
    $diagrams = array();
    $query = "SELECT * FROM diagram ORDER BY title";
    $result = sqlite_query($dbhandle, $query);
    if ($result) {
        while($row = sqlite_fetch_array($result, SQLITE_ASSOC)){
            #print_r($row);
            $d = new Diagram();
            $d->loadFromSQL($row);
            $diagrams[] = $d;
        }
    }
        
    return $diagrams;
}

function diagramDeleteById($dbhandle, $diagramId){
    $query = sprintf("delete FROM diagram where id=%d", $diagramId);
    $result = sqlite_query($dbhandle, $query);
    if ($result) {
        
    }
}

if($_REQUEST['action'] == 'init'){    
    /*
    $stm = "DROP TABLE diagram";
    $ok = sqlite_exec($dbhandle, $stm, $error);
    if (!$ok) die("Cannot execute statement.");
    */
    
//    $stm = "CREATE TABLE diagram (
//    id INTEGER PRIMARY KEY,
//    title VARCHAR(255),
//    description TEXT,
//    public BOOL,
//    createdDate DATETIME NOT NULL,
//    lastUpdate DATETIME NOT NULL,
//    size INT UNSIGNED COMMENT 'The size of diagram in bytes'
//    )";   
//    $ok = sqlite_exec($dbhandle, $stm, $error);
//    if (!$ok) die("Cannot execute statement.");
    
//    
//    $stm1 = "INSERT INTO diagram (title, description, createdDate, lastUpdate, size) 
//        VALUES('test', 'Test description', '2012-11-23 12:34:56', '2012-11-24 13:34:56', 1023)";
//    $ok1 = sqlite_exec($dbhandle, $stm1);
//    if (!$ok1) die("Cannot execute statement.");
//
//    $stm1 = "INSERT INTO diagram (title, description, createdDate, lastUpdate, size) 
//        VALUES('test2', 'Test description2', '2012-11-23 12:34:56', '2012-11-24 13:34:56', 1023)";
//    $ok1 = sqlite_exec($dbhandle, $stm1);
//    if (!$ok1) die("Cannot execute statement.");

    #echo "Table diagram created successfully";    
    header('Location: ./play.php');
}else if($_REQUEST['action'] == 'populate'){
//    $stm1 = "INSERT INTO diagram (title, description, createdDate, lastUpdate, size) 
//        VALUES('test', 'Test description', '2012-11-23 12:34:56', '2012-11-24 13:34:56', 1023)";
//    $ok1 = sqlite_exec($dbhandle, $stm1);
//    if (!$ok1) die("Cannot execute statement.");
//
//    $stm1 = "INSERT INTO diagram (title, description, createdDate, lastUpdate, size) 
//        VALUES('test2', 'Test description2', '2012-11-23 12:34:56', '2012-11-24 13:34:56', 1023)";
//    $ok1 = sqlite_exec($dbhandle, $stm1);
//    if (!$ok1) die("Cannot execute statement.");  
    
    diagramCreate($dbhandle, 'Test', 'Simple description', true);
    header('Location: ./play.php');
}else if($_REQUEST['action'] == 'delete'){
    diagramDeleteById($dbhandle, $_REQUEST['diagramId']);
    header('Location: ./play.php');
}else{//default view?>
    <html>
        <body>
            <table border="1">
                <tr>
                    <td>id</td>
                    <td>title</td>
                    <td>description</td>
                    <td>public</td>
                    <td>createdDate</td>
                    <td>lastUpdate</td>
                    <td>delete</td>
                </tr>
            <?
            $diagrams = diagramGetAll($dbhandle);
            foreach($diagrams as $diagram){?>
                <tr>
                    <td><?=$diagram->id?></td>
                    <td><?=$diagram->title?></td>
                    <td><?=$diagram->description?></td>
                    <td><?=$diagram->public?></td>
                    <td><?=$diagram->createdDate?></td>
                    <td><?=$diagram->lastUpdate?></td>
                    <td><a href="?action=delete&diagramId=<?=$diagram->id?>">delete</a></td>
                </tr>
            <?}?>
            </table> 
            <a href="?action=init">Init</a> | 
            <a href="?action=populate">Populate</a>
        </body>
    </html>
<?}?>
        


<?
sqlite_close($dbhandle);
?>