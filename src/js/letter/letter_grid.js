function createLetterGrid() {
	if (word_to_find_list[0].length != undefined) {
		word_length = word_to_find_list[0].length;
	}
	document.getElementById("letter_grid_placeolder").innerHTML = "";

	letter_html_table = "<table id=\"table_letter\">";
	for (var j = 0; j <= try_number_max-1; j++) {
		letter_html_table += "<tr id=\"line_" + j + "\"" +" >";
		for (var i = 0; i < word_length; i++) {
			letter_html_table += "<td id=" + j + "_" + i + " class=\"background\"></td>";
		}
		letter_html_table += "</tr>";
	}
	letter_html_table += "</table>";
	document.getElementById("letter_grid_placeolder").innerHTML = letter_html_table;
	
	keyboardInput.maxLength = word_length;
}

function wordInitialization() {   // Mise dans le tableau word_to_find le word_to_find
	try_count_index = -1;
	verification_index = 0;
	
	placing = [];
	placing_dup = [];
	lettre_ok = [];
	already_proposed = false;
	word_to_find = word_to_find_list[0]; 
	word_to_find_tab = [];
	word_proposed_tab_list = [];
	word_proposed_tab = [];
	word_composed_letter = [];
	word_composed_letter_exist = false;
	word_composed_letter_amount = [];
	word_composed_letter_amount_dup = [];
	
	word_displayed = false;
	word_found = false;
	
	for (var i = 0; i < word_length; i++) {		//Décomposition du mot vers word_to_find_tab
		word_to_find_tab[i] = word_to_find.substr(i, 1);
	}
	
	for (var i = 0; i < word_length; i++) {		//Position x[0]
		if (i == 0) {
			lettre_ok.push(word_to_find_tab[0]);
			placing.push(1);
		} else {
			lettre_ok.push('');
			placing.push(0);
		}
	}
	
	breakDownWord();

	console.log('Mot à trouver: ' + '%c' + word_to_find, 'background: black; color: gold'); // Affichage du word_to_find tiré dans la console
	// console.log('Lettres composant le mot: ' + '%c' + word_composed_letter, 'background: black; color: gold');
	// console.log('Nombre de lettres composant le mot: ' + '%c' + word_composed_letter_amount, 'background: black; color: gold');


	for (i=0; i<lettre_plus_amount; i++) {
		var letter_plus = Math.floor(Math.random() * (word_length - 2) + 2); // Seconde lettre au premier word_to_find
		placing[letter_plus] = 1; // La seconde lettre est une lettre correcte
		lettre_ok[letter_plus] = word_to_find_tab[letter_plus];
	}
}

function reinitWord() {
	word_to_find_list.splice(0, 1);
	if (word_to_find_list.length == 0) {
		if (always_ask == true) {
			WordListAddRowRandom(always_ask_length);
		} else {
			console.log("Aucun mot dans la liste");

			var prompt_new_word = Number(window.prompt("Plus aucun mot n'est prédéfini dans les paramètres, veuillez entrer le nombre de lettres (compris entre 5 et 10) du prochain mot tiré au hasard:", "8"));
			if (prompt_new_word >= 5 && prompt_new_word <= 10 ) {
				WordListAddRowRandom(prompt_new_word);
			}
		}
	}
	
	document.getElementById("new_line_button").disabled = false;
	document.getElementById("delete_line_button").disabled = false;
	document.getElementById("bonus_letter_button").disabled = false;
	document.getElementById("display_word_button").disabled = false;

	document.getElementById("proposed_word_information_select").disabled = true;
	document.getElementById("proposed_word_information_button").disabled = true;
	document.getElementById("found_word_information_button").disabled = true;
			
	createLetterGrid();
	wordInitialization();
	newWordLine();
}

function breakDownWord() {
	// Mise dans le tableau word_composed_letter le word_to_find
	// word_composed_letter convertit "ELEVE" en "ELV"
	for (var i = 0; i < word_to_find_tab.length; i++) {
		word_composed_letter_exist = false;
		for (var j = 0; j < word_composed_letter.length; j++) {
			if (word_composed_letter[j] == word_to_find_tab[i]){
				word_composed_letter_exist = true;
				if (word_composed_letter_amount.length == 0) {
					word_composed_letter_amount.push(1);
				} else {
					if (word_composed_letter_amount[j] == undefined) {
						word_composed_letter_amount.push(1);
					} else {
						word_composed_letter_amount[j]++;
					}
				}
				break;
			}
		}
		if (word_composed_letter_exist == false) {
			word_composed_letter.push(word_to_find_tab[i]);
			if (word_composed_letter_amount.length == 0) {
				word_composed_letter_amount.push(1);
			} else {
				if (word_composed_letter_amount[i] == undefined) {
					word_composed_letter_amount.push(1);
				} else {
					word_composed_letter_amount[i]++;
				}
			}
		}
	}
}

function submitWord() {	
	if (try_count_index < try_number_max) {
		if (word_proposed.length == 0 && keyboardInput.value.length == word_length) {
			word_proposed = keyboardInput.value.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
	
			for (var i = 0; i < word_length; i++) { //Décomposition du mot proposé dans input vers word_proposed_tab
				word_proposed_tab[i] = word_proposed.substr(i, 1);
				document.getElementById(try_count_index + '_' + i).innerHTML = word_proposed_tab[word_proposed_tab.length-1];
			}
		}
		
		
		if (check_word_length == true) {
			checkLength();
		} else {
			verifPresence();
		}
		
		updateProposedWordList();

		keyboardInput.value = "";
	} else if (try_count_index == try_number_max && word_displayed == false) {
		affichageSolution();
	} else if (try_count_index == try_number_max && word_displayed == true) {
		reinitWord();
	}
}

function newWordLine() {		// Ajoute une nouvelle ligne avec les bonnes lettres proposées
	if (try_count_index < try_number_max-1) {
		try_count_index++;

		for (var i = 0; i < word_length; i++) {
			document.getElementById(try_count_index + '_' + i).innerHTML = ".";
			if (placing[i] == 1) {
				document.getElementById(try_count_index + '_' + i).innerHTML = word_to_find_tab[i];
			}
		}
		
		word_proposed_tab = [];
		word_proposed = "";
	}
}

function suppressionLigne() {		// Supprime la ligne
	if (try_count_index >= 0 && try_count_index <= try_number_max) {
		
		if (try_count_index >= try_number_max) {
			try_count_index = try_number_max-1;
		}
		for (var i = 0; i < word_length; i++) {
			document.getElementById(try_count_index + '_' + i).innerHTML = "";
	
			document.getElementById(try_count_index + '_' + i).className = 'background';
		}
		for (var i = 0; i < word_length; i++) { 
			lettre_ok.push('');
			placing.push(0);
		}
		try_count_index--;
	}
}

function letterAddFromKeyboard(letter) {
	if (check_word_first_letter == true && word_proposed_tab.length == 0 ) {
		if (letter == word_to_find_tab[0]) {
			word_proposed_tab.push(letter);
			document.getElementById(try_count_index + '_' + (word_proposed_tab.length - 1)).innerHTML = word_proposed_tab[word_proposed_tab.length-1];
		} else {
			playsound("error");
		}	
	} else {
		word_proposed_tab.push(letter);
		document.getElementById(try_count_index + '_' + (word_proposed_tab.length - 1)).innerHTML = word_proposed_tab[word_proposed_tab.length-1];
		
	}
}

function suppressionLettre() {		// Supprime les lettre de droite à gauche
	if (word_proposed_tab.length >= 1) {
		document.getElementById(try_count_index + '_' + (word_proposed_tab.length - 1)).innerHTML = ".";
		word_proposed_tab.pop();
	}
}

function affichageSolution() {		// Affiche la solution à la dérnière ligne, necessite une boucle en amont
	if (animationIntervalID_1 == undefined) { animationIntervalID_1 = setInterval(function() {animationAfficheSolution()}, timer); }
}

function animationAfficheSolution() {
	document.getElementById(try_number_max-1 + '_' + verification_index).innerHTML = word_to_find_tab[verification_index];
	document.getElementById(try_number_max-1 + '_' + verification_index).className = 'correct';
	playsound("letter_ok");
	verification_index++;

	if (verification_index == word_length) { // Fin de la vérification
		word_proposed_tab = [];
		verification_index = 0;
		clearInterval(animationIntervalID_1);
		animationIntervalID_1 = undefined

		if (word_found == false) {
			playsound("loose");
		}
		
        document.getElementById("new_line_button").disabled = true;
        document.getElementById("delete_line_button").disabled = true;
        document.getElementById("bonus_letter_button").disabled = true;
        document.getElementById("display_word_button").disabled = true;
        document.getElementById("found_word_information_button").disabled = false;

		if (team_enabled == true) {
			switchTeamFocus(); // Change l'équipe de main
		}

		word_displayed = true;
		
	}
}

function ajoutLettreBonus() {		// Ajoute une lettre bonnus dans les emplacement non trouvés
	if (animationIntervalID_2 == undefined && word_displayed == false) {
		for (var i = 0; i < word_length; i++) {
			if (placing[i] != 1) {
				document.getElementById(try_count_index + '_' + i).innerHTML = word_to_find_tab[i];
				placing[i] = 1;
				playsound("letter_bonus");

				j = 0;
				letter_bonus_placement = i;
				if (animationIntervalID_2 == undefined) { animationIntervalID_2 = setInterval(function() {animationLettreBonus()}, 100); }

				break;
			}
		}
	}
	if (word_displayed == true) {
		errorHandler(4, true);
	}
}

function animationLettreBonus() {
	if ((j%2) == 1) {
		document.getElementById(try_count_index + '_' + letter_bonus_placement).className = 'background';
	} else {
		document.getElementById(try_count_index + '_' + letter_bonus_placement).className = 'correct';
	}
	j++;

	if (j == 8) {
		clearInterval(animationIntervalID_2);
		animationIntervalID_2 = undefined;
	}
}

function updateProposedWordList() {
	document.getElementById("proposed_word_information_select").disabled = false;
	document.getElementById("proposed_word_information_button").disabled = false;

	word_proposed_tab_list.push(word_proposed);
	document.getElementById("proposed_word_information_select").innerHTML += "<option>" + word_proposed_tab_list[word_proposed_tab_list.length-1] + "</option>"
}

function checkLength() {
	if (word_proposed_tab.length != word_length) {  //vérification de la longueur du word_to_find
		errorHandler(1, true); //La longueur du word_to_find n'est pas la bonne.
	} else {
		verifPresence();
	}
}

function verifPresence() {		// Vérification de la présence du word_to_find proposé dans le dictionnaire
	if (check_word_presence == true) {
		in_dictionary = false;
		for (i = 0; i < dictionary_list[word_proposed.length-5].length; i++) {
			if (word_proposed == dictionary_list[word_proposed.length-5][i]) {
				in_dictionary = true;
			}
		}

		if (in_dictionary == false) {
			errorHandler(2, true); //Mot non présent dans le dictionary
		} else {
			verifDuplication();
		}
	} else {
		verifDuplication();
	}
		
}

function verifDuplication() {		// Vérification de la présence du word_to_find proposé dans le dictionnaire
	if (check_word_duplication == true) {
		for (i = 0; i < word_proposed_tab_list.length; i++) {
			if (word_proposed == word_proposed_tab_list[i]) {
				already_proposed = true;
				break;
			} else {
				already_proposed = false;
			}
		}
	
		if (already_proposed == true) {
			errorHandler(3, true); //Mot déjà proposé
			} else {
			verificationProposition()
		}
	} else {
		verificationProposition()
	}
}

function verificationProposition() {		// Vérifie par rapport à word_to_find le proposed_word
	placing_dup = [];
	word_composed_letter_amount_dup = [];
	for (var i = 0; i < placing.length; i++) {
		placing_dup.push(0);
	}
	for (var i = 0; i < word_composed_letter_amount.length; i++) {
		word_composed_letter_amount_dup[i] = word_composed_letter_amount[i];
	}
	for (var i = 0; i < word_to_find.length; i++) {
		if (word_proposed_tab[i] == word_to_find_tab[i]) {
			placing_dup[i] = 1;
			for (var j = 0; j < word_composed_letter.length; j++) {
				if (word_proposed_tab[i] == word_composed_letter[j]) {
					word_composed_letter_amount_dup[j]--;
				}
			}
		}
	}
	for (var i = 0; i < word_to_find.length; i++) {
		if (word_proposed_tab[i] != word_to_find_tab[i]) {
			for (var j = 0; j < word_composed_letter.length; j++) {
				if (word_proposed_tab[i] == word_composed_letter[j] && word_composed_letter_amount_dup[j] > 0) {
					word_composed_letter_amount_dup[j]--;
					placing_dup[i] = 2;
				}
			}
		}
	}
	for (var i = 0; i < placing.length; i++) {
		if (placing_dup[i] == 1) {
			placing[i] = placing_dup[i];
		}
	}

	if (i >= word_length) { // Fin de la vérification

		for (i=0; i < placing.length; i++) { //duplication de word_composed_letter_amount
			if (placing_dup[i] == 1) {
				placing[i] = placing_dup[i];
			}
		}
		if (typeof animationIntervalID_3 == 'undefined') {
		} else {	
			clearInterval(animationIntervalID_3);
		}
		animationIntervalID_3 = setInterval(function() {animationVerificationProposition()}, timer);
	}
}

function animationVerificationProposition() {		//Fonction nécéssitant une boucle en amont ; affiche par le code couleur, les cases
	if (placing_dup[verification_index] == 0) {
		playsound("letter_missing");
	} else if (placing_dup[verification_index] == 1) {
		playsound("letter_ok");
		document.getElementById(try_count_index + '_' + verification_index).className = 'correct';
	} else if (placing_dup[verification_index] == 2) {
		playsound("letter_bad");
		document.getElementById(try_count_index + '_' + verification_index).innerHTML = "<div class=\"not_in_place\">" + document.getElementById(try_count_index + '_' + verification_index).innerHTML + "</div>" //ajout d'un div dans la cellule
	}
	verification_index++;

	if (verification_index == word_length) { // Fin de la vérification
		if (typeof animationIntervalID_3 == 'undefined') {
		} else {	
			clearInterval(animationIntervalID_3);
		}
		verification_index = 0;
		word_proposed_tab = [];
		placing_dup = [];
		
		if (word_proposed == word_to_find) { // Mot trouvé
				word_found = true;
				word_displayed = true;
				document.getElementById("new_line_button").disabled = true;
				document.getElementById("delete_line_button").disabled = true;
				document.getElementById("bonus_letter_button").disabled = true;
				document.getElementById("display_word_button").disabled = true;
				document.getElementById("proposed_word_information_button").disabled = false;
				document.getElementById("found_word_information_button").disabled = false;
				playsound("victory");

				document.getElementById("line_" + try_count_index).className = 'victory_line';

				for (i=0 ; i<word_length ; i++) {
					document.getElementById(try_count_index + '_' + i).className += ' victory_line';
				}

				setTimeout(function() { 
					addScoreTeamFocus(); //Ajoute score_addtion à team_focus
				} , 2250);

				if (use_number_grid == true) {
					if (automatic_behaviour == true && automatic_behaviour_redirect_number_grid == true) {
						setTimeout(function() { goNumberPicking() } , 4000); //reinitialisation de la grille
					}
				} else {
					if (automatic_behaviour == true && automatic_behaviour_ask_new_word == true) {
						setTimeout(function() { reinitWord() } , 4000); //reinitialisation de la grille
					}
				}
				
		} else {
			newWordLine();

			if (team_enabled == true && change_turn_mode == "by_proposition") {
				switchTeamFocus();
			}
		}			
	}
}


