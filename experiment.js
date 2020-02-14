/// LICENCE -----------------------------------------------------------------------------
//
// Copyright 2018 - Cédric Batailler
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be included in all copies
// or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
// CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// OVERVIEW -----------------------------------------------------------------------------
//
// TODO:
// 
// dirty hack to lock scrolling ---------------------------------------------------------
// note that jquery needs to be loaded.
$('body').css({'overflow':'hidden'});
  $(document).bind('scroll',function () { 
       window.scrollTo(0,0); 
  });

// safari & ie exclusion ----------------------------------------------------------------
var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
var is_ie = /*@cc_on!@*/false || !!document.documentMode;

var is_compatible = !(is_safari || is_ie);


if(!is_compatible) {

    var safari_exclusion = {
        type: "html-keyboard-response",
        stimulus:
        "<p>Cette étude n'est pas compatible avec votre moteur de recherche.</p>" +
        "<p>Essayez de nouveau avec un moteur de recherche compatible (p. ex. Google Chrome ou Firefox).</p>",
        choices: jsPsych.NO_KEYS
    };

    var timeline_safari = [];

    timeline_safari.push(safari_exclusion);
    jsPsych.init({timeline: timeline_safari});

}

// firebase initialization ---------------------------------------------------------------
  var firebase_config = {
    apiKey: "AIzaSyBwDr8n-RNCbBOk1lKIxw7AFgslXGcnQzM",
    databaseURL: "https://marineexpe.firebaseio.com/"
  };

  firebase.initializeApp(firebase_config);
  var database = firebase.database();

  // id variables
  var jspsych_id = jsPsych.randomization.randomID(15)

  // Preload images
  var preloadimages = [];

  // connection status ---------------------------------------------------------------------
  // This section ensure that we don't lose data. Anytime the 
  // client is disconnected, an alert appears onscreen
  var connectedRef = firebase.database().ref(".info/connected");
  var connection   = firebase.database().ref("VAAST_FrMg/" + jspsych_id + "/")
  var dialog = undefined;
  var first_connection = true;

  connectedRef.on("value", function(snap) {
    if (snap.val() === true) {
      connection
        .push()
        .set({status: "connection",
              timestamp: firebase.database.ServerValue.TIMESTAMP})

      connection
        .push()
        .onDisconnect()
        .set({status: "disconnection",
              timestamp: firebase.database.ServerValue.TIMESTAMP})

    if(!first_connection) {
      dialog.modal('hide');
    }
    first_connection = false;
    } else {
      if(!first_connection) {
      dialog = bootbox.dialog({
          title: 'Connection lost',
          message: '<p><i class="fa fa-spin fa-spinner"></i> Please wait while we try to reconnect.</p>',
          closeButton: false
          });
    }
    }
  });

    // counter variables
  var vaast_trial_n    = 1;
  var browser_events_n = 1;

// Variable input -----------------------------------------------------------------------
// Variable used to define experimental condition : approached color and group associated with the color

var vaast_condition_approach = jsPsych.randomization.sampleWithoutReplacement(["approach_mg", "approach_fr"], 1)[0];

 // cursor helper functions
var hide_cursor = function() {
	document.querySelector('head').insertAdjacentHTML('beforeend', '<style id="cursor-toggle"> html { cursor: none; } </style>');
}
var show_cursor = function() {
	document.querySelector('#cursor-toggle').remove();
}

var hiding_cursor = {
    type: 'call-function',
    func: hide_cursor
}

var showing_cursor = {
    type: 'call-function',
    func: show_cursor
}

// Preload images in the VAAST 
// Preload faces
  var faces = [
      "stimuli/Fr_3.png",
      "stimuli/Fr_14.png",
      "stimuli/Fr_18.png",
      "stimuli/Fr_43.png",
      "stimuli/Fr_44.png",
      "stimuli/Fr_45.png",
      "stimuli/Fr_54.png",
      "stimuli/Fr_76.png",
      "stimuli/Fr_82.png",
      "stimuli/Fr_83.png",
      "stimuli/Fr_86.png",
      "stimuli/Fr_88.png",
      "stimuli/Fr_92.png",
      "stimuli/Fr_95.png",
      "stimuli/Fr_100.png",
      "stimuli/Fr_103.png",
      "stimuli/Fr_104.png",
      "stimuli/Fr_105.png",
      "stimuli/Fr_106.png",
      "stimuli/Fr_108.png",
      "stimuli/Fr_112.png",
      "stimuli/Fr_115.png",
      "stimuli/Fr_117.png",
      "stimuli/Fr_140.png",
      "stimuli/Fr_142.png",
      "stimuli/Mg_1.png",
      "stimuli/Mg_2.png",
      "stimuli/Mg_7.png",
      "stimuli/Mg_11.png",
      "stimuli/Mg_12.png",
      "stimuli/Mg_22.png",
      "stimuli/Mg_48.png",
      "stimuli/Mg_51.png",
      "stimuli/Mg_58.png",
      "stimuli/Mg_63.png",
      "stimuli/Mg_64.png",
      "stimuli/Mg_67.png",
      "stimuli/Mg_72.png",
      "stimuli/Mg_75.png",
      "stimuli/Mg_77.png",
      "stimuli/Mg_79.png",
      "stimuli/Mg_90.png",
      "stimuli/Mg_93.png",
      "stimuli/Mg_107.png",
      "stimuli/Mg_113.png",
      "stimuli/Mg_120.png",
      "stimuli/Mg_137.png",
      "stimuli/Mg_144.png",
      "stimuli/Mg_145.png",
      "stimuli/Mg_146.png"
  ];

 preloadimages.push(faces);

// VAAST --------------------------------------------------------------------------------
// VAAST variables ----------------------------------------------------------------------
// On duplique chacune des variable pour correspondre au bloc 1 et au bloc 2 !

var movement_mg    = undefined;
var movement_fr    = undefined;
var group_to_approach = undefined;
var group_to_avoid    = undefined;

switch(vaast_condition_approach) {
  case "approach_mg":
    movement_mg    = "approach";
    movement_fr    = "avoidance";
    group_to_approach = "MAGHREBINE";
    group_to_avoid    = "BELGE";
    break;

  case "approach_fr":
    movement_mg    = "avoidance";
    movement_fr    = "approach";
    group_to_approach = "BELGE";
    group_to_avoid   = "MAGHREBINE";
    break;
}

// VAAST stimuli ------------------------------------------------------------------------
// vaast image stimuli ------------------------------------------------------------------

var vaast_stim_training = [
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_1.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_2.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_7.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_11.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_12.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_22.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_48.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_51.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_58.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_63.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_64.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_67.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_72.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_75.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_77.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_79.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_90.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_93.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_107.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_113.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_120.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_137.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_144.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_145.png'},
  {movement: movement_mg, group: "mg", stimulus: 'stimuli/Mg_146.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_3.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_14.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_18.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_43.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_44.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_45.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_54.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_76.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_82.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_83.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_86.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_88.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_92.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_95.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_100.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_103.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_104.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_105.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_106.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_108.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_112.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_115.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_117.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_140.png'},
  {movement: movement_fr,  group: "fr",  stimulus: 'stimuli/Fr_142.png'}
]

// vaast background images --------------------------------------------------------------,

var background = [
    "background/1.jpg",
    "background/2.jpg",
    "background/3.jpg",
    "background/4.jpg",
    "background/5.jpg",
    "background/6.jpg",
    "background/7.jpg"
];


// vaast stimuli sizes -------------------------------------------------------------------

 var stim_sizes = [
    34,
    38,
    42,
    46,
    52,
    60,
    70
  ];

  var resize_factor = 7;
  var image_sizes = stim_sizes.map(function(x) { return x * resize_factor; });

// Helper functions ---------------------------------------------------------------------
  // next_position():
  // Compute next position as function of current position and correct movement. Because
  // participant have to press the correct response key, it always shows the correct
  // position.
var next_position_training = function(){
  var current_position = jsPsych.data.getLastTrialData().values()[0].position;
  var current_movement = jsPsych.data.getLastTrialData().values()[0].movement;
  var position = current_position;

  if(current_movement == "approach") {
    position = position + 1;
  }

  if(current_movement == "avoidance") {
    position = position -1;
  }

  return(position)
}

var next_position = function(){
  var current_position = jsPsych.data.getLastTrialData().values()[0].position;
  var last_keypress = jsPsych.data.getLastTrialData().values()[0].key_press;

  var approach_key = jsPsych.pluginAPI.convertKeyCharacterToKeyCode('e');
  var avoidance_key = jsPsych.pluginAPI.convertKeyCharacterToKeyCode('c');

  var position = current_position;

  if(last_keypress == approach_key) {
    position = position + 1;
  }

  if(last_keypress == avoidance_key) {
    position = position -1;
  }

  return(position)
}

// Saving blocks ------------------------------------------------------------------------
// Every function here send the data to keen.io. Because data sent is different according
// to trial type, there are differents function definition.

// init ---------------------------------------------------------------------------------
  var saving_id = function(){
     database
        .ref("participant_id_FrMg/")
        .push()
        .set({jspsych_id: jspsych_id,
               vaast_condition_approach: vaast_condition_approach,
               timestamp: firebase.database.ServerValue.TIMESTAMP})
  }

// vaast trial --------------------------------------------------------------------------
  var saving_vaast_trial = function(){
    database
      .ref("vaast_trial_FrMg/").
      push()
        .set({jspsych_id: jspsych_id,
          vaast_condition_approach: vaast_condition_approach,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          vaast_trial_data: jsPsych.data.get().last(4).json()})
  }


// demographic logging ------------------------------------------------------------------

  var saving_browser_events = function(completion) {
    database
     .ref("browser_event_FrMg/")
     .push()
     .set({jspsych_id: jspsych_id,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      vaast_condition_approach: vaast_condition_approach,
      completion: completion,
      event_data: jsPsych.data.getInteractionData().json()})
  }


// saving blocks ------------------------------------------------------------------------
var save_id = {
    type: 'call-function',
    func: saving_id
}

var save_vaast_trial = {
    type: 'call-function',
    func: saving_vaast_trial
}


// EXPERIMENT ---------------------------------------------------------------------------

// initial instructions -----------------------------------------------------------------
  var welcome = {
    type: "html-keyboard-response",
    stimulus:
      "<h1 class ='custom-title'> Bienvenue </h1>" +
      "<ul class='instructions'>" +
      "Dans cette étude, vous devrez <b>compléter plusieurs tâches de catégorisation</b>. Notez que nous " +
      "n'enregistrerons aucune donnée permettant de vous identifier et que vous pouvez quitter l'expérience " +
      "à tout moment. A la fin de l'expérience, vous serez rétribué.e en crédits de cours conformément à ce qui a été annoncé. " +
      "<b>Si vous commencez cette étude, cela signifie que vous donnez votre consentement éclairé pour celle-ci. </b></p></p>" +
      "<br>" + 
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
    choices: [32]
  };


// Switching to fullscreen --------------------------------------------------------------
var fullscreen_trial = {
  type: 'fullscreen',
  message:  'Pour commencer cette étude, merci de vous mettre en mode plein écran. </br></br>',
  button_label: 'Passer au plein écran',
  fullscreen_mode: true
}


// VAAST --------------------------------------------------------------------------------

var Gene_Instr = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'>Etude sur la catégorisation</h1>" +
    "<br>" +
    "<p class='instructions'> Dans cette étude, nous nous intéressons à la manière " +
    "dont nous catégorisons autrui. </p>" +
   "<p class='instructions'>Vous devrez effectuer trois tâches de catégorisation : " +
    "<br>" +
    "- La tâche du Jeu Vidéo (environ 15-20 min)" + 
    "<br>" +
    "- La tâche de sélection de visages (environ 5 min)" +
    "<br>" +
    "- La tâche de catégorisation (environ 10 min)</p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};


var vaast_instructions_1 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'>Tâche 1 : Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Dans cette tâche, un peu comme dans un jeu vidéo, vous " +
    "vous trouverez dans l'environnement présenté ci-dessous.</p>" +
    "<br>" +
    "<img src = 'media/vaast-background.png'>" +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

var vaast_instructions_2 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'>Tâche 1 : Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Une série de visages va apparaître dans l'environnement. " +
    "Votre tâche sera de catégoriser ces visages aussi vite que possible. <br> <br>" +
    "Plus précisément, vous devrez <b>catégoriser ces visages sur la base de leur origine ethnique (typiquement belge vs. typiquement maghrébine).</b> " +
    "Des instructions plus spécifiques vont suivre.</p>" +
    "<br>" +
    "<img src = 'media/vaast-background.png'>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

var vaast_instructions_2_bis_vaast = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'>Tâche 1 : Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Pour catégoriser les visages, vous devrez utiliser les touches suivantes de votre clavier :" +
    "<br>" +
    "<br>" +
    "<img src = 'media/touches_Fr.png'>" +
    "<br>" +
    "<br></p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

var vaast_instructions_3 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'>Tâche 1 : Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Au début de chaque essai, vous verrez le symbole 'O'. " +
    "Ce symbole indique que vous devez appuyer sur la touche <b>DEPART</b> (la <b>touche D</b>) pour commencer l'essai. </p>" +
    "<p class='instructions'>Vous allez alors voir apparaître au centre de l'écran une croix de fixation (+), suivie d'un visage. </p>" +
    "<p class='instructions'>Votre tâche sera de catégoriser ce visage en fonction de son origine ethnique en appuyant <b>trois fois</b>, aussi vite que possible, " +
    "sur la <b>touche E</b> ou sur la <b>touche C</b>. Après ces trois appuis, le visage disparaîtra et vous devrez "+
    "appuyer de nouveau sur la touche DEPART (la touche D). " +
    "<p class='instructions'>Merci d'utiliser uniquement l'index de votre main dominante pour toutes ces actions. </p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

var vaast_instructions_4 = {
  type: "html-keyboard-response",
  stimulus:
    "<h1 class ='custom-title'>Tâche 1 : Tâche du Jeu Vidéo</h1>" +
    "<p class='instructions'>Plus spécifiquement, vous devez : " +
    "<ul class='instructions'>" +
    "<li>" +
    "<strong>Appuyez sur la TOUCHE E pour les visages d'origine " + group_to_approach + "</strong></li>" +
    "<li><strong>Appuyez sur la TOUCHE C pour les visages d'origine " + group_to_avoid + "</strong></li>" +
    "</ul>" +
    "<p class='instructions'>Merci de lire attentivement et de mémoriser ces instructions. </p>" +
    "<p class='instructions'><strong>Aussi, notez qu'il est EXTREMEMENT IMPORTANT d'essayer de répondre le plus rapidement et le plus exactement possible. </strong>" +
    "Une croix rouge apparaîtra en cas de réponse incorrecte. </p>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>entrée</strong> pour" +
    " continuer.</p>",
  choices: [13]
};

var vaast_break = {
  type: "html-keyboard-response",
  stimulus:
    "Vous venez d'effectuer la moitié de la tâche du Jeu Vidéo (Tâche 1) ! N'hésitez pas à prendre 2-3 min de pause avant de continuer la tâche. " +
    "Les instructions restent identiques. " +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

var vaast_instructions_end = {
  type: "html-keyboard-response",
  stimulus:
    "La tâche du Jeu Vidéo (Tâche 1) est terminée. Vous allez maintenant commencer la Tâche 2. " +
    "<br>" +
    "<br>" +
    "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour" +
    " continuer.</p>",
  choices: [32]
};

// Creating a trial ---------------------------------------------------------------------
// Note: vaast_start trial is a dirty hack which uses a regular vaast trial. The correct
// movement is approach and the key corresponding to approach is "h", thus making the
// participant press "h" to start the trial. 

// Ici encore tout est dupliqué pour correspondre aux deux blocs de la vaast, les trials
// et les procédures, training compris.

var vaast_start = {
  type: 'vaast-text',
  stimulus: "o",
  position: 3,
  background_images: background,
  font_sizes:  stim_sizes,
  approach_key: "d",
  stim_movement: "approach",
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: true,
  display_feedback: true,
  response_ends_trial: true
}

var vaast_fixation = {
  type: 'vaast-fixation',
  fixation: "+",
  font_size:  46,
  position: 3,
  background_images: background
}

var vaast_first_step_training_1 = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: 3,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "e",
  avoidance_key: "c",
  stim_movement: jsPsych.timelineVariable('movement'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: false,
  display_feedback: true,
  feedback_duration: 500, 
  response_ends_trial: true
}

var vaast_second_step_1 = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: next_position_training,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "e",
  avoidance_key: "c",
  stim_movement: jsPsych.timelineVariable('movement'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: false,
  display_feedback: true,
  feedback_duration: 500, 
  response_ends_trial: true
}

var vaast_second_step_training_1 = {
  chunk_type: "if",
  timeline: [vaast_second_step_1],
  conditional_function: function(){
    var data = jsPsych.data.getLastTrialData().values()[0];
    return data.correct;
  }
}

var vaast_third_step_1 = {
  type: 'vaast-image',
  stimulus: jsPsych.timelineVariable('stimulus'),
  position: next_position_training,
  background_images: background,
  font_sizes:  image_sizes,
  approach_key: "e",
  avoidance_key: "c",
  stim_movement: jsPsych.timelineVariable('movement'),
  html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
  force_correct_key_press: false,
  display_feedback: true,
  feedback_duration: 500, 
  response_ends_trial: true
}

var vaast_third_step_training_1 = {
  chunk_type: "if",
  timeline: [vaast_third_step_1],
  conditional_function: function(){
    var data = jsPsych.data.getLastTrialData().values()[0];
    return data.correct;
  }
}

var vaast_fourth_step_1 = {
  type: 'vaast-image',
  position: next_position_training,
  stimulus: jsPsych.timelineVariable('stimulus'),
  background_images: background,
  font_sizes:  image_sizes,
  stim_movement: jsPsych.timelineVariable('movement'),
  response_ends_trial: false,
  trial_duration: 650
}

var vaast_fourth_step_training_1 = {
  chunk_type: "if",
  timeline: [vaast_fourth_step_1],
  conditional_function: function(){
    var data = jsPsych.data.getLastTrialData().values()[0];
    return data.correct;
  }
}



// VAAST training block -----------------------------------------------------------------

var vaast_training_block = {
  timeline: [
    vaast_start,
    vaast_fixation,
    vaast_first_step_training_1,
    vaast_second_step_training_1,
    vaast_third_step_training_1,
    vaast_fourth_step_training_1,
    save_vaast_trial
  ],
  timeline_variables: vaast_stim_training,
  repetitions: 1, //here, put 12 for 192 trials
  randomize_order: true,
  data: {
    phase:    "training",
    stimulus: jsPsych.timelineVariable('stimulus'),
    movement: jsPsych.timelineVariable('movement'),
    group:   jsPsych.timelineVariable('group'),
  }
};


// end fullscreen -----------------------------------------------------------------------

var fullscreen_trial_exit = {
  type: 'fullscreen',
  fullscreen_mode: false
}


// procedure ----------------------------------------------------------------------------
// Initialize timeline ------------------------------------------------------------------

var timeline = [];

// fullscreen
timeline.push(
        welcome,
        fullscreen_trial,
			  hiding_cursor);

// prolific verification
timeline.push(save_id);

    timeline.push(Gene_Instr,
                  vaast_instructions_1,
                  vaast_instructions_2,
                  vaast_instructions_2_bis_vaast,
                  vaast_instructions_3, 
                  vaast_instructions_4,
                  vaast_training_block,
                  vaast_break,
                  vaast_training_block,
                  vaast_instructions_end);

timeline.push(showing_cursor);

timeline.push(fullscreen_trial_exit);

// Launch experiment --------------------------------------------------------------------
// preloading ---------------------------------------------------------------------------
// Preloading. For some reason, it appears auto-preloading fails, so using it manually.
// In principle, it should have ended when participants starts VAAST procedure (which)
// contains most of the image that have to be pre-loaded.
var loading_gif               = ["media/loading.gif"]
var vaast_instructions_images = ["media/vaast-background.png", "media/keyboard-vaastt.png"];
var vaast_bg_filename         = background;

jsPsych.pluginAPI.preloadImages(loading_gif);
jsPsych.pluginAPI.preloadImages(vaast_instructions_images);
jsPsych.pluginAPI.preloadImages(vaast_bg_filename);

// timeline initiaization ---------------------------------------------------------------
https://marinerougier.github.io/Expe6_RC_3appuis/RCmarine2.html


if(is_compatible) {
  jsPsych.init({
      timeline: timeline,
      preload_images: preloadimages,
      max_load_time: 1000 * 500,
      exclusions: {
            min_width: 800,
            min_height: 600,
        },
      on_interaction_data_update: function() {
        saving_browser_events(completion = false);
      },
    on_finish: function() {
        saving_browser_events(completion = true);
        window.location.href = "https://marinerougier.github.io/RC_FrMg/RC.html?jspsych_id=" + jspsych_id 
        + "&vaast_condition_approach=" + vaast_condition_approach;
    }
  });
}


