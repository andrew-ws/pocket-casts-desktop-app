const electron = require( "electron" );
const { shell, app, BrowserWindow, globalShortcut } = electron;
const mpris = require( "mpris-service" );
const HOMEPAGE = "https://play.pocketcasts.com/web/"

let mainWindow;

app.on( "ready", () => {
	window = new BrowserWindow({
		width: 1200,
		height: 900,
		webPreferences: {
			nodeIntegration: false
		}
	});

	window.setMenuBarVisibility( false );
	window.loadURL( HOMEPAGE );

  const player = mpris({
    name: 'pocket_casts',
    identity: 'Pocket Casts',
    supportedInterfaces: ['player'],
    desktopEntry: 'pocket-casts-linux',
	});

  player.playbackStatus = 'Stopped';
	player.canEditTracks = false;

  player.on('playpause', () => {
		window.webContents.executeJavaScript( "document.querySelector( '.play_pause_button' ).click()");
  });

  player.on('next', () => {
		window.webContents.executeJavaScript( "document.querySelector( '.skip_forward_button' ).click()");
  });

  player.on('previous', () => {
		window.webContents.executeJavaScript( "document.querySelector( '.skip_back_button' ).click()");
  });

	window.webContents.on( "will-navigate", ( ev, url ) => {
		parts = url.split( '/' );

		if( parts[0] + "//" + parts[2] != HOMEPAGE ){
			ev.preventDefault();
			shell.openExternal( url );
		}
	});

	window.on( "closed", () => {
		window = null;
	});
});

app.on( "window-all-closed", () => {
	if( process.platform !== "darwin" ){
		app.quit()
	}
});
