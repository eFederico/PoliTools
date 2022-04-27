# PoliTools for Safari

### Useful Resources

- Apple Developer
    - [Docs - All possible App Extensions](https://developer.apple.com/library/archive/documentation/General/Conceptual/ExtensibilityPG/index.html)
    - [Docs - Safari **Web** Extensions](https://developer.apple.com/documentation/safariservices/safari_web_extensions)
    - [WWDC20 - Safari Web Extensions](https://developer.apple.com/wwdc20/10665)
    - [WWDC20 - What's new for web developers](https://developer.apple.com/wwdc20/10663)
- Real working examples
    - [VocabularyLog](https://github.com/Appccessibility-Shox/VocabularyLog)
    - [Keys](https://github.com/Appccessibility-Shox/Keys)
    - [WWDC20 - Sea Creator](https://docs-assets.developer.apple.com/published/ad929d2b4e/DevelopingASafariWebExtension.zip)
- Reddit
    - [r/SafariExtensionDevs](https://www.reddit.com/r/SafariExtensionDevs/)

### How to Develop

First build:
1. Open the Xcode project with `open PoliToolsSafari/PoliTools/PoliTools.xcodeproj`
2. Run the app with the button in the top left corner of Xcode
3. Quit the app
4. Open Safari
5. Open Preferences with <kbd>⌘</kbd>+<kbd>,</kbd>
6. Advanced -> Show Develop menu in menu bar
7. Develop -> Allow Unsigned Extensions
8. In Preferences -> Extensions -> enable PoliTools
9. Navigate to https://didattica.polito.it
10. Click on the PoliTools extension button in the top bar -> Always Allow on this domain

Next builds:
1. Rebuild with <kbd>⌘</kbd>+<kbd>B</kbd>
2. Done, the code is automatically updated, no need to refresh like on Chrome and Firefox

You can also click the button in the top bar and reload, no idea on its effect.

To debug:
- The popover
    1. Click the button in the top bar
	2. Right click on the popover -> Inspect
- The background page
    1. Click Develop in the menu bar
	2. Web Extension Background Pages -> PoliTools - Background Page
- The content scripts
    1. Open the JS console with <kbd>⌘</kbd>+<kbd>⌥</kbd>+<kbd>C</kbd>
    2. Go to Sources -> Extension Scripts
	3. In the console prompt, switch to the PoliTools namespace on the right (As of now, I can only see some other namespaces but not the right one, I don't know why.) The default is the webpage namespace.
	4. Run commands

