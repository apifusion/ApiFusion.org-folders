define([ "dojo/query"	, "dojo/request",	"dojo/_base/array"	,"dojo/store/Memory"	,"dojo/store/JsonRest"	,"dijit/tree/ObjectStoreModel"	, "dijit/Tree"	, "dijit/form/CheckBox"	,"dijit/tree/dndSource"	, "dojo/ready" ]
, function( $			, request		,	array				, Memory				, JsonRest				,ObjectStoreModel				, Tree			, CheckBox				, dndSource				, ready )
{

	var DEFNS = 'Default'
	,	curNS	= mw.config.get( 'wgCanonicalNamespace' ) || DEFNS
	,	afRoot	= mw.config.get( 'wgScriptPath' )+"/../"
	,	pageTitle	= mw.config.get( 'wgTitle' )
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
		createPagesTree("#p-Pages div ul"			,getRoot( getPageId(1)	), pathToCurrent() );
		request( afRoot+"ns/Namespaces.xml", {handleAs:"xml"} ).then( populateNS );
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
	,	_createTreeNode: function(args)
			{
				var ret = new dijit._TreeNode(args)
				,	o	= args.item
				,	name= o.page_title.split('/').pop();
				ret.labelNode.innerHTML = '<a href="'+getLinkPage(o)+'">'+name+'</a>';
				$("a",ret.labelNode).on('click',function(){location.href=this.href;});				
				return ret;
			}
    }, $(cssSelector)[0]);
	tree.attr('path', curPath);
	tree.startup();
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
pathToCurrent()
{	for( var ret=[], i=1; i<pages.length; i++ )
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
	return ( mw.config.get( 'wgScript' )+"/"+curNS+':'+ o.page_title ).replace('Default:','');
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
});