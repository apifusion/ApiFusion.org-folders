<?php
# get list of subpages beginning from current and up to root

error_reporting(-1);
ini_set('display_errors', 'On');
putenv( 'MW_INSTALL_PATH='. realpath( dirname( __FILE__ ) . '/../wiki') );
require realpath( dirname( __FILE__ ) . '/../wiki/includes/WebStart.php' );

header('Content-Type: application/json');

$fullTitle = str_replace ( ' ' , '_', $_REQUEST['title'] );
$ns = '';
$title = empty( $fullTitle ) ? 'Main_Page' : $fullTitle;
$arr = explode( ':', $fullTitle );

if( $arr && count($arr) > 1 )
{
	$ns = $arr[0];
	$title = $arr[1];
} 
$arr = explode( '/', $title );
$name = array_pop( $arr );
$parentTitle = implode( '/', $arr );
if( empty( $parentTitle ) )
	$parentTitle = 'Main_Page';

$dbr = wfGetDB( DB_MASTER );

	$res = $dbr->query("select page_title, count(page_namespace) as nsCount from wiki_page where page_title='$title' GROUP BY page_title");
	foreach( $res as $row1 )
	{       $t = $row1->page_title;
		$cldSql = 'Main_Page' == $title 
			? " page_title NOT LIKE '%/%' and NOT(page_title='Main_Page') " 
			: " page_title LIKE '$t/%' and page_title NOT LIKE '$t/%/%' ";
		$cldCount = ", (SELECT COUNT( * ) FROM (SELECT page_title FROM wiki_page GROUP BY page_title)p2 WHERE p2.page_title LIKE CONCAT( p1.page_title,  '/%' ) AND p2.page_title NOT LIKE CONCAT( p1.page_title,  '/%/%' ))childrenCount";

		echo '{ "nsCount":'. $row1->nsCount.',"page_title":"'. $t .'","parent":"$parentTitle",children:[ ';	
		$sql = "select p1.page_title, count(p1.page_namespace) as nsCount $cldCount from wiki_page p1 where $cldSql and (p1.page_namespace > 1000 or p1.page_namespace=0) GROUP BY page_title";
//echo $sql.'<br/>';
		$res2 = $dbr->query($sql);
		$children = array();
		foreach( $res2 as $row2 ) 
//			if( $row2->childrenCount != '0' )
				array_push($children, '{ "nsCount":'. $row2->nsCount.',"page_title":"'. $row2->page_title.'", "parent":"'.$title.'","childrenCount":"'.$row2->childrenCount.'" } ');	
		echo implode(',',$children);
		echo '] } ';	
	}

?>