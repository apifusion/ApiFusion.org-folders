/**
 * Created by suns on 2017-04-02.
 * AutoloadWidgets() appends widgets to page from given or default MIDs list.
 * It could be used in global AMD dependencies list or as widget on its own.
 * Widget from mids list creation will be skipped if it is already a part of page.
 * Add following to the page to skip autoloaded by global AMD dependencies list:
 *      <div data-af-mid='af/ui/AutoloadWidgets' data-af-param='{"mids":[]}'></div>
 */
define(["jquery", "require", "./WidgetLoader"],function ( $, require, WidgetLoader )
{   "use strict";
    let timeStamp           = Date.now()
    ,   MIDs= ["af/ui/List/Siblings/Namespace.js?z="+timeStamp,"af/ui/List/Children" ];

    $( ()=> $("*[data-af-mid='af/ui/AutoloadWidgets']").length || AutoloadWidgets() );
    return AutoloadWidgets;

    function AutoloadWidgets(node, params)
    {   let mids = MIDs;
        if( "string" === typeof params)
            mids = params.split(',');
        if( "object" === typeof params && params.mids )
            mids    = "string" === typeof params.mids
                    ? params.mids.split(',')
                    : params.mids;

        mids.forEach( mid =>
        {   let $w = $("*[data-af-mid='"+mid+"']");
            if(!$w.length )
            {   let $w = $("<span data-af-mid='"+mid+"'></span>");
                WidgetLoader.InitWidget( $w );
                $("#mw-content-text").append("<hr/>").append( $w );
            }
        });
    }
});