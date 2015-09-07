<?php
require_once dirname(__FILE__).'/../scripts/km_settings.php';


try {
    $dbh = new PDO($dsn, $user, $password, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
    $dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES  , false  );
    
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
    exit;
}

?>