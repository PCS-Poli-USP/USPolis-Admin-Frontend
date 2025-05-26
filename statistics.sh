#!/bin/bash

SKIP_FOLDERS=(-path ./.yarn -o -path ./build -o -path ./node_modules)

mapfile -t FILES < <(find . \( "${SKIP_FOLDERS[@]}" \) -prune -o \( -name "*.ts" -o -name "*.jsx" \)  -print)

LINES_COUNT=0
for file in "${FILES[@]}"; do
    lines_in_file=$(wc -l < "$file")  # importante: usar '<' para pegar só o número
    ((LINES_COUNT += lines_in_file))
done


echo "Total lines of code: $LINES_COUNT"