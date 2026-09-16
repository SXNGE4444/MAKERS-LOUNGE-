# Skill — Deployment / Release

## Trigger
Use when creating a preview, deploying to Vercel/Cloudflare, preparing a mobile build, or submitting the final hackathon project.

## Release ladder
1. Local feature verification.
2. Pull-request CI.
3. Preview/staging deployment.
4. Smoke test the primary demo path.
5. Production/final deployment.
6. Record the exact URL, commit SHA and verification result.

## Web
Prefer the platform that best matches the actual app. Vercel is a natural path for this Next.js control room; Cloudflare is valid for compatible frontends/workers. Do not introduce a second hosting platform just for novelty.

## Mobile
For React Native/Expo work, keep development builds separate from submission artifacts. Native iOS export requires macOS/Xcode and Apple signing assets; Android release artifacts require the appropriate keystore/signing path. Never commit signing material.

## Release evidence
```text
COMMIT:
ENVIRONMENT:
URL / ARTIFACT:
SMOKE TEST:
KNOWN LIMITATIONS:
ROLLBACK:
```

## Final rule
A deployed URL is not proof of readiness. The judged path must be tested against that exact deployment after the final merge.
