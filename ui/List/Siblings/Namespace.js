/**
 * Created by suns on 2017-04-04.
 * http://www.ApiFusion.org/wiki/index.php/ApiFusion.org/Sources/ui/List/Siblings/Namespace.js
 * http://www.ApiFusion.org/wiki/index.php/Template:SiblingsNS&action=edit
 * <span data-af-mid="af/ui/List/Siblings/Namespace" data-af-param='{ "page":"{{{page|}}}" , "skip": [ "{{{skip|}}}"] }'></span>
 */
define(['jquery'    , "dojo/request",	"dojo/promise/all",	"dojo/_base/array"
],function ( $      , request		,	all               ,	array             )
{   "use strict";
    $('<style>.af-ui-list-siblings-namespace a { background-color: rgba(0,0,128,.1); }</style>').appendTo('head');
    return function AfListSiblingsNamespace( node, params )
    {
        let skip = []
        ,   $w  = $(node)
        ,   afRoot	= (mw && mw.config.get( 'wgScriptPath' ) || '.')+"/../ApiFusion.org-folders/"
	    ,	phpRoot = mw.config.get('wgScriptPath')+"/../ApiFusion.org-folders/php/"
        ,   DEFNS = 'Default'
        ,   wp  = mw.config.get('wgArticlePath')
        ,   cp  = mw.config.get('wgTitle')
        ,   pg  = ( "string" === typeof params ? params : params.page || cp );

        if( "object" === typeof params && params.skip )
        {   skip = params.skip;
            if( "string"=== typeof skip )
                skip = params.skip.split(',');
            if( skip.length===1 && !skip[0] )
                skip = [ mw.config.get('wgCanonicalNamespace') || DEFNS ];
        }

        all([ request( afRoot+"ns/Namespaces.xml"			, { handleAs:"xml"	} )
            , request( phpRoot+"PageNS.php?title="+pg	    , { handleAs:"json"	} )
        ]).then( populateNS );

            function
        populateNS( arr )
        {
            let xml		= arr[0]
            ,	nsArr	= arr[1];

            array.forEach( xml.getElementsByTagName("ns"), function(el)
            {	if( !nsArr.includes( 1*el.getAttribute("id") ) )
                    return;

                let ns = el.getAttribute("canonical")
                ,   u = ns ? ns+":" : ""
                ,   t = ns || el.textContent || DEFNS;
                if( !skip.includes(t) )
                    $w.append('<a class="btn" href="'+wp.replace('$1',u+pg)+'">'+t+'</a> ');
            });
        }
    };
});