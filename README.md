# PoliTools for FireFox

This repository contains the code for the FireFox port of the PoliTools extension alongside a VS Code oriented UNIX development environment that significantly simplifies the development process of the extension.

The required tools in order to exploit this development environment are:

- A shell that has **POSIX compliance**
- **GNU Make**
- Any version of **Python 3**
- **VS Code** or one of the open source forks
- A **UNIX-Like** operating system or development environment (WSL *should* work, not tested)

Of course it is possible to develop the extension even without these tools, just the provided amenities will not work.

## Make targets

> For your convenience when running the `run` target the browser will automatically open the Teaching Portal homepage. Login will be necessary since the temporary instance is separate from any existing user profile and will therefore not contain any authentication cookies.

> Note that when launching the extension through the `run` make target FireFox will automatically reload the extension when any change is detected to the extension sources.

| Target    | Function                                                   |
|-----------|------------------------------------------------------------|
| `run`     | Run the extension in a temporary FireFox instance          |
| `lint`    | Lint the extension code (including manifest) using web-ext |
| `package` | Create an XPI package for the extension                    |
| `clean`   | Removes all build artifacts                                |

## VS Code integration

Users running VS Code will be able to automatically package the extension using the `CTRL+SHIFT+B` inside the editor and running the linter by executing the `Lint extension using WebExt` task. Notice said task is the default *Test Task* of the editor. The user can assign a keyboard shortcut to run the default *Test Task* from within the editor's config. Furthermore, the editor will run the linting task before running the packaging task therefore using the `CTRL+SHIFT+B` shortcut implicitly lints the extension.

The linter output is shown in the editor's integrated *Problems* panel with the correct severity, source file and line/column shown.

The various tasks should stay out of the way and never bother the developer unless an error occurs. The only exception being