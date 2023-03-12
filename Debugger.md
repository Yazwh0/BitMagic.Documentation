# BitMagic - The Debugger

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
