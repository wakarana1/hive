var codeMirror;
var modeInput;
var firepadRef;
function init() {
    // initialize firebase
    var firepadRef = new Firebase('https://h-i-v-e.firebaseio.com');

    // create CodeMirror in JavaScript mode
     codeMirror = CodeMirror(document.getElementById('firepad-container'), {
        lineNumbers: true
    });

    // $("pre").attr("data-lang", "html");

    var hash = window.location.hash.replace(/#/g, '');
   
    if (hash) {
        firepadRef = firepadRef.child(hash);
    } else {
        firepadRef = firepadRef.push(); // generate unique location.
        window.location = window.location + '#' + firepadRef.key(); // add it as a hash to the URL.
    }

    firepadRef.child("file").on('value', function (snapshot){
        $("#file-name").html(snapshot.val().name);
    });



    // creates firepad
    var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
        defaultText: 'Welcome to Hive'
    });

    

    if (typeof console !== 'undefined'){
        console.log('Firebase data: ', firepadRef.toString());
        return firepadRef;
    }
}

CodeMirror.modeURL = "../mode/%N/%N.js";


modeInput = document.getElementById("mode");
CodeMirror.on(modeInput, "keypress", function(e) {
    if (e.keyCode == 13) change();
});

function change() {
    var val = modeInput.value, m, mode, spec;
    if (m = /.+\.([^.]+)$/.exec(val)) {
        var info = CodeMirror.findModeByExtension(m[1]);
        if (info) {
            mode = info.mode;
            spec = info.mime;
        }
    } else if (/\//.test(val)) {
        var info = CodeMirror.findModeByMIME(val);
        if (info) {
          mode = info.mode;
          spec = val;
        }
    } else {
        mode = spec = val;
    }
    if (mode) {
        codeMirror.setOption("mode", spec);
        CodeMirror.autoLoadMode(codeMirror, mode);
        document.getElementById("modeinfo").textContent = spec;
    } else {
        alert("Could not find a mode corresponding to " + val);
    }

}

// // code for changing name
// firepadRef.child("mode").set({name: "untitled.txt", type:"txt"});

init();


// firepadRef.authWithOAuthRedirect("github", function(error) {
//   if (error) {
//     console.log("Login Failed!", error);
//   } else {
//     // We'll never get here, as the page will redirect on success.
//   }
// },
// {
//   remember: "sessionOnly",
//   scope: "user,gist"
// });
