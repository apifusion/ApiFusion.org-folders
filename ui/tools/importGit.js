// http://localhost/af/ApiFusion.org-folders/ui/tools/importGit.html
// http://localhost/af/ApiFusion.org-folders/php/Pages.php?title=ApiFusion.org/Sources
const urlParams={}; location.search.substring(1).split('&').filter(a=>!!a).forEach( el=>{ let a=el.split('=',2); urlParams[a[0]]=decodeURIComponent(a[1])});
let gitRestfulUrl
,   wikiUrl
,   sourcesRoot
,   orgs = []
,   org
,   lockedRepo
,   lockedBranch
,   afSourcesRoot
,   creationQueue   = []
,   pagesTotal      = 0
,   pagesCreated    = 0;

const SEARCH_URL = "/api.php?action=opensearch&format=xml&namespace=0&limit=1000&suggest=true&search=";
const t2a = {}; // title 2 FolderEntry attributes

enableStep( 0 );

validateUrl('af-git-restful', '/git-restful', '//app.version').$then( u =>  gitRestfulUrl = input('af-git-restful').val(), ()=> gitRestfulUrl ="" );
validateUrl('af-wiki-root'  , ''            , '//app.version').$then( u =>  wikiUrl       = u                            , ()=> wikiUrl       ="" );

input('vc-repo').$on('input change').val().$then(onRepoChange);
$('.step1 .regenerate').on( 'click', regenerateVcRepoView );

$onSubmit( 0,  ()=>
{
    if( !gitRestfulUrl || !wikiUrl )
        return;
    enableStep( 1 );
    $.getJSON( pagesUrl(), x=> orgs = x.children.map( e=>e.page_title ) );
    input('af-sources-root').$on('change input focus').val().$then( onSourcesRootChange );
});

$onSubmit( 1, ()=>
{
    let repo = input('vc-repo').val();
    if( !repo )
        return;
    disable( '.step1 form input[type=submit]' );
    $.get( `${gitRestfulUrl}/lock-repo?url=${repo}`, x=>
    {   lockedRepo = x;
        enableStep( 2 );
        let $b = input('vc-branch').focus();
        $.getJSON( `${gitRestfulUrl}/list/${x}/branches`, a=>
        {
            $('.step2 dd').html( a.map( b=>`<a href="#">${b}</a>`).join('') )
                .find('a').click( ev=>
                {   ev.preventDefault();
                    $b.val( ev.target.innerHTML )
                });
        }).fail( function ( msg )
        {   console.error( msg );
            input('vc-branch').addClass('error');
        });
    }).fail( function ( msg )
    {   console.error( msg );
        input('vc-repo').addClass('error');
    });

});

$onSubmit( 2, ()=>
{
    let branch = input('vc-branch').val();
    $.getJSON( `${gitRestfulUrl}/lock-branch/${lockedRepo}/${branch}`, a=>
    {   console.log(a);
        lockedBranch = branch;
        enableStep( 3 );
    });
});

$onSubmit( 3, ()=>
{
    afSourcesRoot = input('af-sources-root').val();
//    enableStep( 4 );
    poolCreationQueue.handle = setInterval( poolCreationQueue, 300 );
    processFolder( val("sources-folder-to-import") );
});
    function
poolCreationQueue()
{
    if( !creationQueue.length )
        { clearInterval( poolCreationQueue.handle ); poolCreationQueue.handle = 0; return; }

    const r = creationQueue.shift();
    if( !r )
        return;
    $('input[name=pages-created]').val( ++pagesCreated );
    $('input[name=pages-to-create]').val( creationQueue.length );

    let sourcePath = r.sourcePath
    ,   text = encodeURIComponent( getRepoLink() )
    ,   textFolder = `
        
    `;

    //createWikiPage( '', r.title, text )
    //.$then( status => createWikiPage( 'Source:', r.title, getRepoLink()  ) )

    $.Xml( `${wikiUrl}/api.php?action=query&meta=tokens&type=csrf&format=xml&titles=${encodeURIComponent(r.title)}`)
    .XPath( '//tokens' )
    .$then( x=> $(x).attr('csrftoken') )
    .$then( wikiEditToken => "+\\" === wikiEditToken &&  throwErr('wikiEditToken required') )
    .$then( ( x, wikiEditToken ) => $.post( `${wikiUrl}/api.php`, `action=edit&summary=created&createonly=true&watchlist=watch&format=xml&token=${encodeURIComponent(wikiEditToken)}&title=Source:${encodeURIComponent(r.title)}&text=${text}` ) )
    .xPath( '//error|//edit' )
    .$then( e =>
            {   const c = $(e).attr('code');
                if( 'articleexists' === c )
                   return r.status = 'existing';

                if( 'Success' === $(e).attr('result') ) // <edit new="" result="Success"
                    return r.status = 'created';
                throw $(e).attr('info');
            })
    .$then( x=> console.log('success', x ), err => console.error( r.info = err ), r.status = 'error' )

    // todo generated docs into Implementation: namespace.
    .$then( x=> renderPage( r ) );
    function getRepoLink()
        { return eval('`'+input('vc-repo-view').val() +'`') }
}
    function
createWikiPage( ns, title, text )
{
    return     $.Xml( `${wikiUrl}/api.php?action=query&meta=tokens&type=csrf&format=xml&titles=${encodeURIComponent(title)}`)
    .XPath( '//tokens' )
    .$then( x=> $(x).attr('csrftoken') )
    .$then( wikiEditToken => "+\\" === wikiEditToken &&  throwErr('wikiEditToken required') )
    .$then( ( x, wikiEditToken ) => $.post( `${wikiUrl}/api.php`, `action=edit&summary=created&createonly=true&watchlist=watch&format=xml&token=${encodeURIComponent(wikiEditToken)}&title=${ns}${encodeURIComponent(title)}&text=${encodeURIComponent(text)}` ) )
    .xPath( '//error|//edit' )
    .$then( e =>
            {   const c = $(e).attr('code');
                if( 'articleexists' === c )
                   return 'existing';

                if( 'Success' === $(e).attr('result') ) // <edit new="" result="Success"
                    return 'created';
                throw $(e).attr('info');
            });
}
    function
processFolder( sourcePath )
{
    console.log( 'processFolder', sourcePath );
    var prExp = sourcePath ? `${afSourcesRoot}/${sourcePath}` : `${afSourcesRoot}`
    ,   pr = eval('`'+prExp +'`');
    $.getJSON( `${gitRestfulUrl}/projects/${lockedRepo}/${sourcePath}`, a=>
    {   const k = sourcePath ? `${sourcePath}/` :'';
        a.forEach( r=>
        {   r.sourcePath = `${k}${r.name}`;
            t2a[ r.sourcePath.toLowerCase() ] = r;
        });
        const titles = a.map( r=>`${pr}/${r.name}`.replace("//",'/') );
        $.post  ( `${wikiUrl}/api.php`,`action=query&prop=info&format=xml&titles=${titles.join('|')}`
                , x => $.Xml(x).XPath('//page').$then( processPages ) );
    });
}
    function
processPages( pages )
{
    const   sourcePath = ''
    ,       afSrc= eval('`'+afSourcesRoot +'`');
    for( let p of pages )
    {
        let t = p.getAttribute('title')
        ,   k = t.substring( afSrc.length )
        ,   r = t2a[ k.toLowerCase() ];
        if( r )
            r.title = t;
        else
            {   renderPage( { title: t, status:'deprecated', name: k } );  continue;   }
        pagesTotal++;
        if( p.getAttribute( 'missing' ) !== '' )
        {   r.status = 'existing';
            // todo update page if it already does not have a reference to source (with repo, branch and path)
            renderPage(r);
            r.isDirectory && processFolder( `${k}` );
            continue;
        }

        r.status = 'missing'; // todo do not process, mark previously deleted. Use action=query&prop=deletedrevisions
        createPage(r).$then( r=>
        {
            r.isDirectory && processFolder( `${k}` )
        });
    }
    $('input[name=pages-total]').val( pagesTotal );
}
    function
renderPage( r )
{
    let status = { missing:'&times;', created:'*', existing:'&checkmark;', error:'!','deprecated':'&#x274C;'}[r.status]
    ,   type = r.isDirectory ? '.' : 'file';
    return $('.step4 table').append(`<tr title="${r.title}"><td><a href="${wikiUrl}/index.php/${r.title}">${r.title}</a></td><td>${type}</td><td>${status}</td></tr>`)
        .$then( x=>r );
}
    function
createPage( r )
{
    $('input[name=pages-to-create]').val( creationQueue.push(r) );
    return $.$then(x=>r);
}
    function
throwErr( err )
{   console.log('throwErr', err );
    throw err;
}
    function
$onSubmit( step, cb )
{
    return $( `.step${step} form` ).on('submit', ev=>{ ev.preventDefault(); cb() });
}
    function
disable( css )
{
    $(css).prop( "disabled", true );
}
    function
regenerateVcRepoView( ev )
{
    ev.preventDefault();

    let repo = input('vc-repo').val()
    ,   parts = repo.replace('.git','').split('/')
    ,   proj  = parts.pop()
    ,   org   = parts.pop()
    ,   prefix = parts.join('/')
    ,   suffix = repo.includes('github.com') ? 'blob': 'src'
    ,   url    = prefix + '/${org}/${lockedRepo}/'+suffix+'/${lockedBranch}/${sourcePath}';

    input('vc-repo-view').val(url);
}
    function
validateAfOrg(  )
    {

    }
    function
onRepoChange( v )
{   if( !v )
        return;
    let t = v.split('/')
    ,   proj = t.pop().replace('.git','');
    org  = t.pop();
    for( let k of orgs )
        if( k.toLowerCase().indexOf(org) === 0 )
            org = k;
    $.getJSON( pagesUrl( org ), x=>
    {
        for( let k of x.children )
            if( k.page_title.includes('/Sources') )
                return $.getJSON( pagesUrl( k.page_title ), x=> // traverse over Sources/*
                {
                    for( let p of x.children )
                        if( hasProj( k ) )
                            return setRoot(  p.page_title );
                    setRoot(k.page_title + '/'+ proj )
                });
        findProj( x );
    }).fail( function( msg )
        {   console.error( pagesUrl( org ) ) });

        function
    hasProj( k ){ return k.page_title.split('/')[1].toLowerCase().indexOf(proj.toLowerCase() ) ===0 }
        function
    findProj( x )
    {
        for( let k of x.children )
            if( hasProj( k ) )
                return setRoot( k.page_title+'/Sources' ); // todo test this case
    }
        function
    setRoot( proj ){   input('af-sources-root').val(`${proj}`); regenerateVcRepoView(); }
}
    function
enableStep( s )
{
    $('input').prop( "disabled", true );
    $(`.step${s} input`).prop( "disabled", false );
    $('fieldset' ).addClass   ( "disabled" );
    $(`.step${s}`).removeClass( "disabled" );
}
    function
pagesUrl( pg ){ return `${wikiUrl}/../ApiFusion.org-folders/php/Pages.php?title=${ pg||'' }`; }
    function
onSourcesRootChange( t )
{   let v = t.split('/');
    if( !v )
        return this.$then( fillDropdown ), orgs;
    if( 1 == v.length )
        $.getJSON( pagesUrl(v), x=> fillDropdown.call( this, x.children.map( e=>e.page_title ) ) );
    else
        this.xml( wikiUrl + SEARCH_URL + '$0').xPath('//*[name()="Text"]').$then( fillDropdown );
    return orgs;

        function
    fillDropdown( items )
    {   let u = $(this).parent().find('dd').empty();
        sourcesRoot = t;
        for( let i of items )
        {   let t = i.nodeName ? $(i).text() : i
            ,   v = t.split('/');

            if( v.length < 3 || ( t.includes('/Source') && !t.includes('/Source/') ) )
                u.append( '<a href="#">'+t+'</a>' );
        }
        u.find('a').click( function(ev)
        {   ev.preventDefault();
            $(this).parent().parent().parent().find('input').val( ev.target.innerHTML  ).focus();
        });
    }
}
    function
validateUrl( filedName, path, xpath )
{   const $i = input( filedName );
    urlParams[filedName] && $i.val( urlParams[filedName] );
    const $ret = $i.$on( 'change input').val().$then( v => v+path ).xml( '$0' ).addClass('validated')
                   .$then( ( v, x, u )=>  u , function(err){ $(this).removeClass('validated').addClass('error'); console.error(err); throw err } );
    $i.sleep(10).trigger('change');
    return $ret;
}
function input( name ){ return $(`input[name=${name}]`); }
function val( name ){ return input( name ).val(); }
