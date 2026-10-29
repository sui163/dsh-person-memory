# dsh-person-memory

个人自用记忆插件，拥有五层记忆。核心是 E:/harness/memory 五层记忆库 + auto-record 自动记录脚本。

## 功能
- **五层记忆**：diary(日记) / events(事件) / reflections(反思) / errors(错误) / important(重要)
- **auto-record.ps1**：可靠写入脚本，把内容追加到当天对应文件
- **会话开始存档**：新会话开始时读记忆恢复 + 记一条"会话开始"
- **记忆工具命令**（通过插件 data 事件）：
  - person:record <layer>|<内容>  — 记录到某层
  - person:read [日期]            — 读取某天记忆
  - person:list                   — 列出已有记忆日期

## 安装
已通过 desktop profile 的 package.json+bundles 和 cordis.patch.yml insert 挂载。

## 记忆库位置
E:/harness/memory/（含 diary/events/reflections/errors/important 五层）

## 说明
- 相同功能脚本位于 本插件 scripts/auto-record.ps1 与 E:/harness/memory/auto-record.ps1
- 需要 PowerShell 可用（Windows）
