# Skill — Code Quality Gate

## Trigger
Use before opening a PR, before merge, and whenever CI fails.

## Fast hackathon gate
Run the cheapest high-signal checks first:
1. focused feature tests;
2. type/static checks;
3. production build;
4. integration smoke test for touched critical paths;
5. secret/config scan by inspection;
6. demo-path regression check when the change affects the core flow.

## Merge decision
A PR is mergeable when:
- its intended behavior is clear;
- verification is repeatable;
- CI passes;
- contract impacts are resolved;
- no high-severity known regression is hidden;
- rollback is obvious enough for the team to recover quickly.

## Review responsibility
The feature owner provides evidence. The relevant domain lead checks domain correctness. Margaret owns the default final merge decision. This is deliberately lighter than requiring every teammate to approve every change.

## CI failure triage
Classify failure as `code`, `test`, `dependency`, `environment`, or `workflow`. Fix the cause; never disable a legitimate test just to turn CI green.
