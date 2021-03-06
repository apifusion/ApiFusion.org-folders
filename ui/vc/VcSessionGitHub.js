﻿/**	Version Control session facade API. 
	Its instance owns the implementation object specific for particular VC API.


*/
define([	"dojo/_base/declare","dojo/request"	,"dojo/Deferred","dojo/_base/array"	,"dojo/store/Memory","./VcSession"]
, function( declare				,request		,Deferred		,array				,Memory				, VcSession				)
{
	if( typeof mw == 'undefined' )
		var mw;
	var DEFNS = 'Default'
	,	curNS	= (mw && mw.config.get( 'wgCanonicalNamespace' )) || DEFNS
	,	afRoot	= (mw && mw.config.get( 'wgScriptPath' ) || '.')+"/../"
	,	pageTitle	= (mw && mw.config.get( 'wgTitle' ) ) || ''
	,	pages		= pageTitle.split('/');


	return declare( [VcSession],
	{	repoParams	: {}
	,	ApiUrl		: "https://api.github.com/repos"
	,	constructor	: function( /*Object*/ params )
		{
		}
	,	Init /*Promise*/: function( /*Object*/ kwArgs )
		{	//	parse git repo URL and save as API root 
			//	https://github.com/apifusion/ApiFusion.org-folders.git
			
			var d = new Deferred( function(reason)
			{
				// do something when the Deferred is cancelled
			});
			
			this.repoParams = kwArgs;
			var url = this.repoParams.href;
			console.log(url);
			var u	= document.createElement('a');
			u.href = url.replace('.git','');
			this.ApiUrl += u.pathname + "/contents/" ;
			
			// call auth and in callback 
			d.resolve(1);
			return d;
		}
	,	List /*Promise*/	: function( /*string*/pathInRepo, $x )
		{	var u = this.ApiUrl + pathInRepo 
			,	zs= this;
			
			console.log(u);

			$x.attr("start"	, af_timestamp() );
			$x.attr("end"	, 0 );
			
			return request( u, {handleAs:'json'} ).then( function(o)
			{	
				$x.$("*").attr("status","deleted");
				
				o.forEach && o.forEach( function(o)
				{	
					var nodeName = { dir : 'folder',file : 'file'}[o.type]
					,	$r = $x.$("./af:"+nodeName+"[@name='"+o.name+"']");
					if( $r.length ) // exist - do nothing
						$r.attr("status","found");
					else
						$r = $x.createChild( nodeName, o).$ret().attr("status","created");
					
					if( "dir" == o.type )
						setTimeout(function()
						{	$r.attr("selected",1); // collapsed
							zs.List(o.path, $r);
						},1000);
				});

				$x.attr("end", af_timestamp() );
			}, function(err)
			{	var msg = err.response && err.response.text || err;
				$x.attr("error", msg );
				console.error( msg );
				debugger;
			});
		}
	});
});