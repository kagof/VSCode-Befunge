# Change Log

All notable changes to the Befunge VS Code extension will be documented in this file.

The format of this changelog is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 1.2.3 - 2019-05-02

### Changed

* long overdue update of dependencies to resolve more npm vulnerability alerts.

## 1.2.2 - 2018-10-09

### Changed

* updated dependencies to address (another) low priority npm dependency vulnerability alert.

## 1.2.1 - 2018-05-01

### Changed

* updated dependencies to address Github notification about [MAID vulnerability in hoek](https://www.cvedetails.com/cve/CVE-2018-3728/) resolved in version `5.0.3`. It appears that version `4.2.1` also fixes this, but to be safe (and to ensure the warning is resolved) all `hoek` dependencies have been updated to `^5.0.3`

## 1.2.0 - 2018-01-22

### Added

* default editor configurations for Befunge-93 and 98 files, including turning off indent guides, line highlight, trailing whitespace trimming, autoindent, and quick suggestions. See the "Contributions" tab in VS Code for details
* restriction on colors: previously accepted any string, now only accepts 6 digit hex colors. This prevents some bugs in rendering, especially in rendering horizontal guides
* extension now renders guides on a change in configuration

### Changed

* fixed bug where guide lines in the old color could still persist after a color change
* `"befunge.guides.enable"` renamed to `"befunge.guides.enabled"`
* `"befunge.guides.enabled"` now defaults to `true`

## 1.1.0 - 2018-01-21

### Added

* Alignment guides from the directional characters (`>`, `v`, `<`, `^`, `?`)

* Configuration to enable/disable alignment guides, and set the color of them per theme.

* Basic testing of the renderer

### Changed

* Changed name from *Befunge Syntax Highlighting* to *Befunge*, to reflect the additional features.

## 1.0.0 (Initial Release) - 2018-01-20

### Added

* Befunge-93 syntax awareness
* Befunge-98 syntax awareness