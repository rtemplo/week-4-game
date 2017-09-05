function game() {
	this.base = null;
	this.attacker = null;
	this.defender = null;
	this.defeated = [];
	this.attack = function () {
		if (this.attacker != null && this.defender != null) {
			this.defender.hp-=this.attacker.ca;
			this.attacker.ca+=this.base;
			this.attacker.hp-=this.defender.ca;
			
			updateUIStats(false, true);
		} else {
			if (this.attacker == null) {
				alert('Please select your player');
				return;
			}
			
			if (this.defender == null) {
				alert('Please select your defender.');
				return;
			}
		}
	};
}

var players = [
	{"id":"obi-wan", name:"Obi-Wan Kenobi", "hp":120, "ca":8},
	{"id":"luke-skywalker", name:"Luke Skywalker", "hp":100, "ca":10},
	{"id":"darth-sidious", name:"Darth Sidious",  "hp":150, "ca":14},
	{"id":"darth-maul", name:"Darth Maul", "hp":180, "ca":25}
]

function getCharacter(id) {
	var playerObj = {id:"NA", name: "NA", hp:0, ca: 0};
	for (var i=0; i < players.length; i++) {
		if (players[i].id == id) {
			playerObj.id = players[i].id;
			playerObj.name = players[i].name;
			playerObj.hp = players[i].hp;
			playerObj.ca = players[i].ca;
			return playerObj;
		}
	}
}

function updateUIStats(reset, attacked) {
	var ahp, dhp, aca;
	
	if (!reset) {
		ahp = starWarsRPG.attacker.hp;
		dhp = starWarsRPG.defender.hp;
		aca = starWarsRPG.attacker.ca;
	} else {
		ahp = 0;
		dhp = 0;
		aca = 0;
	}
	
	$("#attacker-health-points").html(ahp);
		$("#" + starWarsRPG.attacker.id + " > .player-health").html(ahp);
	
	$("#defender-health-points").html(dhp);
		$("#" + starWarsRPG.defender.id + " > .player-health").html(dhp);
	
	$("#attacker-strength").html(aca);
	
	if (!reset && attacked) {
		$("<li>", {class:"log-entry", text: "You attacked " + starWarsRPG.defender.name + " for a damage of " + starWarsRPG.attacker.ca + "."}).appendTo("#action-log");
		$("<li>", {class:"log-entry", text: starWarsRPG.defender.name + " returned a damage of " + starWarsRPG.defender.ca + "."}).appendTo("#action-log");
	} else {
		if (reset) $("#action-log").empty();
	}
	
	//you win
	if (dhp <= 0 && ahp > 0) {
		$("<li>", {class:"log-entry", text: "You win! You defeated " + starWarsRPG.defender.name + "."}).appendTo("#action-log");

		$("#" + starWarsRPG.defender.id).remove();
		starWarsRPG.defender = null;
		if ($("#available-players .player").length == 0)  {
			$("#btn-restart").show();
		}
	}
	
	//you lose
	if (dhp > 0 && ahp <=0) {
		$("<li>", {class:"log-entry", text: "You were defeated by " + starWarsRPG.defender.name + ". Game Over." }).appendTo("#action-log");
		$("#btn-attack").hide();
		$("#btn-restart").show();
	}
	
	//both die
	if (dhp < 0 && ahp < 0) {
		$("<li>", {class:"log-entry", text: "Both players die. Game over. " }).appendTo("#action-log");
		$("#btn-attack").hide();
		$("#btn-restart").show();
	}
	
	//scroll spy so the action log is always showing the latest at the bottom
	$("#action-log").scrollTop($("#action-log")[0].scrollHeight);
}

var starWarsRPG = new game();

$(document).ready(function () {
	$("#btn-restart").hide();
	if (starWarsRPG instanceof game) {
	
		$("#btn-attack").on("click", function () {
			starWarsRPG.attack();
		})

		$("#btn-restart").on("click", function () {
			window.location.reload();
		});

		$(".player").on("click", function () {
			if (starWarsRPG.attacker == null) {
				starWarsRPG.attacker = getCharacter(this.id);
				starWarsRPG.base = starWarsRPG.attacker.ca;
				$("#attacker-noselection").hide();
				$("#" + this.id).appendTo("#chosen-player");
				return;
			}
			
			if (starWarsRPG.defender == null) {
				starWarsRPG.defender = getCharacter(this.id);
				$("#defender-noselection").hide();
				$("#" + this.id).appendTo("#enemy-player");
				updateUIStats(false);
				return;
			}
		});
	}
});
