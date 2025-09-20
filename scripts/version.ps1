<#
.SYNOPSIS
Set semantic version for project files (version.farm and version.registry)

.DESCRIPTION
Writes the semantic version string to the appropriate files.

.PARAMETER Single
Write the same version to both version.farm and version.registry

.PARAMETER Farm
Write the version to version.farm only

.PARAMETER Registry
Write the version to version.registry only
#>

[CmdletBinding()]
param(
    [Parameter(Position=0, Mandatory=$false)]
    [string]$Single,

    [Parameter(Mandatory=$false)]
    [string]$Farm,

    [Parameter(Mandatory=$false)]
    [string]$Registry
)

function Show-Usage {
    Write-Host "Usage:"
    Write-Host "  .\version.ps1 <semver>                  # Write semver to both version.farm and version.registry"
    Write-Host "  .\version.ps1 --farm <semver>           # Write semver to version.farm"
    Write-Host "  .\version.ps1 --registry <semver>       # Write semver to version.registry"
    Write-Host "  .\version.ps1 --farm <semver> --registry <semver>"
    Write-Host
    Write-Host "Arguments:"
    Write-Host "  <semver>   Semantic version string (e.g. 1.2.3, 1.2.3-alpha, 1.2.3+build)"
    Write-Host
    Write-Host 
    Write-Host "** Note: that you may need to specify specific execution policies to be able to run this script."
    Write-Host "         An example command that allows the script to run looks like:"
    Write-Host
    Write-Host "    powershell -ExecutionPolicy Bypass -File .\version.ps1 <semver>"
    exit 0
}

# If no arguments, show usage
if (-not $Single -and -not $Farm -and -not $Registry) {
    Show-Usage
}

# Regex for semantic versioning
$SemverRegex = '^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$'

# Resolve output directory one level up from script
$TargetDir = Split-Path -Parent $PSScriptRoot

function Validate-And-Write {
    param(
        [string]$Version,
        [string]$File
    )

    if (-not ($Version -match $SemverRegex)) {
        Write-Error "'$Version' is not a valid semantic version string"
        exit 1
    }

    $Path = Join-Path $TargetDir $File
    Set-Content -Path $Path -Value $Version
    Write-Host "Wrote $Version to $File"
}

# If Single version is provided, write both files
if ($Single) {
    Validate-And-Write -Version $Single -File "version.farm"
    Validate-And-Write -Version $Single -File "version.registry"
} else {
    if ($Farm) { Validate-And-Write -Version $Farm -File "version.farm" }
    if ($Registry) { Validate-And-Write -Version $Registry -File "version.registry" }
}