/**
 * Created by suns on 2017-04-02.
 * http://www.ApiFusion.org/wiki/index.php/ApiFusion.org/Sources/ui/List/Children.js
 */
define(['jquery'],function ( $ )
{   "use strict";
    return function AfListChildren( node, params )
    {
        var $w  = $(node)
        ,   wp  = mw.config.get('wgArticlePath')
        ,   cp  = mw.config.get('wgTitle')
        ,   pg  = ( "string" == typeof params ? params : params.page || cp )
        ,   url = mw.config.get('wgScriptPath')+'/../ApiFusion.org-folders/php/Pages.php?title='+ pg;

        $.get( url, function( data )
        {   data.children.forEach( function( c )
            {   var t = c.page_title.split('/').pop();
                var u = pg + '/' + t;
                $w.append('<a href="'+wp.replace('$1',u)+'">'+t+'</a> ');
            });
        }).fail( function(err){  console.error( "error",err, url );  })
    };
});