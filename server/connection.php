<?php
/**
 * Author: PJ Grondelaers
 * Date: 03/11/2015
 */

//Revoke access when file directly accessed
if (count(get_included_files()) == 1) {
    die('{"MessageCode":"403"}');
}

/**
 * Class Connection
 * Contains access info to database
 */
class Connection
{


    /**
     * @param Authentication
     * @return bool Access Granted or Prohibited
     */
    function validateAuthentication($input)
    {
        /*if ($this->getPassword() == $input) {
            return TRUE;
        } else {
            return FALSE;
        }*/
        return TRUE;
    }

    /**
     * @return Mixed Authentication
     */
    private function getPassword()
    {
        return 'WLK-5cn-ufG-zYZ';
    }

    /**
     * Connects to the database
     * @return Connection object
     * TODO Activate comments when you want to use a local database
     * Deactivate on UnitTests & when using remote database on local test
     */
    function getDBConnection()
    {
        $host = "mysql.hostinger.es";
		$user = "u372544662_mafia";
		$pwd = "mafia123";
		$db = "u372544662_mafia";
       // try {
            $conn = new PDO("mysql:host=$host;dbname=$db", $user, $pwd);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
       // } catch (Exception $e) {
       //     die('{"MessageCode":"503"}');
        //}
        return $conn;
    }

    
}
