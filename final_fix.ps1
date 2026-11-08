$ErrorActionPreference = "Stop"

$index = Join-Path $PSScriptRoot "index.html"
$cssFile = Join-Path $PSScriptRoot "style.css"

Copy-Item $index (Join-Path $PSScriptRoot "index_before_final_fix.html") -Force
Copy-Item $cssFile (Join-Path $PSScriptRoot "style_before_final_fix.css") -Force

$html = [System.IO.File]::ReadAllText($index, [System.Text.Encoding]::UTF8)

$click = @'
<button id="btn-click" class="upgrade-btn btn-blue">
    <span class="btn-title">&#9889; &#1059;&#1083;&#1091;&#1095;&#1096;&#1080;&#1090;&#1100; &#1082;&#1083;&#1080;&#1082; (&#1091;&#1088;. <span id="lbl-click-lvl">1</span>)</span>
    <span class="btn-price">&#1062;&#1077;&#1085;&#1072;: <span id="lbl-click-cost">10</span></span>
</button>
'@

$farm = @'
<button id="btn-farm" class="upgrade-btn btn-green">
    <span class="btn-title">&#128421; &#1050;&#1091;&#1087;&#1080;&#1090;&#1100; &#1092;&#1077;&#1088;&#1084;&#1091; (&#1091;&#1088;. <span id="lbl-farm-lvl">0</span>)</span>
    <span class="btn-price">&#1062;&#1077;&#1085;&#1072;: <span id="lbl-farm-cost">50</span></span>
</button>
'@

$ad = @'
<button id="btn-ad" class="upgrade-btn btn-gold">
    <span class="btn-title">&#127916; &#1041;&#1086;&#1085;&#1091;&#1089;: +500 &#1084;&#1086;&#1085;&#1077;&#1090;</span>
    <span class="btn-price">&#1055;&#1086;&#1089;&#1084;&#1086;&#1090;&#1088;&#1077;&#1090;&#1100; &#1074;&#1080;&#1076;&#1077;&#1086;&#1088;&#1086;&#1083;&#1080;&#1082;</span>
</button>
'@

$html = [regex]::Replace($html, '(?s)<button id="btn-click"[^>]*>.*?</button>', $click, 1)
$html = [regex]::Replace($html, '(?s)<button id="btn-farm"[^>]*>.*?</button>', $farm, 1)
$html = [regex]::Replace($html, '(?s)<button id="btn-ad"[^>]*>.*?</button>', $ad, 1)

$utf8 = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($index, $html, $utf8)

$css = [System.IO.File]::ReadAllText($cssFile, [System.Text.Encoding]::UTF8)

$pattern = '(\.manul-character::before\s*\{[^}]*?content:\s*)"[^"]*"'
$evaluator = [System.Text.RegularExpressions.MatchEvaluator]{
    param($match)
    return $match.Groups[1].Value + '"\1F431"'
}

$css = [regex]::Replace($css, $pattern, $evaluator, 1)
[System.IO.File]::WriteAllText($cssFile, $css, $utf8)

Write-Host "FINAL FIX COMPLETED!"