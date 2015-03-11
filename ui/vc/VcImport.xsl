<?xml version="1.0"  encoding="utf-8"?>
<?xml-stylesheet type="text/xsl" href="NSSiblings.xml"?>
<!DOCTYPE
  xsl:stylesheet [
	<!ENTITY copy "&#169;" >
	<!ENTITY euro "&#8364;" >
	<!ENTITY lt "&#38;#60;" >
	<!ENTITY gt "&#38;#62;" >
	<!ENTITY triangleright "&#38;#9654;" >
	<!ENTITY triangledown "&#38;#9660;" >
]>
<xsl:stylesheet version="1.0"
	xmlns="http://www.w3.org/1999/xhtml"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:af="http://apifusion.com/ui/vc/1.0" 
>
	<xsl:output  method="html"
		encoding="UTF-8"
		xml:lang="en"
		indent="yes" 
		/>

	<xsl:template match="ns[@id='0']">[[{{PAGENAME}}|Default]] 
	</xsl:template>

	<xsl:template match="/">
		<xsl:call-template name="htmlHeaders"/>
		<xsl:apply-templates select="*/*"></xsl:apply-templates>
	</xsl:template>
	
	<xsl:template match="ns[@id='0']">[[{{PAGENAME}}|Default]] 
	</xsl:template>
	<xsl:template name="htmlHeaders">
		<head>
		</head>
	</xsl:template>
	<xsl:template match="af:repository[@rendermode='edit']">
		<xsl:variable name="repo" select="." />
		<div class="VcImport_params">
			<form onsubmit="return false;" name="VcImport_params">
				<table >
					<tbody>
						<tr><th>Repository	</th><td><input type="text" name="href"	af:xpath="//af:repository" 
															value="{@href}"	/></td></tr>
						<tr><th>Type		</th><td><select			name="Type">
														<xsl:for-each select="//af:RepoTraverse/*">
															<option value="${@mid}">
																<xsl:if test="@name=$repo/@type">
																	<xsl:attribute name="selected">selected</xsl:attribute>
																</xsl:if>
																<xsl:value-of select="@name"/>
															</option>
														</xsl:for-each>
													</select></td></tr>
						<tr><th><input type="submit" value="Start"/></th><td></td></tr>
						<tr><th>login		</th><td><input type="text"		name="login"	af:xpath="//af:repository" /></td></tr>
						<tr><th>password	</th><td><input type="password" name="password"	af:xpath="//af:repository" /></td></tr>
						<tr><th>Path		</th><td><input type="text"		name="path"		af:xpath="//af:repository" value="{@path}"	/></td></tr>
						<tr><th>AF Path		</th><td><input type="text"		name="afref"	af:xpath="//af:repository" value="{@afref}"	/></td></tr>
						<tr>
							<th>Import routines</th>
							<td>
								<ul class="collapsible">
									<xsl:apply-templates mode="RoutiesGroup" select="//af:routines/af:group" />
								</ul>								
							</td>
						</tr>
					</tbody>	
				</table>
			</form>
		</div>		
	</xsl:template>
	<xsl:template mode="CollapsibleControl" match="*">
		<!-- CSS notes assumes container has class="collapsible" and next UL sibling visibility triggered by checkbox -->
		<xsl:variable name="collapseId" select="generate-id()"/>
		<xsl:if test="*"><!-- only if children are present -->
			<input type="checkbox" id="{$collapseId}" name="collapsed" value="1" >
				<xsl:attribute name="af:xpath">
					<xsl:apply-templates mode="xpath" select="."/>
				</xsl:attribute>
				<xsl:attribute name="title">
					<xsl:apply-templates mode="xpath" select="."/>
				</xsl:attribute>
				<xsl:if test="@selected='1'"><xsl:attribute name="checked">checked</xsl:attribute></xsl:if>
			</input>
		</xsl:if>
		<label for="{$collapseId}">
			<xsl:if test="*"><u>&triangledown;</u><s>&triangleright;</s></xsl:if>
			<xsl:if test="@status='deleted'"><d>&#x02717;</d></xsl:if>
			<xsl:if test="@status='created'"><c>&#x021D8;</c></xsl:if>
			<span><xsl:value-of select="@name"/></span> 
			<xsl:if test="@error"><e><xsl:value-of select="@error"/></e></xsl:if>
		</label>		
	</xsl:template>
	<xsl:template mode="RoutiesGroup" match="af:group">
		<xsl:variable name="collapseId" select="generate-id()"/>
		<li>
			<div class="collapsible">
				<xsl:apply-templates mode="CollapsibleControl" select="." />
				<ul>
					<xsl:apply-templates mode="RoutiesGroup" select="*" />
				</ul>
			</div>
		</li>
	</xsl:template>
		
	<xsl:template mode="RoutiesGroup" match="af:routine">
		<li title="{@mid}">
			<label>
				<input type="checkbox" name="{@name}" >
					<xsl:attribute name="af:xpath">
						<xsl:apply-templates mode="xpath" select="."/>
					</xsl:attribute>
					<xsl:if test="@selected='1'"><xsl:attribute name="checked">checked</xsl:attribute></xsl:if>
				</input>
				<xsl:value-of select="@name"/>
			</label>
		</li>
	</xsl:template>
	<xsl:template mode="stats_headers"	match="*[not(@selected='1')]"></xsl:template>
	<xsl:template mode="stats_headers"	match="*[@selected='1']"			><th><xsl:value-of select="@name"/></th></xsl:template>
	<xsl:template mode="stats_body_cell"	match="*[not(@selected='1')]"	></xsl:template>
	<xsl:template mode="stats_body_cell"	match="*[@selected='1']"		><td><xsl:value-of select="count(.//*[not(@end='0')])"/></td></xsl:template>
	<xsl:template mode="stats_body_row"		match="*">
		<xsl:param name="depth" >0</xsl:param>
		<tr>
			<td style="padding-left:{$depth}em" class="collapsible refreshonchange {name(.)}">
				<xsl:apply-templates mode="CollapsibleControl" select="." />
			</td>
			<td><xsl:value-of select="count(.//*)"/></td>
			<xsl:apply-templates mode="stats_body_cell" select="//af:routine" >
				<xsl:sort select="name()"/>
			</xsl:apply-templates>
		</tr>
		<xsl:if test="not(@selected='1')">
			<xsl:apply-templates mode="stats_body_row" select="*" >
				<xsl:with-param name="depth"><xsl:value-of select="$depth+1"/></xsl:with-param>
			</xsl:apply-templates>
		</xsl:if>
	</xsl:template>
	
	<xsl:template match="af:repository[@rendermode='view']">
		<div class="VcImport_progress">
			<table class="VcImport_params" >
				<tbody>
					<tr><th>Repository	</th><td><xsl:value-of select="@href"/></td></tr>
					<tr><th>Type		</th><td><xsl:value-of select="@type"/></td></tr>
					<tr><th>Path		</th><td><xsl:value-of select="@path"/></td></tr>
					<tr><th><input type="submit" value="Pause" onclick="PauseImport()"/></th><td></td></tr>
				</tbody>	
			</table>
			<div class="VcImport_stats">
				<table border="1">
					<thead>
						<tr>
							<th>Source tree</th>
							<th title="count of components(files, directories)">#</th>
							<xsl:apply-templates mode="stats_headers" select="//af:routine" >
								<xsl:sort select="name()"/>
							</xsl:apply-templates>
						</tr>
					</thead>	
					<tbody>
							<xsl:apply-templates mode="stats_body_row" select="//af:repository/*" />
					</tbody>	
				</table>
				
			</div>
		</div>		
	</xsl:template>
	
	<!-- mode="xpath" returns selector of current node in document
		xslaspect-war/XslAspect/web/XmlAspect/XOR/XPath/Dom2XPath.xsl inlined due to browser security restrictions 
		altered to add af: namespace
	-->	
	
	<xsl:template match="/" mode="xpath">
		<xsl:text>/</xsl:text>
	</xsl:template>

	<!-- Element -->
	<xsl:template match="*" mode="xpath">
		<!-- Process ancestors first -->
		<xsl:apply-templates select=".." mode="xpath"/>

		<!-- Output / if not already output by the root node -->
		<xsl:if test="../..">/</xsl:if>

		<!-- Output the name of the element -->
		<xsl:if test="../.."><xsl:text>af:</xsl:text></xsl:if><xsl:value-of select="name()"/>

		<!-- Add the element's position to pinpoint the element exactly -->
		<xsl:if test="count(../*[name() = name(current())]) > 1">
			<xsl:text>[</xsl:text>
			<xsl:value-of
				select="count(preceding-sibling::*[name() = name(current())]) +1"/>
			<xsl:text>]</xsl:text>
		</xsl:if>

		<!-- Add 'name' predicate as a hint of which element -->
		<xsl:if test="@name">
			<xsl:text/>[@name='<xsl:value-of select="@name"/>']<xsl:text/>
		</xsl:if>
	</xsl:template>

	<!-- Attribute -->
	<xsl:template match="@*" mode="xpath">
		<!-- Process ancestors first -->
		<xsl:apply-templates select=".." mode="xpath"/>

		<!-- Output the name of the attribute -->
		<xsl:text/>/@<xsl:value-of select="name()"/>

		<!-- Output the attribute's value as a predicate -->
		<xsl:text/>[.="<xsl:value-of select="."/>"]<xsl:text/>
	</xsl:template>
</xsl:stylesheet>
