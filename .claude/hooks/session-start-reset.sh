#!/bin/bash
# Resets the skill-active flag at the start of every new session so the
# skill-first reminder (see require-skill.sh) applies fresh each session.
mkdir -p .claude/state
rm -f .claude/state/skill-active.flag
exit 0
