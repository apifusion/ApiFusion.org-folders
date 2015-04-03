/**	ApiFusion session API. 
	
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
	{	repoParams	: { afref : "ApiFusion.org/Sources/ui" }
	,	ApiUrl		: "../../php/Pages.php?title="
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
				if(o)
				{	if( o.page_title != pathInRepo )
						{	console.log( 'o.page_title != pathInRepo ',o.page_title, pathInRepo ); }
			
					var darr = [];
					o.children.forEach && o.children.forEach( function(o)
					{	
						var nodeName = 'folder'//{ dir : 'folder',file : 'file'}[o.type]
						,	name		= o.page_title.split('/').pop()
						,	$r = $x.$("*[@name='"+name+"']");
						if( $r.length ) // exist - do nothing
							$r.attr("status","found");
						else
							$r = $x.createChild( nodeName, o).$ret()
								.attr("status","created")
								.attr("name",o.page_title.split('/').pop() )
								.attr("path",o.page_title)
								.attr("selected",1); // collapsed
					
							darr.push(zs.List(o.page_title, $r));
					});
				}
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