define([ "dojo/query"	, "dojo/request",	"dojo/_base/array"	,"dojo/store/Memory"	, "dijit/tree/ObjectStoreModel"	, "dijit/Tree"	, "dijit/form/CheckBox"	, "dojo/ready" ]
, function( $			, request		,	array				, Memory				, ObjectStoreModel				, Tree			, CheckBox				, ready )
{
	var DEFNS = 'Default'
	,	curNS	= mw.config.get( 'wgCanonicalNamespace' ) || DEFNS
	,	afRoot	= mw.config.get( 'wgScriptPath' )+"/../"
	,	pageTitle = mw.config.get( 'wgTitle' );

	ready( function()
	{
		var css=document.createElement("link");
		css.setAttribute("rel", "stylesheet");
		css.setAttribute("type", "text/css");
		css.setAttribute("href", "https://ajax.googleapis.com/ajax/libs/dojo/1.10.1/dijit/themes/claro/claro.css");
		document.getElementsByTagName("head")[0].appendChild(css)
  		document.body.className += " claro";

		request( afRoot+"ns/Namespaces.xml", {handleAs:"xml"} ).then( populateNS );
		request( afRoot+"php/Pages.php?title="+pageTitle, {handleAs:"json"} ).then( populatePages );
    });
	return {};

	function
populatePages( arr )
{
	var d = [{ id:"Root",name:'Root' }]
	,	np = pageTitle.split('/')
	,	curPath = [];

	while( np.length )
	{	
		curPath.splice(0,0, np.join('/') );
		np.pop();
	}
	curPath.splice(0,0,'Root');

	array.forEach( arr, function(el)
	{	var p	 = el.page_title.split('/')
		,	name = p.pop()
		,	par	 = p.join('/')
		,	e	 = { id: el.page_title, name: name, parent: par || 'Root' };
		
		for( var k in el )
			e[k] = el[k];

		d.push(e);
	});
	
	var myStore = new Memory(
	{   data: d
	,   getChildren: function(o)
		{	
			return this.query({parent: o.id});	
		}
    });

    var myModel = new ObjectStoreModel(
	{   store: myStore
    ,   query: { id: 'Root'}
	,	mayHaveChildren: function(o)
		{
			return !!myStore.query({parent: o.id}).length;
		}
    });
	createTree( "#p-Pages div ul", myModel, curPath  );
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
	
	var myStore = new Memory(
	{   data: d
	,   getChildren: function(object)
		{	
			return this.query({parent: object.id});	
		}
    });

    var myModel = new ObjectStoreModel(
	{   store: myStore
    ,   query: {id: 'Root'}
	,	mayHaveChildren: function(o)
		{
			return o.id == o.name && o.id!=DEFNS;
		}
    });
	createTree( "#p-Namespaces div ul", myModel, curPath  );
}
	function
createTree( cssSelector, myModel, curPath )
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
				{	ret.labelNode.innerHTML = '<a href="'+location.pathname.replace( curNS+':', name+':').replace('Default:','')+'">'+name+'</a>';
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