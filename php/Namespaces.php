<?php
# Extended Namespaces include file
define("NS_FOO", 500);
define("NS_FOO_TALK", 501);
 
$wgExtraNamespaces[NS_FOO] = "Foo";
$wgExtraNamespaces[NS_FOO_TALK] = "Foo_talk";   // underscore required
 
$wgNamespaceProtection[NS_FOO] = array( 'editfoo' ); //permission "editfoo" required to edit the foo namespace
$wgNamespacesWithSubpages[NS_FOO] = true;            //subpages enabled for the foo namespace
$wgGroupPermissions['sysop']['editfoo'] = true;      //permission "editfoo" granted to users in the "sysop" group

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

function NS_ApiFusionInitNS( $id, $name )
{
	global $wgExtraNamespaces,  $wgNamespaceProtection,  $wgNamespacesWithSubpages, $wgGroupPermissions;
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

