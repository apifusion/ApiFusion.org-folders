/**
 * Created by suns on 2017-04-02.
 * http://www.ApiFusion.org/wiki/index.php/ApiFusion.org/Sources/ui/List/Siblings/Pages.js
 * http://www.ApiFusion.org/wiki/index.php/Template:SiblingsList&action=edit
 * <span data-af-mid="af/ui/List/Siblings/Pages" data-af-param='{ "page":"{{{page|}}}" , "skip": [ "{{{skip|}}}"] }'></span>
 */
define(['jquery','../Children'],function ( $, Children )
{   "use strict";
    $('<style>.af-ui-list-siblings-pages a { background-color: rgba(128,128,0,.1); }</style>').appendTo('head');
    return function AfListSiblingPages( node, params )
    {
        let pg  = "string" === typeof params
                ? params
                : ( params && params.page ) || mw.config.get('wgTitle')
        ,   arr = pg.split('/')
        ,   t   = arr.pop()
        ,   pt  = arr.join("/");

        if( "object" !== typeof params  )
            params = {};

        params.skip = "string" === typeof params.skip
                    ? params.skip.split(',')
                    : [t];
        params.page = pt;
        return Children( node, params );
    };
});