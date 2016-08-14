var BootScene = require('./scenes/boot')

cc.game.onStart = function () {
  // Pass true to enable retina display, on Android disabled by default to improve performance
  cc.view.enableRetina(cc.sys.os === cc.sys.OS_IOS)

  // Adjust viewport meta
  cc.view.adjustViewPort(true)

  // Uncomment the following line to set a fixed orientation for your game
  // cc.view.setOrientation(cc.ORIENTATION_PORTRAIT);

  // Setup the resolution policy and design resolution size
  cc.view.setDesignResolutionSize(960, 640, cc.ResolutionPolicy.SHOW_ALL)

  // The game will be resized when browser size change
  cc.view.resizeWithBrowserSize(true)

  // load resourcjs
  cc.director.runScene(new BootScene())
}
cc.game.run()
