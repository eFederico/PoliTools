$(function() {
	
	let events = document.querySelectorAll(".calendar_poli_event_inner > b");
	let exams = new Array(events.length);
	
	events.forEach(function(evt) {
		if (!exams.includes(evt.innerHTML)) {
			exams.push(evt.innerHTML);
		}
	});
	let table = '<table class="check-table"><tbody class="check-tbody"></tbody></table>';

	let HTMLbody = $("body");

	HTMLbody.prepend(table);

	HTMLbody.addClass("orario");

	let examstr = document.createElement('tr');
	examstr.classList.add("test");
	$(".check-tbody").append(examstr);

	let index = 1;
	exams.forEach(function(exam) {

		if (index === 4) {
			let examstr = document.createElement('tr');
			examstr.classList.add("test");
			$(".check-tbody").prepend(examstr);
		}

		let checkrow = $(".test").first();
		let examtd= document.createElement('td');
		examtd.innerHTML = '<input class="show-hide cb-check" id="'+exam+'" name="'+exam+'" type="checkbox" checked/><label class="cb-label cb-label-'+index+'" for="'+exam+'">'+exam+'</label>';
		
		checkrow.append(examtd);
		index++;
	});
	
	let colors = [ "#E27D60", "#41B3A3", "#E8A87C","#501B1D","#85CDCA","#AFD275" ];
	
	index = 0;
	exams.forEach(function(exam) { 
		$(".calendar_poli_event").each(function() {
			
			if ($(this).children(":first").children(":first").html() === exam) {
				$(this).children().eq(1).children(":first").css("background-color", colors[index]);
			}
		});
		index++;
	});
	
	$(".cb-check").on("change", function() {
		let check = $(this);
		$(".calendar_poli_event").each(function() {
			
			if ($(this).children(":first").children(":first").html() === check.attr("name")) {
				if (check.is(":checked")) {
					$(this).show();
				} else {
					$(this).hide();
				}					
			}
		});
	});
	
});
