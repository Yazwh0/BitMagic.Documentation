---
layout: page
title: WiFi Card
permalink: /emulator/wificard
description: How BitMagic emulates the Commander X16's serial UART, runs the WiFi card firmware behind it, and which parts are not modelled.
---
# WiFi Card

BitMagic emulates the [TL16C2550](https://www.ti.com/lit/ds/symlink/tl16c2550.pdf) UART that the X16's serial port is built on. There is no emulated modem behind it: the card's own firmware, [ZiModem](https://github.com/bozimmerman/Zimodem), is compiled and run as a library, and bytes moving through the UART's data register are handed to it and back. The modem control and status side of the UART, the part that would carry DTR, RTS, CTS, DSR, DCD and RI, is not emulated.

This currently ships only in the develop release. Turn on `bitMagic.debugger.developRelease` in [Settings](/settings#debugger) to get it.

The wifi card is not enabled by default, so it needs to be turned on separately. Set `"wifi": true` in your [project file](/debugger/projectfile) to enable it.

![RomTerm running over the WiFi card](/Images/RomTerm.gif)

## What it is

- A [TL16C2550](https://www.ti.com/lit/ds/symlink/tl16c2550.pdf) UART, mapped at `$9fe0` to `$9fe7`, with 16-byte transmit and receive FIFOs.
- Behind that UART, the actual [ZiModem](https://github.com/bozimmerman/Zimodem) firmware, compiled as a library and run on a background thread. It is the same code the real WiFi modem runs, not a reimplementation.
- Because it is the real firmware, the AT command set, dialling, telnet and raw TCP, TLS, the phonebook, and the xmodem, ymodem, zmodem, kermit and punter transfer protocols all work the way they do on hardware.
- Network access uses your host machine's connection through the firmware's host layer.

## What it isn't

- It doesn't emulate the WiFi radio itself. ZiModem's networking goes straight to your host's network layer instead, so there's no access point scan and no signal strength.
- It isn't both channels. The TL16C2550 is a dual UART: one channel drives ZiModem, the other is wired to the card's serial port. BitMagic emulates only the ZiModem channel; the serial channel is not implemented.

Only one card can be enabled, even though real hardware can have several. The modem firmware is the real ESP32 sketch, and that code assumes it is the only thing running on the chip: its serial port, GPIO pins, filesystem and logging are all process-global. BitMagic runs it as a library, but the global state is still global, so a second instance would trample the first. Creating the modem is therefore a one-per-process operation.

## The UART registers

Register names and bit definitions are from the [TL16C2550 datasheet](https://www.ti.com/lit/ds/symlink/tl16c2550.pdf). Several addresses read as one register and write as another, and `$9fe0` / `$9fe1` change meaning with the divisor latch access bit (DLAB, LCR bit 7).

| Address | DLAB | Read | Write |
| ------- | ---- | ---- | ----- |
| `$9fe0` | 0 | RBR, receiver buffer | THR, transmit holding |
| `$9fe0` | 1 | DLL, divisor latch low | DLL, divisor latch low |
| `$9fe1` | 0 | IER, interrupt enable | IER, interrupt enable |
| `$9fe1` | 1 | DLM, divisor latch high | DLM, divisor latch high |
| `$9fe2` | x | IIR, interrupt identification | FCR, FIFO control |
| `$9fe3` | x | LCR, line control | LCR, line control |
| `$9fe4` | x | MCR, modem control | MCR, modem control |
| `$9fe5` | x | LSR, line status | ignored (read only) |
| `$9fe6` | x | MSR, modem status | ignored (read only) |
| `$9fe7` | x | SCR, scratch | SCR, scratch |

### RBR / THR ($9fe0, DLAB = 0)

Read pulls the next byte from the 16-byte receive FIFO; write queues a byte in the 16-byte transmit FIFO. Both emulated.

### DLL / DLM ($9fe0 and $9fe1, DLAB = 1)

The 16-bit baud divisor, low byte then high byte. Writing either recalculates the byte timing (see [Baud rate and throughput](#baud-rate-and-throughput)). DLL is effectively write-only: a read of `$9fe0` returns the receive FIFO, not the divisor. DLM reads back the value written. BitMagic uses `divisor = 921600 / baud`; the chip's own formula is `XIN / (baud * 16)`.

### IER ($9fe1, DLAB = 0)

| Bit | Function | Emulated |
| --- | -------- | -------- |
| 0 | Received-data-available interrupt enable | Yes |
| 1 | Transmit-holding-register-empty interrupt enable | Yes |
| 2 | Receiver-line-status interrupt enable | No |
| 3 | Modem-status interrupt enable | No |
| 4 to 7 | Unused | Yes, forced to 0 |

### IIR, read ($9fe2)

BitMagic does not implement the datasheet's encoded identification field. IIR here is a plain bitfield: bit 0 is set while a received-data-available condition is pending, bit 1 while a transmit-holding-register-empty condition is pending, and every other bit stays 0. There is no priority encoding, the datasheet's active-low "interrupt pending" bit 0 is not honoured, the FIFO-enabled bits 6 and 7 are never set, and the codes for the three unemulated sources do not exist. A driver that reads IIR expecting the standard TL16C2550 layout will misread it.

| IIR here | Condition | Datasheet code |
| -------- | --------- | -------------- |
| bit 0 set | Received data available, trigger level reached | `0100` |
| bit 1 set | Transmit holding register empty | `0010` |
| both clear | Nothing pending | `0001` |

### FCR, write ($9fe2)

| Bit | Function | Emulated |
| --- | -------- | -------- |
| 0 | Enable the FIFOs | Yes |
| 1 | Clear the receive FIFO | Yes |
| 2 | Clear the transmit FIFO | Yes |
| 3 | DMA mode select | No |
| 4 to 5 | Reserved | n/a |
| 6 to 7 | Receive FIFO trigger level (1, 4, 8, 14) | Yes |

### LCR ($9fe3)

The written byte is stored and reads back, but only bit 7 has any effect.

| Bit | Function | Emulated |
| --- | -------- | -------- |
| 0 to 1 | Word length, 5 to 8 bits | No |
| 2 | Stop bits | No |
| 3 | Parity enable | No |
| 4 | Even parity select | No |
| 5 | Stick parity | No |
| 6 | Break control | No |
| 7 | Divisor latch access (DLAB) | Yes |

### MCR ($9fe4)

Writes are stored with bit 2 forced to 0, but nothing acts on them. Reads return the stored value.

| Bit | Function | Emulated |
| --- | -------- | -------- |
| 0 | DTR output | No |
| 1 | RTS output | No |
| 2 | OUT1 | No |
| 3 | OUT2, gates the interrupt output | No |
| 4 | Local loopback | No |
| 5 | Auto-flow-control enable | No |
| 6 to 7 | Unused | n/a |

### LSR, read ($9fe5)

There is no transmitter shift register, so bit 6 always equals bit 5. On real hardware TEMT lags THRE by up to one character time while the last byte clocks out of the shift register; here they set and clear together.

| Bit | Function | Emulated |
| --- | -------- | -------- |
| 0 | Data ready | Yes |
| 1 | Overrun error | No |
| 2 | Parity error | No |
| 3 | Framing error | No |
| 4 | Break interrupt | No |
| 5 | Transmit holding register empty (THRE) | Yes |
| 6 | Transmitter empty (TEMT) | Tracks bit 5 |
| 7 | An error is in the receive FIFO | No, always 0 |

### MSR, read ($9fe6)

CTS and DSR are held asserted, RI and DCD held clear, regardless of the modem's real state. The change bits (0 to 3) are cleared on every read, as the datasheet describes, but nothing ever sets them, so MSR reads as `$30` at all times.

| Bit | Function | Emulated |
| --- | -------- | -------- |
| 0 | Change in CTS | No |
| 1 | Change in DSR | No |
| 2 | Trailing edge of RI | No |
| 3 | Change in DCD | No |
| 4 | CTS | Fixed asserted |
| 5 | DSR | Fixed asserted |
| 6 | RI | Fixed clear |
| 7 | DCD | Fixed clear |

### SCR ($9fe7)

Scratch byte with no effect on anything else. Holds whatever is written and returns it. Emulated.

## Talking to it

The FIFO data path is the part you use day to day. A minimal poll loop:

{% include generated/wificard-poll-loop.html %}

## Interrupts

The TL16C2550 has four prioritised interrupt levels, and priority 2 covers two separate conditions. Two of the five are emulated.

| Priority | Source | Shown in IIR as | IER bit | Emulated |
| -------- | ------ | --------------- | ------- | -------- |
| 1 | Receiver line status (overrun, parity, framing, break) | nothing | 2 | No |
| 2 | Received data available | bit 0 | 0 | Yes |
| 2 | Character time-out | nothing | 0 | No |
| 3 | Transmit holding register empty | bit 1 | 1 | Yes |
| 4 | Modem status (change in CTS, DSR, RI, DCD) | nothing | 3 | No |

IIR is a bitfield, not the datasheet's encoded identification field: bit 0 for received data available, bit 1 for transmit holding register empty, and nothing else. The three unemulated sources have no representation in it, and there is no priority encoding, no active-low pending bit, and no FIFO-enabled bits. See [IIR](#the-uart-registers). IER bits 2 and 3 are stored and read back, but setting them has no effect.

### Received data available

Level triggered. It follows the FIFO count against the trigger level set in FCR, so it re-asserts for as long as the FIFO is at or above the trigger, and clears once a read drops the count below it.

### Transmit holding register empty

Edge triggered. It fires once when the transmit FIFO drains to empty, or immediately if you enable it while the FIFO is already empty. Acknowledge it by reading IIR or by writing THR.

### The IRQ line

IER only gates whether a pending source pulls the CPU's IRQ line. The matching condition in IIR is set regardless of IER, so IIR can be polled with interrupts disabled.

## Baud rate and throughput

The divisor latch is reached through LCR bit 7, with the low byte at `$9fe0` and the high byte at `$9fe1`. The divisor sets the UART's baud rate. Throughput is that rate divided by the number of bits per word: one start bit, the data bits, an optional parity bit, and the stop bits. The emulator uses that bit count to time how often a byte moves through the FIFO, so a slower rate or a wider word delivers bytes less often.

BitMagic derives the divisor as `921600 / baud`. ZiModem starts at 115200, so to match it the UART needs a divisor of `921600 / 115200 = 8`:

{% include generated/wificard-baud-rate.html %}

Slower rates need a larger divisor: 9600 baud is `921600 / 9600 = 96` (`$60`, `$00`), and 1200 baud is `768` (`$00`, `$03`).

Two things are not wired up yet: the word format is taken as 8N1 rather than read from LCR, and the rate is never checked against what ZiModem is running at. See [Not emulated](#not-emulated).

## Not emulated

ZiModem only uses the FIFO data path, and that part is complete, so nothing here stops the modem working. The gaps are around it. The [register](#the-uart-registers) and [interrupt](#interrupts) tables mark each bit and source; this is what the missing pieces mean in practice.

- **Line config drift.** The UART's rate and word format, and the rate ZiModem is running at, are tracked separately and never reconciled. The word format is not read from LCR, so framing is always timed as 8N1. The rates are never compared, so a mismatch that would corrupt data on real hardware passes through clean here. The trap: an AT command can move the modem's rate to a value your code does not know, and there is no way to resynchronise from the X16 side short of resetting the card. This one should be fixed.
- **No modem control or status lines.** The whole DTR, RTS, CTS, DSR, DCD and RI plane is absent. MCR writes do nothing; MSR holds CTS and DSR asserted and RI and DCD clear. So dropping DTR to hang up (`AT&Dn`) has no effect, DCD never shows whether a call is up, and there is no ring indication.
- **No hardware flow control.** RTS and CTS are not wired to the modem. BitMagic never overruns its own receive FIFO, because it only pulls a byte when there is room, so nothing is lost in normal use. If your code puts the modem into RTS/CTS flow control, the firmware's send path can stall waiting for a CTS that is never driven.
- **No line-status, time-out or modem-status interrupts.** Only received-data-available and transmit-holding-empty fire. An IRQ handler that relies on line errors, the receive time-out, or a modem-line change will never run; poll instead.
- **Non-standard IIR.** IIR is a simple bitfield, bit 0 for received data and bit 1 for transmit empty, not the encoded identification field the datasheet describes. A stock UART driver's interrupt dispatch, which decodes the priority field and treats bit 0 as active-low, will not work against it.
- **No line errors.** Overrun, parity, framing and break are never reported in LSR. Inbound overrun cannot happen by design; outbound overrun silently drops the extra byte.
- **No transmitter shift register.** LSR bit 6 (TEMT) just mirrors bit 5 (THRE). Code that waits on TEMT to know the last byte has left the wire is told so up to one character time early.
- **No break signalling.** LCR bit 6 does not force a TX break, and a received break is not flagged.
- **No loopback.** MCR bit 4 does nothing, so a driver's local self-test will not pass.
