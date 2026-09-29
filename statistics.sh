#!/bin/bash

SKIP_FOLDERS=(-path ./.yarn -o -path ./build -o -path ./node_modules -o -path ./docs)

mapfile -t FILES < <(find . \( "${SKIP_FOLDERS[@]}" \) -prune -o \( -name "*.ts" -o -name "*.tsx" \)  -print)

LINES_COUNT=0
for file in "${FILES[@]}"; do
    lines_in_file=$(wc -l < "$file")  # importante: usar '<' para pegar só o número
    ((LINES_COUNT += lines_in_file))
done

mapfile -t DOCS_FILES < <(find ./docs \( -name "*.ts" -o -name "*.tsx" -o -name "*.md" \) -print)

DOCS_LINES_COUNT=0
for file in "${DOCS_FILES[@]}"; do
    lines_in_file=$(wc -l < "$file")
    ((DOCS_LINES_COUNT += lines_in_file))
done


echo "Total lines of code: $LINES_COUNT"
echo "Total lines of docs code: $DOCS_LINES_COUNT"
