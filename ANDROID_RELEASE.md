# Releasing the Android application

The Android app is the same build as the site, wrapped by Capacitor. It is assembled by
`.github/workflows/android.yml`, started by hand or by a version tag, and this file is about the one
part of that a runner cannot do by itself: the key a release is signed with.

## Why a release is signed

A device refuses to install an APK that carries no signature, and the debug key that a laptop build
uses is a key every debug build anywhere shares. So a release is signed with a key of this project's
own, kept in repository secrets and never in the repository: anybody with the key can sign an update
that a device will accept as coming from this app.

That cuts both ways, and it is worth knowing before the first tag. **If the key is lost, no device
that installed the app will accept an update signed with a different one**, and the application has
to be installed fresh under a new identity. Two backups and the passwords are not optional.

## Making the key, once

Any JDK 21 can do it, including the one bundled with Android Studio. Run this where the keystore
should live, which is outside this repository:

```bash
keytool -genkeypair -v \
  -keystore africaquest-release.keystore \
  -alias africaquest \
  -keyalg RSA -keysize 4096 -validity 10000
```

It asks for a password for the keystore, the same password again, a name and an organisation (the
answers are in the certificate and a device may show them), and a password for the key itself.
Keeping the two passwords the same is fine, and the secrets below are set to the same value in that
case. Then:

- put the keystore somewhere it will survive this machine, twice
- put the passwords wherever the rest of the project's secrets are kept
- do not commit any of it. `android/.gitignore` already refuses `*.keystore` and `*.jks`

## Putting it in the repository, once

A workflow secret is text, so the keystore travels as base64. On Windows, where this project is
made, in PowerShell:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("$HOME\africaquest-release.keystore")) |
  Out-File -NoNewline -Encoding ascii africaquest-release.keystore.base64
```

On macOS or Linux the same file comes from
`base64 -w 0 africaquest-release.keystore > africaquest-release.keystore.base64`.

Then the four secrets, from the repository root, with the GitHub CLI signed in:

```bash
gh secret set ANDROID_KEYSTORE_BASE64 < africaquest-release.keystore.base64
gh secret set ANDROID_KEYSTORE_PASSWORD
gh secret set ANDROID_KEY_ALIAS
gh secret set ANDROID_KEY_PASSWORD
```

`gh` asks for the three values without echoing them, so nothing lands in a shell history. Delete the
base64 file when the secrets are set: it is the key in a form anybody can decode.

The names are the ones `android/app/build.gradle` reads from the environment, and the workflow is
the only place they are set: the key is decoded into the runner's temporary directory, which is
thrown away with the machine, and no step ever prints any of the four.

## What a version tag does

Pushing a tag of the form `v<major>.<minor>.<patch>` starts the build, and on that tag:

1. `scripts/android-version.mjs` turns the tag into the two numbers Android reads. The name is the
   tag without its `v`, and the integer is `major * 10000 + minor * 100 + patch`, so v1.2.3 installs
   as versionName 1.2.3 / versionCode 10203 and any later tag is a larger number. A tag that is not
   three numbers, or one whose numbers would not fit, stops the run before it builds anything.
2. The keystore is decoded and `./gradlew assembleRelease` signs the release APK with it.
3. On a tag, the signed APK is attached to the release the tag names, under
   `africa-history-quest-<version>.apk`, and the notes say what it is. Pushing the same tag again
   replaces the file rather than failing, so a build that failed once is a tag pushed twice.

A run started by hand builds and keeps the debug APK and signs nothing. **A version tag on a
repository with none of these four secrets fails before it builds anything**, with an annotation
naming them, because the release it would otherwise publish is one no device will install.

## What is read back out of the published file

A fourth job runs after the release is published, and it is the only one of the four that reads the
file a reader will actually be given. Every step before it works on what the build produced: the
artifact the signed build kept, the name it was uploaded under, the version the tag named. The asset
on the release page is a copy of that, and the copy is where a wrong version, a signature from a
key that is not this project's, or a file carried under the wrong name would go unnoticed.

It downloads the asset with `gh release download`, then runs `npm run check:apk` over it. The check
reads the version and the package with `aapt2 dump badging`, the signature with `apksigner verify
--print-certs`, and compares the signer's certificate against the keystore's own - `keytool
exportcert` and a SHA-256 of the bytes - so what it proves is not "signed" but "signed with the key
this project signs with". What it decides, and what would make the file wrong, is
`src/lib/apk-release.js`, which is a plain module with tests of its own; the tools are only run by
the script.

It is a job of its own rather than three more steps in the release, for the reason the release is a
job of its own: publishing and checking are different trust. It fails the run rather than
withdrawing anything, since an APK already published is not un-published by a red mark, and the run
is where somebody can still see which of the three promises went wrong.

To read a file by hand, with the two Android tools and a JDK on `PATH`:

```bash
npm run check:apk -- --apk africa-history-quest-1.2.3.apk --tag v1.2.3
```

The key is named the way the build names it, so a machine that can already sign can also check:
`ANDROID_KEYSTORE`, `ANDROID_KEY_ALIAS` and `ANDROID_KEYSTORE_PASSWORD`. With no key given, the
signature is still read and the report says it was not compared, which is the honest answer rather
than a pass; `--certificate <sha256>` compares against a fingerprint when the key itself is
elsewhere.

To build a release APK on a machine that has the keystore, set the same four variables and run:

```bash
npm run android:version -- v1.2.3
npm run android:sync
cd android && ./gradlew assembleRelease
```

Without them the same command produces an unsigned `app-release-unsigned.apk`, which no device will
install.

## When a phone refuses the file: Play Protect

A release can pass every check above and still be refused by the phone, and the message to expect is
"Blocked by Play Protect". It is not a verdict on the file. Play Protect is the scan Android runs
before it installs an app, and it shows that warning for anything that does not come from the Play
Store, which is every APK this project publishes. The signature is read and trusted; the developer
is simply one Google has not seen before. The same file from a GitHub release, a USB drive or a
message is refused the same way.

What the person doing the install does:

1. On the warning, choose **Install anyway** (**More details**, then **Install anyway**). The install
   then continues, and this is the ordinary path for a sideloaded app.
2. Answer that first prompt. The warning is shown once, and a second attempt after it has been
dismissed fails with "App not installed" (`INSTALL_FAILED_VERIFICATION_FAILURE`, code -22) and no
   choice at all, which is the state that reads as the file being broken.
3. If the warning no longer appears, the scan can be turned off for the length of the install:
   Settings, Google, Play Protect, the gear icon, then **Scan apps with Play Protect**. Turn it back
   on when the app is installed.

Nothing here is something the build can change, and it is better said plainly than left as a support
message. Google's own [developer guidance for Play Protect warnings](https://developers.google.com/android/play-protect/warning-dev-guidance)
lists an install block for apps from outside the Play Store and the appeal that can be requested
when a file has been flagged in error. Publishing the application on the Play Store, even on an
internal testing track, is the only way to stop the warning appearing at all; until then, the
`/Android` screen tells the reader what the warning means before they meet it.
