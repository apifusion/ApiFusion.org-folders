<?xml version="1.0"  encoding="utf-8"?>
<!DOCTYPE
  xsl:stylesheet [
	<!ENTITY copy "&#169;" >
	<!ENTITY euro "&#8364;" >
	<!ENTITY lt "&#38;#60;" >
	<!ENTITY gt "&#38;#62;" >
]>

<xsl:stylesheet version="1.0"
	xmlns="http://www.w3.org/1999/xhtml"
	xmlns:xhtml="http://www.w3.org/1999/xhtml"
	xmlns:xa="urn:schemas-xmlaspect-org:aspectrule"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:exslt="http://exslt.org/common"
	xmlns:msxsl="urn:schemas-microsoft-com:xslt"
	xmlns:af="urn:schemas-apifusion-org:af"
	exclude-result-prefixes="xhtml xa exslt msxsl"
>
<!--	
	<xsl:include href="ScrollableTable.xsl"/>
	<xsl:include href="VirtualTable.xsl"/>
	<xsl:include href="SortableTable.xsl"/>
	<xsl:include href="ExtData.xsl"/>
-->
	<xsl:output  method="xml"
		doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
		doctype-system="xhtml1-strict.dtd"
		encoding="UTF-8"
		xml:lang="en"
		indent="yes"
		cdata-section-elements="script style"
		/>

	<msxsl:script language="JScript" implements-prefix="exslt">
		<![CDATA[
			//function node_set(x) { return x; } // VS debugger does not compile this line
			//this['node-set'] =  function (x) { return x; } // VS debugger does not compile this line
			var dd= eval("this['node-set'] =  function (x) { return x; }");// workaround
			]]>
	</msxsl:script>

	<xsl:variable name="AppRoot"	select="//ApiFusionSection/@relAppRoot"/>
	<xsl:variable name="WikiRoot"	select="'http://apifusion.com/wiki/'"/>
	<xsl:variable name="namespaces" select="document('../ns/Namespaces.xml')/api/query/namespaces/*"/>
	<xsl:variable name="PagePath"	select="//ApiFusionSection/@page"/>
	<xsl:variable name="CurrentNamespace" select="//ApiFusionSection/@ns"/>

	<xsl:template match="/">
		<xsl:apply-templates select="*"/>
	</xsl:template>

	<xsl:template match="*" mode="Title">
		<xsl:value-of select="$PagePath"/> - <xsl:value-of select="$CurrentNamespace" /> - ApiFusion
	</xsl:template>

	<xsl:template match="*"  mode="BodySection">
		<xsl:element name="{local-name()}" xmlns="http://www.w3.org/1999/xhtml" >
			<xsl:copy-of select="@*"/>
			<xsl:apply-templates select="node()" mode="BodySection"/>
		</xsl:element>
	</xsl:template>

	<xsl:template name="navPanelSection">
		<xsl:param name="id"/>
		<xsl:param name="title"/>

		<div class="navSection $id">
			<h3>
				<xsl:value-of select="$title"/>
			</h3>
			<ul>
				<li>
					0. Default
				</li>
				<xsl:for-each select="$namespaces">
					<xsl:choose>
						<xsl:when test="@id &lt; 4"></xsl:when>
						<xsl:when test="contains(@canonical,'talk')"></xsl:when>
						<xsl:otherwise>
							<li>
								<xsl:value-of select="@id"/>. 
								<a>
									<xsl:attribute name="href"><xsl:value-of select="$AppRoot"/>ns/<xsl:value-of select="@canonical"/>/<xsl:value-of select="$PagePath"/></xsl:attribute>
									<xsl:value-of select="@canonical"/>
								</a>
								
							</li>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>
			</ul>
		</div>
	</xsl:template>
	<xsl:template match="*" mode="CatPanel">
		<div class="navSection CatPanel">
			<xsl:value-of select="*|@value"/>
		</div>
	</xsl:template>
	<xsl:template match="*" mode="ProjectsPanel">
		<div class="navSection ProjectsPanel">
			<xsl:value-of select="*|@value"/>
		</div>
	
	</xsl:template>
	
	<xsl:template match="/*">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
				<title>
					<xsl:apply-templates mode="Title"/>
				</title>
				<!-- todo title template-->
<!--
				<xsl:apply-templates  select="//*[@*='AcpectRuleSet1']"  mode="XmlAspect_HeadXaSet" />
				<xsl:apply-templates  select="//*[@*='AcpectRuleSet2']"  mode="XmlAspect_HeadXaSet" />
-->
				<style type="text/css">
					/* page-specific CSS */
					.navPanel{ display:inline-block; border:1px dashed grey;float: left;}
					.headBar, .navSection{ border-bottom:1px solid grey; }
				</style>
			</head>
			<body>
				<div class="headBar">home | breabcrumbs as scope + search | NS switch | notifications|login</div>
				<div class="navPanel">
					<xsl:call-template name="navPanelSection" ><xsl:with-param name="id" select="'NsPanel'"			/><xsl:with-param name="title" select="'Namespaces'"/></xsl:call-template>
					<xsl:call-template name="navPanelSection" ><xsl:with-param name="id" select="'CatPanel'"		/><xsl:with-param name="title" select="'Categories'"/></xsl:call-template>
					<xsl:call-template name="navPanelSection" ><xsl:with-param name="id" select="'ProjectsPanel'"	/><xsl:with-param name="title" select="'Projects'"	/></xsl:call-template>
					<xsl:call-template name="navPanelSection" ><xsl:with-param name="id" select="'PagesPanel'"		/><xsl:with-param name="title" select="'Modules'"	/></xsl:call-template>
				</div>
				
				<h1>
					<xsl:apply-templates mode="Title"/>
				</h1>
				<xsl:apply-templates select="//text/*" mode="BodySection"/>

				<div style="text-align:right">
						Copyright &copy; 2014 Simulation Works, LLC
				</div>
				<div class="footBar"></div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
