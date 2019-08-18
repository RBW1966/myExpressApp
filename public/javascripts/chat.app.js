var socket = null;
var user_id = null;
var terminated = false;
var timer;
var timeout = (function () {
    return function () {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
            const m2 = document.getElementById("m");
            m2.placeholder = 'Type a message...';
        }, 5000);
    };
})();
window.addEventListener('load', () => {
    adoIt();
});
// Disable key press
function disableKeyPressing(e) {
    // keycode for F5 function
    if (e.keyCode === 116) {
        e.returnValue = false;
        e.keyCode = 0;
        return false;
    }
    // keycode for Ctrl+R
    if (e.keyCode === 82) {
        if (e.ctrlKey) {
            e.returnValue = false;
            e.keyCode = 0;
            return false;
        }
    }
    // keycode for backspace
    if (e.keyCode === 8) {
        // try to cancel the backspace
        e.returnValue = false;
        e.keyCode = 0;
        return false;
    }
}
function doDisconnect() {
    if (terminated)
        return;
    console.log('doDisconnect');
    alert('Lost connection to myExpressApp.');
    socket.open();
}
function doLogout() {
    terminated = true;
    console.log('doLogout');
    location.href = "/logout";
}
function doRecon() {
    console.log('doRecon');
    socket.close();
}
function doTerminate() {
    terminated = true;
    console.log('doTerminate');
    alert('myExpressApp is offline.');
    location.href = "https://github.com/RBW1966/myExpressApp";
}
function doIncomingChatMessage(message) {
    // Parse the JSON message argument
    var msg = JSON.parse(message);
    // We will display SENDER: MESSAGE
    var msgString = `${msg.sender}: ${msg.msg}`;
    console.log(`INCOMING MESSAGE-${msgString}`);
    // Get the Messages <ul> element
    const messages = document.getElementById("messages");
    // Create the new <li> element
    const newItem = document.createElement("li");
    // Set the <li> inner text
    newItem.appendChild(document.createTextNode(msgString));
    // Append the new <li> to the <ul>
    messages.appendChild(newItem);
    // Scroll to make the new bottom row visible
    messages.scrollTop = messages.scrollHeight - messages.clientHeight;
}
function doConnect() {
    socket.emit('register user', user_id);
}
function adoIt() {
    user_id = getCookie("USER_ID");
    console.log(`myID=${user_id}`);
    socket = io();
    socket.on('terminate', doTerminate);
    socket.on('logout', doLogout);
    socket.on('recon', doRecon);
    socket.on('disconnect', doDisconnect);
    socket.on('chat', doIncomingChatMessage);
    socket.on('connect', doConnect);
    socket.emit('register user', user_id);
    document.getElementById("form1").addEventListener('submit', function (evt) {
        const m = document.getElementById("m");
        evt.preventDefault();
        if (m.value.length) {
            m.placeholder = '';
            let x = timeout();
            socket.emit('chat message', m.value);
            m.value = '';
        }
    });
    document.addEventListener('keydown', (e) => {
        // F5 is pressed
        if ((e.which || e.keyCode) == 116) {
            disableKeyPressing(e);
            console.log('F5 was ignored.');
        }
        // Backspace
        if (e.keyCode == 8) {
            console.log(e.target.id);
            switch (e.target.id) {
                case "m":
                    break;
                default:
                    disableKeyPressing(e);
                    console.log('Backspace was ignored.');
            }
        }
        // Ctrl+R
        if (e.ctrlKey && (e.which === 82)) {
            disableKeyPressing(e);
            console.log('Ctrl+R was ignored.');
        }
    });
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC5hcHAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjaGF0LmFwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbEIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ25CLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQztBQUN2QixJQUFJLEtBQUssQ0FBQztBQUVWLElBQUksT0FBTyxHQUFHLENBQUM7SUFDYixPQUFPO1FBQ0wsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQixLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBRSxHQUFHLEVBQUU7WUFDOUIsTUFBTSxFQUFFLEdBQXFCLFFBQVEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUQsRUFBRSxDQUFDLFdBQVcsR0FBRyxtQkFBbUIsQ0FBQztRQUN2QyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDWCxDQUFDLENBQUE7QUFDSCxDQUFDLENBQUMsRUFBRSxDQUFDO0FBRUwsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7SUFDbkMsS0FBSyxFQUFFLENBQUM7QUFDVixDQUFDLENBQUMsQ0FBQztBQUNILG9CQUFvQjtBQUNwQixTQUFTLGtCQUFrQixDQUFDLENBQUM7SUFDdkIsMEJBQTBCO0lBQzFCLElBQUksQ0FBQyxDQUFDLE9BQU8sS0FBSyxHQUFHLEVBQUU7UUFDckIsQ0FBQyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDdEIsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDZCxPQUFPLEtBQUssQ0FBQztLQUNkO0lBQ0QscUJBQXFCO0lBQ3JCLElBQUksQ0FBQyxDQUFDLE9BQU8sS0FBSyxFQUFFLEVBQUU7UUFDcEIsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFO1lBQ2IsQ0FBQyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFD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LE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbInZhciBzb2NrZXQgPSBudWxsO1xyXG52YXIgdXNlcl9pZCA9IG51bGw7XHJcbnZhciB0ZXJtaW5hdGVkID0gZmFsc2U7XHJcbnZhciB0aW1lcjtcclxuXHJcbnZhciB0aW1lb3V0ID0gKGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuICAgIHRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoICgpID0+IHtcclxuICAgICAgY29uc3QgbTIgPSA8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1cIik7XHJcbiAgICAgIG0yLnBsYWNlaG9sZGVyID0gJ1R5cGUgYSBtZXNzYWdlLi4uJztcclxuICAgIH0sIDUwMDApO1xyXG4gIH1cclxufSkoKTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gIGFkb0l0KCk7XHJcbn0pO1xyXG4vLyBEaXNhYmxlIGtleSBwcmVzc1xyXG5mdW5jdGlvbiBkaXNhYmxlS2V5UHJlc3NpbmcoZSkge1xyXG4gICAgICAvLyBrZXljb2RlIGZvciBGNSBmdW5jdGlvblxyXG4gICAgICBpZiAoZS5rZXlDb2RlID09PSAxMTYpIHtcclxuICAgICAgICBlLnJldHVyblZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgZS5rZXlDb2RlID0gMDtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICAgLy8ga2V5Y29kZSBmb3IgQ3RybCtSXHJcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IDgyKSB7XHJcbiAgICAgICAgaWYgKGUuY3RybEtleSkge1xyXG4gICAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgZS5rZXlDb2RlID0gMDtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTsgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vIGtleWNvZGUgZm9yIGJhY2tzcGFjZVxyXG4gICAgICBpZiAoZS5rZXlDb2RlID09PSA4KSB7XHJcbiAgICAgICAgLy8gdHJ5IHRvIGNhbmNlbCB0aGUgYmFja3NwYWNlXHJcbiAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG4gICAgICAgIGUua2V5Q29kZSA9IDA7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbn1cclxuZnVuY3Rpb24gZG9EaXNjb25uZWN0KCkge1xyXG4gIGlmICh0ZXJtaW5hdGVkKSByZXR1cm47XHJcbiAgY29uc29sZS5sb2coJ2RvRGlzY29ubmVjdCcpO1xyXG4gIGFsZXJ0KCdMb3N0IGNvbm5lY3Rpb24gdG8gbXlFeHByZXNzQXBwLicpO1xyXG4gIHNvY2tldC5vcGVuKCk7XHJcbn1cclxuZnVuY3Rpb24gZG9Mb2dvdXQoKSB7XHJcbiAgdGVybWluYXRlZCA9IHRydWU7XHJcbiAgY29uc29sZS5sb2coJ2RvTG9nb3V0Jyk7XHJcbiAgbG9jYXRpb24uaHJlZiA9IFwiL2xvZ291dFwiO1xyXG59XHJcbmZ1bmN0aW9uIGRvUmVjb24oKSB7XHJcbiAgY29uc29sZS5sb2coJ2RvUmVjb24nKTtcclxuICBzb2NrZXQuY2xvc2UoKTtcclxufVxyXG5mdW5jdGlvbiBkb1Rlcm1pbmF0ZSgpIHtcclxuICB0ZXJtaW5hdGVkID0gdHJ1ZTtcclxuICBjb25zb2xlLmxvZygnZG9UZXJtaW5hdGUnKTtcclxuICBhbGVydCgnbXlFeHByZXNzQXBwIGlzIG9mZmxpbmUuJyk7XHJcbiAgbG9jYXRpb24uaHJlZiA9XCJodHRwczovL2dpdGh1Yi5jb20vUkJXMTk2Ni9teUV4cHJlc3NBcHBcIjtcclxufVxyXG5mdW5jdGlvbiBkb0luY29taW5nQ2hhdE1lc3NhZ2UobWVzc2FnZSkge1xyXG4gIC8vIFBhcnNlIHRoZSBKU09OIG1lc3NhZ2UgYXJndW1lbnRcclxuICB2YXIgbXNnID0gSlNPTi5wYXJzZShtZXNzYWdlKTtcclxuICAvLyBXZSB3aWxsIGRpc3BsYXkgU0VOREVSOiBNRVNTQUdFXHJcbiAgdmFyIG1zZ1N0cmluZyA9IGAke21zZy5zZW5kZXJ9OiAke21zZy5tc2d9YFxyXG4gIGNvbnNvbGUubG9nKGBJTkNPTUlORyBNRVNTQUdFLSR7bXNnU3RyaW5nfWApO1xyXG4gIC8vIEdldCB0aGUgTWVzc2FnZXMgPHVsPiBlbGVtZW50XHJcbiAgY29uc3QgbWVzc2FnZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lc3NhZ2VzXCIpO1xyXG4gIC8vIENyZWF0ZSB0aGUgbmV3IDxsaT4gZWxlbWVudFxyXG4gIGNvbnN0IG5ld0l0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XHJcbiAgLy8gU2V0IHRoZSA8bGk+IGlubmVyIHRleHRcclxuICBuZXdJdGVtLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG1zZ1N0cmluZykpO1xyXG4gIC8vIEFwcGVuZCB0aGUgbmV3IDxsaT4gdG8gdGhlIDx1bD5cclxuICBtZXNzYWdlcy5hcHBlbmRDaGlsZChuZXdJdGVtKTtcclxuICAvLyBTY3JvbGwgdG8gbWFrZSB0aGUgbmV3IGJvdHRvbSByb3cgdmlzaWJsZVxyXG4gIG1lc3NhZ2VzLnNjcm9sbFRvcCA9IG1lc3NhZ2VzLnNjcm9sbEhlaWdodCAtIG1lc3NhZ2VzLmNsaWVudEhlaWdodDtcclxufVxyXG5mdW5jdGlvbiBkb0Nvbm5lY3QoKSB7XHJcbiAgc29ja2V0LmVtaXQoJ3JlZ2lzdGVyIHVzZXInLCB1c2VyX2lkKTtcclxufVxyXG5mdW5jdGlvbiBhZG9JdCgpIHtcclxuICB1c2VyX2lkID0gZ2V0Q29va2llKFwiVVNFUl9JRFwiKTtcclxuICBjb25zb2xlLmxvZyhgbXlJRD0ke3VzZXJfaWR9YCk7XHJcbiAgc29ja2V0ID0gaW8oKTtcclxuICBzb2NrZXQub24oJ3Rlcm1pbmF0ZScsIGRvVGVybWluYXRlKTtcclxuICBzb2NrZXQub24oJ2xvZ291dCcsIGRvTG9nb3V0KTtcclxuICBzb2NrZXQub24oJ3JlY29uJywgZG9SZWNvbik7XHJcbiAgc29ja2V0Lm9uKCdkaXNjb25uZWN0JywgZG9EaXNjb25uZWN0KTtcclxuICBzb2NrZXQub24oJ2NoYXQnLCBkb0luY29taW5nQ2hhdE1lc3NhZ2UpXHJcbiAgc29ja2V0Lm9uKCdjb25uZWN0JywgZG9Db25uZWN0KTtcclxuICBzb2NrZXQuZW1pdCgncmVnaXN0ZXIgdXNlcicsIHVzZXJfaWQpO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9ybTFcIikuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24oZXZ0KSB7XHJcbiAgICBjb25zdCBtID0gPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtXCIpO1xyXG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBpZiAobS52YWx1ZS5sZW5ndGgpIHtcclxuICAgICAgbS5wbGFjZWhvbGRlciA9ICcnO1xyXG4gICAgICBsZXQgeCA9IHRpbWVvdXQoKTtcclxuICAgICAgc29ja2V0LmVtaXQoJ2NoYXQgbWVzc2FnZScsIG0udmFsdWUpO1xyXG4gICAgICBtLnZhbHVlID0gJyc7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB7XHJcbiAgICAvLyBGNSBpcyBwcmVzc2VkXHJcbiAgICBpZigoZS53aGljaCB8fCBlLmtleUNvZGUpID09IDExNikge1xyXG4gICAgICBkaXNhYmxlS2V5UHJlc3NpbmcoZSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdGNSB3YXMgaWdub3JlZC4nKTtcclxuICAgIH1cclxuICAgIC8vIEJhY2tzcGFjZVxyXG4gICAgaWYgKGUua2V5Q29kZSA9PSA4KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCkuaWQpO1xyXG4gICAgICBzd2l0Y2ggKCg8SFRNTElucHV0RWxlbWVudD5lLnRhcmdldCkuaWQpIHtcclxuICAgICAgICBjYXNlIFwibVwiOlxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGRpc2FibGVLZXlQcmVzc2luZyhlKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdCYWNrc3BhY2Ugd2FzIGlnbm9yZWQuJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIEN0cmwrUlxyXG4gICAgaWYgKGUuY3RybEtleSAmJiAoZS53aGljaCA9PT0gODIpICkge1xyXG4gICAgICAgIGRpc2FibGVLZXlQcmVzc2luZyhlKTtcclxuICAgICAgIGNvbnNvbGUubG9nKCdDdHJsK1Igd2FzIGlnbm9yZWQuJyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENvb2tpZShjbmFtZSkge1xyXG4gIHZhciBuYW1lID0gY25hbWUgKyBcIj1cIjtcclxuICB2YXIgZGVjb2RlZENvb2tpZSA9IGRlY29kZVVSSUNvbXBvbmVudChkb2N1bWVudC5jb29raWUpO1xyXG4gIHZhciBjYSA9IGRlY29kZWRDb29raWUuc3BsaXQoJzsnKTtcclxuICBmb3IodmFyIGkgPSAwOyBpIDxjYS5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgYyA9IGNhW2ldO1xyXG4gICAgICB3aGlsZSAoYy5jaGFyQXQoMCkgPT0gJyAnKSB7XHJcbiAgICAgICAgICBjID0gYy5zdWJzdHJpbmcoMSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGMuaW5kZXhPZihuYW1lKSA9PSAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gYy5zdWJzdHJpbmcobmFtZS5sZW5ndGgsIGMubGVuZ3RoKTtcclxuICAgICAgfVxyXG4gIH1cclxuICByZXR1cm4gXCJcIjtcclxufSJdfQ==