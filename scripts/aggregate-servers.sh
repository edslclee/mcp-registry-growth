#!/bin/bash
# Fetch all servers from MCP Registry API with pagination
# Build time-series data based on each server's publishedAt date
# Generate cumulative daily counts (date, total, local, remote)

set -e

ENDPOINT="https://registry.modelcontextprotocol.io/v0/servers"
ALL_SERVERS_JSON="/tmp/all_servers.json"
CURSOR=""

echo "Fetching all servers from MCP Registry API..."

# Initialize empty array
echo '[]' > "$ALL_SERVERS_JSON"

# Fetch all pages and collect servers
PAGE_NUM=0
while true; do
    PAGE_NUM=$((PAGE_NUM + 1))

    # Fetch page
    if [ -z "$CURSOR" ]; then
        RESPONSE=$(curl -s "$ENDPOINT")
    else
        RESPONSE=$(curl -s "${ENDPOINT}?cursor=${CURSOR}")
    fi

    # Extract servers from this page
    PAGE_SERVERS=$(echo "$RESPONSE" | jq '.servers')

    # Merge with accumulated servers
    ALL_SERVERS=$(jq -s '.[0] + .[1]' "$ALL_SERVERS_JSON" <(echo "$PAGE_SERVERS"))
    echo "$ALL_SERVERS" > "$ALL_SERVERS_JSON"

    PAGE_COUNT=$(echo "$PAGE_SERVERS" | jq 'length')
    echo "  Page $PAGE_NUM: $PAGE_COUNT servers fetched"

    # Check for next page
    NEXT_CURSOR=$(echo "$RESPONSE" | jq -r '.metadata.nextCursor // empty')

    if [ -z "$NEXT_CURSOR" ]; then
        echo "  Reached end of pagination"
        break
    fi

    CURSOR="$NEXT_CURSOR"
done

TOTAL_SERVERS=$(jq 'length' "$ALL_SERVERS_JSON")
echo "Total servers collected: $TOTAL_SERVERS"

echo ""
echo "Building time-series data by publishedAt date..."

# Extract date-based data: each line = date, is_local (0/1), is_remote (0/1)
# Sort by date and calculate cumulative counts
jq -r '
  .[] |
  {
    date: (._meta."io.modelcontextprotocol.registry/official".publishedAt | split("T")[0]),
    is_local: (if .server.packages != null then 1 else 0 end),
    is_remote: (if .server.remotes != null then 1 else 0 end)
  } |
  "\(.date),\(.is_local),\(.is_remote)"
' "$ALL_SERVERS_JSON" | sort > /tmp/dated_servers.csv

# Calculate daily counts and cumulative totals
awk -F',' '
BEGIN {
    cumulative_total = 0
    cumulative_local = 0
    cumulative_remote = 0
    current_date = ""
    daily_total = 0
    daily_local = 0
    daily_remote = 0
}
{
    date = $1
    is_local = $2
    is_remote = $3

    # If date changed, output previous date totals
    if (current_date != "" && current_date != date) {
        cumulative_total += daily_total
        cumulative_local += daily_local
        cumulative_remote += daily_remote
        print current_date "," cumulative_total "," cumulative_local "," cumulative_remote
        daily_total = 0
        daily_local = 0
        daily_remote = 0
    }

    current_date = date
    daily_total++
    daily_local += is_local
    daily_remote += is_remote
}
END {
    # Output last date
    if (current_date != "") {
        cumulative_total += daily_total
        cumulative_local += daily_local
        cumulative_remote += daily_remote
        print current_date "," cumulative_total "," cumulative_local "," cumulative_remote
    }
}
' /tmp/dated_servers.csv > /tmp/cumulative_counts.csv

# Create data directory if it doesn't exist
mkdir -p data

# Write to final CSV with header
echo "date,total,local,remote" > data/snapshots.csv
cat /tmp/cumulative_counts.csv >> data/snapshots.csv

LINES=$(wc -l < data/snapshots.csv)
echo "Generated snapshots.csv with $((LINES - 1)) data points"

# Show first and last few entries
echo ""
echo "First entries:"
head -5 data/snapshots.csv

echo ""
echo "Last entries:"
tail -5 data/snapshots.csv

# Cleanup
rm -f "$ALL_SERVERS_JSON" /tmp/dated_servers.csv /tmp/cumulative_counts.csv

echo ""
echo "✅ Time-series data generation complete!"
