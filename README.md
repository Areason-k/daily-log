# 日迹 Daily Log

一个给自己用的日程 / 专注 / 周记工具。

- 一句话快速记日程（「明天下午3点跟张总过方案」自动拆成日期、时间和标题）
- 番茄钟，用结束时间戳计时，锁屏不漂移
- 周记自动聚合本周数据并生成草稿
- 数据本地四层持久化 + Supabase 云端同步
- 可安装为 PWA，手机添加到主屏幕后全屏运行

## 使用

直接打开 https://Areason-k.github.io/daily-log/

首次使用请到「设置 → 云端同步」填写 Supabase 的 Project URL 与 publishable key，
然后建表。**建表走 Table Editor 图形化操作，不要用 SQL Editor** —— 部分账户的
SQL Editor 是只读的，会报 `Only SELECT queries allowed`：

1. `Table Editor → New table`，表名 **`daily_log`**（小写 + 下划线）
2. 三列：`user_id` uuid 主键 / `data` jsonb 默认 `{}` / `updated_at` timestamptz 默认 `now()`
3. 点右上角 `Add RLS policy` 加三条：select 用 `using`、insert 用 `with check`、
   update 两个都要，Target roles 选 `authenticated`

数据只属于你自己：所有云端读写都受 RLS 约束，只有本人账号能访问。

## 开发

```
npm install          # 装 Electron
npm start            # 桌面版调试
npm run pack         # 打包到 dist/
```

`index.html` 是全部业务逻辑（单文件、零构建、零框架）。
`main.js` 只是 Electron 外壳。

修改 `index.html` 后直接提交即可，GitHub Pages 从仓库根目录发布。
