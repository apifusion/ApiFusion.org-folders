define([], function() 
{
	// module:
	//		ui/AMD/xml
	// summary:
	//		This module implements the ui/AMD/xml! plugin and API for XML creation, transformation, XPath and node creation/removal.
	// description:
	//		As plugin returns XMLDOMDocument retrieved by XHR

	var XHTML	= "http://www.w3.org/1999/xhtml"
	,	AFNS	= "http://apifusion.com/ui/vc/1.0";

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
			,	XPath_nl : XPath_nl
			,	$ : XPath_nl
			,	createElement : createElement
			,	cleanElement : cleanElement
			};
		function 
	XPath_nl( /* string | Array */ xPath, node )
	{
		var	d	= ( node || xPath[0] ).ownerDocument || node
		,	nl	= [];
		if( "string" == typeof xPath )
				nl = xpath2arr(xPath, node);
		else
				nl.push.apply(nl,xPath);

		// WindJetQuery inlined
		var o = nl[0] || createElement('b',d);

		forEachProp( o, function(v,name)
		{	
			nl[name] = function 
			invokeElementMethod()
			{
				var args	= arguments
				,	i		= 0
				,	max		= this.length;

				this._ret = [];

				for( ; i<max ; i++ )
				{	var el	= this[i]
					,	v	= el[name];
					if( "function" === typeof v )
						v = v.apply( el, args );
					else if( args.length )	// setter
						v = el[name] = args[ i % args.length ]; 
					this._ret[i] = v;
				}
				return this;
			}			
		}, nl );

		nl.attr = nl.setAttribute; // alias
		nl.val	= function(){ return this[0] && this[0].value; }
		nl.createChild = createChild;
		nl.$ = function(xp)
		{	var ret = [];
			this.forEach( function( el, i )
			{
				ret.push.apply( ret, xpath2arr(xp,el) );
			});
			return XPath_nl(ret);
		}
		nl.$ret = function(){	return XPath_nl(this._ret); }

		return nl;

			function
		xpath2arr(xPath, node)
		{
			var nl =[]
			,	e, xr
			,	nsResolver = d.createNSResolver && d.createNSResolver(d.documentElement);

			if( d.evaluate )
				xr = (node.ownerDocument || node).evaluate( xPath, node, nsResolver, 0, null );
			else
			{
				d.setProperty('SelectionLanguage', 'XPath');
				d.setProperty('SelectionNamespaces', 'xmlns:xsl="http://www.w3.org/1999/XSL/Transform"');
				xr = node.SelectNodes( xPath );//, nsmgr );
			}
			while( e = xr.iterateNext() )
				nl.push(e);
			return nl;
		}
	}
		function 
	createChild(name, attrs)
	{	this.forEach(function(n,i)
			{	var c = this._ret[i] = n.ownerDocument.createElementNS(AFNS,name);
				for( var a in attrs )
					c.setAttribute(a, attrs[a] );
				n.appendChild( c );
			}, this);
		return this; 
	}

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
	function createElement(name, document)
	{
		return document.createElementNS ? document.createElementNS(XHTML, name) : document.createElement(name);
	}
	function cleanElement(el)
	{
		while( el && el.lastChild)
			el.removeChild(el.lastChild);
	}

		function
	forEachProp( o, onProp, scope )
	{
		if( scope )
			for( var n in o )
				onProp.call( scope, o[n], n, o );
		else
			for( var n in o )
				onProp( o[n], n, o );
	}
});
