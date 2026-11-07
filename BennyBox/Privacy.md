---
layout: page
title: Benny Box Privacy Policy
permalink: /bennybox/privacy
description: What the Benny Box media player for Windows and Android stores, and who it talks to.
sitemap: false
---
# Benny Box Privacy Policy

_Last updated: 7 November 2026_

Benny Box is a media player for Windows and Android. It plays content from sources you add yourself (M3U playlists, Xtream Codes accounts, Jellyfin servers, SFTP servers and local folders). It doesn't come with any channels or content of its own.

I don't collect any personal data from the app. There are no accounts, no analytics, no advertising and no crash reporting.

## What the app stores

Everything stays on your device:

- The profiles you add: server addresses, usernames and passwords (or API keys). Passwords and keys are encrypted with the operating system's own key store (Windows DPAPI, or the Android Keystore).
- Your channel lists, programme guide, favourites, watch history, playback positions, downloads and settings.

None of this is sent to me or anyone else.

## Who the app talks to

The app only connects to:

- **The servers you add**, to fetch playlists, guides and streams. Those servers' own privacy policies apply to what they receive.
- **The Movie Database (TMDb)**, to look up posters and descriptions for films and shows that don't have their own. Only titles are sent, never your credentials. See [TMDb's privacy policy](https://www.themoviedb.org/privacy-policy).
- **GitHub**, to check whether a newer version is available (Windows, and Android when installed directly rather than from Google Play). This can be switched off in Settings. See [GitHub's privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).
- **Channel logo addresses** given in your playlists.

## QR code setup

The Windows app can show a QR code that copies your profiles to the Android app. The QR code contains your passwords, so treat it like the passwords themselves. It's shown on screen only and never uploaded anywhere.

On Android, the QR code is scanned with the code scanner built into Google Play services. The app doesn't get access to the camera itself; it only receives the text of the scanned code. Google's handling of the scanner is covered by [Google's privacy policy](https://policies.google.com/privacy).

## Google Play

If you install Benny Box from Google Play, Google handles the download, updates and any data it collects as part of that, under [Google's privacy policy](https://policies.google.com/privacy). I don't receive any of it beyond the anonymous, aggregated install and crash statistics Play Console shows every developer.

## Deleting your data

Deleting a profile removes it and its content from the device. Uninstalling the app removes everything.

## Children

Benny Box isn't aimed at children and doesn't knowingly collect data from anyone.

## Changes

If this policy changes, the new version will be posted on this page with a new date.

## Contact

If you have questions about this policy, open an issue at <https://github.com/Yazwh0/bennybox/issues>.
