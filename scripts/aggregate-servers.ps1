# Fetch all servers from MCP Registry API with pagination
# Classify as local (has packages) or remote (has remotes)
# Append timestamp + counts to data/snapshots.csv

$ErrorActionPreference = "Stop"

$ENDPOINT = "https://registry.modelcontextprotocol.io/v0/servers"
$TIMESTAMP = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:00:00Z")
$LOCAL_COUNT = 0
$REMOTE_COUNT = 0
$TOTAL_COUNT = 0
$CURSOR = ""

Write-Host "Starting MCP server aggregation at $TIMESTAMP"

# Create data directory if it doesn't exist
if (-not (Test-Path "data")) {
    New-Item -ItemType Directory -Path "data" | Out-Null
}

while ($true) {
    # Fetch page
    if ($CURSOR -eq "") {
        $RESPONSE = Invoke-RestMethod -Uri $ENDPOINT -Method Get
    } else {
        $RESPONSE = Invoke-RestMethod -Uri "$ENDPOINT?cursor=$CURSOR" -Method Get
    }

    # Count servers on this page
    $PAGE_LOCAL = ($RESPONSE.servers | Where-Object { $_.server.packages -ne $null }).Count
    $PAGE_REMOTE = ($RESPONSE.servers | Where-Object { $_.server.remotes -ne $null }).Count
    $PAGE_TOTAL = $RESPONSE.servers.Count

    $LOCAL_COUNT += $PAGE_LOCAL
    $REMOTE_COUNT += $PAGE_REMOTE
    $TOTAL_COUNT += $PAGE_TOTAL

    Write-Host "  Page processed: $PAGE_TOTAL servers ($PAGE_LOCAL local, $PAGE_REMOTE remote)"

    # Check for next page
    $NEXT_CURSOR = $RESPONSE.metadata.nextCursor

    if (-not $NEXT_CURSOR) {
        Write-Host "  Reached end of pagination"
        break
    }

    $CURSOR = $NEXT_CURSOR
}

Write-Host "Total servers: $TOTAL_COUNT ($LOCAL_COUNT local, $REMOTE_COUNT remote)"

# Create CSV with header if it doesn't exist
if (-not (Test-Path "data/snapshots.csv")) {
    "timestamp,total,local,remote" | Out-File -FilePath "data/snapshots.csv" -Encoding utf8
    Write-Host "Created new snapshots.csv with header"
}

# Append new row
"$TIMESTAMP,$TOTAL_COUNT,$LOCAL_COUNT,$REMOTE_COUNT" | Out-File -FilePath "data/snapshots.csv" -Append -Encoding utf8
Write-Host "Appended snapshot to data/snapshots.csv"
