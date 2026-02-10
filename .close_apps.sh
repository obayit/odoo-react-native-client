#!/usr/bin/env bash

# Make sure adb is available
command -v adb >/dev/null || { echo "adb not found"; exit 1; }

# Check connection
adb get-state >/dev/null 2>&1 || { echo "No device/emulator connected"; exit 1; }

# Emulator check
IS_EMULATOR=$(adb shell getprop ro.kernel.qemu | tr -d '\r')
if [ "$IS_EMULATOR" != "1" ]; then
  echo "Connected device is NOT an emulator. Skipping app closure."
  exit 0
fi

echo "Emulator detected. Closing all user apps..."

PACKAGES=$(adb shell pm list packages -3 | sed 's/package://' | tr -d '\r')

for package in $PACKAGES; do
  echo "Stopping $package"
  adb shell am force-stop "$package"
done

echo "Done ✅ All user apps closed on emulator."
