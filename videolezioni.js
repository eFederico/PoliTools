var map = {};
var selected = {};
var last_selected = 0;

var total = 0;
var modal_dom;

var navbar;
var page_mode = 0;
var page_subtype = 0;

$(document).ready(function() { 
	var modal = document.createElement('div');
	modal.innerHTML=`
	<div class="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="modalTitle" aria-hidden="false">
	<div class="modal-dialog" role="document">
	<div class="modal-content">
	  <div class="modal-header">
		<h5 class="modal-title" id="modalTitle">Links List</h5>
		
		<button type="button" id="download_selected_btn" class="btn btn-primary right">Download Selected</button>

	
		</button>
	  </div>
	  <div class="modal-body"> 
	  <form>
		<table id="table_link" class="table table-hover" onselectstart="return false">
		<thead class="thead-dark">
		<tr>
		<td class=""><a href="#" id='select_all'>Select All</a></td>
		<td class=""><a href="#" id='deselect_all'>Deselect All</a></td>
		<td></td>
		</tr>
		<tr><th class="center">Selected</th><th>Lesson</th><th class="center">Download</th></tr></thead>
		<tbody id="table_link_tbody">
		
		</tbody>
		<tfoot>
		
		</tfoot>
		</table> 
		</form>
		<br><br>
		<button id="copyall" class="btn btns btn-primary" data-clipboard-target="#foo">Copy to clipboard</button>
		
		<input type="text" class="right" id="foo">
	  </div>
	  <div class="modal-footer">
		<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
	  </div>
	</div>
	</div>
	</div>
	`;
	
	
	var body = document.getElementsByTagName("body")[0];
	body.insertBefore(modal, body.firstChild);
	
	
	navbar = document.getElementById("navbar_left_menu");
	
	if(typeof navbar === 'undefined' || navbar == null){
		page_mode = 1;
		navbar = document.getElementById("lessonList");
		$('head').append('<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">');

		//navbar.className = "lessonListclass";
		//navbar.style = "background: none; width: auto;";
	}
	
	var macro = document.createElement('div');
	
	new ClipboardJS('.btns');

	macro.innerHTML = `
	<button id='getalllinks_btn'  class="btn btn-primary">Generate Links</button>
	<button id="link_list" type="button" class="btn btn-secondary" data-toggle="modal" data-target="#exampleModalLong" disabled>Links List</button>
	`;
	
	var downall = document.createElement("button");
	downall.className="btn btn-primary download-all";
	downall.innerHTML = "Download ALL (Prof & Slide)";
	
	var downall1 = document.createElement("button");
	downall1.className="btn btn-primary download-all";
	downall1.innerHTML = "Download ALL (Slide Only)";

	var els = getLessonListDOM();

	downall.addEventListener("click", function() {
		for(var i = 0; i < els.length; i++)
		{
			document.getElementById("directdwn_"+i).click();
		}
	}, false);
	
	downall1.addEventListener("click", function() {
		for(var i = 0; i < els.length; i++)
		{
			document.getElementById("directdwnslide_"+i).click();
		}
	}, false);
	
	navbar.insertBefore(downall, navbar.firstChild);
	navbar.insertBefore(downall1, navbar.firstChild);
	
	populateDownloadButton();
	
	$("#copyall").click(function(){ 
		reloadInputClipboard();
		copyToClipboard("foo");
	});
	
	$("#select_all").click(function(){ 
		selectAll();
		reloadTable();
	});
	
	$("#deselect_all").click(function(){ 
		deselectAll();
		reloadTable();
	});
	
	$("#download_selected_btn").click(function(){ 
		downloadAllSelected();
	});
	
	$("#getalllinks_btn").click(function(e){
		
		$("#getalllinks_btn").prop('disabled', true);
		enableLinkList();
		$("#link_list").click();
		
        puy_startReconizer();
    }
	);
	
	insertSlider();

	manageHotkeys();
	
});

function insertSlider() {
	
	var slider = `<div><h3 style="font-size: 21px;" class="cb-title">Hotkeys</h3>
						<p class="inline"><span class="keyboard-char">J</span> Slower</p>
						<p class="inline"><span class="keyboard-char">K</span> Faster</p>
						<p class="inline"><span class="keyboard-char">L</span> Reset</p>
						<div class="range-slider"><input class="range-slider__range " type="range" value="1.0" min="0.1" max="2.5" step="0.1">
						<span class="range-slider__value col-md-1">1</span>
					</div>`
	var macro = document.createElement('div');
	
	macro.innerHTML = slider;
	var controls = document.querySelector(".col-md-12.col-lg-8");

	controls.insertBefore(macro, controls.firstChild);
	
	document.querySelector(".range-slider__range").addEventListener("change", function(){

		document.querySelector(".video-js").playbackRate = document.querySelector(".range-slider__value").innerHTML;
	});
	
   	rangeSlider();
}

function enableLinkList()
{
	$("#link_list").prop('disabled', false);
}

function populateDownloadButton()
{
	var els = getLessonListDOM();
		
	if(els){
	for(var i = 0; i<els.length; i++)
	{
		var btn = document.createElement("button");
		btn.className="btn btn-primary dwlbtn";
		btn.id="directdwn_"+i;
		btn.innerHTML = '<span class="fa fa-download"></span>  Prof & Slide';
		
		var btn1 = document.createElement("button");
		btn1.className="btn btn-primary dwlbtnslide";
		btn1.id="directdwnslide_"+i;
		btn1.innerHTML = '<span class="fa fa-download"></span> Slide Only';
		
		els[i].insertBefore(btn1, els[i].firstChild);
		els[i].insertBefore(btn, els[i].firstChild);
		
		
		var a = els[i].getElementsByTagName("a")[0];
		if(page_mode == 0) {
			var hr = document.createElement("hr");
			els[i].insertBefore(hr, els[i].firstChild);
		} else {
			a.parentNode.removeChild(a.nextSibling);
		}
		
		var dombtn = document.getElementById("directdwn_"+i);
		dombtn.ass = a;
		dombtn.addEventListener("click", function(evt) {
				var url = evt.target.ass.getAttribute("href");
				var inn = evt.target.id.substr(10);
				
				if(total <= inn) total = (inn+1);
				
				startDownload(inn, url, 1, 0);
				enableLinkList();
				
		}, false);
		
		var dombtn1 = document.getElementById("directdwnslide_"+i);
		dombtn1.ass = a;
		dombtn1.addEventListener("click", function(evt) {
				var url = evt.target.ass.getAttribute("href");
				var inn = evt.target.id.substr(10);
				
				if(total <= inn) total = (inn+1);
				
				startDownload(inn, url, 1, 1);
				
		}, false);
		
	}
	}
}

function downloadAllSelected()
{
	for(var i=0; i<total; i++)
	{
		if(typeof selected[i] === 'undefined'){}
		else{
			if(selected[i] == 1)
				download(i);
		}
	}
}

function download(index)
{
	var urll = map[index];
	chrome.runtime.sendMessage({
	msg: "PLS_DOWNLOAD", 
	data: {
		subject: "URL",
		content: urll,
	}
	});
}

function selectAll()
{
	for(var i=0; i<total; i++)
	{
		if(typeof selected[i] === 'undefined'){}
		else{
			selected[i] = 1;
		}
	}
}

function deselectAll()
{
	for(var i=0; i<total; i++)
	{
		if(typeof selected[i] === 'undefined'){}
		else{
			selected[i] = 0;
		}
	}
}

function reloadInputClipboard()
{
	var itxt = document.getElementById("foo");
	itxt.value = "";
	for(var i=0; i<total; i++)
	{
		if(typeof selected[i] === 'undefined')
		{
			
		}
		else
		{
			if(selected[i] == 1)
			{
				itxt.value += map[i]+"\r\n";
			}
		}
	}
}

function copyToClipboard(copyButtonId){
	var clipboard = new ClipboardJS("#"+copyButtonId);
	clipboard.on('success', function(e) {
		console.info('Action:', e.action);
		console.info('Text:', e.text);
		console.info('Trigger:', e.trigger);
	});
}

/*function copyAllToClipboard()
{
	var inp = document.getElementById("inp_hid");
	if(inp)
	{
		copyToClipboard(inp.value);
	}
}

function copyToClipboard(str)
{
  var el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};*/

function reloadTable()
{
	var table_tbody = document.getElementById("table_link_tbody");
	//var inp_hid = document.createElement('input');
	//inp_hid.id = "foo";
	//inp_hid.type = "text";
	//inp_hid.style="width:1px;";
	//inp_hid.value="";
	
	table_tbody.innerHTML = "";
	for(var i =0; i<total; i++)
	{
		if(map[i])
		{
			var row = createRow(i,map[i]);
			row.className = "align-middle";
			if(selected[i] == 1)
			{
				row.className+=" row-selected";
			}
			table_tbody.appendChild(row);
			var e = i;
			
			row.addEventListener("click", function(evt) {
			
			var index = evt.target.parentNode.id.substr(4);
				if(evt.shiftKey)
				{
					var ls = parseInt(last_selected);
					if(index > ls){						
						for(var s = ls+1; s<=index; s++)
						{
							toggleSelected(s);
						}
					}
					else{
						for(var s = ls-1; s>=index; s--)
						{
							toggleSelected(s);
						}
					}
					
					document.getSelection().removeAllRanges();
				}
				else{
					toggleSelected(index);
				}
				//alert(index);
				
				reloadTable();
				return 1;
			}, false);
			
			document.getElementById("check_"+i).addEventListener("change", function(evt) {
				return false;
			}, false);
			
			document.getElementById("download_"+i).addEventListener("click", function(evt) {
				var index = evt.target.id.substr(9);
				download(index);
			
			}, false);
	
			//inp_hid.value += map[i]+"\r\n";
		}
	}
	
	
	//table_tbody.appendChild(inp_hid);
}

function toggleSelected(index)
{
	last_selected = index;
	if(!selected[index])
	{
		selected[index] = 1;
		//console.log("metto a 1: "+index);
	}
	else
	{
		selected[index] = 0;
		//console.log("metto a 0");
	}
}

function createRow(index,url)
{
	var row = document.createElement('tr');
	row.id="row_"+index;
	var sel = "";
	if (typeof selected[index] === 'undefined'){
		selected[index] = 0;
		//console.log("setto init");
	}
	else
	{
		if(selected[index] == 1)
		{
			sel = "checked='checked'";
			//console.log("selected");
		}
		else{
			
		}
	}
	
	row.innerHTML=`
		<td class="center"><input type="checkbox" id="check_`+index+`" `+sel+`></input></td>
		<td><a target="_blank" href='`+url+`'>Lezione `+(index+1)+`</a></td>
		<td class="center"><a id='download_`+index+`' href="#">Download</a></td>
		
	`;
	
	
			
	
	
	  
	//<td class="center"><a href="#" onclick="$.fileDownload('`+url+`')" >Download</a></td>
	
	//<td><a href="`+url+`" download="file.mp4">Download</a></td>
	//<td><a href="`+url+`" rel="nofollow" download="file.mp4">Download</a></td>
	
	/*var td_url = document.createElement('td');
	td_url.innerHTML=url;
	var td_actions = document.createElement('td');
	
	row.appendChild(td_url);
	row.appendChild(td_actions);*/
	return row;
}

function getChilds(parent, tagName) {
    var childs = parent.childNodes,
        arr = [],
        currChild;
    for (var i = 0, len = childs.length; i < len; i++) {
        currChild = childs[i];
        if (currChild.nodeType == 1 && currChild.tagName.toLowerCase() == tagName && currChild.id == "") {
            arr.push(currChild);
        }
    }
    return arr;
}
function getLessonListDOM()
{
	var els;
	if(page_mode == 0)
	{
		els = navbar.getElementsByClassName("h5");
	}
	else
	{
		//els = $("#"+navbar.getElementsByTagName("ul")[0].id).children();
		//els = .children;
		var arr = navbar.getElementsByClassName("lezioni");
		if(arr.length == 2)
		{
			page_subtype = 1;
		}
		
		console.log(arr);
		els = getChilds(arr[arr.length-1],"li");
		console.log(els);
	}
	
	return els;
}

function puy_startReconizer()
{
	//var navbar = document.getElementById("navbar_left_menu");
	var els = getLessonListDOM();
	total = els.length;
	if(els){
	for(var i = 0; i<els.length; i++)
	{
		
	   //if( i > 20) break;
	   
	   var a = els[i].getElementsByTagName("a");
	   if(a)
	   {
			var lin = a[0].getAttribute("href");
			//console.log(lin);
			var mol = i*500;
			//console.log(mol);
			setTimeout(startDownload, mol, i, lin, 0);
	   }
	}
	}
}
function startDownload(index, lin, direct=0, type)
{
	
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() 
	{ 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			switch (type) {
				case 0: callback(index, xmlHttp.responseText, direct); break;
				case 1: callbackSlide(index, xmlHttp.responseText, direct); break;
			}
	}
	var preurl = "https://didattica.polito.it/portal/pls/portal/";
	
	if(page_mode == 0){	}
	else if(page_mode == 1)
	{
		if(page_subtype == 0) 
			preurl = "https://elearning.polito.it/gadgets/video/";
		else if(page_subtype == 1) 
			preurl = "https://elearning.polito.it/main/videolezioni/";
	}
	
	xmlHttp.open("GET", preurl+lin, true);
	xmlHttp.send(null);
}

function callback(index, response, direct=0)
{
	var parser = new DOMParser();
	var doc = parser.parseFromString(response, "text/html");
	
	var a = doc.getElementsByTagName("script");
	for(var i = 0; i<a.length; i++)
	{
		if(!a[i]) continue;
		var str = a[i].textContent;
		if(str.indexOf("flowplayer.commercial-latest.swf") != -1)
		{
			
			var ind1 = str.indexOf(",{'url':'");
			if(ind1 != -1)
			{
				var ind2 = str.indexOf("}", ind1+9);
				if(ind2 != -1){
					var fin = str.substring((ind1+9),(ind2-1));
					//console.log("1: "+ind1+" 2: "+ind2+ " 3:"+(ind2-ind1));
					map[index] = fin;
					
					reloadTable();
					//console.log(fin);
					if(direct == 1)
						download(index);
					return;
				}
			}
		}
		
	}
}

function callbackSlide(index, response, direct=0)
{
	var parser = new DOMParser();
	var doc = parser.parseFromString(response, "text/html");

	var lin = doc.querySelector("div.container-fluid > div.row > div.col-md-8 > div.row:nth-child(5) ul > li:nth-child(2) a").href;
	
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() 
	{ 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
				downloadFromURL(xmlHttp.responseURL);
		}
		
	}
	
	xmlHttp.open("GET", lin, true);
	xmlHttp.send(null);
}

function downloadFromURL(url)
{

	chrome.runtime.sendMessage({
	msg: "PLS_DOWNLOAD", 
	data: {
		subject: "URL",
		content: url,
	}
	});
	
}

var rangeSlider = function(){
    var slider = $('.range-slider'),
    range = $('.range-slider__range'),
    value = $('.range-slider__value');
    
 	  slider.each(function(){

      value.each(function(){
        var value = $('.range-slider__range').attr('value');
        $(this).html(value);
      
      });

      range.on('input', function(){
        $('.range-slider__value').html(this.value);
      });
    });
};

function manageHotkeys(){
	document.addEventListener('keyup', function (e){
  
		if(e.defaultPrevented){
			return;
		}
  
		var key = e.key || e.keyCode;
		var video = document.querySelector(".video-js");
		
		if(video.playbackRate < 2.5 && (key === 'K' || key === 'k' || key === 75)){ //Accelero
	
		  video.playbackRate += 0.1;
		} else if(video.playbackRate > 0.1 && (key === 'J' || key === 'j' || key === 74)){ //Decellero
		
		  video.playbackRate -= 0.1;
		} else if(key === 'L' || key === 'l' || key === 76){ //Reset
		  
		  video.playbackRate = 1.0;
		}
		document.querySelector(".range-slider__value").innerHTML = video.playbackRate.toFixed(1);
		document.querySelector(".range-slider__range").value = video.playbackRate.toFixed(1);
	});
  }