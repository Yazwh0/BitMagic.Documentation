# BitMagic - The Debugger

[![Build](https://github.com/Yazwh0/BitMagic/actions/workflows/build-test.yml/badge.svg)](https://github.com/Yazwh0/BitMagic/actions/workflows/build-test.yml)

The debugger is an application that supports [DAP](https://microsoft.github.io/debug-adapter-protocol/overview) to allows developers to use applications such as VSCode to develop applications for the Commander X16.

Currently only Windows is supported. In theory this could run on any x64 system which dotnet can target, but without the ability to test on these machines I cannot offer support to them currently.

## Installation

You can obtain the VSCode extension from the extensions market place. Simply search for `BitMagic` and click install.

For legal reasons, you will need to obtain your own copy of the [Rom](Rom.md).

## Getting Started

The easiest way to get something working is to create a `project.json` file as follows:

```json
{
    "source": "",
    "machine" : "CommanderX16R42",
    "ramBankNames" : [ "Kernel_Ram" ]
}
```

Then, go to the debug and run screen, click on `create a launch file`, and then on `BitMagic X16 ASM Debugger`.

![Debug and Run](Images/DebugAndRun.png)

This will create a `launch.json`. Hit `F5` to run, and type `project.json`. A emulator window should then appear and VSCode should give you an interactive debugging session.

If you don't want to enter the filename of what to debug each time, change the `program` entry in `project.json` by replacing `${command:AskForProgramName}` with the initial filename.

![Debugger Running](Images/DebuggerRunning.png)

## Watches and Breakpoint

BitMagic has support for conditional breakpoints, log points, hit count breakpoints and extensive Watches.

Please see the [Watches and Breakpoints](Debugger/WatchesBreakpoints.md) page for more information.

![LogPoint](Images/Logpoint.gif)

## Kernel Symbols

The best way to run the debugger is with Kernel symbols. To do this, you'll need to get hold of them but they should be included with whichever means you've obtained the Rom.

If the symbols are in `c:\Documents\Source\x16-rom\build\x16`, then you can replace your `project.json` with the follow which will decorate the disassembled code with symbols, making Rom debugging much easier!

```json
{
    "source": "",
    "machine" : "CommanderX16R42",
    "ramBankNames" : [ "Kernel_Ram" ],
    "romFile" : "C:\\Documents\\Source\\x16-rom\\build\\x16\\rom.bin",
    "symbols": [
        {
            "name": "C:\\Documents\\Source\\x16-rom\\build\\x16\\kernal.sym",
            "romBank": 0,
            "RangeDefinitions" : [
                {
                    "type" : "jumpTable",
                    "Start" : "0xFEBD",
                    "End" : "0xFF80"                    
                },                
                {
                    "Start" : "0xFF81",
                    "End" : "0xFFF6"
                }
            ]
        },
        {
            "name": "C:\\Documents\\Source\\x16-rom\\build\\x16\\keymap.sym",
            "romBank": 1
        },
        {
            "name": "C:\\Documents\\Source\\x16-rom\\build\\x16\\dos.sym",
            "romBank": 2,
            "RangeDefinitions" : [
                {
                    "type" : "jumpTable",
                    "Start" : "0xc000",
                    "End" : "0xc036"
                }
            ]
        },
        {
            "name": "C:\\Documents\\Source\\x16-rom\\build\\x16\\geos.sym",
            "romBank": 3
        },
        {
            "name": "C:\\Documents\\Source\\x16-rom\\build\\x16\\basic.sym",
            "romBank": 4
        },
        {
            "name": "C:\\Documents\\Source\\x16-rom\\build\\x16\\monitor.sym",
            "romBank": 5
        },
        {
            "name": "C:\\Documents\\Source\\x16-rom\\build\\x16\\charset.sym",
            "romBank": 6
        },
        {
            "name": "C:\\Documents\\Source\\x16-rom\\build\\x16\\codex.sym",
            "romBank": 7
        },
        {
            "name": "C:\\Documents\\Source\\x16-rom\\build\\x16\\graph.sym",
            "romBank": 8
        },
        {
            "name": "C:\\Documents\\Source\\x16-rom\\build\\x16\\audio.sym",
            "romBank": 10
        }
    ]
}
```

## Project File

While its possible to start debug a `.bmasm` file directly, it is better to use a project file. This is a `.json` file that defines how the debugger sets up the system for you're requirements.

The schema is below:

```c#
public class X16DebugProject
{
    /// <summary>
    /// Start the application in stepping mode.
    /// </summary>
    [JsonProperty("startStepping", DefaultValueHandling = DefaultValueHandling.Ignore)]
    public bool StartStepping { get; set; } = true;

    /// <summary>
    /// Main source file.
    /// </summary>
    [JsonProperty("source", DefaultValueHandling = DefaultValueHandling.Ignore)]
    public string Source { get; set; } = "";

    /// <summary>
    /// Directly run the compiled code, or if false compile the source and add it as a file to the SDCard.
    /// </summary>
    public bool RunSource { get; set; } = false;

    /// <summary>
    /// Location to save the .prg from the source file on the host. (Not on the sdcard.)
    /// </summary>
    public string SourcePrg { get; set; } = "";

    /// <summary>
    /// Start address. If omitted or -1, will start the ROM normally from the vector at $fffc.
    /// </summary>
    [JsonProperty("startAddress", DefaultValueHandling = DefaultValueHandling.Ignore)]
    public int StartAddress { get; set; } = -1;

    /// <summary>
    /// ROM file to use.
    /// </summary>
    [JsonProperty("romFile", DefaultValueHandling = DefaultValueHandling.Ignore)]
    public string RomFile { get; set; } = "";

    /// <summary>
    /// List of files that can be imported for symbols.
    /// </summary>
    [JsonProperty("symbols", DefaultValueHandling = DefaultValueHandling.Ignore)]
    public SymbolsFile[] Symbols { get; set; } = Array.Empty<SymbolsFile>();

    /// <summary>
    /// Show DAP messages between calling host and debugger.
    /// </summary>
    [JsonProperty("showDAPMessage", DefaultValueHandling = DefaultValueHandling.Ignore)]
    public bool ShowDAPMessages { get; set; } = false;

    /// <summary>
    /// Display names for the Rom banks.
    /// </summary>
    public string[] RomBankNames { get; set; } = new string[] { "Kernel", "Keyboard", "Dos", "Geos", "Basic", "Monitor", "Charset", "Codex", "Graph", "Demo", "Audio" };

    /// <summary>
    /// Display names for the Ram banks.
    /// </summary>
    public string[] RamBankNames { get; set; } = Array.Empty<string>();

    /// <summary>
    /// Machine to load globals from if there is no bmasm source.
    /// </summary>
    public string Machine { get; set; } = "";

    /// <summary>
    /// Prefill the keyboard buffer with this data. 16bytes max, rest are discarded.
    /// </summary>
    public byte[] KeyboardBuffer { get; set; } = new byte[] { };

    /// <summary>
    /// Prefill the mouse buffer with this data. 8bytes max, rest are discarded.
    /// </summary>
    public byte[] MouseBuffer { get; set; } = new byte[] { };

    /// <summary>
    /// RTC NvRam Data
    /// </summary>
    public RtcNvram NvRam { get; set; } = new RtcNvram();

    /// <summary>
    /// Files to add to the root directory of the SDCard. Wildcards accepted.
    /// </summary>
    public string[] SdCardFiles = new string[] { };

    /// <summary>
    /// Capture changes between every time the emulator is paused. (Eg breakpoints or stepping)
    /// </summary>
    public bool CaptureChanges { get; set; } = false;    
}

public class RtcNvram
{
    /// <summary>
    /// Filename to load into 0x00 -> 0x60 in the RTCs NVRAM.
    /// Not used if Data has values.
    /// </summary>
    public string File { get; set; } = "";

    /// <summary>
    /// Data to load into 0x00 -> 0x60 in the RTCs NVRAM.
    /// </summary>
    public byte[] Data { get; set; } = new byte[] { };

    /// <summary>
    /// Filename to store the RTCs NVRAM in. This will overwrite.
    /// </summary>
    public string WriteFile { get; set; } = "";
}

public class SymbolsFile
{
    /// <summary>
    /// File name.
    /// </summary>
    [JsonProperty("name", DefaultValueHandling = DefaultValueHandling.Ignore, Required = Required.Always)]
    public string Name { get; set; } = "";

    /// <summary>
    /// ROM bank that the symbols are for. Omit or not a rombank file. Any symbols in the ROM area will be discarded.
    /// </summary>
    [JsonProperty("romBank", DefaultValueHandling = DefaultValueHandling.Ignore)]
    public int? RomBank { get; set; }

    /// <summary>
    /// RAM bank that the symbols are for. Omit for not a rambank file. Any symbols in the RAM area will be discarded.
    /// </summary>
    [JsonProperty("ramBank", DefaultValueHandling = DefaultValueHandling.Ignore)]
    public int? RamBank { get; set; }

    /// <summary>
    /// Range of memory that is a jump table. Used to create extra symbols.
    /// </summary>
    public RangeDefinition[] RangeDefinitions { get; set; } = Array.Empty<RangeDefinition>();
}

public class RangeDefinition
{
    /// <summary>
    /// Start address of the jump table
    /// </summary>
    public string Start { get; set; } = "";

    /// <summary>
    /// End address of the jump table
    /// </summary>
    public string End { get; set; } = "";

    /// <summary>
    /// Type of definition, supported : 'jumptable'
    /// </summary>
    public string Type { get; set; } = "jumptable";
}
```

## Upcoming Features

The following features are not yet implemented but are planned to be:

- File system hooks so the a `.prg` can be loaded via the kernel and debugged as you'd expect. [Issue](https://github.com/Yazwh0/BitMagic/issues/7)
- Improved SDCard support inline with the Emulator.
- Breakpoints on data changes. (Need to explore how we'd do this with DAP.)
- Template Engine support. [Issue](https://github.com/Yazwh0/BitMagic/issues/2)
- Cartridge support. [Issue](hhttps://github.com/Yazwh0/BitMagic/issues/1)
