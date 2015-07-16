//      ___ ___ ._______   _______________
//     /   |   \|   \   \ /   /\_   _____/
//    /    ~    \   |\   Y   /  |    __)_ 
//    \    Y    /   | \     /   |        \
//     \___|_  /|___|  \___/   /_______  /
//           \/                        \/    
                                    
  //==========================================//
 //                                          //
//==========================================//
                                                              
var codeMirror;
var modeInput;
var firepadRef;

// setting syntax mode
CodeMirror.modeURL = '../mode/%N/%N.js';
modeInput = document.getElementById('mode');

var currentTheme = 'ambiance';

function init(authData) {
    // initialize firebase

    firepadRef = new Firebase('https://h-i-v-e.firebaseio.com');


    // create CodeMirror in JavaScript mode
     codeMirror = CodeMirror(document.getElementById('firepad-container'), {
        lineNumbers: true,
        matchBrackets: true,
        highlightSelectionMatches: {showToken: /\w/},
        lineWrapping: true,
        theme: 'ambiance'
    });

    var hash = window.location.hash.replace(/#/g, "");
   
    if (hash) {
        firepadRef = firepadRef.child(hash);
    } else {
        firepadRef = firepadRef.push(); // generate unique location.
        firepadRef.child('file').set("untitled.txt");
        window.location = window.location + '#' + firepadRef.key(); // add it as a hash to the URL.
    }

    firepadRef.child('file').on('value', function (snapshot) {
        // if (snapshot.val() != modeInput.value) {
            modeInput.value = snapshot.val();
        // }
        change();
    });

    // creates firepad
    var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
        defaultText: "Welcome to Hive. write your code below! \n \nChange the file extension, and theme above! \n \n def say_hello \n    puts 'Hello, World' \n end \n \n function hello(){ \n    console.log('Hello World!') \n }" 
    });

    if (typeof console !== 'undefined'){
        console.log('Firebase data: ', firepadRef.toString());
    }

    $('#mode').on('change blur', function() {
        firepadRef.child('file').set(modeInput.value);
    });

}

function change() {
    var info;
    var val = modeInput.value, m, mode, spec;
    if (m = /.+\.([^.]+)$/.exec(val)) {
        info = CodeMirror.findModeByExtension(m[1]);
        if (info) {
            mode = info.mode;
            spec = info.mime;
        }
    } else if (/\//.test(val)) {
        info = CodeMirror.findModeByMIME(val);
        if (info) {
          mode = info.mode;
          spec = val;
        }
    } else {
        mode = spec = val;
    }
    if (mode) {
        codeMirror.setOption('mode', spec);
        CodeMirror.autoLoadMode(codeMirror, mode);
        document.getElementById('modeinfo').textContent = spec;
        codeMirror.setOption('theme', currentTheme);
    } else {
        if (val) alert('Could not find a mode corresponding to ' + val);
    }
}

init();

// Theme select
var input = document.getElementById('select');
function chosenTheme () {
    codeMirror.setOption('theme', currentTheme);
}

$('#select li').click(function() {
    currentTheme = this.textContent;
    chosenTheme();
});