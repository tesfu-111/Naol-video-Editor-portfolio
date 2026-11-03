# Security Specification & Threat Model

## 1. Data Invariants

1. **Admins Access Gate**: Only authenticated users whose `request.auth.uid` exists in the `/admins/{adminId}` collection (or verified owner email `tesfukebe000@gmail.com`) can mutate `portfolioProjects`, `services`, `siteSettings`, and `mediaAssets`, or read/update/delete `contactInquiries`.
2. **Public Read Integrity**: Unauthenticated visitors and clients may read `siteSettings`, `services`, and only **published** `portfolioProjects` (`published == true`). Draft projects can only be viewed by administrators.
3. **Public Inquiries Write-Only**: Anyone (public visitor or client) can submit a `contactInquiry` provided it strictly satisfies type, boundary, and required field rules. Visitors cannot list or read inquiries.
4. **Id Poisoning Guard**: All document identifiers in subcollections and paths must be alphanumeric plus hyphens/underscores, <= 128 characters.
5. **No Client Role Escalation**: Public users cannot create documents in `/admins` or grant themselves admin rights.
6. **Strict Field Whitelisting**: Every update and create must only include valid, declared schema attributes.

---

## 2. The "Dirty Dozen" Payloads (Red Team Test Cases)

1. **Unauthenticated Project Deletion**: Attempting to delete `/portfolioProjects/proj-1` without an auth session -> Expected: `PERMISSION_DENIED`.
2. **Unauthenticated Draft Read**: Public visitor attempting to read `/portfolioProjects/draft-item` where `published == false` -> Expected: `PERMISSION_DENIED`.
3. **Ghost Field Injection in Project Creation**: Admin or attacker attempting to write `{ id: 'proj-1', title: 'Test', isSuperUserBackdoor: true }` -> Expected: `PERMISSION_DENIED`.
4. **Massive Payload Resource Exhaustion**: Attempting to create an inquiry with a description string exceeding 3,000 characters or 1MB -> Expected: `PERMISSION_DENIED`.
5. **Inquiry Listing Attack**: Public visitor attempting to list `/contactInquiries` to scrape client contact info -> Expected: `PERMISSION_DENIED`.
6. **Self-Promote to Admin**: Unauthenticated or unauthorized user writing a new document to `/admins/{uid}` -> Expected: `PERMISSION_DENIED`.
7. **Modifying Inquiries from Public**: Public client trying to update or alter a previously submitted inquiry -> Expected: `PERMISSION_DENIED`.
8. **Malicious ID Path Poisoning**: Attempting to create a project with ID `../../root-hack/x` or non-alphanumeric junk characters -> Expected: `PERMISSION_DENIED`.
9. **Tampering Site Settings Without Admin**: Public visitor trying to update `/siteSettings/global` -> Expected: `PERMISSION_DENIED`.
10. **Unauthenticated Media Asset Write**: Unauthenticated attacker attempting to write directly to `/mediaAssets/fake` -> Expected: `PERMISSION_DENIED`.
11. **Altering Admin Record by Non-Admin**: Non-admin authenticated user trying to update `/admins/{targetUid}` -> Expected: `PERMISSION_DENIED`.
12. **Inquiry Deletion by Public**: Public visitor attempting to delete any client inquiry -> Expected: `PERMISSION_DENIED`.

---

## 3. Test Runner Specification (`firestore.rules.test.ts`)

The test suite validates that unauthenticated or unprivileged operations fail with `PERMISSION_DENIED` across all 12 scenarios.
