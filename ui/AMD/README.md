Additional UI functionality in ApiFusion is added using AMD.
 
http://www.apifusion.com/wiki/index.php/MediaWiki:Common.js
 
```javascript
/* Any JavaScript here will be loaded for all users on every page load. */
var afAction2mid ={protect:"acl/protect"};
var dojoConfig = {   async: true, isDebug: true
,   packages: [{name: "af", location: "/af/ApiFusion.org-folders" },{ name: "acl", location: "/af/af-acl" }]
,   aliases:[["jquery", "af/ui/AMD/jquery"]]
,   deps:["af/ui/WikiSideBar/WikiSideBar","af/ui/WidgetLoader","af/ui/List/Title2Breadcrumbs"]};

(function(d,s,h)
{h=d.getElementsByTagName('head')[0]||d.getElementsByTagName('div')[0]||document.documentElement;
s=d.createElementNS?d.createElementNS(h.namespaceURI||'http://www.w3.org/1999/xhtml','script'):
d.createElement('script');
/*s.setAttribute('src','//ajax.googleapis.com/ajax/libs/dojo/1.11.2/dojo/dojo.js');*/
s.setAttribute('src','/dojo/dojo/dojo.js.uncompressed.js');

h.appendChild(s);
})(document);
``` 