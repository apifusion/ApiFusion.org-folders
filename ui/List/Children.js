/**
 * Created by suns on 2017-04-02.
 * http://www.ApiFusion.org/wiki/index.php/ApiFusion.org/Sources/ui/List/Children.js
 */
define(['jquery'],function ( $ )
{   "use strict";
    $('<style>.af-ui-list-children a { background-color: rgba(0,128,0,.1); }</style>').appendTo('head');
    return function AfListChildren( node, params )
    {
        var skip = []
        ,   $w  = $(node)
        ,   wp  = mw.config.get('wgArticlePath')
        ,   cp  = mw.config.get('wgTitle')
        ,   pg  = ( "string" == typeof params ? params : params.page || cp )
        ,   url = mw.config.get('wgScriptPath')+'/../ApiFusion.org-folders/php/Pages.php?title='+ pg;

        if( "object" == typeof params && params.skip )
        {   skip = params.skip;
            if( "string"== typeof skip )
                skip = params.skip.split(',');
        }

        $.get( url, function( data )
        {   data.children.forEach( function( c )
            {   var t = c.page_title.split('/').pop()
                ,   u = pg + '/' + t;
                if( !skip.includes(t) )
                    $w.append('<a class="btn" href="'+wp.replace('$1',u)+'">'+t+'</a> ');
            });
        }).fail( function(err){  console.error( "error",err, url );  })
    };
});