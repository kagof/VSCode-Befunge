# Befunge Support in VS Code

[![Version](https://vsmarketplacebadge.apphb.com/version/kagof.befunge.svg)](https://marketplace.visualstudio.com/items?itemName=kagof.befunge)
[![Installs](https://vsmarketplacebadge.apphb.com/installs/kagof.befunge.svg)](https://marketplace.visualstudio.com/items?itemName=kagof.befunge)
[![Build Status](https://img.shields.io/travis/kagof/VSCode-Befunge.svg)](https://travis-ci.org/kagof/VSCode-Befunge)
[![Known Vulnerabilities](https://snyk.io/test/github/kagof/vscode-befunge/badge.svg?targetFile=package.json)](https://snyk.io/test/github/kagof/vscode-befunge?targetFile=package.json)

## Features

* Implements Syntax Highlighting in VS Code for [Befunge-93](https://esolangs.org/wiki/Befunge) and [Befunge-98](https://esolangs.org/wiki/Funge-98) programming languages.

* Adds alignment guides coming from the directional characters (`>`, `v`, `<`, `^`, `?`).

Associates `.bf`, `.befunge`, and `.b93` files with Befunge-93, and `.b98` files with Befunge-98.

## Screenshots

![FizzBuzz Example](https://raw.githubusercontent.com/kagof/VSCode-Befunge/master/assets/screenshots/screenshot-fizzbuzz.png)

![Factorial Example](https://raw.githubusercontent.com/kagof/VSCode-Befunge/master/assets/screenshots/screenshot-factorial.png)

## Installation

1. Open VS Code, select the extensions icon (Windows: `ctrl` + `shift` + `X`, Mac: `cmd` + `shift` + `X`) and search for `befunge`. Or maybe you are already here in VS Code. Nice!
2. Click `install`
3. Restart or reload VS Code when prompted
4. Add `"befunge.guides.enable": true"` to your Workspace or User Settings if you want to enable Befunge alignment guides.
    * note: it is recommended that you also add `"editor.renderIndentGuides": false` to your workspace settings if you enable this
5. (Optional) add the custom theming described in [Extension Settings](#extension-settings)

## Extension Settings

Adds the following new configuration settings:

| Name | Default (Type) | Description |
|------|----------------|-------------|
|`"befunge.guides.enabled"`|`true` (boolean)|Enable the Befunge guides coming from arrow characters.|
|`"befunge.guides.color.dark"`|`"#3c3c3c"` (*#rrggbb* hex string)|The Befunge guide line color to use for a dark theme.|
|`"befunge.guides.color.light"`|`"#dcdcdc"` (*#rrggbb* hex string)|The Befunge guide line color to use for a light theme.|

To get the colors shown in the [screenshots](#screenshots), some changes to your User Settings are necessary:

1. Open your user settings (Windows: `ctrl` + `,` Mac: `cmd` + `,`)
2. Add the following json to your User Settings (or Workspace Settings to only enable it on your current workspace):

``` javascript
    // custom colors
    "editor.tokenColorCustomizations": {
        "textMateRules": [

            // Befunge directional character styles
            {
                // bf93: v^><
                // bf98: v^<>x
                "scope": "keyword.control.direction.absolute.befunge",
                    "settings": {
                        "fontStyle": "bold",
                        "foreground": "#f0bf00"
                    }
            },
            {
                // bf9*: ?
                "scope": "keyword.control.direction.random.befunge",
                    "settings": {
                        "fontStyle": "bold",
                        "foreground": "#f0bf00"
                    }
            },
            {
                // bf98: []
                "scope": "keyword.control.direction.rotate.befunge",
                    "settings": {
                        "fontStyle": "bold",
                        "foreground": "#f0bf00"
                    }
            },
            {
                // bf98: r
                "scope": "keyword.control.direction.reflect.befunge",
                    "settings": {
                        "fontStyle": "bold",
                        "foreground": "#f0bf00"
                    }
            },
            {
                // bf93: |_
                // bf98: |_w
                "scope": "keyword.control.direction.conditional.befunge",
                    "settings": {
                        "fontStyle": "bold",
                        "foreground": "#f0bf00"
                    }
            },
            {
                // bf98: hlm
                "scope": "keyword.control.direction.3d.befunge",
                    "settings": {
                        "fontStyle": "bold",
                        "foreground": "#f0bf00"
                    }
            },
            // befunge end character styles
            {
                // bf93: @
                // bf98: @q
                "scope": "keyword.control.end.befunge",
                    "settings": {
                        "fontStyle": "bold",
                        "foreground": "#ff0000"
                    }
            },
            // befunge stack manipulation character styles
            {
                // bf93: :\$
                // bf98: :\$n{}u
                "scope": "keyword.operator.stack.befunge",
                    "settings": {
                        "foreground": "#b405ff"
                    }
            },
            // befunge I/O operators
            {
                // bf9*: &~
                "scope": "keyword.operator.io.input.befunge",
                    "settings": {
                        "foreground": "#128024"
                    }
            },
            {
                // bf9*: .,
                "scope": "keyword.operator.io.output.befunge",
                    "settings": {
                        "foreground": "#128024"
                    }
            },
            {
                // bf98: io
                "scope": "keyword.operator.io.file.befunge",
                    "settings": {
                        "foreground": "#128024"
                    }
            },
            {
                // bf93: pg
                // bf98: pgs
                "scope": "keyword.operator.io.code.befunge",
                    "settings": {
                        "foreground": "#128024"
                    }
            },
        ]
    }
```

As VS Code [does not (yet?) allow themes to be set on a per language basis](https://github.com/Microsoft/vscode/issues/20652), this adds to your *global* theme. However, all scopes used in this blurb end in `.befunge`, ie, this should not affect your theme anywhere except on Befunge files.

Of course, feel free to modify this to your liking, and look at the scopes contained in the `*.tmLanguage.json` files to see what other Befunge scopes you can customize the theme for.

## Known Issues

Currently no known issues for this extension.

Find an issue/bug? [Report it](https://github.com/kagof/VSCode-Befunge-syntax-highlighting/issues/new)!

## Source

[Github Repository](https://github.com/kagof/VSCode-Befunge)

## Release Notes

See also the [changelog](CHANGELOG.md).

### 1.2.2

* Update npm dependencies addressing (another) low priority npm vulnerability alert.

### 1.2.1

* Update npm dependencies, addressing Github notification of a dependency vulnerability

### 1.2.0

* Restrict colors to 6 digit hex colors as other formats can cause problems, especially with the horizontal lines
* Purge decorations of the old style when color configuration changes, as otherwise it would persist until editor is closed
* Renamed `"befunge.guides.enable"` configuration property to `"befunge.guides.enabled"` to match README and code
* Set some default editor configurations for Befunge-93 and 98 files, including turning off indent guides, line highlight, trailing whitespace trimming, autoindent, and quick suggestions
* Because indent guides are now disabled by default, `"befunge.guides.enabled"` now defaults to `true`

### 1.1.0

* Support for alignment guides for the directional characters

### 1.0.0

* Initial release with support for Befunge-93 and Befunge-98
