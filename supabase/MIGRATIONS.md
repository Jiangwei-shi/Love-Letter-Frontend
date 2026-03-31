# Supabase Migration 维护规范

## 当前结构

- `supabase/migrations/20260331193000_baseline_schema.sql`：当前远程数据库导出的基线结构（仅 `public` schema）。

## 日常开发规则

1. **新增变更只追加新 migration**
   - 不要再修改 baseline 文件。
   - 每次 schema 变更创建一个新的时间戳 migration 文件。

2. **保持本地与远程一致**
   - 提交前执行一次本地验证（例如 `supabase db push` / `supabase db reset`，按团队流程选择）。
   - 避免在 SQL 编辑器直接改远程结构而不落地 migration。
   - 执行 `db pull` 时固定使用 `--schema public`，避免把 Supabase 托管 schema（如 `auth` / `storage`）混入本地迁移链路。

3. **需要重新整理时**
   - 在里程碑节点导出新基线，替换当前 baseline，并把旧 baseline 移到归档目录。

## 重新导出基线（参考命令）

```bash
npx supabase db dump --linked --schema public --file supabase/migrations/$(Get-Date -Format yyyyMMddHHmmss)_baseline_schema.sql
```

> Windows PowerShell 下可直接使用上面的时间戳格式；若手动命名，请确保时间戳递增。

