@echo off
setlocal ENABLEDELAYEDEXPANSION

:: Path one level above this script's directory
set "OUTDIR=%~dp0.."

:: Usage help
:usage
echo Usage:
echo   %~nx0 ^<semver^>                Write semver to version.farm and version.registry
echo   %~nx0 --farm ^<semver^>         Write semver to version.farm
echo   %~nx0 --registry ^<semver^>     Write semver to version.registry
echo   %~nx0 --farm ^<semver^> --registry ^<semver^>
echo                                  Write each semver to respective file
echo.
echo <semver> must follow the format: major.minor.patch[-prerelease][+build]
goto:eof

:: If no args
if "%~1"=="" (
  call :usage
  goto:eof
)

:: Regex pattern for semantic version (loose approximation)
set "SEMVER_REGEX=^[0-9]\+\.[0-9]\+\.[0-9]\+\(-[0-9A-Za-z.-]\+\)\{0,1\}\(\+[0-9A-Za-z.-]\+\)\{0,1\}$"

set "farm="
set "registry="
set "single="

:: Parse args
if "%~2"=="" (
  set "single=%~1"
) else (
  :parse
  if "%~1"=="--farm" (
    set "farm=%~2"
    shift
    shift
    goto :checkmore
  ) else if "%~1"=="--registry" (
    set "registry=%~2"
    shift
    shift
    goto :checkmore
  ) else (
    echo Error: Unknown argument %~1
    call :usage
    exit /b 1
  )

  :checkmore
  if not "%~1"=="" goto :parse
)

:: Validate and write function
:validate_and_write
:: %1 = version, %2 = filename
echo %~1 | findstr /R "%SEMVER_REGEX%" >nul
if errorlevel 1 (
  echo Error: "%~1" is not a valid semantic version string
  exit /b 1
)
> "%OUTDIR%\%~2" echo %~1
echo Wrote %~1 to %OUTDIR%\%~2
goto:eof

:: Handle single argument
if defined single (
  echo %single% | findstr /R "%SEMVER_REGEX%" >nul
  if errorlevel 1 (
    echo Error: "%single%" is not a valid semantic version string
    exit /b 1
  )
  > "%OUTDIR%\version.farm" echo %single%
  > "%OUTDIR%\version.registry" echo %single%
  echo Wrote %single% to %OUTDIR%\version.farm and %OUTDIR%\version.registry
  goto:eof
)

:: Handle separate farm/registry
if defined farm (
  call :validate_and_write "%farm%" version.farm
)
if defined registry (
  call :validate_and_write "%registry%" version.registry
)
