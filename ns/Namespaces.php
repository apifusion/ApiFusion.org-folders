<?php
# Extended Namespaces include file
# NS is taken from ../ns/Namespaces.xml by NS_ApiFusionInitFromXml()
# initial Namespaces.xml file is generated by NS_ApiFusionInit( $NS_ApiFusionNames ) and extracted from
# http://localhost:8480/af/wiki/api.php?action=query&meta=siteinfo&siprop=namespaces&format=xml

define("NS_FOO", 500);
define("NS_FOO_TALK", 501);
 
$wgExtraNamespaces[NS_FOO] = "Foo";
$wgExtraNamespaces[NS_FOO_TALK] = "Foo_talk";   // underscore required
 
$wgNamespaceProtection[NS_FOO] = array( 'editfoo' ); //permission "editfoo" required to edit the foo namespace
$wgNamespacesWithSubpages[NS_FOO] = true;            //subpages enabled for the foo namespace
$wgGroupPermissions['sysop']['editfoo'] = true;      //permission "editfoo" granted to users in the "sysop" group


NS_ApiFusionInitFromXml();
/* comment line above and uncomment bellow to generate namespaces out of this list
$NS_ApiFusionNames = array
(	"Requirements"
,	"WishList"
,	"ToDo"
,	"Design"
,	"Implementation"
,	"FAQ"
,	"HowTo"
,	"Sources"
,	"Binaries"
,	"Demo"
,	"Test"
,	"TestResult"
,	"DesignReview"
,	"ImplementationReview"
,	"SecurityReview"
,	"Compatibility"
,	"License"
,	"CLA"
,	"Support"
,	"Contributors"
// branches/forks 
);

NS_ApiFusionInit( $NS_ApiFusionNames );
*/

function NS_ApiFusionInitNS( $id, $name )
{
	global $wgExtraNamespaces,  $wgNamespaceProtection,  $wgNamespacesWithSubpages, $wgGroupPermissions;
	$name = str_replace(' ','_',$name);
	$wgExtraNamespaces[$id] = $name; 
	$wgNamespaceProtection		[$id] = array( 'edit'+$name ); //permission "editfoo" required to edit the foo namespace
	$wgNamespacesWithSubpages	[$id] = true;            //subpages enabled for the foo namespace
	$wgGroupPermissions['sysop']['edit'+$name] = true;      //permission "editfoo" granted to users in the "sysop" group
//	print($id . " " . $name . ' ' . $wgExtraNamespaces[$id] . "\n<br/>");	
}
function NS_ApiFusionInit( $names)
{
	$NS_ApiFusionIdBase = 8300;

	foreach ($names as $i => $value) 
	{
		NS_ApiFusionInitNS( $NS_ApiFusionIdBase + $i*10		, $value );
		NS_ApiFusionInitNS( $NS_ApiFusionIdBase + $i*10+1	, $value . "_talk" );// underscore required
	}
}
function NS_ApiFusionInitFromXml()
{
    $xmlObj = simplexml_load_file( __DIR__ . "/Namespaces.xml" );
    foreach( $xmlObj->query->namespaces->ns as $nsEntry )
    {
    	$attr = $nsEntry->attributes();
    	$id = $attr['id'];
    	if( $id*1 >600 )
    	    NS_ApiFusionInitNS( 1*$id, $attr['canonical'] );
    }
}