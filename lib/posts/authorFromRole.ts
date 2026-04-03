import type { CoupleProfile, PostAuthorRole } from '@/lib/types/mvp';

/** Normalize role for display (defaults to boy). */
export function normalizePostAuthorRole(role: PostAuthorRole | null | undefined): PostAuthorRole {
  return role === 'girl' ? 'girl' : 'boy';
}

/** Label from couple_profile; fallback 他/她 when names missing. */
export function resolvePostAuthorDisplayName(
  authorRole: PostAuthorRole | null | undefined,
  profile: CoupleProfile | null,
): string {
  const role = normalizePostAuthorRole(authorRole);
  if (!profile) return role === 'boy' ? '他' : '她';
  const raw = role === 'boy' ? profile.boy_name : profile.girl_name;
  return raw?.trim() || (role === 'boy' ? '他' : '她');
}

export function resolvePostAuthorAvatarUrl(
  authorRole: PostAuthorRole | null | undefined,
  profile: CoupleProfile | null,
): string | undefined {
  const role = normalizePostAuthorRole(authorRole);
  if (!profile) return undefined;
  const url = role === 'boy' ? profile.boy_avatar : profile.girl_avatar;
  return url ?? undefined;
}
