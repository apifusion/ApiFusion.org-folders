<?php
error_reporting( -1 );
ini_set( 'display_errors', 1 );

$AF_defXmlName = 'index.xml';

$url = $_SERVER["REQUEST_URI"];
if( $AF_defXmlName == substr($url,0-strlen($AF_defXmlName)) )
    $url = substr($url,0,0-strlen($AF_defXmlName));
if( '/' == substr($url,-1) )
    $url = substr($url,0,-1);

$regEx = '/(.*)\/ns\/([^\/]*)\/(.*)/';

$webApp = preg_replace($regEx, '${1}', $url );
$ns 	= preg_replace($regEx, '${2}', $url );
$page 	= preg_replace($regEx, '${3}', $url );

$wikiPage = 'api.php';
$uri = $webApp . '/wiki/' . $wikiPage . '?action=parse&format=xml&page=' . $ns . '%3A' . $page;
//$_GET = array();
$_GET['page'] = $ns . ":" . $page;
$_GET['action'] = 'parse';
$_GET['format'] = 'xml';
$_SERVER["REQUEST_URI"] = $uri;
//$_SERVER["SCRIPT_NAME"] = $webApp . '/wiki/' . $wikiPage;
//$_SERVER["PHP_SELF"] = $webApp . '/wiki/' . $wikiPage;
 
$wikiPath = realpath(__DIR__ . '/../wiki');
putenv("MW_INSTALL_PATH=" . $wikiPath);

$fdir = realpath( __DIR__ . $ns . '/' . $page);
$relAppRoot = preg_replace("/[^\/]*\//", "../", $page. '/') . '../../';
$xslPath = $relAppRoot . 'ui/page.xsl';

ob_start();
require_once '../wiki/' . $wikiPage;
$apiXml = ob_get_clean();
$apiXml = html_entity_decode( substr($apiXml, strpos($apiXml,'?>')+2) );
$xml = '<?xml version="1.0"  encoding="utf-8"?>' . "\r\n"
	. '<?xml-stylesheet type="text/xsl" href="'. xmlEncode($xslPath) . '"?>'. "\r\n"
	. '<ApiFusion><ApiFusionSection wikiApiUrl="' . xmlEncode($uri) . '"  '. "\r\n"
		.'	ns="' . xmlEncode($ns) . '" '. "\r\n"
		.'	page="' . xmlEncode($page) . '" '. "\r\n"
		.'	relAppRoot="' . xmlEncode($relAppRoot) . '" >'. "\r\n"
	. $apiXml . "\r\n"
	. '</ApiFusionSection></ApiFusion>';

// TODO error if $ns missed in namespaces.xml

if( strpos($apiXml, 'missingtitle') === false )
{
    $fdir =  __DIR__ .'/'. $ns . '/' . $page;
	mkdir( $fdir,  0777, true );
    $xmlFileName = $fdir . '/' . $AF_defXmlName;
	$f = fopen( $xmlFileName, 'w');
	fwrite( $f, $xml );
	fclose( $f );
}

//header('Location: ' . $url . '/', true, 301);

function xmlEncode($str)
{
    return htmlspecialchars( $str, ENT_QUOTES, 'UTF-8');
}
?>