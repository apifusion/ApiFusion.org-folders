define([ "dojo/query"	, "dojo/request",	"dojo/_base/array"	,"dojo/store/Memory"	,"dojo/store/JsonRest"	,"dijit/tree/ObjectStoreModel"	, "dijit/Tree"	, "dijit/form/CheckBox"	,"dijit/tree/dndSource"	, "dojo/ready" ]
, function( $			, request		,	array				, Memory				, JsonRest				,ObjectStoreModel				, Tree			, CheckBox				, dndSource				, ready )
{

//	if( typeof mw == 'undefined' )
//		var mw;
	var DEFNS = 'Default'
	,	curNS	= (mw && mw.config.get( 'wgCanonicalNamespace' )) || DEFNS
	,	afRoot	= (mw && mw.config.get( 'wgScriptPath' ) || '.')+"/../"
	,	pageTitle	= (mw && mw.config.get( 'wgTitle' ) ) || ''
	,	pages		= pageTitle.split('/');

	ready( function()
	{
		var css=document.createElement("link");
		css.setAttribute("rel", "stylesheet");
		css.setAttribute("type", "text/css");
		css.setAttribute("href", "https://ajax.googleapis.com/ajax/libs/dojo/1.10.1/dijit/themes/claro/claro.css");
		document.getElementsByTagName("head")[0].appendChild(css)
  		document.body.className += " claro";

		createPagesTree("#p-Organisations div ul"	,getRoot( "Main_Page"	),[ "Main_Page"		, getPageId(0) ] );
		createPagesTree("#p-Projects div ul"		,getRoot( getPageId(0)	),[ getPageId(0)	, getPageId(1) ] );
		createPagesTree("#p-Pages div ul"			,getRoot( getPageId(1)	), pathToCurrent(1, pages) );
		request( afRoot+"ns/Namespaces.xml", {handleAs:"xml"} ).then( populateNS );

		$(".Page_Select_Control").forEach( init_Page_Select_Control );
    });
	return {};

	function 
createPagesTree(cssSelector, getRoot, curPath)
{
    var model = new JsonRest(
	{	target:afRoot+"php/Pages.php?title="
	,	_getTarget: function(id){ return this.target+id; }
	,	idProperty: "page_title"
	,	mayHaveChildren: function(o){  return o.childrenCount*1 >0; }
	,	getChildren: function(object, onComplete, onError)
		{
			this.get(object.page_title).then(function(fullObject)
			{   object.children = fullObject.children;
				onComplete(fullObject.children);
			}, onError);
		}
	,	getRoot: getRoot
	,	getLabel: function(o)
		{
			return o.page_title.split('/').pop();
		}
	});
    var tree = new Tree(
	{	model: model
    ,	dndController: dndSource
	,	showRoot: false
	,	getIconClass: function(){return "";}
	,	openOnClick : false
	,	_onClick: function(nodeWidget, e)
			{
				if( e.target.nodeName.toLowerCase() == "a" )
					return false;
				return this.__click(nodeWidget, e, this.openOnClick, 'onClick');
			}
	,	_createTreeNode: function(args)
			{
				var ret = new dijit._TreeNode(args)
				,	o	= args.item
				,	zs	= this
				,	name= o.page_title.split('/').pop();
				ret.labelNode.innerHTML = '<a href="'+getLinkPage(o)+'">'+name+'</a>';
				return ret;
			}
    }, $(cssSelector)[0]);
	tree.attr('path', curPath);
	tree.startup();
	return tree;
}

	function 
getRoot( id )
{	
	return function(onItem, onError)
	{
		this.get(id).then(onItem, onError);
	}
}
	function
getPageId( n )
{	for( var ret=[], i=0; i<=n &&i<pages.length; i++ )
		ret.push( pages[i] );
	return ret.join('/');
}
	function 
pathToCurrent(i, pages)
{	for( var ret=[]; i<pages.length; i++ )
		ret.push( getPageId(i) );
	return ret;
}

	function
populateNS( xml )
{
	var d = [{ id:"Root",name:'Root' }, {id:0,parent:'Root', name:DEFNS, canonical:''}]
	,	o = {}
	,	curPath = ['Root'];

	array.forEach( xml.getElementsByTagName("ns"), function(el)
	{	var e = {};
		array.forEach( el.attributes, function( a ){ e[a.name] = a.value; });
		e.name		= e.canonical;
		e.parent	= e.category || DEFNS;

		var id = e.id * 1;
		if( id < 1000 || id&1 )
			return;
		var cat = e.category;
		if( cat && !( cat in o ) )
			d.push( o[cat] = {id:cat,name:cat,parent:'Root'} );
		if( e.name == curNS )
		{	curPath.push(cat);
			curPath.push(e.id);
		}
		d.push(e);
	});

    var myModel = new ObjectStoreModel(
	{   store: createMemoryStore(d)
    ,   query: {id: 'Root'}
	,	mayHaveChildren: function(o)
		{
			return o.id == o.name && o.id!=DEFNS;
		}
    });
	createTree( "#p-Namespaces div ul", myModel, curPath, getLinkNS  );
}
	function
createMemoryStore(d)
{	return new Memory(
	{   data: d
	,   getChildren: function(object)
		{	
			return this.query({parent: object.id});	
		}
    });
}
	function
getLinkNS( o )
{
	return ( mw.config.get( 'wgScript' )+"/"+o.name+':'+ pageTitle ).replace('Default:','');
}
	function
getLinkPage( o )
{
	return ( mw.config.get( 'wgScript' )+"/"+curNS+':'+ (o.page_title || o) ).replace('Default:','');
}

	function
createTree( cssSelector, myModel, curPath, getLink )
{
    var tree	= new Tree
	({  model	: myModel
	,	showRoot: false
	,	getIconClass: function(){return "";}
	,	_createTreeNode: function(args)
			{
				var ret = new dijit._TreeNode(args)
				,	o	= args.item
				,	ns  = o.id
				,	name= o.name;
				if( o.id != o.name )
				{	ret.labelNode.innerHTML = '<a href="'+getLink(o)+'">'+name+'</a>';
					$("a",ret.labelNode).on('click',function(){location.href=this.href;});
				}
				var cb = new CheckBox(
				{	onChange: function(b)
					{	ret.item.selected = b;
						console.log( ret.item, b );
					}
				});
				cb.placeAt( ret.labelNode, "first");

				return ret;
			}
    },  $(cssSelector)[0] );

	tree.attr('path', curPath);
    tree.startup();
}
	function
init_Page_Select_Control( el )
{
	console.log(el.innerHTML);
	el.innerHTML=el.innerHTML.replace( /&lt;/g ,"<").replace( /&gt;/g ,">").replace( /<p>/g ,"").replace( /<\/p>/g ,"");
	var paths = pathToCurrent(0, pages);
	paths.unshift("Main_Page");
	var tree = createPagesTree( $(".PagesTree",el ), getRoot( "Main_Page" ), paths );
	var tm
	,	inp = $("input[name=title]",el);
	inp.on("change",OnInputChange);
	inp.on("input", function()
		{	tm && clearTimeout(tm);
			tm = setTimeout( OnInputChange, 1000 );
		});
	tree._onClick = function(nodeWidget, e)
		{
			if( e.target.nodeName.toLowerCase() == "a" )
			{
				inp[0].value = nodeWidget.item.page_title + "/New";
				OnInputChange();
				e.preventDefault();
				return true;
			}	return this.__click(nodeWidget, e, this.openOnClick, 'onClick');
		};
	$("input[name='CreatePage']", el).on( 'click', function()
		{
			var v = inp[0].value
			,	u = getLinkPage( v );
			if( "New" == v.split('/').pop() )
				return false;
			location.href = u +(u.indexOf('?')>0 ? '&':'?')+"action=edit";
		});
	OnInputChange();

		function
	OnInputChange()
	{	tm && clearTimeout(tm); tm = 0;
		var msg = $(".warning",el)[0]
		,	v = inp[0].value
		,	a = v.split('/')
		,	paths = pathToCurrent( 0, a ); 
		paths.unshift("Main_Page")
		tree.attr('path', paths);

		if( v.split('/').pop() == "New" )
			return msg.innerHTML = "Replace a 'New' with desired to create page name";
		tree.model.get( v ).then( function ok(o)
			{	if( o ) 
					msg.innerHTML =  "Page found: <a href='"+getLinkPage( o ) + "'>" + o.page_title + "</a>"; 
				else 
					err();	
			}, err); 
		function err(){ msg.innerHTML = "Will create a page"; }
	}
}
});