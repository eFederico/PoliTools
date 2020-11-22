$(document).ready(function() { 

    $("body").addClass("casa"); 

    var groups = `<a id="div_colsx" class="col-sm-12 col-md-12 portlet_colsx" href="https://t.me/PoliToGruppiBot" target="_blank" style="margin-top: 10px; content:url(chrome-extension://`+exID+`/immagini/groups-button.png)"></a>`;

    $(".sidebar > div:nth-child(1)").after(groups); // Append telegram groups button

    var matr = $("#div_anagrafica .nav li strong u").html(); // Recupero matricola

    var links =`<div id="div_colsx" class="col-sm-12 col-md-12 portlet_colsx">
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
	
    $(".sidebar > div:nth-child(2)").after(links); // Append box links (medie)
    
    var psico =`<div id="div_colsx" class="col-sm-12 col-md-12 portlet_colsx">
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
	
	$(".sidebar").append(psico); // Append box psicologo

	$("#menu_pag_stud > li:last-child").attr("target","_self"); // Link posta sulla stessa tab


});