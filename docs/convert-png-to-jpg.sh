#!/bin/bash

shopt -s nullglob
files=(*.png)

if [ ${#files[@]} -eq 0 ]; then
  echo "No PNG files found."
  exit 0
fi

echo "The following files will be converted:"
echo "---------------------------------------"

for file in "${files[@]}"; do
  echo "$file  ->  ${file%.png}.jpg"
done

echo
read -p "Are you sure you want to continue? (y/N): " confirm

if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Operation cancelled."
  exit 0
fi

echo
echo "Converting..."

for file in "${files[@]}"; do
  convert "$file" -quality 80 "${file%.png}.jpg"
done

echo "Done."
