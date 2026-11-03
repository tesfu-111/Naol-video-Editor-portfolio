/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Security Rules Unit & Red Team Test Suite
 * Tests all 12 "Dirty Dozen" attack vectors against firestore.rules
 */

export interface TestPayloadAssertion {
  id: string;
  description: string;
  collection: string;
  docId: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid?: string; email?: string } | null;
  data?: any;
  expectedResult: 'PERMISSION_DENIED' | 'ALLOWED';
}

export const DIRTY_DOZEN_SECURITY_TESTS: TestPayloadAssertion[] = [
  {
    id: 'T1_UNAUTHENTICATED_PROJECT_DELETE',
    description: 'Unauthenticated actor attempts to delete published portfolio project',
    collection: 'portfolioProjects',
    docId: 'proj-placeholder-shortform',
    operation: 'delete',
    auth: null,
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 'T2_UNAUTHENTICATED_DRAFT_READ',
    description: 'Public visitor attempts to read unpublished draft project',
    collection: 'portfolioProjects',
    docId: 'draft-secret-project',
    operation: 'get',
    auth: null,
    data: { published: false },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 'T3_SHADOW_GHOST_FIELD_INJECTION',
    description: 'Attempting to inject rogue privilege fields into portfolio project creation',
    collection: 'portfolioProjects',
    docId: 'proj-malicious',
    operation: 'create',
    auth: { uid: 'unauthorized-user', email: 'guest@example.com' },
    data: {
      id: 'proj-malicious',
      title: 'Hacked',
      category: 'Short-Form Content',
      fullVideoSource: 'https://evil.com/video.mp4',
      published: true,
      isSuperAdmin: true,
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 'T4_MASSIVE_STRING_DENIAL_OF_WALLET',
    description: 'Attempting to submit 5MB spam description in contact inquiry',
    collection: 'contactInquiries',
    docId: 'inq-overflow',
    operation: 'create',
    auth: null,
    data: {
      id: 'inq-overflow',
      fullName: 'Bot',
      email: 'bot@spam.com',
      description: 'A'.repeat(50000), // Exceeds 3000 size limit
      status: 'new',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 'T5_INQUIRY_LISTING_SCRAPE',
    description: 'Public visitor attempting to list contact inquiries to scrape client emails',
    collection: 'contactInquiries',
    docId: '',
    operation: 'list',
    auth: null,
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 'T6_SELF_PROMOTION_ADMIN_ESCALATION',
    description: 'Public user attempting to register themselves in admins collection',
    collection: 'admins',
    docId: 'attacker-uid',
    operation: 'create',
    auth: { uid: 'attacker-uid', email: 'attacker@evil.com' },
    data: { uid: 'attacker-uid', email: 'attacker@evil.com', role: 'admin' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 'T7_PUBLIC_INQUIRY_TAMPERING',
    description: 'Public user attempting to overwrite or alter a previously submitted inquiry',
    collection: 'contactInquiries',
    docId: 'inq-real-123',
    operation: 'update',
    auth: null,
    data: { status: 'reviewed' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 'T8_ID_PATH_POISONING',
    description: 'Attempting directory traversal or malicious characters in document ID',
    collection: 'portfolioProjects',
    docId: '../../system/passwd',
    operation: 'create',
    auth: { uid: 'admin-test', email: 'tesfukebe000@gmail.com' },
    data: { title: 'Traversal' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 'T9_TAMPER_GLOBAL_SITE_SETTINGS',
    description: 'Unauthenticated visitor attempting to alter homepage hero headline',
    collection: 'siteSettings',
    docId: 'global',
    operation: 'update',
    auth: null,
    data: { heroHeadline: 'Defaced Site' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 'T10_UNAUTHENTICATED_MEDIA_ASSET_WRITE',
    description: 'Unauthenticated attacker writing directly to mediaAssets metadata collection',
    collection: 'mediaAssets',
    docId: 'asset-fake',
    operation: 'create',
    auth: null,
    data: { url: 'https://evil.com/phish.exe' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 'T11_NON_ADMIN_ALTER_ADMINS',
    description: 'Standard authenticated user attempting to delete designated admin',
    collection: 'admins',
    docId: 'owner-admin-id',
    operation: 'delete',
    auth: { uid: 'regular-user', email: 'regular@user.com' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 'T12_PUBLIC_INQUIRY_DELETION',
    description: 'Unauthenticated actor attempting to delete customer inquiries',
    collection: 'contactInquiries',
    docId: 'inq-sample-1',
    operation: 'delete',
    auth: null,
    expectedResult: 'PERMISSION_DENIED',
  },
];

console.log(`[Security Test Suite] Registered ${DIRTY_DOZEN_SECURITY_TESTS.length} threat models.`);
