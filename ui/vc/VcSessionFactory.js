/**	Version Control session factory initializes the VcSession API. 
	Return VcSession-derived instanse
	params url or Object with following keys
		url		: repository url
		path	: initial path inside or repository
		transport: optional VcSession-derived class or its MID. If omitted will be guessed from URL 
		optional mix-in the authorisation parameters like login/password
*/
define([	"dojo/Deferred"	,"dojo/request"	,"dojo/promise/all"	,"dojo/_base/array"	,"./VcSessionGitHub"]
, function( Deferred 		,request			,all				,array			, VcSessionGitHub	)
{
	function CreateVcSession( /*Object*/ params )
	{
		var o = ( "string" == typeof params ) ? { url: params } : params;
		// todo: type by url recognition or o.transport
		return new VcSessionGitHub(o);		
	};
	return CreateVcSession;
});