var exID = chrome.runtime.id;

var defaulttheme = `<style>

body >table >tbody> tr> td> table> tbody >tr> td> div >img {
	content:url("chrome-extension://`+exID+`/immagini/header-white.png");
}

#topnav,
.c_logoPoli2 {
	background: url(chrome-extension://`+exID+`/immagini/header-white.png) no-repeat #003576 !important;
}
</style>`;

var darktheme = `<style>

img[alt="Politecnico di Torino Logo"] {
	content:url("chrome-extension://`+exID+`/immagini/logologin.png");
}

#imgOrari {
	content:url("chrome-extension://`+exID+`/immagini/orologio.png");
	width: 23px;
	height: 23px;
	margin: 0 10px;
}

body >table >tbody> tr> td> table> tbody >tr> td> div >img {
	content:url("chrome-extension://`+exID+`/immagini/header-grey.png");
}

#topnav,
.c_logoPoli2 {
	background: url(chrome-extension://`+exID+`/immagini/header-grey.png) no-repeat !important;
}

body {
	background: #222 !important;
}

.navbar-default,
#navbar_mainazi li > a,
.navbar-default .navbar-nav>li>a {
	background-color: #000 !important;
	margin: 0px;
}

.navbar-default .navbar-nav>.active>a,
.navbar-default .navbar-nav>.active>a:focus,
.navbar-default .navbar-nav>.active>a:hover {
	color: #ffffff !important;
	background-color: #FF9800 !important;
}
#nav_menu,
.c_strisciaArancione {
    background-color: #000 !important;
	margin:0px;
}
.c_titleBar {
	display: block;
}
.btn.btn-default.dropdown-toggle {
	background-color: #000 !important;
}

a[href^="mailto"] {
	color: #FF9800 !important;
}
.navbar-default .navbar-nav>li>a:hover,
.navbar-nav > li:hover a{
	color: white;

}

table>tbody>tr>td>a,
#divAltriAAcc > a,
p > a {
	color: #FF9800;
}

table>tbody>tr:hover>td>a,
table>tbody>tr:hover>td>a>i,
table>tbody>tr:hover>td>a>span {
	color: white !important;
}

body > .container-fluid  {
	padding-top: 20px;
}

.selected td {
    background-color: #ff8002 !important;
}

.webkit #messagelist tr td,
.webkit #messagelist tr td a,
.webkit #messagelist tr th,
.webkit #messagelist tr th a,
#messagelistfooter, #messagelistfooter span, #message.statusbar, .listbox .boxfooter, .listbox .boxfooter span,
.content {
	background-color: #333;
	color: white !important;
	text-shadow: none !important;
}

.records-table tr.selected td a, .records-table tr.selected td span {
    background-color: #ff8002;
}

.nav-sidebar > .active > a,
.breadcrumb {
	background-color: #1c1c1c !important;
}
#materialeDiv > div,
#directorylist li.addressbook.selected a,
#settings-sections span.listitem a,
.listing tbody td,
.uibox,
.panel-body,
#main p a,
.c_relative > div > span,
.ui-tabs-anchor,
#messagepreview,
#mailboxcontainer,
#mailboxlist li.mailbox a,
.wrapper,
.well,
.panel.panel-primary,
.nav.nav-sidebar.ng-scope,
.row,
.container-fluid,
.container-fluid > div > div,
#note_accordion > div,
.RegionHeaderColor {
	background-color: #222;
	color: white !important;
} 

#idSeaRes,
.bg-info.polinota,
.uibox .boxtitle,
body > table > tbody > tr > td,
.ui-tabs-panel,
#topnav,
.policorpo,
.c_titleBar,
div.RegionBorderMao,
.table>tbody>tr, .table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th,
table>tbody>tr, table>tbody>tr>td, table>tbody>tr>th, table>tfoot>tr>td, table>tfoot>tr>th, table>thead>tr>td, table>thead>tr>th {
	background-color: #222 !important;
	color: white !important;
}

.bg-info,
.testo_img {
	background-color: #000 !important;
}

.btn-info,
.list-help-item > a > span:last-child,
.langs,
.selected td .text-warning,
.idplaceholder,
p,
.exlegend,
.h6 a,
.h5 a {
	color: white !important;
}

.calendar_poli_event_inner,
.calendar_poli_corner_inner,
.calendar_poli_rowheader_inner,
.calendar_poli_colheader_inner {
	background-color: #ddd !important;
	background-image: none;
	color: #333;
}

.calendar_poli_cell_inner {
	border-right: 1px solid #ff800254;
    border-bottom: 1px solid #ff800254;
    background: #222 !important;
}

#note_accordion p {
	color: #000 !important;
}

.bg-warning  {
	background-color: #a40000; !important;
}

.container-fluid > div:nth-child(4) {
	background-color: #fff !important;
}

div.RegionBorderMao {
	border: 1px solid white !important;
}
.policorpolink {
	color: #FF9800 !important;
}
#foto_colsx {
	margin-top: 20px;
    border-radius: 20px;
}

#portlet_container {
	padding-top: 20px;
}

.table>tbody>tr>td {
	padding: 5px !important;
}

.RegionBorderMao > div:nth-child(1) > div:nth-child(4) {
	color: black;
}

#portlet_container>#container>div>.RegionBorderMao {
	padding: 0px !important;
}

.argoLink {
	color: white;
}

.link_img:hover {
	background-color: black;
}

.toolbar a.button {
	text-shadow: none;
	color: white;
}
.message.unread td,
.message.unread span {
	color: #ff8002 !important;
}

</style>`;

function DarkTheme() {
	
	$(document).ready(function() {
		$("#rcmbtnPolitoPortal").attr("target","_self");
	});
}

var improvedtheme  = `
<style>
.c_logoPoli2 {
	background: url(chrome-extension://`+exID+`/immagini/header-white.png) no-repeat !important;
}

#imgOrari{
	content:url("chrome-extension://`+exID+`/immagini/orologio-black.png");
	width: 23px;
	height: 23px;
	margin: 0 10px;
}

.selected td span.text-warning {
	color: white !important;
}
</style>`;

var christmastheme  = `
<style>


.c_logoPoli2 {
	background: url(chrome-extension://`+exID+`/immagini/header-natalizio.png) no-repeat !important;
}

#topnav {
	background: url(chrome-extension://`+exID+`/immagini/header-natalizio.png) no-repeat scroll top center #BB2528!important;
}

#imgOrari{
	content:url("chrome-extension://`+exID+`/immagini/orologio-black.png");
	width: 23px;
	height: 23px;
	margin: 0 10px;
}

.selected td span.text-warning {
	color: #165B33 !important;
}

body {
	background: #FFF5F5 !important;
}

.navbar-default,
#navbar_mainazi li > a,
.navbar-default .navbar-nav>li>a {
	background-color: #165B33 !important;
	margin: 0px;
	color: #fff !important;
}

.navbar-default .navbar-nav>.active>a,
.navbar-default .navbar-nav>.active>a:focus,
.navbar-default .navbar-nav>.active>a:hover {
	color: #fff !important;
	background-color: #BB2528 !important;
}
#nav_menu,
.c_strisciaArancione {
    background-color: #165B33 !important;
	margin:0px;
}
.c_titleBar {
	display: block;
}
.btn.btn-default.dropdown-toggle {
	background-color: #165B33 !important;
}

a[href^="mailto"] {
	color: #BB2528 !important;
}

.navbar-default .navbar-nav>li>a:hover,
table>tbody>tr>td>a,
#divAltriAAcc > a,
p > a,
.navbar-nav > li:hover a{
	color: #BB2528 !important;
}

table>tbody>tr:hover>td>a,
table>tbody>tr:hover>td>a>i,
table>tbody>tr:hover>td>a>span {
	color: #165B33 !important;
}

body > .container-fluid  {
	padding-top: 20px;
}

.selected td {
    background-color: #ff8002 !important;
}

.webkit #messagelist tr td,
.webkit #messagelist tr td a,
.webkit #messagelist tr th,
.webkit #messagelist tr th a,
#messagelistfooter, #messagelistfooter span, #message.statusbar, .listbox .boxfooter, .listbox .boxfooter span,
.content {
	background-color: #FFF5F5;
	color: #165B33 !important;
	text-shadow: none !important;
}

.records-table tr.selected td a, .records-table tr.selected td span {
    background-color: #ff8002;
}

.nav-sidebar > .active > a,
.breadcrumb {
	background-color: #BB2528 !important;
}
p,
#materialeDiv > div,
#directorylist li.addressbook.selected a,
#settings-sections span.listitem a,
.listing tbody td,
.uibox,
.panel-body,
#main p a,
.c_relative > div > span,
.ui-tabs-anchor,
#messagepreview,
#mailboxcontainer,
#mailboxlist li.mailbox a,
.wrapper,
.well,
.panel.panel-primary,
.nav.nav-sidebar.ng-scope,
.container-fluid,
.container-fluid > div > div,
#note_accordion > div,
.RegionHeaderColor {
	background-color: #FFF5F5;
	color: #165B33 !important;
} 

#idSeaRes,
.bg-info.polinota,
.uibox .boxtitle,
body > table > tbody > tr > td,
.ui-tabs-panel,
.policorpo,
div.RegionBorderMao,
.table>tbody>tr, .table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th,
table>tbody>tr, table>tbody>tr>td, table>tbody>tr>th, table>tfoot>tr>td, table>tfoot>tr>th, table>thead>tr>td, table>thead>tr>th {
	background-color: #FFF5F5 !important;
	color: #165B33 !important;
}

#topnav,
.c_titleBar .row,
.c_titleBar {
	background-color: #BB2528 !important;
	border: 0px;
}
#taskbar a.button-selected, 
#taskbar a.button-selected:hover, 
#taskbar a:hover,
.bg-info,
.testo_img {
	background-color: #165B33 !important;
}

.breadcrumb>.active {
	color: #FFF5F5;
}

.btn-info,
.list-help-item > a > span:last-child,
.langs,
.selected td .text-warning,
.idplaceholder,
p,
.exlegend,
.h6 a,
.h5 a {
	color: #165B33 !important;
}

.calendar_poli_event_inner,
.calendar_poli_corner_inner,
.calendar_poli_rowheader_inner,
.calendar_poli_colheader_inner {
	background-color: #ddd !important;
	background-image: none;
	color: #333;
}

.calendar_poli_cell_inner {
	border-right: 1px solid #ff800254;
    border-bottom: 1px solid #ff800254;
    background: #222 !important;
}

#note_accordion p {
	color: #165B33 !important;
}

.bg-warning  {
	background-color: #a40000; !important;
}

.container-fluid > div:nth-child(4) {
	background-color: #fff !important;
}

div.RegionBorderMao {
	border: 1px solid white !important;
}
.policorpolink {
	color: #165B33 !important;
}
#foto_colsx {
	margin-top: 20px;
    border-radius: 20px;
}

#portlet_container {
	padding-top: 20px;
}

.table>tbody>tr>td {
	padding: 5px !important;
}

.RegionBorderMao > div:nth-child(1) > div:nth-child(4) {
	color: black;
}

.btn-primary {
    background-color: #165B33 !important;
    color: white !important;
}
.slideInLeft {
    position: absolute;
    left: -1900px;
    -webkit-animation: slide 1s forwards;
    -webkit-animation-delay: 1.5s;
    animation: slide 1s forwards;
    animation-delay: 1.5s;
}

@-webkit-keyframes slide {
    100% { left: 0; }
}

@keyframes slide {
    100% { left: 0; }
}

  
  .lightrope {
	text-align: center;
	white-space: nowrap;
	overflow: hidden;
	position: absolute;
	z-index: 1;
	margin: -15px 0 0 0;
	padding: 0;
	pointer-events: none;
	width: 100%;
  }
  .lightrope li {
	position: relative;
	-webkit-animation-fill-mode: both;
			animation-fill-mode: both;
	-webkit-animation-iteration-count: infinite;
			animation-iteration-count: infinite;
	list-style: none;
	margin: 0;
	padding: 0;
	display: block;
	width: 12px;
	height: 28px;
	border-radius: 50%;
	margin: 20px;
	display: inline-block;
	background: #00f7a5;
	box-shadow: 0px 4.6666666667px 24px 3px #00f7a5;
	-webkit-animation-name: flash-1;
			animation-name: flash-1;
	-webkit-animation-duration: 2s;
			animation-duration: 2s;
  }
  .lightrope li:nth-child(2n+1) {
	background: cyan;
	box-shadow: 0px 4.6666666667px 24px 3px rgba(0, 255, 255, 0.5);
	-webkit-animation-name: flash-2;
			animation-name: flash-2;
	-webkit-animation-duration: 0.4s;
			animation-duration: 0.4s;
  }
  .lightrope li:nth-child(4n+2) {
	background: #f70094;
	box-shadow: 0px 4.6666666667px 24px 3px #f70094;
	-webkit-animation-name: flash-3;
			animation-name: flash-3;
	-webkit-animation-duration: 1.1s;
			animation-duration: 1.1s;
  }
  .lightrope li:nth-child(odd) {
	-webkit-animation-duration: 1.8s;
			animation-duration: 1.8s;
  }
  .lightrope li:nth-child(3n+1) {
	-webkit-animation-duration: 1.4s;
			animation-duration: 1.4s;
  }
  .lightrope li:before {
	content: "";
	position: absolute;
	background: #222;
	width: 10px;
	height: 9.3333333333px;
	border-radius: 3px;
	top: -4.6666666667px;
	left: 1px;
  }
  .lightrope li:after {
	content: "";
	top: -14px;
	left: 9px;
	position: absolute;
	width: 52px;
	height: 18.6666666667px;
	border-bottom: solid #222 2px;
	border-radius: 50%;
  }
  .lightrope li:last-child:after {
	content: none;
  }
  .lightrope li:first-child {
	margin-left: -40px;
  }
  
  @-webkit-keyframes flash-1 {
	0%, 100% {
	  background: #00f7a5;
	  box-shadow: 0px 4.6666666667px 24px 3px #00f7a5;
	}
	50% {
	  background: rgba(0, 247, 165, 0.4);
	  box-shadow: 0px 4.6666666667px 24px 3px rgba(0, 247, 165, 0.2);
	}
  }
  
  @keyframes flash-1 {
	0%, 100% {
	  background: #00f7a5;
	  box-shadow: 0px 4.6666666667px 24px 3px #00f7a5;
	}
	50% {
	  background: rgba(0, 247, 165, 0.4);
	  box-shadow: 0px 4.6666666667px 24px 3px rgba(0, 247, 165, 0.2);
	}
  }
  @-webkit-keyframes flash-2 {
	0%, 100% {
	  background: cyan;
	  box-shadow: 0px 4.6666666667px 24px 3px cyan;
	}
	50% {
	  background: rgba(0, 255, 255, 0.4);
	  box-shadow: 0px 4.6666666667px 24px 3px rgba(0, 255, 255, 0.2);
	}
  }
  @keyframes flash-2 {
	0%, 100% {
	  background: cyan;
	  box-shadow: 0px 4.6666666667px 24px 3px cyan;
	}
	50% {
	  background: rgba(0, 255, 255, 0.4);
	  box-shadow: 0px 4.6666666667px 24px 3px rgba(0, 255, 255, 0.2);
	}
  }
  @-webkit-keyframes flash-3 {
	0%, 100% {
	  background: #f70094;
	  box-shadow: 0px 4.6666666667px 24px 3px #f70094;
	}
	50% {
	  background: rgba(247, 0, 148, 0.4);
	  box-shadow: 0px 4.6666666667px 24px 3px rgba(247, 0, 148, 0.2);
	}
  }
  @keyframes flash-3 {
	0%, 100% {
	  background: #f70094;
	  box-shadow: 0px 4.6666666667px 24px 3px #f70094;
	}
	50% {
	  background: rgba(247, 0, 148, 0.4);
	  box-shadow: 0px 4.6666666667px 24px 3px rgba(247, 0, 148, 0.2);
	}
  }
  body.orario,
  body.orario > table > tbody > tr > td {
	  background-color: #222 !important;
  }
</style>`;

function ChristmasTheme() {
	
	$(document).ready(function() {
		console.log("Neveeee");
		var header = $(".c_titleBar");
		header.addClass("winter-is-coming");
		var snow = `<div class="snow snow--near"></div>
		<div class="snow snow--near snow--alt"></div>
		
		<div class="snow snow--mid"></div>
		<div class="snow snow--mid snow--alt"></div>
		
		<div class="snow snow--far"></div>
		<div class="snow snow--far snow--alt"></div>`;
		header.prepend(snow);
	});
}

async function getTheme() {
	
	chrome.storage.local.get(['theme'], function(result) {
		
        switch(result.theme) {
			case 0:
			$("html").append(defaulttheme);
			break;

			case 1: 
			$("html").append(darktheme); 
			DarkTheme();
			break;
			
			case 2:
			$("html").append(defaulttheme);
			setTheme(0)
			/*$("html").append(christmastheme); 
			ChristmasTheme();*/
			break;

			case 3:
			$("html").append(improvedtheme); 
			break;
			

		}
	});
}


var fonts = `<style>
td,div,a,p,body {
	font-family: %font% !important;
}
</style>`;

async function getFont() {
	
	chrome.storage.local.get(['font'], function(result) {
		var font = result.font;
		if (font != "Default" && font != null) {
	   		console.log("Font:" + font);
		   $("html").append(fonts.replace("%font%", font)); 
		}
	});
}

function setTheme(i) {
	chrome.storage.local.set({'theme': i}, function() {
        console.log("New selected theme: " + i);
		
    });
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.reload(tabs[0].id);
	});
}

getTheme();
getFont();