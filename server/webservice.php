<?php
header("Access-Control-Allow-Origin: *");

/**
 * Author: PJ Grondelaers
 * Date: 03/11/2015
 */

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'connection.php';
$connection = new Connection();
/*
if (!isset($_GET['Authentication']) || !$connection->validateAuthentication(htmlEntities($_GET['Authentication'], ENT_QUOTES))) {
        die('{"MessageCode":"403"}');
        
}else{
    $authentication = $_GET['Authentication'];
}*/

//Find function in webservice classes
if (isset($_GET['Function'])) {
    $function = htmlEntities($_GET['Function'], ENT_QUOTES);
    require_once 'database.php';
    if (method_exists('Database', $function)) {
        $instance = new Database();
        $instance->$function($_GET);
    } 
}

