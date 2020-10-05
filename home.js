$(document).ready(function() { 
	
	$("body").addClass("casa"); 
	
	var matr = $("#div_anagrafica .nav li strong u").html(); 
	
	var modal =`<div id="div_colsx" class="col-sm-12 col-md-12 portlet_colsx">
					<div class="RegionBorderMao">
						<div style="margin-bottom: 10px; position: relative; left: 0px; right: 2px; border: solid 0px #CCC; height: auto; min-height: 30px; z-index: 0;">
							<div style="float:left;"><img src="/img/icone_portale/light/mobilita_q.png" width="30"></div>
							<div class="idplaceholder" style="position: relative; left: 7px; right: 30px; font-family: open sans, Arial; font-weight: bold; font-size:16px; color: #000; ">LINKS</div>
							<div style="position: relative; height: 1px; background-color:#666; margin-left:40px; margin-right:0px;"></div>
						</div>
						<div style="text-align:left;">
							<div class="col-md-12" style="margin:5px;"><a href="http://didattica.polito.it/pls/portal30/sviluppo.vicar.link?p_username=S`+matr+`" class="btn btn-primary">Medie</a></div>
						</div>
					</div>
				</div>`;
	
	$(".sidebar").append(modal);
	
	var modal =`<div id="div_colsx" class="col-sm-12 col-md-12 portlet_colsx">
					<div class="RegionBorderMao">
						<div style="margin-bottom: 10px; position: relative; left: 0px; right: 2px; border: solid 0px #CCC; height: auto; min-height: 30px; z-index: 0;">
							<div style="float:left;"><img src="/img/icone_portale/light/collaborazionistudentesche2_q.png" width="30"></div>
							<div class="idplaceholder" style="position: relative; left: 7px; right: 30px; font-family: open sans, Arial; font-weight: bold; font-size:16px; color: #000; ">Disagio?</div>
							<div style="position: relative; height: 1px; background-color:#666; margin-left:40px; margin-right:0px;"></div>
						</div>
						<div style="text-align:left;">
							<p>Se provi disagio psicologico nell’affrontare alcune situazioni legate alla tua esperienza universitaria, nell’organizzazione del proprio tempo, dello studio difficoltà di concentrazione, ansia, demotivazione, nonché disagio relazionale contatta lo <a href="http://www.mappaservizi.polito.it/#/l2/s877">sportello di ascolto</a></p>
							<p>Telefonare o lasciare un messaggio al <h2>373 862 22 67</h2></p>
							<div class="col-md-12" style="margin:5px;"><a href="http://www.mappaservizi.polito.it/content/download/868/10558/file/01_b_Studenti%20POLIT%20brochure_SdA%20DipPSIC2018.pdf" class="btn btn-primary">More info</a></div>
						</div>
					</div>
				</div>`;
	
	$(".sidebar").append(modal);


	/*chrome.storage.local.get(['theme'], function(result) {
	
        switch(result.theme) {
			case 2:
				var lucine =`<ul class="lightrope slideInLeft">
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				</ul>`;
				$("#nav_menu").append(lucine);
			break;
		}
	});*/
	var modal =`
				<script>
				function openPopup() {
					$("#GroupNotFoundModal").show();
				}
				</script>
				<div id="GroupNotFoundModal">
					<div class="modal-header">
						<h1 class="modal-title" style="float: left;">Gruppi Telegram</h5> 
						<button id="hide" class="remove-btn-style" style="float: right; right: 30px; font-size: 40px; ">&#10060;</button>
					
					<div class="modal-cont"> 
						<p style="color:black !important;">Il gruppo Telegram per questo esame non è nei nostri database, 
						<br>se esiste un gruppo Telegram che non conosciamo compila il modulo e lo aggiungeremo al più presto! <br>
						Grazie al tuo aiuto potremo creare un database completo per tutti gli esami del Polito.
						<br>
						<br>
						MODULO <br><br>
						 - <a href="https://docs.google.com/forms/d/e/1FAIpQLSfbxRvW6W8s0O53sxY-n3U69zyAEfEv7VtD5PSoFNSEPxWMxg/viewform?usp=sf_link" target="_blank">Richiedi l'inserimento del gruppo</a>
						 <br><br>
						CONTATTI <br><br>
						  - <a href="mailto:support@federicolucido.it">support@federicolucido.it</a>
						  <br>
						  - <a href="https://t.me/joinchat/BXW0uRM5t-ZTpmMdstz_bA" target="_blank">Supporto Telegram</a>
						</p>
					</div>
				</div>`;
	
	$("body").append(modal);

	$('#hide').click(function() {
		$("#GroupNotFoundModal").hide();
	})

	//Posta su un altra tab o sulla stessa
	$("#menu_pag_stud > li:last-child").attr("target","_self");

	var course = $("#div_anagrafica .RegionBorderMao p a.policorpolink:nth-child(4)")
	.text().toLowerCase().replace(/ /g, function (x) { return x = "_"; });

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		var data = JSON.parse(this.responseText);
		callbackMapping(data, course);
	  }
	};
	xmlhttp.open("GET", chrome.runtime.getURL("groups/mapping.json"), true);
	xmlhttp.send();	

});

function callbackMapping(data, course) {

	
	var coursesFile = data.Courses[course]
	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
		var data = JSON.parse(this.responseText);
		callback(data);
	  }
	};
	xmlhttp.open("GET", chrome.runtime.getURL("groups/"+coursesFile+".json"), true);
	xmlhttp.send();
}


function callback(data) {
	var imgurl = chrome.runtime.getURL("/immagini/logo-telegram.png");

	//$("#portlet_container > div:nth-child(2) .table-striped tbody tr").text(JSON.stringify(data).replace(/"([^"]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');}));

	$("#portlet_container > div:nth-child(2) .table-striped tbody tr").each(function() {
		var codEsame = $(this).find("td:first-child").text();
		var nomeEsame = $(this).find("td:nth-child(2) > a").text();
		var esame = $(this);
		
		var values = [];
		
		var f = 1; 
		chiaveEsame = nomeEsame.trim().toLowerCase();

		for(var k in data){
	
			if (data[k][chiaveEsame] != null) {
				
				var link = data[k][chiaveEsame].link;
				esame.find("td:nth-child(3)").append('<a href="'+link+'" target="_blank"><img class="pt-icon" src="'+imgurl+'" ></img></a>');
				f = 0;
			}
		}

		/*for(var k in data.links){
			link = data.links[k].link;
			if (nomeEsame.toLowerCase() === data.links[k].name.toLowerCase() || data.links[k].code.includes(codEsame)) {
				esame.find("td:nth-child(3)").append('<a href="'+link+'" target="_blank"><img class="pt-icon" src="'+imgurl+'" ></img></a>');
				f = 0;
			} 	
		}*/
		
		if (f) {
			esame.find("td:nth-child(3)").append('<button class="remove-btn-style" onclick="openSwal()"><img class="pt-icon" src="'+imgurl+'" ></img></button>');
		}
		
	});
}