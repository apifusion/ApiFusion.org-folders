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

$wikiPage = 'api.php';
//$uri = $webApp . '/wiki/index.php?title=' . $ns . ':' . $page;
$uri = $webApp . '/wiki/' . $wikiPage . '?action=parse&format=xml&page=' . $ns . '%3A' . $page;
//$_GET = array();
$_GET['page'] = $ns . ":" . $page;
$_GET['action'] = 'parse';
$_GET['format'] = 'xml';
$_SERVER["REQUEST_URI"] = $uri;
//$_SERVER["SCRIPT_NAME"] = $webApp . '/wiki/' . $wikiPage;
//$_SERVER["PHP_SELF"] = $webApp . '/wiki/' . $wikiPage;
 
//echo $uri;
$wikiPath = realpath(__DIR__ . '/../wiki');
putenv("MW_INSTALL_PATH=" . $wikiPath);
require_once '../wiki/' . $wikiPage;

//phpinfo();

?>