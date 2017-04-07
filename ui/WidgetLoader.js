/**
 * Created by suns on 2017-04-02.
 */
define(["jquery", "require"],function ( $, require )
{   "use strict";
    // todo plugin API support for immediate page parsing "WidgetLoader!"
    $(WidgetLoader);
    return WidgetLoader;

    function WidgetLoader()
    {
        $("*[data-af-mid]").each( function InitWidget( i, el )
        {   var mid = el.getAttribute("data-af-mid");
            $(el).addClass( mid.toLowerCase().replace( /\//g, "-") );
            require([mid], function CreateWidget( Widget )
            {   try
                {   new Widget( el, JSON.parse( el.getAttribute("data-af-param") ) );
                }catch( ex )
                    { console.error( mid, ex); debugger; }
            });
        });
    }
});