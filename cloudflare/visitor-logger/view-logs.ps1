param(
    [ValidateRange(1, 500)]
    [int]$Limit = 100,
    [string]$IpAddress
)

$tokenFile = Join-Path $PSScriptRoot "visitor-log-token.secret.clixml"
if (-not (Test-Path -LiteralPath $tokenFile)) {
    throw "Encrypted log token not found at $tokenFile"
}

$secureToken = Import-Clixml -LiteralPath $tokenFile
$credential = [System.Net.NetworkCredential]::new("", $secureToken)
$token = $credential.Password

$query = "limit=$Limit"
if ($IpAddress) {
    $query += "&ip=$([uri]::EscapeDataString($IpAddress))"
}

$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "https://matferg.com/_visitor-logs?$query" -Headers $headers
