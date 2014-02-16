<?php
//error_reporting( -1 );
//ini_set( 'display_errors', 1 );

$url = $_SERVER["REQUEST_URI"];
$regEx = '/(.*)\/ns\/([^\/]*)\/(.*)/';
//echo $regEx . "<hr/>";
$webApp = preg_replace($regEx, '${1}', $url );
$ns 	= preg_replace($regEx, '${2}', $url );
$page 	= preg_replace($regEx, '${3}', $url );
//echo $webApp . ":" . $ns . ":" . $page;

$uri = $webApp . '/wiki/index.php?title=' . $ns . ':' . $page;
//$_GET = array();
$_GET['title'] = $ns . ":" . $page;
$_SERVER["REQUEST_URI"] = $uri;
$_SERVER["SCRIPT_NAME"] = $webApp . '/wiki/index.php';
$_SERVER["PHP_SELF"] = $webApp . '/wiki/index.php';
 
$wikiPath = realpath(__DIR__ . '/../wiki');
putenv("MW_INSTALL_PATH=" . $wikiPath);
require_once '../wiki/index.php';

//phpinfo();

?>