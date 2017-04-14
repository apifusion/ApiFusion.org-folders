<?php
# get list of subpages beginning from current and up to root

error_reporting(-1);
ini_set('display_errors', 'On');
$wikiFolder = "wiki";//isset($_SERVER["HTTP_REFERER"]) ? explode('/', $_SERVER["HTTP_REFERER"] )[4] : "wiki";

putenv( 'MW_INSTALL_PATH='. realpath( dirname( __FILE__ ) . '/../../'.$wikiFolder) );
require realpath( dirname( __FILE__ ) . '/../../'.$wikiFolder.'/includes/WebStart.php' );

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
$pageTable = $dbr->tableName( "page" );

	$res = $dbr->query("select page_title, count(page_namespace) as nsCount from " . $pageTable ." where page_title='$title' GROUP BY page_title");
	foreach( $res as $row1 )
	{       $t = $row1->page_title;
		$cldSql = 'Main_Page' == $title 
			? " page_title NOT LIKE '%/%' and NOT(page_title='Main_Page') " 
			: " page_title LIKE '$t/%' and page_title NOT LIKE '$t/%/%' ";
		$cldCount = ", (SELECT COUNT( * ) FROM (SELECT page_title FROM " . $pageTable ." GROUP BY page_title)p2 WHERE p2.page_title LIKE CONCAT( p1.page_title,  '/%' ) AND p2.page_title NOT LIKE CONCAT( p1.page_title,  '/%/%' ))childrenCount";

		echo '{ "nsCount":'. $row1->nsCount.',"page_title":"'. $t .'","parent":"'.$parentTitle.'","children":[ ';	
		$sql = "select p1.page_title, count(p1.page_namespace) as nsCount $cldCount from " . $pageTable ." p1 where $cldSql and (p1.page_namespace > 1000 or p1.page_namespace=0) GROUP BY page_title";
//echo $sql.'<br/>';
		$res2 = $dbr->query($sql);
		$children = array();
		foreach( $res2 as $row2 ) 
			if( 0 !== strpos($row2->page_title, 'New')  && ( $title != 'Main_Page' ||  is_valid_domain_name($row2->page_title,'.') ) )
				array_push($children, '{ "nsCount":'. $row2->nsCount.',"page_title":"'. $row2->page_title.'", "parent":"'.$title.'","childrenCount":"'.$row2->childrenCount.'" } ');	
		echo implode(',',$children);
		echo '] } ';	
	}
function is_valid_domain_name($domain_name)
{
    return (preg_match("/^([a-z\d](-*[a-z\d])*)(\.([a-z\d](-*[a-z\d])*))*$/i", $domain_name) //valid chars check
            && preg_match("/^.{1,253}$/", $domain_name) //overall length check
            && preg_match("/^[^\.]{1,63}(\.[^\.]{1,63})*$/", $domain_name)   ); //length of each label
}