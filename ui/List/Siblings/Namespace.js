/**
 * Created by suns on 2017-04-04.
 * http://www.ApiFusion.org/wiki/index.php/ApiFusion.org/Sources/ui/List/Siblings/Namespace.js
 */
define(['jquery'    , "dojo/request",	"dojo/promise/all",	"dojo/_base/array"
],function ( $      , request		,	all               ,	array             )
{   "use strict";
    $('<style>.af-ui-list-siblings-namespace a { background-color: rgba(0,0,128,.1); }</style>').appendTo('head');
    return function AfListSiblingsNamespace( node, params )
    {
        var skip = []
        ,   $w  = $(node)
        ,   afRoot	= (mw && mw.config.get( 'wgScriptPath' ) || '.')+"/../ApiFusion.org-folders/"
        ,   DEFNS = 'Default'
        ,   wp  = mw.config.get('wgArticlePath')
        ,   cp  = mw.config.get('wgTitle')
        ,   pg  = ( "string" == typeof params ? params : params.page || cp );


        all([ request( afRoot+"ns/Namespaces.xml"				, { handleAs:"xml"	} )
            , request( afRoot+"php/PageNS.php?title="+pg	    , { handleAs:"json"	} )
        ]).then( populateNS );




        if( "object" == typeof params && params.skip )
        {   skip = params.skip;
            if( "string"== typeof skip )
                skip = params.skip.split(',');
        }
            function
        populateNS( arr )
        {
            var xml		= arr[0]
            ,	nsArr	= arr[1];

            array.forEach( xml.getElementsByTagName("ns"), function(el)
            {	if( !nsArr.includes( 1*el.getAttribute("id") ) )
                    return;

                var ns = el.getAttribute("canonical")
                ,   u = ns ? ns+":" : ""
                ,   t = ns || DEFNS;
                if( !skip.includes(t) )
                    $w.append('<a class="btn" href="'+wp.replace('$1',u+pg)+'">'+t+'</a> ');
            });

console.log(d);
        }
    };
});