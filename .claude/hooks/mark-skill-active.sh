#!/bin/bash
# Marks that a skill has been invoked in this session. Runs on PostToolUse
# for the Skill tool. Consumed by require-skill.sh.
mkdir -p .claude/state
date +%s > .claude/state/skill-active.flag
exit 0
