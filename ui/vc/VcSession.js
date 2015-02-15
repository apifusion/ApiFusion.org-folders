/**	Version Control session facade API. 
	Its instance owns the implementation object specific for particular VC API.


*/
define([	"dojo/declare"	,"dojo/request"	,"dojo/promise/all"	,"dojo/_base/array"	,"dojo/store/Memory","dojo/store/JsonRest"]
, function( declare			,request		,all				,array				,Memory				, JsonRest				)
{
	if( typeof mw == 'undefined' )
		var mw;
	var DEFNS = 'Default'
	,	curNS	= (mw && mw.config.get( 'wgCanonicalNamespace' )) || DEFNS
	,	afRoot	= (mw && mw.config.get( 'wgScriptPath' ) || '.')+"/../"
	,	pageTitle	= (mw && mw.config.get( 'wgTitle' ) ) || ''
	,	pages		= pageTitle.split('/');


	return declare( // [Memory]
	{	Repo /*VcSession*/: 0
	,	construct: function( /*Object*/ params )
		{
		
		}
	,	InitAuth /*Promise*/: function( /*string*/ login, /*string*/ password )
		{
		}
	,	SetRepo					/*Promise*/	: function( /*string*/ url ){	require( [this.GetImplementationMid(url)], function( impl ){ this.Repo = new Impl(this); }); } // todo return Promise
	,	GetImplementationMid	/*MID*/		: function( /*string*/ url ){ return "ui/vc/vcGitHub"; } // todo other VC types
	,	List					/*Promise*/	: function( /*string*/pathInRepo ){ return this.Repo.List(pathInRepo); }
	,	GetText					/*Promise*/	: function( /*string*/pathInRepo ){ return this.Repo.GetText(pathInRepo); }
	,	GetTags					/*Promise*/	: function( /*string*/pathInRepo ){ return this.Repo.GetTags(pathInRepo); }
	,	GetContributors			/*Promise*/	: function( /*string*/pathInRepo ){ return this.Repo.GetContributors(pathInRepo); }
	,	GetLastModified			/*Promise*/	: function( /*string*/pathInRepo ){ return this.Repo.GetLastModified(pathInRepo); }
	});
});