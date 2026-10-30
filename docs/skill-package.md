# 发布 Skill 包约定（C4A 基线）

本约定是**本仓库的发布结构**，不是 HarmonyOS 官方 `skillProfiles` 规范。真实注册结构需由甲组确认，后续单独更新导入器。

```text
skills/<name>/
  SKILL.md
  scripts/<Entry>.ets
  README.md
  SOURCE.md
  LICENSE（原许可要求时）
  evidence/verification.md
  evidence/demo.mp4（或长期可访问的演示链接，须说明来源）
```

- `<name>`：小写英文/数字和连字符，须与发布登记一致，防止路径穿越或覆盖。
- `SOURCE.md`：原始项目、作者、owner/slug、固定 commit/版本、哈希、原许可证、移植修改范围和保留声明；**仅允许合法再分发**。
- `README.md`：支持环境、必需权限、导入、构建、调用、边界条件和功能子集说明。
- `evidence/verification.md`：原平台和目标端的真实运行环境、输入/输出、命令或步骤、正常/异常用例、演示录屏路径与审查结论。未测项目写未测。
- 样例发布需要原始 `SKILL.md`、鸿蒙 ArkTS 入口、明确来源和演示；其他文件作为可重复验证的最低证明。

## 阶段门槛

1. 静态结构/许可检查仅证明文件和声明存在。
2. 构建通过不能代替真实 Skill 调用。
3. 正式发布必须有受支持鸿蒙环境的实际 Skill 调用和行为验证证据。
4. “三步以内导入并成功调用”是**整个公开仓库最终验收标准**；C4A 初版文件复制工具**尚未达到**。

发布前不要将模拟文件或未经验证的候选 Skill 放进 `skills/`。目前 `skills/` 应只保留说明文件。
