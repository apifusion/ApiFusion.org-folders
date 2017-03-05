require([ "dojo/query"	, "dojo/request",	"dojo/promise/all"	,	"dojo/_base/array"	,"dojo/store/Memory"	,"dojo/store/JsonRest"	,"dijit/tree/ObjectStoreModel"	, "dijit/Tree"	, "dijit/form/CheckBox"	,"dijit/tree/dndSource"	,"dojo/topic"   ,"dojo/ready", "dojo/NodeList-manipulate" ]
, function( $			, request		,	all					,	array				, Memory				, JsonRest				,ObjectStoreModel				, Tree			, CheckBox				, dndSource				,topic          , ready )
{

//	if( typeof mw == 'undefined' )
//		var mw;
	var DEFNS = 'Default'
	,	curNS	= (mw && mw.config.get( 'wgCanonicalNamespace' )) || DEFNS
	,	afRoot	= require.toUrl('af')+'/'
	,	pageTitle	= (mw && mw.config.get( 'wgTitle' ) ) || ''
	,	pages		= pageTitle.split('/');

	ready( function()
	{
		document.body.className += " claro";

		all([ request( afRoot+"ns/Namespaces.xml"				, { handleAs:"xml"	} )
			, request( afRoot+"php/PageNS.php?title="+pageTitle	, { handleAs:"json"	} ) 
			]).then( populateNS );
		

		createPagesTree("#p-Organisations div ul"	,getRoot( "Main_Page"	),[ "Main_Page"		, getPageId(0) ] );
		createPagesTree("#p-Projects div ul"		,getRoot( getPageId(0)	),[ getPageId(0)	, getPageId(1) ] );
		createPagesTree("#p-Pages div ul"			,getRoot( getPageId(1)	), pathToCurrent(1, pages) );

		$(".Page_Select_Control").forEach( init_Page_Select_Control );
		var mid = afAction2mid[ mw.config.get( 'wgAction' ) ];
		mid && require([ mid ]);
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
			return o && o.page_title.split('/').pop();
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
				,	o	= args.item || {page_title:"undefined"}
				,	zs	= this
				,	name= o.page_title.split('/').pop();
				ret.labelNode.innerHTML = '<a href="'+getLinkPage(o)+'">'+name+'</a>';
                if( 'view'!= mw.config.get('wgAction') )
                    new CheckBox({	onChange: function(b){	ret.item.selected = b; topic.publish("title/checked",ret.item); }})
                    .placeAt( ret.labelNode, "first");
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
populateNS( arr )
{
	var xml		= arr[0]
	,	nsArr	= arr[1]
	,	d = [{ id:"Root",name:'Root' }, {id:0,parent:'Root', name:DEFNS, canonical:''}]
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
	createTree( "#p-Namespaces div ul", myModel, curPath, getLinkNS, nsArr  );
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
createTree( cssSelector, myModel, curPath, getLink, nsArr )
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
				{	ret.labelNode.innerHTML = '<a href="'+getLink(o)+'" >'+name+'</a>';
					if( nsArr.indexOf(1*o.id) >=0 )
						ret.labelNode.className += " nsFound ";					
					$("a",ret.labelNode).on('click',function(){location.href=this.href;});
				}else
				{	var b;
					array.forEach( myModel.store.query({parent:name}), function( o ){ if( nsArr.indexOf(1*o.id) >=0 ) b = 1; });
					if( b ) 
						ret.labelNode.className += " nsFound ";
				}
				if( 'view'!= mw.config.get('wgAction') )
                    new CheckBox({	onChange: function(b){	ret.item.selected = b; topic.publish("namespace/checked",ret.item); }})
                    .placeAt( ret.labelNode, "first");

				return ret;
			}
    },  $(cssSelector)[0] );

	tree.attr('path', curPath);
    tree.startup();
}
	function
init_Page_Select_Control( el )
{
	el.innerHTML=el.innerHTML.replace( /&lt;/g ,"<").replace( /&gt;/g ,">").replace( /<p>/g ,"").replace( /<\/p>/g ,"");
	var paths = pathToCurrent(0, pages);
	paths.unshift("Main_Page");
	var tree = createPagesTree( $(".PagesTree",el ), getRoot( "Main_Page" ), paths )
	,	model = tree.model
	,	tm
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
		,	t = inp[0]
		,	v = t.value.replace("Main Page/","").replace("Main_Page/","")
		,	a = v.split('/')
		,	paths = pathToCurrent( 0, a ); 
		paths.unshift("Main_Page")
		tree.attr('path', paths);

		if( t.value != v )
			t.value = v;

		if( v.split('/').pop() == "New" )
			return msg.innerHTML = "Replace a 'New' with desired to create page name";

		model.get( v ).then( function ok(o)
			{	o	?	msg.innerHTML =  "Page found: <a href='"+getLinkPage( o ) + "'>" + o.page_title + "</a>"
					:	createPageNote();
			}, createPageNote); 
		
			function 
		createPageNote()
		{	msg.innerHTML = "Will create a page";
			UpdateHint();
		}
			function
		UpdateHint()
		{
			var p = v.split('/');
			if( 2 >  p.length )	return displayHint( "New_Organisation" );
			if( 2 == p.length )	return displayHint( "New_Project" );
			p.pop(); p.push("New");
			return displayHint( p.join('/') );
		}
			function
		displayHint( page )
		{
			var id = "HintSection-"+page;
			if( document.getElementById(id) )
				return;
			request( afRoot+"wiki/api.php?format=json&action=parse&prop=text&page="+page, {handleAs:"json"} )
			.then( function (o){ o.error ? err() : AppendSection(id, o.parse.text['*']);}, err );

				function 
			err(ex)
			{	var a = page.split('/'); a.pop();a.pop(); a.push("New");
				displayHint( a.join('/'));
			}
		}
			function
		AppendSection( id, text )
		{
			$("#bodyContent").append("<div id='"+id+"'><hr/>"+text+"</div>");
		}
	}
}
});