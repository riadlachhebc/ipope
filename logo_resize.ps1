$root = "c:\Users\Ryad\.gemini\antigravity\scratch\iptv-europe"

$rootFiles = Get-ChildItem -Path $root -Filter '*.html'
$blogFiles = Get-ChildItem -Path "$root\blog" -Filter '*.html'

$oldRootLogo = '<img src="assets/images/logo.png" alt="IPTV Mate Logo" height="40" style="display:block;">'
$newRootLogo = '<img src="assets/images/logo.png" alt="IPTV Mate Logo" height="48" style="display:block;"><span style="font-family:var(--font-heading);font-weight:700;font-size:1.4rem;color:var(--text-heading);margin-left:12px;">IPTV Mate</span>'

$oldBlogLogo = '<img src="../assets/images/logo.png" alt="IPTV Mate Logo" height="40" style="display:block;">'
$newBlogLogo = '<img src="../assets/images/logo.png" alt="IPTV Mate Logo" height="48" style="display:block;"><span style="font-family:var(--font-heading);font-weight:700;font-size:1.4rem;color:var(--text-heading);margin-left:12px;">IPTV Mate</span>'

foreach ($f in $rootFiles) {
    if ($f.FullName -match '\.git') { continue }
    $content = Get-Content $f.FullName -Raw -Encoding UTF8
    if ($content -match [regex]::Escape($oldRootLogo)) {
        $content = $content -replace [regex]::Escape($oldRootLogo), $newRootLogo
        Set-Content -Path $f.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Updated $($f.Name)"
    }
}

foreach ($f in $blogFiles) {
    if ($f.FullName -match '\.git') { continue }
    $content = Get-Content $f.FullName -Raw -Encoding UTF8
    if ($content -match [regex]::Escape($oldBlogLogo)) {
        $content = $content -replace [regex]::Escape($oldBlogLogo), $newBlogLogo
        Set-Content -Path $f.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Updated $($f.Name)"
    }
}

Write-Host "Done!"
