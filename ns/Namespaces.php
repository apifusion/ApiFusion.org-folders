<?php
# Extended Namespaces include file
# NS is taken from ../ns/Namespaces.xml by AF_NSInitFromXml()
# initial Namespaces.xml file is generated by NS_ApiFusionInit( $NS_ApiFusionNames ) and extracted from
# http://localhost:8480/af/wiki/api.php?action=query&meta=siteinfo&siprop=namespaces&format=xml

$afNsBitMask = [];
$afNsCat = [];

define("NS_FOO", 500);
define("NS_FOO_TALK", 501);
 
$wgExtraNamespaces[NS_FOO] = "Foo";
$wgExtraNamespaces[NS_FOO_TALK] = "Foo_talk";   // underscore required
 
$wgNamespaceProtection[NS_FOO] = array( 'editfoo' ); //permission "editfoo" required to edit the foo namespace
$wgNamespacesWithSubpages[NS_FOO] = true;            //subpages enabled for the foo namespace
$wgGroupPermissions['sysop']['editfoo'] = true;      //permission "editfoo" granted to users in the "sysop" group

# disable editing of all pages, then re-enable for users with confirmed e-mail addresses only
# Disable for everyone.
$wgGroupPermissions['*']['edit']              = false;
# Disable for users, too: by default 'user' is allowed to edit, even if '*' is not.
$wgGroupPermissions['user']['edit']           = false;
# Make it so users with confirmed e-mail addresses are in the group.
$wgAutopromote['emailconfirmed'] = APCOND_EMAILCONFIRMED;
# Hide group from user list. 
$wgImplicitGroups[] = 'emailconfirmed';
# Finally, set it to true for the desired group.
# $wgGroupPermissions['emailconfirmed']['edit'] = true;

AF_NSInitFromXml();
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
function NS_ApiFusionInit( $names)
{
	$NS_ApiFusionIdBase = 8300;

	foreach ($names as $i => $value)
	{
		NS_ApiFusionInitNS( $NS_ApiFusionIdBase + $i*10		, $value );
		NS_ApiFusionInitNS( $NS_ApiFusionIdBase + $i*10+1	, $value . "_talk" );// underscore required
	}
}
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

function AF_NSInitFromXml()
{
    global $afNsBitMask, $afNsCat;

    $xmlObj = simplexml_load_file( __DIR__ . "/Namespaces.xml" );
    foreach( $xmlObj->query->namespaces->ns as $nsEntry )
    {
    	$attr = $nsEntry->attributes();
    	$id = $attr['id'];
        $name = ''.$attr['canonical'];
        $cat  = ''.$attr['category'];
    	if( $id*1 >600 )
    	    NS_ApiFusionInitNS( 1*$id, $name );
    	if( !isset($afNsBitMask[$cat]) )
            { $afNsBitMask[$cat] = 0; $afNsCat [$cat] = []; }
    	$b = 1<< ($attr['bit']*1);
        $afNsCat [$cat][$name] = $afNsBitMask[$name] = $b;
        $afNsBitMask[$cat] |= $b;
    }
    $afNsBitMask[ '' ] = -1;
}