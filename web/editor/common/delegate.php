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

define('DEBUG', false);

require_once dirname(__FILE__) . '/utils.php';



/**
 * LICENSE
 * License Class is not reflected in the Database (it was not generates by SQLarity)
 * To generate a license you need first 8 fields completed
 * @deprecated
 */
class License {
    //from client
    public $serial;   // buyer's serial number
    public $host; //Where the license will be installed
    
    //from server
    public $date;   // purchase date (SQL datetime) as 'yyyy-mm-dd'
    public $unlockKey;  // full key of the license (license object saved to a string)

    /**
     * Saves the License object (this) object to a string
     */
    public function save() {
        $this->unlockKey = $this->computeUnlockKey();
        return base64_encode(strrev(serialize($this)));
    }

    /**
     * Load the License object (this) from a string
     */
    public function load($str) {
        //nothing
    }

    /*
     * Computes License's full key based on its other values
     * The key is based on email, date, expiryDate, maxUsers and serial
     */

    protected function computeUnlockKey() {
        return "";
    }

    /** Check a license */
    public function checkLicense() {
        return true;
    }

}

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
    public $tutorial;

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
        $this->tutorial = is_null($row['tutorial']) ? null : $row['tutorial'];
    }

}


class Diagramdata {
	const TYPE_DMO = 'dia';
	const TYPE_SVG = 'svg';
	const TYPE_JPG = 'jpg';
	const TYPE_PNG = 'png';
	const TYPE_CSV = 'csv';

	public $diagramId;
	public $type;
	public $fileName;
	public $fileSize;
	public $lastUpdate;

	function loadFromSQL($row) {
		$this->diagramId = is_null($row['diagramId']) ? null : $row['diagramId'];
		$this->type = is_null($row['type']) ? null : $row['type'];
		$this->fileName = is_null($row['fileName']) ? null : $row['fileName'];
		$this->fileSize = is_null($row['fileSize']) ? null : $row['fileSize'];
		$this->lastUpdate = is_null($row['lastUpdate']) ? null : $row['lastUpdate'];
	}
}



class Setting {

	public $name;
	public $value;

	function loadFromSQL($row) {
		$this->name = is_null($row['name']) ? null : $row['name'];
		$this->value = is_null($row['value']) ? null : $row['value'];
	}
}

class Delegate extends SQLite3 {

    function __construct() {
        $this->open( dirname(__FILE__) .  '/../data/diagramo.db');
    }

    /**a wrapper method for executing a query*/
    public function executeSQL($query) {
        $result = $this->query($query);

        return $result;
    }
    
    /*     * Add a new entry. We should make wrappers around this function (make it private !?!)
     *  and never call it directly from outside Delegate
     *  $tableName - name of the table
     *  $object - the object
     *  $ids -  list of ids (default 'id'), usefull for multiple key or keys other then 'id'
     *  $nullify - if true unset values will be set to NULL, if false we will not touch existing column value
     * returns the 'id' of the created entry
     *  author: alex
     */

    protected function create($object, $ids = array('id'), $tableName = null, $nullify = false, $autoincrement = true) {

        //detect class name
        if (empty($tableName)) {
            $tableName = strtolower(get_class($object));
        }

        //start query
        $query = "INSERT INTO `{$tableName}` ( ";

        //start collecting column names
        $comma = false;
        foreach ($object as $key => $value) {
            //ignore the primary keys (usually id) if autogenerated
            if ($autoincrement && in_array($key, $ids)) {
                continue;
            }

            //set column names
            if (isset($value)) { //ok the value is set
                if (is_null($value)) { //but it's set to null
                    if ($nullify) { //we will add columns that will have NULL values
                        if ($comma) {
                            $query .= ",";
                        } else {
                            $comma = true;
                        }
                        $query .= "`{$key}`"; #protect the column names in case they are the same as SQL keywords (ex: order)
                    } else { //we will ignore the columns with null values
                        //do nothing
                    }
                } else { //now, it's not null
                    if ($comma) {
                        $query .= ",";
                    } else {
                        $comma = true;
                    }
                    $query .= "`{$key}`";
                }
            } else {
                //just ignore unset values
            }
        }//end collecting column names
        //start collecting values
        $query .= ') VALUES (';
        //TODO: test for cases where there is not need for a value - ex. table with 1 autogenerated column
        //even if this is kinda stupid :P
        $comma = false;
        foreach ($object as $key => $value) {

            //ignore the primary keys (usually id) if autogeneated
            if ($autoincrement && in_array($key, $ids)) {
                continue;
            }

            //add VALUES(....)
            //right now we skip not set NULL values...but maybe we should reconsider for set to Null values (ex: $o->deadDate = null)
            if (isset($value)) {
                if ($comma) {
                    $query .= ", ";
                } else {
                    $comma = true;
                }

                //based on it's type we quote the value
                switch (gettype($value)) {
                    case 'string':
                        $query .= sprintf("'%s'", addslashes($value));
                        break;
                    case 'boolean': //special case as a 'false' value can not be concatenated with a string
                        $query .= $value ? 'true' : 'false';
                        break;
                    case 'NULL' : //if $conditionValue is null the gettype($conditionValue) returns 'NULL'
                        $query .= 'NULL';
                        break;
                    default:
                        $query .= sprintf("%s", $value);
                }
            } else {
                if ($nullify) { //should we set the unset values to null ?
                    if ($comma) {
                        $query .= ", ";
                    } else {
                        $comma = true;
                    }
                    $query .= " NULL";
                }
            }
        }//end collecting values


        $query .= ')';

//        print $query;
        #exit();

        (DEBUG) ? $_SESSION['logs'][] = "&nbsp;&nbsp;&nbsp;&nbsp;" . __CLASS__ . '{#}' . __FUNCTION__ . "{#}{$query}{#}" . __LINE__ : '';
        //EXECUTE
        $result = $this->query($query);

        if ($autoincrement) {//autogenerated ID
//            print "log: autoincrement used";
            return $this->lastId();
        } else { //"by hand" ids
//            print "log: by hand used";
            if ($this->changes() > 0) {
//                print "log: affected";
                return true;
            } else {
//                print "log: not affected";
                return false;
            }
        }
    }

    /* retuns last inserted Id */

    protected function lastId() {
        $result = $this->query('SELECT last_insert_rowid() as last_insert_rowid')->fetchArray();
        return $result['last_insert_rowid'];
    }

    /*     * Update an entry from an object. We should make wrappers around this function (make it private !?!)
     *  and never call it directly from outside Delegate
     *  $tableName - name of the table
     *  $object - the object
     *  $ids -  list of ids (default 'id'), usefull for multiple key or keys other then 'id'
     *  $nullify - if true unset values will be set to NULL, if false we will not touch existing column value
     *  author: liviu, alex
     * 
     *  Note: The update is made based on the object/record id, so the id should not be changed!
     */

    protected function update($object, $ids = array('id'), $tableName = null, $nullify = false) {

        //detect class name
        if (empty($tableName)) {
            $tableName = strtolower(get_class($object));
        }

        //start query
        $query = "UPDATE `{$tableName}` SET ";


        $comma = false;
        foreach ($object as $key => $value) {

            //ignore the primary keys (usually id)
            if (in_array($key, $ids)) {
                continue;
            }

            //set values
//            if(isset($value)) { //pick only set values and ignore not set ones
            //TODO: here is wrong as $v= null; isset($v) returns False and we can not get inside this branch/scope

            if (is_null($value)) { //the value is null so we have to see what to do with it
                if ($nullify) { //should we set the unset values to null ?
                    if ($comma) {
                        $query .= ", ";
                    } else {
                        $comma = true;
                    }
                    $query .= "{$key} = NULL ";
                } else {
                    //do nothing, we will ignore set & null values
                }
            } else { //the value is not null
                if ($comma) {
                    $query .= ", ";
                } else {
                    $comma = true;
                }

                //based on it's type we quote the value
                switch (gettype($value)) {
                    case 'string':
                        $query .= sprintf(" `{$key}` = '%s' ", addslashes($value));
                        break;
//                    case 'boolean':
//                        $query .= sprintf(" `{$key}` = %s ", $value ? "true" : "false");
//                        break;
                    default:
                        $query .= sprintf(" `{$key}` = %s ", addslashes($value));
                        break;
                }
            }
//            } else {
//                //ignore unset values
//            }
        }//end foreach
        //use the keys
        $query .= " WHERE "; //'WHERE' should always be present as there should always be an id
        $comma = false;
        foreach ($ids as $id) {
            foreach ($object as $key => $value) {
//                print "ID: $id -------" . "($key,$value) ----------- " . var_export($object, true) . "<br>";
                if ($id == $key) { //ok we found a key
                    if ($comma) {
                        $query .= " AND ";
                    } else {
                        $comma = true;
                    }

                    switch (gettype($value)) {
                        case 'string':
                            $query .= sprintf(" {$key} = '%s' ", addslashes($value));
                            break;
//                        case 'boolean':
//                            $query .= sprintf(" {$key} = '%s' ", $value?'true':'false');
//                            break;
                        default: //we place together integers, booleans and aliens
                            $query .= sprintf(" {$key} = %s ", addslashes($value));
                            break;
                    }
                }
            }
        } //end foreach
//        print $query;
//        exit();

        (DEBUG) ? $_SESSION['logs'][] = "&nbsp;&nbsp;&nbsp;&nbsp;" . __CLASS__ . '{#}' . __FUNCTION__ . "{#}{$query}{#}" . __LINE__ : '';

        /* EXECUTE
         * @see http://www.php.net/manual/en/sqlite3.query.php
         */
        return $this->query($query);
    }

    /**
     * Get a number of object from the database
     * $tableName - table name
     * $conditions - AND like conditions ex: array('name'=>'alex', 'age'=>'31')
     * $orders - ORDER BY part ex: array('name'=>'ASC', 'age'=>'DESC')
     * $start - start offset
     * $nr - number of rows returned
     * author: alex
     */
    protected function getMultiple($tableName, $conditions = null, $orders = null, $start = null, $nr = null) {
        $objects = array(); //this will contain all the found objects

        $tableName = strtolower($tableName);

        //start query building
        $query = sprintf("SELECT * FROM `%s`", $tableName);

        //conditions
        if (count($conditions) > 0) {
            $query .= " WHERE ";
            $and = false;
            foreach ($conditions as $conditionName => $conditionValue) {
                if ($and) {
                    $query .= " AND ";
                } else {
                    $and = true;
                }

                //based on it's type we quote the value
                switch (gettype($conditionValue)) {
                    case 'string':
                        $query .= sprintf(" `%s` = '%s'", $conditionName, addslashes($conditionValue));
                        break;
                    case 'boolean': //special case as a 'false' value can not be concatenated with a string
                        $query .= sprintf(" `%s` = %s", $conditionName, $conditionValue ? 'true' : 'false');
                        break;
                    case 'NULL' : //if $conditionValue is null the gettype($conditionValue) returns 'NULL'
                        $query .= sprintf(" `%s` IS NULL", $conditionName);
                        break;
                    default:
                        $query .= sprintf(" `%s` = %s", $conditionName, $conditionValue);
                }
            }
        }


        //add orders
        if (count($orders) > 0) {
            $query .= " ORDER BY ";
            $comma = false;
            foreach ($orders as $order => $direction) {
                if ($comma) {
                    $query .= sprintf(", `%s`  %s ", $order, $direction);
                } else {
                    $query .= sprintf(" `%s`  %s", $order, $direction);
                    $comma = true;
                }
            }
        }


        if (!is_null($start)) {
            $query .= sprintf(" LIMIT %d", $start);
        }

        if (!is_null($nr)) {
            $query .= sprintf(", %d", $nr);
        }

        #print $query;
        #exit();
        (DEBUG) ? $_SESSION['logs'][] = "&nbsp;&nbsp;&nbsp;&nbsp;" . __CLASS__ . '{#}' . __FUNCTION__ . "{#}{$query}{#}" . __LINE__ : '';

        //EXECUTE query
        $result = $this->query($query);
        $className = ucfirst($tableName);
        while ($row = $result->fetchArray()) {
            $object = new $className;
            $object->loadFromSQL($row);
            $objects[] = $object;
        }



        return $objects;
    }

    /*     * Return single */

    protected function getSingle($tableName, $conditions = null) {
        $foundedObjects = $this->getMultiple($tableName, $conditions);
        if (isset($foundedObjects) && count($foundedObjects) > 0) {
            return $foundedObjects[0];
        }

        return;
    }

    /*     * Return single */

    protected function getCount($tableName, $conditions = null) {
        $foundedObjects = $this->getMultiple($tableName, $conditions);
        return count($foundedObjects);
    }

    /*     * Remove all entries from a table that met conditions
     * param: $conditions (an array of $key=>$value)
     * Returns true if data was deleted, false otherwise
     *
     * Ex: delete('user', array('id'=>1)) //delete the user with id 1
     * Ex2: delete('user') //delete ALL users
     */

    protected function delete($tableName, $conditions = null) {
        $tableName = strtolower($tableName);

        //start query building
        $query = sprintf("DELETE FROM `%s`", $tableName);

        //conditions
        if (count($conditions) > 0) {
            $query .= " WHERE ";
            $and = false;
            foreach ($conditions as $conditionName => $conditionValue) {
                if ($and) {
                    $query .= " AND ";
                } else {
                    $and = true;
                }

                //based on it's type we quote the value
                switch (gettype($conditionValue)) {
                    case 'string':
                        $query .= sprintf(" %s = '%s'", $conditionName, addslashes($conditionValue));
                        break;
                    case 'boolean': //special case as a 'false' value can not be concatenated with a string
                        $query .= sprintf(" %s = %s", $conditionName, $conditionValue ? 'true' : 'false');
                        break;
                    default:
                        $query .= sprintf(" %s = %s", $conditionName, $conditionValue);
                }
            }
        }


//        print $query;
//        exit();
        (DEBUG) ? $_SESSION['logs'][] = "&nbsp;&nbsp;&nbsp;&nbsp;" . __CLASS__ . '{#}' . __FUNCTION__ . "{#}{$query}{#}" . __LINE__ : '';

        $this->query($query);

        /*
         * @see: http://stackoverflow.com/questions/313567/how-can-i-determine-the-number-of-affected-rows-in-a-sqlite-2-query-in-php
         */
        if ($this->changes() > 0) {
            return true;
        } else {
            return false;
        }
    }

    /************************************************************************* */
    /************************************************************************* */
    /************************************************************************* */
    public function userGetByEmailAndPassword($email,$password) {
        (DEBUG) ? $_SESSION['logs'][] = __CLASS__ .'{#}'. __FUNCTION__ ."{#}{#}". __LINE__ : '';
        return $this->getSingle('user', array('email'=>$email, 'password'=>md5($password) ));
    }
    
    public function userGetByEmailAndCryptedPassword($email,$cryptedPassword) {
        (DEBUG) ? $_SESSION['logs'][] = __CLASS__ .'{#}'. __FUNCTION__ ."{#}{#}". __LINE__ : '';
        return $this->getSingle('user', array('email'=>$email, 'password'=>$cryptedPassword ));
    }
    
    public function userGetById($userId) {
        (DEBUG) ? $_SESSION['logs'][] = __CLASS__ .'{#}'. __FUNCTION__ ."{#}{#}". __LINE__ : '';
        return $this->getSingle('user', array('id'=>$userId));
    }
    
    public function userGetAll() {
        (DEBUG) ? $_SESSION['logs'][] = __CLASS__ .'{#}'. __FUNCTION__ ."{#}{#}". __LINE__ : '';
        return $this->getMultiple('user', null, array('email' => 'ASC'));
    }
    
    

    
    /************************************************************************* */
    /************************************************************************* */
    /************************************************************************* */
    public function diagramGetAll() {
        (DEBUG) ? $_SESSION['logs'][] = __CLASS__ . '{#}' . __FUNCTION__ . "{#}{#}" . __LINE__ : '';
        return $this->getMultiple('diagram', null, array('title' => 'DESC'));
    }

    public function diagramCreate($entry) {
        (DEBUG) ? $_SESSION['logs'][] = __CLASS__ . '{#}' . __FUNCTION__ . "{#}{#}" . __LINE__ : '';
        return $this->create($entry);
    }
    
    public function diagramGetById($diagramId) {
        (DEBUG) ? $_SESSION['logs'][] = __CLASS__ .'{#}'. __FUNCTION__ ."{#}{#}". __LINE__ : '';
        return $this->getSingle('diagram', array('id'=>$diagramId));
    }
    
    public function diagramDeleteById($diagramId) {
        (DEBUG) ? $_SESSION['logs'][] = __CLASS__ .'{#}'. __FUNCTION__ ."{#}{#}". __LINE__ : '';
        return $this->delete('diagram', array('id'=>$diagramId));
    }
    
    public function diagramUpdate($diagram) {
        (DEBUG) ? $_SESSION['logs'][] = __CLASS__ .'{#}'. __FUNCTION__ ."{#}{#}". __LINE__ : '';
        return $this->update($diagram);
    }
    
        /**This create a cascade delete to diagramdata*/
    public function diagramDelete($diagramId){
        (DEBUG) ? $_SESSION['logs'][] = __CLASS__ .'{#}'. __FUNCTION__ ."{#}{#}". __LINE__ : '';
        return $this->delete('diagram', array('id'=>$diagramId));
    }
    
    /**************************************************************************/
    /*********************************SETTINGS*********************************/
    /**************************************************************************/
    public function settingsGetByKeyNative($key){
        (DEBUG) ? $_SESSION['logs'][] = __CLASS__ .'{#}'. __FUNCTION__ ."{#}{#}". __LINE__ : '';
        

        $query = sprintf("select `value` from `setting` where `name` = '%s' ",$key);

        (DEBUG) ? $_SESSION['logs'][] = "&nbsp;&nbsp;&nbsp;&nbsp;" . __CLASS__ .'{#}'. __FUNCTION__ ."{#}{$query}{#}". __LINE__ : '';

        $value = '';

        //EXECUTE query
        $result = $this->query($query);
        if( $row = $result->fetchArray() ){
            $value = $row['value'];
        }
                

        return $value;
    }
    
    
    public function settingsSaveNative($key, $value){
        (DEBUG) ? $_SESSION['logs'][] = __CLASS__ .'{#}'. __FUNCTION__ ."{#}{#}". __LINE__ : '';
        
        //see http://stackoverflow.com/questions/418898/sqlite-upsert-not-insert-or-replace
        $query = sprintf("insert or REPLACE  into `setting` (`value`,`name`) VALUES('%s', '%s')", $value, $key);
        
        $this->query($query);
        
        if($this->changes() > 0) {
            return true;
        } else {
            return false;
        }
    }
    
    
    /**************************************************************************/
    /*********************************USER*************************************/
    /**************************************************************************/
    public function userCreate($user) {
        (DEBUG) ? $_SESSION['logs'][] = __CLASS__ .'{#}'. __FUNCTION__ ."{#}{#}". __LINE__ : '';
        return $this->create($user);
    }
    
    public function userDeleteById($id) {
        (DEBUG) ? $_SESSION['logs'][] = __CLASS__ .'{#}'. __FUNCTION__ ."{#}{#}". __LINE__ : '';
        return $this->delete('user', array('id' => $id));
    }
    
    
    public function userUpdate($user) {
        (DEBUG) ? $_SESSION['logs'][] = __CLASS__ .'{#}'. __FUNCTION__ ."{#}{#}". __LINE__ : '';
        return $this->update($user);
    }
    
    
    /**************************************************************************/
    /*****************************DIAGRAMDATA**********************************/
    /**************************************************************************/
    public function diagramdataCreate($entry) {
        (DEBUG) ? $_SESSION['logs'][] = __CLASS__ .'{#}'. __FUNCTION__ ."{#}{#}". __LINE__ : '';
        //$object, $ids = array('id'), $tableName=null,  $nullify=false, $autoincrement=true) {
        return $this->create($entry, array('diagramId', 'type'), 'diagramdata', false, false);
    }

    public function diagramdataGetByDiagramIdAndType($diagramId, $type) {
        (DEBUG) ? $_SESSION['logs'][] = __CLASS__ .'{#}'. __FUNCTION__ ."{#}{#}". __LINE__ : '';
        return $this->getSingle('diagramdata', array('diagramId'=>$diagramId, 'type'=>$type));
    }
    
    public function diagramdataUpdate($diagramdata) {
        (DEBUG) ? $_SESSION['logs'][] = __CLASS__ .'{#}'. __FUNCTION__ ."{#}{#}". __LINE__ : '';
        return $this->update($diagramdata, array('diagramId', 'type'), 'diagramdata'); //do not update the key
    }
    
    public function diagramdataGetByDiagramId($diagramId) {
        (DEBUG) ? $_SESSION['logs'][] = __CLASS__ .'{#}'. __FUNCTION__ ."{#}{#}". __LINE__ : '';
        return $this->getMultiple('diagramdata', array('diagramId'=>$diagramId));
    }
    
    /**This create a cascade delete to diagramdata*/
    public function diagramdataDeleteByDiagramIdAndType($diagramId, $type){
        (DEBUG) ? $_SESSION['logs'][] = __CLASS__ .'{#}'. __FUNCTION__ ."{#}{#}". __LINE__ : '';
        return $this->delete('diagramdata', array('diagramId'=>$diagramId, 'type'=>$type));
    }
        
}

function diagramCreate($dbhandle, $title, $description, $public) {
    $stm1 = sprintf("INSERT INTO diagram (title, description, public, createdDate, lastUpdate) 
        VALUES('%s', '%s', '%s', '%s', '%s')", $title, $description, $public, gmdate('Y-m-d H:i:s'), gmdate('Y-m-d H:i:s'));
    #print($stm1);
    $ok1 = sqlite_exec($dbhandle, $stm1);
    if (!$ok1)
        die("Cannot execute statement.");
}

function diagramGetById($dbhandle, $diagramId) {
    $d = false;
    $query = sprintf("SELECT * FROM diagram where id=%d", $diagramId);
    $result = sqlite_query($dbhandle, $query);
    if ($result) {
        $row = sqlite_fetch_array($result, SQLITE_ASSOC);
        if ($row) {
            $d = new Diagram();
            $d->loadFromSQL($row);
        }
    }

    return $d;
}

function diagramGetAll2($dbhandle) {
    $diagrams = array();
    $query = "SELECT * FROM diagram ORDER BY title";
    $results = $this->query($query);
    if ($results) {
        while ($row = $results->fetchArray()) {
            #print_r($row);
            $d = new Diagram();
            $d->loadFromSQL($row);
            $diagrams[] = $d;
        }
    }

    return $diagrams;
}

function diagramDeleteById($dbhandle, $diagramId) {
    $query = sprintf("delete FROM diagram where id=%d", $diagramId);
    $result = sqlite_query($dbhandle, $query);
    if ($result) {
        
    }
}

if(false && PHP_SAPI == 'cli'){ //see http://php.net/manual/en/features.commandline.php
    print("\nOn the console");

    //test
    $d = new Delegate();
    $diagrams = $d->diagramGetAll();
    print_r($diagrams);

    $diagram = new Diagram();
    $diagram->title = 'Ana are mere';
    $diagram->description = 'Ana are foarte multe mere';
    $diagram->public = 0;
    $diagram->createdDate = gmdate('Y-m-d h:i:s');
    $diagram->lastUpdate = gmdate('Y-m-d h:i:s');

    $dId = $d->diagramCreate($diagram);
    print("Diagram Id: " + $dId);

    $nd = $d->diagramGetById($dId);
    $nd->title = 'Zzoz';
    $d->diagramUpdate($nd);

    $d->close();
}
?>
