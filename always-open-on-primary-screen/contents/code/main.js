/*
KWin Script Always Show Notification on Primary Screen
(C) 2022 PgBiel
Based on the works of Natalie Clarius <natalie_clarius@yahoo.de>
GNU General Public License v3.0
*/

// initialization
const config = {
  primaryScreenIndex: readConfig("primaryScreenIndex", 0),
  debugMode: readConfig("debugMode", true)
};

  function debug(...args) {
    if (config.debugMode) console.debug("alwaysshownotifonprimaryscreen:", ...args);
  }
  debug("initializing");

// primary screen is 0'th by default (but changeable in the config)
var primaryScreen = config.primaryScreenIndex;

// when a client is added
workspace.clientAdded.connect(client => {
    debug("client", JSON.stringify(client, undefined, 2));

    // abort conditions
    if (!client // null
	|| !(client.notification || client.criticalNotification)  // is not a notification
        || client.screen == primaryScreen) // already on right screen
        return;

    // move client to primary screen
    debug("sending client", client.caption, "to primary screen", primaryScreen);
    workspace.sendClientToScreen(client, primaryScreen);

    // clip and move client into bounds of screen dimensions
    const area = workspace.clientArea(KWin.MaximizeArea, client);
    client.geometry.width = Math.min(area.width, client.width);
    client.geometry.height = Math.min(area.height, client.height);
    client.geometry.x = Math.max(area.x, Math.min(area.x + area.width - client.width, client.x));
    client.geometry.y = Math.max(area.y, Math.min(area.y + area.height - client.height, client.y));
});
