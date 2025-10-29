#!/bin/bash
# Analyze server classification logic in detail

set -e

ENDPOINT="https://registry.modelcontextprotocol.io/v0/servers"

echo "=== Analyzing Server Classification ==="
echo ""

# Fetch all servers (handling pagination)
ALL_SERVERS='{"servers":[]}'
CURSOR=""
PAGE_COUNT=0

echo "Fetching all servers via pagination..."

while true; do
    if [ -z "$CURSOR" ]; then
        RESPONSE=$(curl -s "$ENDPOINT")
    else
        RESPONSE=$(curl -s "${ENDPOINT}?cursor=${CURSOR}")
    fi

    PAGE_COUNT=$((PAGE_COUNT + 1))

    # Merge servers
    ALL_SERVERS=$(echo "$ALL_SERVERS" "$RESPONSE" | jq -s '.[0].servers + .[1].servers | {servers: .}')

    # Check for next page
    CURSOR=$(echo "$RESPONSE" | jq -r '.metadata.nextCursor // empty')
    if [ -z "$CURSOR" ]; then
        break
    fi
done

echo "Fetched $PAGE_COUNT pages"
echo ""

# Analyze classification
TOTAL=$(echo "$ALL_SERVERS" | jq '.servers | length')
LOCAL_ONLY=$(echo "$ALL_SERVERS" | jq '[.servers[] | select(.server.packages != null and .server.remotes == null)] | length')
REMOTE_ONLY=$(echo "$ALL_SERVERS" | jq '[.servers[] | select(.server.packages == null and .server.remotes != null)] | length')
BOTH=$(echo "$ALL_SERVERS" | jq '[.servers[] | select(.server.packages != null and .server.remotes != null)] | length')
NEITHER=$(echo "$ALL_SERVERS" | jq '[.servers[] | select(.server.packages == null and .server.remotes == null)] | length')

LOCAL_TOTAL=$(echo "$ALL_SERVERS" | jq '[.servers[] | select(.server.packages != null)] | length')
REMOTE_TOTAL=$(echo "$ALL_SERVERS" | jq '[.servers[] | select(.server.remotes != null)] | length')

echo "=== Classification Results ==="
echo "Total unique servers: $TOTAL"
echo ""
echo "Breakdown by properties:"
echo "  Local only (packages only): $LOCAL_ONLY"
echo "  Remote only (remotes only): $REMOTE_ONLY"
echo "  Both (packages AND remotes): $BOTH"
echo "  Neither: $NEITHER"
echo ""
echo "Totals by type:"
echo "  All with packages (local): $LOCAL_TOTAL"
echo "  All with remotes (remote): $REMOTE_TOTAL"
echo ""
echo "Verification:"
echo "  Local only + Remote only + Both + Neither = $((LOCAL_ONLY + REMOTE_ONLY + BOTH + NEITHER))"
echo "  Should equal Total: $TOTAL"
echo "  Match: $([[ $((LOCAL_ONLY + REMOTE_ONLY + BOTH + NEITHER)) -eq $TOTAL ]] && echo "✅ YES" || echo "❌ NO")"
echo ""
echo "  Local only + Both = $((LOCAL_ONLY + BOTH))"
echo "  Should equal Local total: $LOCAL_TOTAL"
echo "  Match: $([[ $((LOCAL_ONLY + BOTH)) -eq $LOCAL_TOTAL ]] && echo "✅ YES" || echo "❌ NO")"
echo ""
echo "  Remote only + Both = $((REMOTE_ONLY + BOTH))"
echo "  Should equal Remote total: $REMOTE_TOTAL"
echo "  Match: $([[ $((REMOTE_ONLY + BOTH)) -eq $REMOTE_TOTAL ]] && echo "✅ YES" || echo "❌ NO")"
echo ""

if [ "$BOTH" -gt 0 ]; then
    echo "=== Servers with BOTH packages and remotes ==="
    echo "$ALL_SERVERS" | jq -r '[.servers[] | select(.server.packages != null and .server.remotes != null)] | .[0:3] | .[] | "  - \(.server.name)"'
    echo ""
fi

echo "=== CSV Entry Explanation ==="
echo "Format: timestamp,total,local,remote"
echo "Current: $(tail -1 /Users/cheollee/speckit/mcp-registry-growth/data/snapshots.csv)"
echo ""
echo "Where:"
echo "  total = unique servers ($TOTAL)"
echo "  local = servers with packages ($LOCAL_TOTAL)"
echo "  remote = servers with remotes ($REMOTE_TOTAL)"
echo ""
echo "Note: local + remote may exceed total because servers can have both properties"
echo "  Expected: local + remote >= total"
echo "  Actual: $LOCAL_TOTAL + $REMOTE_TOTAL = $((LOCAL_TOTAL + REMOTE_TOTAL)) >= $TOTAL"
echo "  Difference (servers with both): $((LOCAL_TOTAL + REMOTE_TOTAL - TOTAL))"
echo "  Should equal Both count: $BOTH"
echo "  Match: $([[ $((LOCAL_TOTAL + REMOTE_TOTAL - TOTAL)) -eq $BOTH ]] && echo "✅ YES" || echo "❌ NO")"
