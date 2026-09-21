# Revert mc- classes to original Tailwind classes (best-effort)
Write-Host "Starting mc- -> original replacements..."

$patterns = @{
  'bg-mc-50' = 'bg-slate-50'
  'bg-mc-100' = 'bg-slate-100'
  'bg-mc-600' = 'bg-blue-600'
  'bg-mc-700' = 'bg-blue-700'
  'text-mc-600' = 'text-blue-600'
  'text-mc-700' = 'text-blue-700'
  'border-mc-100' = 'border-slate-200'
  'border-mc-200' = 'border-slate-200'
  'border-t-mc-600' = 'border-t-blue-600'
  'hover:bg-mc-50' = 'hover:bg-slate-50'
  'hover:text-mc-700' = 'hover:text-blue-700'
  'focus:border-mc-600' = 'focus:border-blue-600'
  'focus:ring-mc-100' = 'focus:ring-slate-100'
  'disabled:bg-mc-50' = 'disabled:bg-slate-50'
  'bg-mc-50,' = 'bg-slate-50,'
}

$extensions = '*.jsx','*.js','*.css','*.tsx','*.ts'

$files = Get-ChildItem -Path .\src -Recurse -Include $extensions -File

foreach ($file in $files) {
  $text = Get-Content $file.FullName -Raw
  $original = $text

  foreach ($k in $patterns.Keys) {
    $v = $patterns[$k]
    $text = $text -replace [regex]::Escape($k), $v
  }

  if ($text -ne $original) {
    Set-Content -Path $file.FullName -Value $text -Encoding UTF8
    Write-Host "Patched: $($file.FullName)"
  }
}

Write-Host "Replacement complete."
