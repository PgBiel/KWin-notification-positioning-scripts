/*
KWin Script Always Show Notifications on Focused Screen
(C) 2022 PgBiel
Based on the works of Natalie Clarius <natalie_clarius@yahoo.de>
GNU General Public License v3.0
*/

// initialization
const config = {
  debugMode: readConfig("debugMode", true)
};

  function debug(...args) {
    if (config.debugMode) console.debug("alwaysshownotifonfocusedscreen:", ...args);
  }
  debug("initializing");

// when a client is activated, update focused screen to screen client is on
var focusedScreen = workspace.activeScreen;
workspace.clientActivated.connect(client => {
    if (!client || !(client.notification || client.criticalNotification)) return;
    focusedScreen = client.screen;
    debug("focused screen", focusedScreen);
});

// when a client is added
workspace.clientAdded.connect(client => {
    debug("client", JSON.stringify(client, undefined, 2));

    // abort conditions
    if (!client // null
	|| !(client.notification || client.criticalNotification)  // not a notification
        || client.screen == focusedScreen) // already on right screen
        return;

    // move client to focused screen
    debug("sending client", client.caption, "to focused screen", focusedScreen);
    workspace.sendClientToScreen(client, focusedScreen);
  
    // clip and move client into bounds of screen dimensions
    const area = workspace.clientArea(KWin.MaximizeArea, client);
    client.geometry.width = Math.min(area.width, client.width);
    client.geometry.height = Math.min(area.height, client.height);
    client.geometry.x = Math.max(area.x, Math.min(area.x + area.width - client.width, client.x));
    client.geometry.y = Math.max(area.y, Math.min(area.y + area.height - client.height, client.y));
});
