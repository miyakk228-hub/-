$ErrorActionPreference = "Stop"
$file = Join-Path $PSScriptRoot "index.html"
Copy-Item $file (Join-Path $PSScriptRoot "index_before_text_fix.html") -Force
$html = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

$html = [regex]::Replace($html, '(?m)^\s*<span class="coin-icon">.*?</span>', '            <span class="coin-icon">&#129689;</span>')
$html = [regex]::Replace($html, '(?m)^\s*<div class="stats-text" id="stats-text">.*?</div>', '        <div class="stats-text" id="stats-text">&#1050;&#1083;&#1080;&#1082;: +1 | &#1042; &#1089;&#1077;&#1082;&#1091;&#1085;&#1076;&#1091;: +0</div>')
$html = [regex]::Replace($html, '(?m)^\s*<span class="btn-title">.*?lbl-click-lvl.*?</span></span>', '                <span class="btn-title">&#9889; &#1059;&#1083;&#1091;&#1095;&#1096;&#1080;&#1090;&#1100; &#1082;&#1083;&#1080;&#1082; (&#1091;&#1088;. <span id="lbl-click-lvl">1</span>)</span>')
$html = [regex]::Replace($html, '(?m)^\s*<span class="btn-price">.*?lbl-click-cost.*?</span>', '                <span class="btn-price">&#1062;&#1077;&#1085;&#1072;: <span id="lbl-click-cost">10</span></span>')
$html = [regex]::Replace($html, '(?m)^\s*<span class="btn-title">.*?lbl-farm-lvl.*?</span></span>', '                <span class="btn-title">&#128421; &#1050;&#1091;&#1087;&#1080;&#1090;&#1100; &#1092;&#1077;&#1088;&#1084;&#1091; (&#1091;&#1088;. <span id="lbl-farm-lvl">0</span>)</span>')
$html = [regex]::Replace($html, '(?m)^\s*<span class="btn-price">.*?lbl-farm-cost.*?</span>', '                <span class="btn-price">&#1062;&#1077;&#1085;&#1072;: <span id="lbl-farm-cost">50</span></span>')
$html = [regex]::Replace($html, '(?m)^\s*<span class="btn-title">.*?\+500.*?</span>', '                <span class="btn-title">&#127916; &#1041;&#1086;&#1085;&#1091;&#1089;: +500 &#1084;&#1086;&#1085;&#1077;&#1090;</span>')
$html = [regex]::Replace($html, '(?m)^\s*<span class="btn-price">.*?РџРѕСЃ.*?</span>', '                <span class="btn-price">&#1055;&#1086;&#1089;&#1084;&#1086;&#1090;&#1088;&#1077;&#1090;&#1100; &#1074;&#1080;&#1076;&#1077;&#1086;&#1088;&#1086;&#1083;&#1080;&#1082;</span>')

$utf8 = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($file, $html, $utf8)
Write-Host "TEXTS UPDATED!"