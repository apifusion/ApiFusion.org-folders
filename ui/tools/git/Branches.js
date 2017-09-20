/**
 * Created by suns on 2017-09-17.
 * http://www.ApiFusion.org/wiki/index.php/ApiFusion.org/Sources/ApiFusion.org-folders/ui/tools/git/Branches.js
 * http://www.ApiFusion.org/wiki/index.php/Template:ApiFusion.org-folders/ui/tools/git/Branches&action=edit
 * <span data-af-mid="af/ApiFusion.org-folders/ui/tools/git/Branches" data-af-param='{ "page":"{{{page|}}}" , "skip": [ "{{{skip|}}}"] }'></span>
 */
define(['jquery'],function ( $ )
{   "use strict";
    $('<style>.af-ui-tools-git-Branches a { background-color: rgba(128,128,0,.1); }</style>').appendTo('head');
    return function AfListBranches( node, params )
    {
        let $w  = $(node)
        ,   wp  = mw.config.get('wgArticlePath')
        ,   cp  = mw.config.get('wgTitle')
        ,   pg  = ( "string" == typeof params ? params : params.page || cp )
        ,   url = mw.config.get('wgScriptPath')+'/api.php?action=parse&prop=sections&format=json&page=Sources:'+ pg;
        //  http://localhost/af/wiki/api.php?action=parse&prop=sections&page=ApiFusion.org/Modules

        $.get( url, function( data )
        {
            debugger;
            data.parse.sections.forEach( function( c )
            {   var t = c.line
                ,   u = pg + '/' + t;
                $w.append('<a class="btn" href="'+wp.replace('$1',u)+'">'+t+'</a> ');
            });
        }).fail( function(err){  console.error( "error",err, url );  })
    };
});