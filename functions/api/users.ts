import { verifyClerkRequest } from '../_lib/clerkAuth';

interface Env {
  CLERK_SECRET_KEY?: string;
  CLERK_ISSUER?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

interface ClerkUserApiItem {
  id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string;
  primary_email_address_id: string | null;
  email_addresses: Array<{ id: string; email_address: string }>;
  public_metadata?: { role?: string };
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

const VALID_ROLES = new Set(['', 'editor', 'admin']);

export async function onRequestGet({ request, env }: PagesContext) {
  if (!env.CLERK_SECRET_KEY) {
    return json({ ok: false, error: 'CLERK_SECRET_KEY is not configured.' }, 503);
  }

  const caller = await verifyClerkRequest(request, env.CLERK_ISSUER);
  if (!caller) {
    return json({ ok: false, error: 'Authentication required.' }, 401);
  }
  if (caller.role !== 'admin') {
    return json({ ok: false, error: 'Admin role required.' }, 403);
  }

  const url = new URL(request.url);
  const query = (url.searchParams.get('query') || '').trim();
  const clerkUrl = new URL('https://api.clerk.com/v1/users');
  clerkUrl.searchParams.set('limit', '50');
  clerkUrl.searchParams.set('order_by', '-created_at');
  if (query) {
    clerkUrl.searchParams.set('query', query);
  }

  const res = await fetch(clerkUrl.toString(), {
    headers: {
      Authorization: `Bearer ${env.CLERK_SECRET_KEY}`,
    },
  });
  if (!res.ok) {
    return json({ ok: false, error: 'Could not load users from Clerk.' }, 502);
  }

  const raw = (await res.json()) as ClerkUserApiItem[];
  const users = raw.map((u) => {
    const primary =
      u.email_addresses.find((e) => e.id === u.primary_email_address_id)?.email_address ??
      u.email_addresses[0]?.email_address ??
      '';
    const name = [u.first_name, u.last_name].filter(Boolean).join(' ') || primary || 'Reader';
    return {
      id: u.id,
      name,
      email: primary,
      imageUrl: u.image_url,
      role: String(u.public_metadata?.role || '').toLowerCase(),
    };
  });

  return json({ ok: true, users });
}

export async function onRequestPatch({ request, env }: PagesContext) {
  if (!env.CLERK_SECRET_KEY) {
    return json({ ok: false, error: 'CLERK_SECRET_KEY is not configured.' }, 503);
  }

  const caller = await verifyClerkRequest(request, env.CLERK_ISSUER);
  if (!caller) {
    return json({ ok: false, error: 'Authentication required.' }, 401);
  }
  if (caller.role !== 'admin') {
    return json({ ok: false, error: 'Admin role required.' }, 403);
  }

  let body: { userId?: string; role?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, error: 'Invalid JSON body.' }, 400);
  }

  const userId = (body.userId || '').trim();
  const nextRole = String(body.role || '').trim().toLowerCase();
  if (!userId || !VALID_ROLES.has(nextRole)) {
    return json({ ok: false, error: 'Valid userId and role (admin, editor, or "") required.' }, 400);
  }
  if (userId === caller.userId && nextRole !== 'admin') {
    return json({ ok: false, error: 'You cannot remove your own admin role.' }, 400);
  }

  const res = await fetch(
    `https://api.clerk.com/v1/users/${encodeURIComponent(userId)}/metadata`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_metadata: {
          role: nextRole || null,
        },
      }),
    }
  );

  if (!res.ok) {
    return json({ ok: false, error: 'Failed to update user role in Clerk.' }, 502);
  }

  return json({ ok: true, userId, role: nextRole });
}
