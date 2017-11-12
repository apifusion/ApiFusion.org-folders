/* Any JavaScript here will be loaded for all users on every page load. */
;
var isLocal = ['127.0.0.1','localhost'].includes( location.hostname )
,   cdn_root = 'https://cdn.xml4jquery.com/ajax/libs/components'
,   vaadin_root         =isLocal ? '/components'                : cdn_root // 'https://cdn.vaadin.com/vaadin-elements/latest'
,   webcomponent_root   =isLocal ? "/components/webcomponentsjs": cdn_root+'/webcomponentsjs'
,   polymer_root        =isLocal ? "/components/polymer"        : cdn_root+'/polymer'
,   iron_root           =isLocal ? '/components'                : cdn_root ;

var dojoConfig =
{ async: true
, packages:
    [ { name: "af" , location: "/af/ApiFusion.org-folders" }
    , { name: "acl", location: "/af/af-acl" }
    , { name: "webcomponentsjs", location: webcomponent_root }
    , { name: "polymer", location: polymer_root }
    , { name: "app-storage", location: iron_root+"/app-storage" }
    ]
, aliases:  [ [ "link-import"  , isLocal ? "/components/link-import/link-import.js" : "../../link-import.js" ]
            , [ /(vaadin-)(.*)/, function(m,x,y){ return vaadin_root+'/'+x+y } ]
            , [ /(iron-)(.*)/  , function(m,x,y){ return iron_root  +'/'+x+y } ]
            , ["jquery", "af/ui/AMD/jquery"]
            ]
, deps: ["af/ui/WikiSideBar/WikiSideBar","af/ui/WidgetLoader","af/ui/List/Title2Breadcrumbs","af/ui/AutoloadWidgets", "webcomponentsjs/webcomponents-lite" ] // common for all pages
};

var afAction2mid ={protect:"acl/protect"};

(function(d,s,h)
{h=d.getElementsByTagName('head')[0]||d.getElementsByTagName('div')[0]||document.documentElement;
s=d.createElementNS?d.createElementNS(h.namespaceURI||'http://www.w3.org/1999/xhtml','script'):
d.createElement('script');
s.setAttribute('src',isLocal ?'/dojo/dojo/dojo.js':'//ajax.googleapis.com/ajax/libs/dojo/1.11.2/dojo/dojo.js');

h.appendChild(s);
})(document);