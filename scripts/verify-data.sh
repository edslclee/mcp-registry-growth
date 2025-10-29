#!/bin/bash
# Verify API data collection logic

set -e

ENDPOINT="https://registry.modelcontextprotocol.io/v0/servers"

echo "=== Fetching data from MCP Registry API ==="
echo "Endpoint: $ENDPOINT"
echo ""

# Fetch first page
RESPONSE=$(curl -s "$ENDPOINT")

# Count servers
TOTAL=$(echo "$RESPONSE" | jq '.servers | length')
LOCAL=$(echo "$RESPONSE" | jq '[.servers[] | select(.server.packages != null)] | length')
REMOTE=$(echo "$RESPONSE" | jq '[.servers[] | select(.server.remotes != null)] | length')
HAS_CURSOR=$(echo "$RESPONSE" | jq 'has("cursor")')
CURSOR=$(echo "$RESPONSE" | jq -r '.cursor // "none"')

echo "First page results:"
echo "  Total servers: $TOTAL"
echo "  Local (has packages): $LOCAL"
echo "  Remote (has remotes): $REMOTE"
echo "  Has more pages: $HAS_CURSOR"
echo "  Cursor: $CURSOR"
echo ""

# Show sample servers
echo "=== Sample servers ==="
echo "Local server example:"
echo "$RESPONSE" | jq '[.servers[] | select(.server.packages != null)] | .[0] | {name: .server.name, has_packages: true, has_remotes: (.server.remotes != null)}'

echo ""
echo "Remote server example:"
echo "$RESPONSE" | jq '[.servers[] | select(.server.remotes != null)] | .[0] | {name: .server.name, has_packages: (.server.packages != null), has_remotes: true}'

echo ""
echo "=== Checking latest CSV entry ==="
tail -1 /Users/cheollee/speckit/mcp-registry-growth/data/snapshots.csv

echo ""
echo "=== Running full aggregation script ==="
bash /Users/cheollee/speckit/mcp-registry-growth/scripts/aggregate-servers.sh

echo ""
echo "=== Latest CSV entry after aggregation ==="
tail -1 /Users/cheollee/speckit/mcp-registry-growth/data/snapshots.csv
