/**	Version Control session facade API. 
	Its instance owns the implementation object specific for particular VC API.


*/
define([	"dojo/_base/declare", "dojo/_base/lang"	,"dojo/request"	,"dojo/promise/all"	,"dojo/_base/array"	,"dojo/store/Memory","dojo/store/JsonRest"]
, function( declare				,lang				,request		,all				,array				,Memory				, JsonRest				)
{
	if( typeof mw == 'undefined' )
		var mw;
	var DEFNS = 'Default'
	,	curNS	= (mw && mw.config.get( 'wgCanonicalNamespace' )) || DEFNS
	,	afRoot	= (mw && mw.config.get( 'wgScriptPath' ) || '.')+"/../"
	,	pageTitle	= (mw && mw.config.get( 'wgTitle' ) ) || ''
	,	pages		= pageTitle.split('/');


	return declare( null, // [Memory]
	{	ImportXml	:0
	,	RoutineEl	:0
	,	constructor: function( /*Object*/ kwArgs )
		{
			lang.mixin(this, kwArgs);
		}
	,	Init /*Promise*/: function( /*Object*/ kwArgs ){}	// override to use parameters like auth method, key, login, password, ApiKey, etc
	,	List					/*Promise*/	: function( /*string*/pathInRepo ){ return this.Repo.List(pathInRepo); }
	,	GetText					/*Promise*/	: function( /*string*/pathInRepo ){ return this.Repo.GetText(pathInRepo); }
	,	GetTags					/*Promise*/	: function( /*string*/pathInRepo ){ return this.Repo.GetTags(pathInRepo); }
	,	GetContributors			/*Promise*/	: function( /*string*/pathInRepo ){ return this.Repo.GetContributors(pathInRepo); }
	,	GetLastModified			/*Promise*/	: function( /*string*/pathInRepo ){ return this.Repo.GetLastModified(pathInRepo); }
	});
});