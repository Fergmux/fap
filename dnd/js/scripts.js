$(document).ready(function () {
	$("#4").click(function(){generate(2)})
	$("#6").click(function(){generate(5)})
	$("#8").click(function(){generate(7)})
	$("#10").click(function(){generate(9)})
	$("#12").click(function(){generate(11)})
	$("#20").click(function(){generate(19)})
})

var ready = 1

function generate(num) {
	if (ready) {
		ready = 0
		$("p").animate({opacity: 0}, 500, function(){
			num = Math.round(Math.random()*num)+1
			$("p").html(num)
			if (num == 20) {
				$("p").css("color", "#ffff00")
			} else if (num == 1) {
				$("p").css("color", "#f74816")
			} else {
				$("p").css("color", "#ffffff")
			}
			$("p").animate({opacity: 1}, 800, function(){ready = 1})
		})
	}
}