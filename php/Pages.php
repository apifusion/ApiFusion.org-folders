[<?php
# get list of subpages beginning from current and up to root

error_reporting(-1);
ini_set('display_errors', 'On');
putenv( 'MW_INSTALL_PATH='. realpath( dirname( __FILE__ ) . '/../wiki') );
require realpath( dirname( __FILE__ ) . '/../wiki/includes/WebStart.php' );

header('Content-Type: application/json');

$fullTitle = $_REQUEST['title'];
$ns = '';
$title = $fullTitle;


$arr = explode( ':', $fullTitle );

if( $arr && count($arr) > 1 )
{
	$ns = $arr[0];
	$title = $arr[1];
} 
#var_dump( $title);
$dbr = wfGetDB( DB_MASTER );

$troot = '';

$arr = explode( '/', $title );
print_page( $arr[0], $dbr );
for( $i = 0; $i < count($arr); $i++ )
{
	$t = $troot . $arr[$i];
	print_children( $t, $dbr );
	$troot = $t . '/';
}
function print_page( $t, $dbr )
{
	$res = $dbr->select( 'page', array( 'page_title','count(page_namespace) as nsCount' ), "page_title='$t'", __METHOD__, 'GROUP BY page_title' );
	foreach( $res as $row ) 
		echo ' { "nsCount":'. $row->nsCount.',"page_title":"'. $row->page_title.'" }';
}
function print_children( $t, $dbr )
{
//	$res = $dbr->select( 'page', array( 'page_title','count(page_namespace) as nsCount' ), "page_title LIKE '$t/%' and page_title NOT LIKE '$t/%/%'", __METHOD__, array('GROUP BY page_title') );
	$res = $dbr->query("select page_title, count(page_namespace) as nsCount from wiki_page where page_title LIKE '$t/%' and page_title NOT LIKE '$t/%/%' GROUP BY page_title");
	foreach( $res as $row ) 
		echo ',{ "nsCount":'. $row->nsCount.',"page_title":"'. $row->page_title.'" } ';	
}
?>]
