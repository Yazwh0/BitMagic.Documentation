---
title: Project File
layout: page
permalink: /debugger/projectfile
description: "The project.json that controls a debug launch: source, ROM, symbols, SD card and compile options."
---

# Project File

A project file is the easiest way to control a debug session. It is a JSON file; the VSCode extension ships a JSON schema for it, so you get completion and validation while editing. `//` line comments are allowed.

Property names are `camelCase`. An empty `{}` is valid and boots to the BASIC prompt.

## Example

```json
{
    "source": "main.bmasm",
    "outputFolder": "out",
    "directRun": true,
    "startStepping": true,
    "compileOptions": {
        "displaySegments": true,
        "displayVariables": true,
        "binFolder": "bin"
    },
    "sdCardFiles": [
        { "source": "assets/*.bin", "dest": "" }
    ],
    "symbols": [
        { "symbols": "kernal.sym", "romBank": 0 }
    ]
}
```

## Properties

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `source` | string | `""` | Main source file. |
| `startStepping` | bool | `true` | Start the session paused, ready to step. |
| `directRun` | bool | `false` | Run the compiled code directly. If `false`, compile it and add it to the SD card as a file instead. |
| `autobootRun` | bool | `true` | Run the application by writing an `AUTOBOOT.X16`. Not written if the file already exists. |
| `autobootFile` | string | `""` | Write `AUTOBOOT.X16` to run this named file instead. Overrides `autobootRun`. |
| `outputFolder` | string | `""` | Where to save the `.prg` and other host-side build outputs. Not the SD card. |
| `startAddress` | int | `-1` | Start address. `-1` (or omitted) starts the ROM normally from the reset vector at `$fffc`. |
| `romFile` | string | `""` | ROM file to use. |
| `emulatorDirectory` | string | `""` | Folder holding the official X16 emulator. Its `rom.bin` is used if `romFile` is not set; ROM-bank symbols are loaded from here using `romBankNames` + `.sym`. |
| `symbols` | [SymbolsFile](#symbols)[] | `[]` | Symbol files to import. |
| `romBankNames` | string[] | *(the 16 standard banks)* | Display names for the ROM banks. Defaults to `Kernal, Keymap, Dos, Fat32, Basic, Monitor, Charset, Diag, Graph, Demo, Audio, Util, Bannex, X16Edit1, X16Edit2, Basload`. |
| `romBankSymbols` | string[] | `[]` | Per-bank symbol files that override the defaults. |
| `ramBankNames` | string[] | `[]` | Display names for the RAM banks. |
| `machine` | string | `"CommanderX16"` | Machine to load globals from when there is no `.bmasm` source. |
| `keyboardBuffer` | byte[] | `[]` | Prefill the keyboard buffer. 16 bytes max; the rest are discarded. |
| `mouseBuffer` | byte[] | `[]` | Prefill the mouse buffer. 8 bytes max; the rest are discarded. |
| `nvRam` | [RtcNvram](#rtcnvram) | `{}` | RTC NVRAM contents. |
| `sdCard` | string | `""` | SD card image to start with. |
| `sdCardOutput` | string | `""` | SD card image to write. May end `.gz` or `.zip` to compress. |
| `sdCardFinalOutput` | string | `""` | SD card image to write once emulation finishes. May end `.gz` or `.zip`. |
| `sdCardFiles` | [SdCardFile](#sdcardfiles)[] | `[]` | Files to add to the SD card. Wildcards accepted. Added in the order listed. |
| `cartridge` | string | `""` | Cartridge file to load. |
| `wifi` | bool | `false` | Enable the [WiFi card](/emulator/wificard) at `$9fe0`. |
| `romSource` | [RomSource](#romsource)[] | `[]` | Files to load into ROM banks. |
| `compileOptions` | [CompileOptions](#compileoptions) | `null` | Compilation options. |
| `memoryFillValue` | byte | `0` | Value to fill CPU RAM and VRAM with at startup. |
| `breakpoints` | int[] | `[]` | Addresses to break on at startup. |
| `historySize` | int | `0x800000` | Size of the CPU history buffer. Must be a power of two. |
| `windowScale` | float | `1` | Multiplier for the emulator display window. |
| `basePath` | string | *(workspace folder)* | Base path that other relative paths are resolved against. |
| `files` | [file](#files)[] | `[]` | Additional files to compile and debug. |

## files

Each entry has a `type` of either `bitmagic` or `cc65`, with different fields.

### bitmagic

| Name | Type | Description |
| ---- | ---- | ----------- |
| `type` | `"bitmagic"` | |
| `filename` | string | The `.bmasm` file. |

### cc65

Experimental: see [cc65 Projects](/debugger/cc65) for what's supported.

| Name | Type | Description |
| ---- | ---- | ----------- |
| `type` | `"cc65"` | |
| `outputs` | [Cc65Output](#cc65-output)[] | The binaries ld65 produced, with their load addresses. |
| `objectFiles` | string[] | The `.o` files. |
| `config` | string | The `.cfg` file passed to ld65. |
| `debugFile` | string | The ld65 `--dbgfile` output. |
| `sourcePath` | string | Where the source lives. |
| `includes` | string[] | Include paths. |
| `filemap` | [Cc65FileMap](#cc65-file-map)[] | Path rewrites, applied to paths in the debug file. |
| `basepath` | string | Base path for the cc65 project. |
| `defaultOutputFile` | string | Which of `outputs` is the one to run. |

#### cc65 output

| Name | Type | Description |
| ---- | ---- | ----------- |
| `filename` | string | The produced binary. |
| `startAddress` | int | Address it is loaded at. |
| `default` | bool | This is the binary to run. |
| `hasHeader` | bool | The file has a two-byte load-address header. Default `true`. |
| `referenceFile` | string | A file to compare the generated data against. |

#### cc65 file map

| Name | Type | Description |
| ---- | ---- | ----------- |
| `path` | string | Path prefix to match in the debug file. |
| `replace` | string | What to replace it with. |

## symbols

| Name | Type | Description |
| ---- | ---- | ----------- |
| `symbols` | string | The symbol file. Required. |
| `romBank` | int? | ROM bank the symbols are for. Omit for a non-bank file. If set, symbols outside the ROM area are discarded. |
| `ramBank` | int? | RAM bank the symbols are for. Omit for a non-bank file. If set, symbols outside the RAM area are discarded. |
| `filename` | string | X16 filename the symbols belong to. Omit if not for an X16 binary. |
| `rangeDefinitions` | [RangeDefinition](#range-definition)[] | Memory ranges that are jump tables, used to synthesise extra symbols. |

### Range definition

| Name | Type | Description |
| ---- | ---- | ----------- |
| `start` | string | Start address of the jump table. |
| `end` | string | End address of the jump table. |
| `type` | string | Only `jumptable` is supported. |

### About symbol files

A `.sym` file is the cc65 / VICE label format: one `al <hex address> .<name>` per line. `ld65 -Ln game.sym` produces one for a cc65 build, and the x16-rom build produces one per ROM bank (`kernal.sym`, `basic.sym`, and so on).

Set `emulatorDirectory` to an X16 emulator checkout and the ROM-bank symbol files are picked up automatically, named from `romBankNames`. A symbol at `$c000` or above needs `romBank` set; one in `$a000` to `$bfff` needs `ramBank`; symbols in the wrong area for the bank are dropped.

`rangeDefinitions` names ranges of `jmp` instructions, such as the KERNAL jump table. The debugger follows each `jmp` and gives its target a symbol, so calls made through the table decompile with names.

## sdCardFiles

| Name | Type | Description |
| ---- | ---- | ----------- |
| `source` | string | File(s) on the host. Wildcards and directories accepted. |
| `dest` | string | Destination directory on the SD card. |
| `allowOverwrite` | bool | Allow overwriting files already on the card. Default `true`. |

## rtcNvram

| Name | Type | Description |
| ---- | ---- | ----------- |
| `file` | string | File to load into `0x00` to `0x60` of the RTC NVRAM. Ignored if `data` is set. |
| `data` | byte[] | Bytes to load into `0x00` to `0x60` of the RTC NVRAM. |
| `writeFile` | string | File to write the RTC NVRAM to at the end. Overwrites. |

## romSource

| Name | Type | Description |
| ---- | ---- | ----------- |
| `filename` | string | File to load. |
| `bank` | int | ROM bank to load it into. |
| `address` | string \| int | Address within the bank. Default `"0"`. |

## compileOptions

| Name | Type | Description |
| ---- | ---- | ----------- |
| `displayVariables` | bool | List all names and their values. |
| `displaySegments` | bool | List the segments. |
| `displaySymbols` | bool | Log symbol loading. |
| `displayCode` | bool | Show generated code. |
| `displayData` | bool | Show generated data. |
| `rebuild` | bool | Force a full rebuild. |
| `binFolder` | string | Folder for the built template assemblies. If omitted, generated files land directly in the project's base path rather than a `bin` subfolder; the scaffolded project sets this to `bin` explicitly. |
| `saveGeneratedBmasm` | bool | Write the generated `.bmasm` to the bin folder. Default `true`. |
| `saveGeneratedTemplate` | bool | Write the generated template C# to the bin folder. Default `false`. |
| `savePreGeneratedTemplate` | bool | Write the pre-template intermediate to the bin folder. Default `false`. |
| `warnOnBranchOverPage` | bool | Warn when a branch crosses a page boundary. |
