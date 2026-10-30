# 首次提交及 PR（空仓库）

此仓库当前只有待提交的初始化内容。GitHub 空仓库没有可供从 `main` 创建分支的现有 commit：先初始化 `main`，**再**从 `main` 建工作分支提交后续更改。请勿将 C4A 本地工程误称为已经同步到 GitHub。

## 建议操作

首次操作的账号需要仓库 Content 写权限。仓库若已经有人初始化，请先拉取远端并检查差异，不要用 `--force` 或覆盖历史。

```bash
git clone https://github.com/nju-skills-group/openclaw-skills-for-harmony.git
cd openclaw-skills-for-harmony
# 复制交付包内的 README.md、其他文件到仓库根目录
npm test
# 如果这是首次初始化的空仓库：
git add .
git commit -m "chore: bootstrap Skill release repository"
git branch -M main
git push -u origin main
# 之后所有新工作均从 main 建分支，向 main 发 PR
```

**限制**：空仓库第一次创建 `main` 无法通过普通 PR 实现，属于一次性引导步骤。建议由被授权维护者执行；引导后恢复常规 PR + Review 工作流。如果组织要求首次提交也经过审查，可先对本地交付包审阅再初始化，或由管理员另行建立最小 `main` 后将 C4A 文件作为 PR 导入。
