define([], function() 
{
	// module:
	//		ui/AMD/xml
	// summary:
	//		This module implements the ui/AMD/xml! plugin and API for XML creation, transformation, XPath and node creation/removal.
	// description:
	//		As plugin returns XMLDOMDocument retrieved by XHR

    return	{	load: function load(name, req, onLoad, config) 
				{
					getXml( req.toUrl( name ) , onLoad );
				}
			,	getXml		: getXml
			,	transform	: transform
			,	XPath_node	: function XPath_node( xPath, node )
				{
					var d = node.ownerDocument || node
					,	nsResolver = d.createNSResolver && d.createNSResolver(d.documentElement);
					if( d.evaluate )
						return (node.ownerDocument || node)
							.evaluate(xPath, node, nsResolver, 9, null)
							.singleNodeValue;
					d.setProperty('SelectionLanguage', 'XPath');
					d.setProperty('SelectionNamespaces', 'xmlns:xsl="http://www.w3.org/1999/XSL/Transform"');
  
					return node.selectSingleNode( xPath );//,nsmgr )
				}
			,	XPath_nl : function XPath_nl( xPath, node )
				{
					var d = node.ownerDocument || node
					,	nsResolver = d.createNSResolver && d.createNSResolver(d.documentElement);
					if( d.evaluate )
						return (node.ownerDocument || node).evaluate( xPath, node, nsResolver, 0, null );

					d.setProperty('SelectionLanguage', 'XPath');
					d.setProperty('SelectionNamespaces', 'xmlns:xsl="http://www.w3.org/1999/XSL/Transform"');
					return node.SelectNodes( xPath );//, nsmgr );
				}
			,	createElement : function createElement(name, document)
				{
					return document.createElementNS ? document.createElementNS(XHTML, name) : document.createElement(name);
				}
			,	cleanElement : cleanElement
			};

		function 
	getXml( url, callback )
	{
		var xhr = window.ActiveXObject ? new ActiveXObject("Msxml2.XMLHTTP") : new XMLHttpRequest();
		xhr.open("GET", url, false);
		try { xhr.responseType = "msxml-document" } catch (err) { } // Helping IE11
		xhr.onreadystatechange = function ()
		{
			if( 4 != xhr.readyState )
				return;
			try
			{	if( xhr.responseXML )
					return callback( xhr.responseXML );
				callback(new DOMParser().parseFromString( xhr.responseText, "application/xml" ));
			}catch( ex )
				{	console.log("XHR handler error", ex );	}
		}
		xhr.send();
	}
		function 
	transform( xml, xsl, el )
	{
		if ('undefined' == typeof XSLTProcessor)
		{	xsl.setProperty("AllowXsltScript", true);
			el.innerHTML = xml.transformNode(xsl);	
			return;
		}
		var p = new XSLTProcessor();
		p.importStylesheet(xsl);

		cleanElement(el);
		el.appendChild(p.transformToFragment(xml, document));
	}
	function cleanElement(el)
	{
		while( el && el.lastChild)
			el.removeChild(el.lastChild);
	}
});
