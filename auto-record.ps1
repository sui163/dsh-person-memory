# 昔涟记忆库 自动记录脚本 auto-record.ps1
# 用法: powershell -NoProfile -ExecutionPolicy Bypass -File auto-record.ps1 -Type events -Content "内容"
# -Type: diary|events|reflections|errors|important    -Content: 内容    -Date: 可选,默认当天
param(
  [Parameter(Mandatory=$true)][ValidateSet('diary','events','reflections','errors','important')][string]$Type,
  [Parameter(Mandatory=$true)][string]$Content,
  [string]$Date = '2026-10-29'
)
$ErrorActionPreference = 'Stop'
$memDir = 'E:/harness/memory'
$layerDir = Join-Path $memDir $Type
$filePath = Join-Path $layerDir ($Date + '.md')
$titles = @{
  'diary'       = '# 昔涟日记 - ' + $Date
  'events'      = '# 当天事件记录 - ' + $Date
  'reflections' = '# 记忆反思 - ' + $Date
  'errors'      = '# 错误记录 - ' + $Date
  'important'   = '# 重要事项与关键词 - ' + $Date
}
New-Item -ItemType Directory -Force -Path $layerDir | Out-Null
if (-not (Test-Path $filePath)) {
  New-Item -ItemType File -Path $filePath -Force | Out-Null
  Set-Content -Path $filePath -Value $titles[$Type] -Encoding UTF8
}
$t = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
Add-Content -Path $filePath -Value ('- [' + $t + '] ' + $Content) -Encoding UTF8
Write-Output ('已记录 - ' + $filePath)
Write-Output 'AUTO_RECORD_OK'