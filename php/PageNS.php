<?php
# get list of subpages beginning from current and up to root

error_reporting(-1);
ini_set('display_errors', 'On');
$wikiFolder = "wiki";//isset($_SERVER["HTTP_REFERER"]) ? explode('/', $_SERVER["HTTP_REFERER"] )[4] : "wiki";

putenv( 'MW_INSTALL_PATH='. realpath( dirname( __FILE__ ) . '/../../'.$wikiFolder) );
header('Content-Type: application/json');
require realpath( dirname( __FILE__ ) . '/../../'.$wikiFolder.'/includes/WebStart.php' );


$fullTitle = str_replace ( ' ' , '_', $_REQUEST['title'] );
$ns = '';
$title = empty( $fullTitle ) ? 'Main_Page' : $fullTitle;
$arr = explode( ':', $fullTitle );

if( $arr && count($arr) > 1 )
{
	$ns = $arr[0];
	$title = $arr[1];
} 

$dbr = wfGetDB( DB_MASTER );

	$nsArr = array();
	$res = $dbr->query("select page_namespace as ns from " . $wgDBprefix ."page where page_title='$title' ");
	foreach( $res as $row1 )
	       array_push($nsArr, $row1->ns);	
echo '[';
	echo implode(',',$nsArr);
echo ']';
