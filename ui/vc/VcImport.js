/**	Version Control import flow. 
*/
define([	"dojo/declare"	,"dojo/request"	,"dojo/promise/all"	,"dijit/Dialog", "dijit/form/Form"]
, function( declare			,request		,all				,Dialog				)
{	
	return function VcImport()
	{
		var dlg = new Dialog
		({	title: "Programmatic Dialog Creation"
        ,	style: "width: 100%"
	    });
		dlg.show();
		return;
		var w = document.getElementById("VcImport");
		if( !w )
		{
			w = document.createElement("div");
			w.setAttribute("id","VcImport");
			w.setAttribute("style","");
			w.innerHTML="ZZZZZZZZZZZZZZZZZ";
			document.body.appendChild(w);		
		}
	};
});