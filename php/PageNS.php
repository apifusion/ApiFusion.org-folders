<?php
# get list of subpages beginning from current and up to root

error_reporting(-1);
ini_set('display_errors', 'On');
putenv( 'MW_INSTALL_PATH='. realpath( dirname( __FILE__ ) . '/../wiki') );
header('Content-Type: application/json');
require realpath( dirname( __FILE__ ) . '/../wiki/includes/WebStart.php' );


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
	$res = $dbr->query("select page_namespace as ns from wiki_page where page_title='$title' ");
	foreach( $res as $row1 )
	       array_push($nsArr, $row1->ns);	
echo '[';
	echo implode(',',$nsArr);
echo ']';
?>