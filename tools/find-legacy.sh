#!/usr/bin/env bash
# usage: tools/find-legacy.sh <ScreenOrClassName>     e.g. BalanceSheet  OutstandingBills  ARReports
# Locates the legacy reference for a screen: Java, layouts, strings. Read-only helper for CLEAN-ROOM behaviour notes.
n="$1"; R="docs/reference/biz-analyst-android"
[ -z "$n" ] && { echo "usage: $0 <Name>"; exit 1; }
[ -d "$R" ] || { echo "No Android reference in this repo (see docs/reference/)"; exit 1; }
snake=$(echo "$n" | sed -E 's/([a-z0-9])([A-Z])/\1_\2/g' | tr 'A-Z' 'a-z')
echo "== Java (screens, sheets, calculators, packages)"; find "$R/java_sources/app" -iname "${n}*.java" | head -20
echo "== Layout XML (guess: *${snake}*)"; find "$R/decoded_resources/res" -path '*layout*' -iname "*${snake}*.xml" | head -20
echo "== String/label hints"; grep -rIl --include=strings.xml -i "$n\|$snake" "$R/decoded_resources/res/values" 2>/dev/null | head -3
echo "== Mentions in other classes (first 15)"; grep -rIl "$n" "$R/java_sources/app" 2>/dev/null | head -15
