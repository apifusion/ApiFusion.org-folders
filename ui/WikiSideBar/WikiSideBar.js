define([ "dojo/query"	, "dojo/request", "dojo/_base/array"	,"dojo/store/Memory"	, "dijit/tree/ObjectStoreModel"	, "dijit/Tree"	, "dijit/form/CheckBox"	, "dojo/ready" ]
, function( $			, request		, array					, Memory				, ObjectStoreModel				, Tree			, CheckBox				, ready )
{
	var DEFNS = 'Default';
	ready( function()
	{
		var afRoot = "/af/"
		,	css=document.createElement("link");
		css.setAttribute("rel", "stylesheet");
		css.setAttribute("type", "text/css");
		css.setAttribute("href", "https://ajax.googleapis.com/ajax/libs/dojo/1.10.1/dijit/themes/claro/claro.css");
		document.getElementsByTagName("head")[0].appendChild(css)
  		document.body.className += " claro";

		request( afRoot+"ns/Namespaces.xml", {handleAs:"xml"} ).then( populateNS );
    });
	return {};
	function
populateNS( xml )
{
	var d = [{ id:"Root",name:"Root" }, {id:0,parent:'Root', name:DEFNS, canonical:''}]
	,	o = {};

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

    var curNS	=  mw.config.get( 'wgPageName' ).split(':')[0]
	,	tree	= new Tree
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
					{ 
						ret.item.selected = b;
						console.log( ret.item, b );
					}
				});
				cb.placeAt( ret.labelNode, "first");

				return ret;
			}
    },  $("#p-Namespaces div ul")[0] );

	$("#p-Namespaces>div")[0].setAttribute("style","display: block; margin: 0px;");

    tree.startup();
}
});