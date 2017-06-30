/**
 * Created by suns on 2017-04-02.
 */
define(['jquery'],function ( $ )
{   "use strict";
    $(AfTitle2Breadcrumbs);

    return AfTitle2Breadcrumbs;

    function AfTitle2Breadcrumbs( node, params )
    {
        var wp  = mw.config.get('wgArticlePath');

        $('.firstHeading').each( function ( i, el, p )
        {
            var arr = el.innerText.split('/')
            ,   ret = [];
            while( p = arr.pop() )
                {   ret.push( '<a href="'+wp.replace('$1',arr.concat([p]).join('/')) + '">'+p+'</a>');  }
            el.innerHTML = ret.reverse().join('/');
        });
    };
});