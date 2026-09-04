---
title: Settings
layout: home
permalink: /settings
description: The bitMagic.* VSCode settings for debugger updates, the official emulator, and local development.
---
# Settings

All settings live under `bitMagic.` in VSCode settings. The defaults are fine for most people. The ones you are most likely to touch are the emulator location and, on an unsupported platform, the platform check.

## Debugger

| Setting | Description |
| ------- | ----------- |
| `bitMagic.debugger.autoUpdateDebugger` | Keep the downloaded copy of the debugger up to date. |
| `bitMagic.debugger.path` | Path to the automatically downloaded debugger. |
| `bitMagic.debugger.alternativePath` | Path to a different copy of the debugger, used instead of the downloaded one. |
| `bitMagic.debugger.developRelease` | Use the develop release channel for pre-release and experimental builds; use with caution. |
| `bitMagic.debugger.useBundledDotnet` | Download a private copy of the .NET runtime for the extension rather than using a system one. |
| `bitMagic.debugger.disablePlatformCheck` | Skip the x64 platform check, to experiment on unsupported platforms. |

## Official emulator

Used for the ROM and its symbol files, and by **Run Project In The Official Emulator**.

| Setting | Description |
| ------- | ----------- |
| `bitMagic.officialEmulator.downloadOfficialEmulator` | Automatically download the official emulator (for `rom.bin` and the `.sym` files). |
| `bitMagic.officialEmulator.version` | Which version of the official emulator to download. |
| `bitMagic.officialEmulator.officialEmulatorLocation` | Path to the automatically downloaded emulator. |
| `bitMagic.officialEmulator.customOfficialEmulatorLocation` | Point at your own copy of the official emulator instead. Can be overridden per-project with `emulatorDirectory` in the [project file](/debugger/projectfile#properties). |

## Local development

For working on BitMagic itself. The extension talks to a debugger you are running from source rather than the downloaded one. Requires a restart.

| Setting | Description |
| ------- | ----------- |
| `bitMagic.localDebug.enable` | Connect to a locally running debugger. |
| `bitMagic.localDebug.dapPort` | Port for the Debug Adapter Protocol connection (default 2563). |
| `bitMagic.localDebug.lspPort` | Port for the Language Server connection (default 2564). |
