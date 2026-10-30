# OpenClaw Skills for HarmonyOS

> OpenClaw Skill 向 HarmonyOS 迁移的**已验证成果发布仓库**。当前为 **C4A 基础设施候选版本**，**没有已发布 Skill**。

本仓库面向外部开发者，计划发布每个包含 `SKILL.md`、ArkTS 脚本、演示与原始来源记录的移植 Skill，并提供导入工具。研究报告、原型、SkillIR 草案与评估结果保存在[主研究仓库](https://github.com/nju-skills-group/nju-openclaw-harmony-skill/tree/main/docs/04-methodology/group-c)。[丙组计划与验收](https://github.com/nju-skills-group/nju-openclaw-harmony-skill/blob/main/docs/04-methodology/group-c/plan.md)。

## 当前状态

| 范围 | 状态 |
| --- | --- |
| 仓库文档、贡献及发布标准 | 基础版本已编写，待 PR 审核 |
| 文件复制导入器（合成工程） | 自动测试覆盖；**非鸿蒙 Skill 注册/调用** |
| 正式 Skill（L1 ×3、L2 ×2） | 0/5，等待乙组真实移植成果 |
| HarmonyOS `skillProfiles` 接入 | 等待甲组确认可运行契约 |
| 真机端到端导入与调用 | 未测；不声称三步成功 |

## 目录与使用

- [`skills/`](skills/README.md)：**仅限**满足发布门槛的 Skill；暂无正式 Skill。
- [`docs/skill-package.md`](docs/skill-package.md)：发布包、来源、证据与验收约定。
- [`CONTRIBUTING.md`](CONTRIBUTING.md)：从研究仓库移交、审查、发布的工作流。
- [`tools/import.mjs`](tools/import.mjs)：**实验性、文件级**导入工具，不会更改 `module.json5` 或注册 Skill。

开发者可执行 `npm test` 运行合成工程测试。**当前没有任何可以由外部用户通过 README 成功调用的正式 Skill。**

### 文件级导入工具（仅供验证集成前置步骤）

```bash
node tools/import.mjs --skill <name> --target /path/to/harmony-project --dry-run
node tools/import.mjs --skill <name> --target /path/to/harmony-project --files-only
```

`--dry-run` 仅预览检查。`--files-only` 要求显式确认，并仅复制已发布包中的 `SKILL.md` 和 `scripts/*.ets` 到 `entry/skills/<name>/`，**不**完成 `skillProfiles` 注册、Ability 绑定、构建或调用；缺乏正式 Skill 时以上命令不会成功，这是预期行为。不得用合成测试夹具冒充正式 Skill。支持范围以甲组真实工程与接口验证后更新。

## 仓库分工

研究仓库：调查、适配原型、语义映射、实验与证据。**本发布仓库**：审核后的 Skill 包、必要工具、使用文档、来源/许可证与真实调用证据。首个和五个 Skill 的数量指标只有在真实调用等验收后才可标记完成。
