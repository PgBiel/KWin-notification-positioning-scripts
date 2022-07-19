/*
KWin Script Always Show Notifications on Active Screen
(C) 2022 PgBiel
Based on the works of Natalie Clarius <natalie_clarius@yahoo.de>
GNU General Public License v3.0
*/

// initialization
const config = {
  debugMode: readConfig("debugMode", true)
};

  function debug(...args) {
    if (config.debugMode) console.debug("alwaysshownotifonactivescreen:", ...args);
  }
  debug("initializing");

// when a client is added
workspace.clientAdded.connect(client => {
    debug("client", JSON.stringify(client, undefined, 2));

    // get active screen
    var activeScreen = workspace.activeScreen;

    // abort conditions
    if (!client // null
	|| !(client.notification || client.criticalNotification)  // not a notification
        || client.screen == activeScreen) // already on right screen
        return;

    // move client to active screen
    debug("sending client", client.caption, "to active screen", activeScreen);
    workspace.sendClientToScreen(client, activeScreen);

    // clip and move client into bounds of screen dimensions
    const area = workspace.clientArea(KWin.MaximizeArea, client);
    client.geometry.width = Math.min(area.width, client.width);
    client.geometry.height = Math.min(area.height, client.height);
    client.geometry.x = Math.max(area.x, Math.min(area.x + area.width - client.width, client.x));
    client.geometry.y = Math.max(area.y, Math.min(area.y + area.height - client.height, client.y));
});
