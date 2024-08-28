---
title: Project File
layout: page
permalink: /debugger/projectfile
---

## Project File

Using a project file is the easiest way to control your project.

It is a standard `json` file. The extension has embedded json schema definition to aid editing.

## Definition

The following properties can be used:

| Name | Type | Description |
| -- | -- | -- |
| StartStepping | boolean | Start the debugging stepping. |
| Source | string | Main source file. |
| DirectRun | bool | Directly run the compiled code, or if false compile the source and add it as a file to the SD Card. |
| AutobootRun | bool | Run the main application by creating a `AUTOBOOT.X16` file. This will not overwrite if the file already exists. |
| OutputFolder | string | Location to save the .prg and other files from the source file on the host. (Not on the sdcard.) |
| StartAddress | int | Start address. If omitted or -1, will start the ROM normally from the vector at $fffc. |
| RomFile | string | Override the default ROM file to use. |
| EmulatorDirectory | string | Folder for the official X16 Emulator. The rom.bin file from this directory will be used if not set by RomFile. Symbols for the ROM banks will also be loaded from here, using the names from RomBankNames + .sym extension. |
| Symbols | [SymbolsFile](#sd-card-file)[] | List of files that can be imported for symbols. |
| RomBankNames | string[] | Display names for the Rom banks. |
| RamBankNames | string[] | Display names for the Ram banks. |
| Machine | string | Machine to load globals from if there is no bmasm source. |
| KeyboardBuffer | byte[] | Prefill the keyboard buffer with this data. 16bytes max, rest are discarded. |
| MouseBuffer | byte[] | Prefill the mouse buffer with this data. 8bytes max, rest are discarded. |
| NvRam | [RtcNvram](#rtc-nvram) | RTC NvRam Data. |
| SdCard | string | SD Card image to start with. |
| SdCardFiles | [SdCardFile](#sd-card-file)[] | Files to add to the root directory of the SD Card. Wildcards accepted. |
| Cartridge | string | Cartridge file to load. |
| CompileOptions | [CompileOptions](#compile-options) | Compilation Options. |
| MemoryFillValue | byte | Value to fill CPU RAM and VRAM with at startup. |
| BasePath | string | Base Path, should try to use this for all other paths. |
| Files | [DebugProjectFile](#debug-project-file) | Files to be debugged. |

### SD Card File

Files are added in order that they are included within the `project.json` file.

| Name | Type | Description |
| -- | -- | -- |
| Source | string | File selection on the local machine. Wildcards and directories accepted. |
| Dest | string | Location on the SDCard to place the files. |
| AllowOverwrite | bool | Allow overwriting of files on the SDCard. |

### Symbols File

| Name | Type | Description |
| -- | -- | -- |
| Symbols | string | Filename for the symbols file. |
| RomBank | int? | ROM bank that the symbols are for. Omit if not a rombank file. If set any symbols in the ROM area will be discarded. |
| RamBank | int? | RAM bank that the symbols are for. Omit if not a rambank file. If set any symbols in the RAM area will be discarded. |
| Filename | string | X16 Filename that the symbols are for. Omit if not a X16 binary. |
| RangeDefinitions | [RangeDefinition](#range-definition)[] | Range of memory that is a jump table. Used to create extra symbols. |

### Range Definition

| Name | Type | Description |
| -- | -- | -- |
| Start | string | Start address of the jump table. |
| End | string | End address of the jump table. |
| Type | string | Type of definition, supported : 'jumptable' |

### Rtc Nvram

| Name | Type | Description |
| -- | -- | -- |
| File | string | Filename to load into 0x00 -> 0x60 in the RTCs NVRAM. Not used if `Data` has values. |
| Data | byte[] | Data to load into 0x00 -> 0x60 in the RTCs NVRAM. |
| WriteFile | string | Filename to store the RTCs NVRAM in. This will overwrite. |

### Debug Project File

Debug Project Files have different properties depending on the `Type`.

#### Bitmagic Input File

| Name | Type | Description |
| -- | -- | -- |
| Type | **bitmagic** | Defines the input file as a BitMagic input file. |
| Filename | string | Filename of the `.bmasm` file. |

#### Cc65 Input File

| Name | Type | Description |
| -- | -- | -- |
| Type | **cc65** | Defines the input file as a Cc65 input file. |
| Filename | string | `.prg` file that was produced by cc65. |
| ObjectFile | string | `.o` file that was produced by cc65. |
| Config | string | `.cfg` file that was used by cc65 to link the output files. |
| SourcePath | string | Path to where the source code is located. |
| StartAddress | int | Address where the `.prg` will be loaded. |
| Includes | string[] | Included files. |
| BasePath | string | Base path for the cc65 project. |

### Compile Options

| Name | Type | Description |
| -- | -- | -- |
| DisplayVariables | bool | Display all the variables and their values. |
| DisplaySegments | bool | Display segments. |
| DisplayCode | bool | Display generated code. |
| DisplayData | bool | Display generated data. |
| Rebuild | bool | Force rebuild. |
| BinFolder | string | Bin folder for the dlls. |
