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

To build a release APK on a machine that has the keystore, set the same four variables and run:

```bash
npm run android:version -- v1.2.3
npm run android:sync
cd android && ./gradlew assembleRelease
```

Without them the same command produces an unsigned `app-release-unsigned.apk`, which no device will
install.
