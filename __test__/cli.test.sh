#!/bin/sh

LANG_ID=""
TEXT=""

while [ $# -gt 0 ]; do
  case "$1" in
    --lang)
      LANG_ID="$2"
      shift 2
      ;;
    --text)
      TEXT="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1"
      exit 1
      ;;
  esac
done

RESPONSE=$(curl -s -X POST http://localhost:3000/api/suggestions \
  -H "Content-Type: application/json" \
  -d "{
    \"lang_id\": \"$LANG_ID\",
    \"suggesstions\": \"$TEXT\"
  }")

if command -v jq >/dev/null 2>&1; then
  echo "$RESPONSE" | jq
else
  echo "$RESPONSE"
fi
