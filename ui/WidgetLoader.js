/**
 * Created by suns on 2017-04-02.
 * WidgetLoader() creates a widgets for all dom nodea with data-af-mid attribute.
 */
define(["jquery", "require"],function ( $, require )
{   "use strict";
    // todo plugin API support for immediate page parsing "WidgetLoader!"
    $(WidgetLoader);
    return WidgetLoader;

    function WidgetLoader()
    {
        $("*[data-af-mid]").each( function InitWidget( i, el )
        {   let mid = el.getAttribute("data-af-mid");
            $(el).addClass( mid.toLowerCase().replace( /\//g, "-") );
            require([mid], function CreateWidget( Widget )
            {   try
                {   let o = JSON.parse( el.getAttribute("data-af-param") );
                    for( let k in o )
                        if( o[k] && o[k].map )
                            o[k] = o[k].map( v => v.trim() );
                    new Widget( el, o );
                }catch( ex )
                    { console.error( mid, ex); debugger; }
            });
        });
    }
});