/**
 * Created by suns on 2017-04-02.
 * WidgetLoader() creates a widgets for all dom nodes with data-af-mid attribute.
 */
define(["jquery", "require"],function ( $, require )
{   "use strict";
    // todo plugin API support for immediate page parsing "WidgetLoader!"
    WidgetLoader.InitWidget = InitWidget;
    $(WidgetLoader);
    return WidgetLoader;

    function WidgetLoader()
    {
        $("*[data-af-mid]").each( (i,el) => InitWidget(el) );
    }
    function InitWidget( el )
    {   let $el = $(el)
        ,   mid = $el.attr("data-af-mid")
        ,   cls = mid.toLowerCase().replace( /\//g, "-");
        if( $el.hasClass(cls) )
            return;
        $el.addClass( cls );
        require([mid], function CreateWidget( Widget )
        {   try
            {   let o = JSON.parse( $el.attr("data-af-param") || '{"skip":[""]}' );
                for( let k in o )
                    if( o[k] && o[k].map )
                        o[k] = o[k].map( v => v.trim() );
                new Widget( el, o );
            }catch( ex )
                { console.error( mid, ex); debugger; }
        });
    }
});