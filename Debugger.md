# BitMagic - The Debugger

[![Build](https://github.com/Yazwh0/BitMagic/actions/workflows/build-test.yml/badge.svg)](https://github.com/Yazwh0/BitMagic/actions/workflows/build-test.yml)

The debugger is an application that supports [DAP](https://microsoft.github.io/debug-adapter-protocol/overview) to allows developers to use applications such as VSCode to develop applications for the Commander X16.

## Installation

As the VSCode extension is not yet published, the steps are a little more complex than they will eventually be.

Download the Debugger from the latest build action on [Github](https://github.com/Yazwh0/BitMagic/actions).

Obtain a copy of the [Rom](Rom.md).

Clone the [VSC Extension](https://github.com/Yazwh0/BitMagic.VSC) project.

At this point you can either open the VSC Extension within VSCode and run it. It will spawn another VSCode instance in which you can try out the debugger. Or run the batch app `create_extension.bat` which will build and install the `.vsix` to your copy of VSCode.

## Getting Started

Currently the debugger only works via TCP/IP, so it needs to be started manually. This will change in later version, but it helps with debugging the debugger.

To do this use:

`x16d --port 2563`

We now need a project to run. Open VSCode in an empty folder.

Create a `project.json` file as follows:

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

The best way to start the debugger is to pass it a project file, and example of which is above. This is a `.json` file that defines how the debugger sets up the system.

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
    /// Start address. If ommitted or -1, will start the ROM normally from the vector at $fffc.
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

    public RtcNvram NvRam { get; set; } = new RtcNvram();

    /// <summary>
    /// Files to add to the root directory of the SDCard. Wildcards accepted.
    /// </summary>
    public string[] SdCardFiles = new string[] { };
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
    /// Type of defintion, supported : 'jumptable'
    /// </summary>
    public string Type { get; set; } = "jumptable";
}
```

## Upcoming Features

The following features are not yet implemented but are planned to be:

- Use StdIn\Out so an instance doesn't need to be running. [Issue](https://github.com/Yazwh0/BitMagic.X16Debugger/issues/1)
- File system hooks so the a `.prg` can be loaded via the kernel and debugged as you'd expect. [Issue](https://github.com/Yazwh0/BitMagic.X16Debugger/issues/2)
- Improved SDCard support inline with the Emulator.
- Step Out. [Issue](https://github.com/Yazwh0/BitMagic.X16Debugger/issues/3)
- Watches. [Issue](https://github.com/Yazwh0/BitMagic.X16Debugger/issues/4)
- Breakpoints on data changes. (Need to explore how we'd do this with DAP.)
- Conditional Breakpoints. [Issue](https://github.com/Yazwh0/BitMagic.X16Debugger/issues/5)
- Logpoints. [Issue](https://github.com/Yazwh0/BitMagic.X16Debugger/issues/6)
- Template Engine support. [Issue](https://github.com/Yazwh0/BitMagic.X16Debugger/issues/7)
- Cartridge support. [Issue](https://github.com/Yazwh0/BitMagic.X16Debugger/issues/8)
