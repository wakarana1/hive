// Create a Firebase Ref
var messagesRef = firepadRef.child("chat");
var username;
// Register DOM elements into chat
var messageField = $('#messageInput');
var messageList = $('#messages');

firepadRef.onAuth(function(authData) {
   // Once authenticated, instantiate Hive with our user id and user name
    if (authData) {
        $('#myModal').modal('hide');
        username = authData.github.username;
        $('#username').html(username);
        render(true);
    } else {
        render(false);
        username = null;
        $('#myModal').modal('show');
    }
});

function login(provider) {
    firepadRef.authWithOAuthPopup('github', function(error, authData) {
        if (error) {
            console.log(error);
        } else {
            
        }
    });
}

function logout() {
    firepadRef.unauth();
    console.log('Successfully logged out!');
}

// Listen to keypress events
messageField.keypress(function (e) {
    if (e.keyCode == 13) {
        // Field Values
        var message = messageField.val();
        e.preventDefault();
        // Save data to firebase and empty field
        messagesRef.push({name:username, text:message});
        messageField.val('');
    }
});

// Add a callback that is triggered for each chat message.
messagesRef.limitToLast(10).on('child_added', function (snapshot) {
    // Get data
    var data = snapshot.val();
    var username = data.name || "anonymous";
    var message = data.text;

    // Create message
    var messageElement = $("<li>");
    var nameElement = $("<strong></strong>");
    nameElement.text(username);
    messageElement.text(":  " + message).prepend(nameElement);

    // Add message
    messageList.append(messageElement);

    // Scroll to newest
    messageList[0].scrollTop = messageList[0].scrollHeight;
});

function render(authorized) {
    var visibility = authorized ? "visible" : "hidden";
    $('.text-right #syntax').css('visibility', visibility);
    $('#chat').css('visibility', visibility);
    $('#firepad-container').css('visibility', visibility);
    $('#select').css('visibility', visibility);
    $('#mode').css('visibility', visibility);
    $('.form-group').css('visibility', visibility);
    $('.syntax').css('visibility', visibility);
    if(! authorized) {
        $('#myModal').modal('show');
        console.log('Test');
    }       
}