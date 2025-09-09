import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, locals }) => {
  const session = await locals.auth();
  let requestsCount;

  if (session?.user?.id) {
    requestsCount = await fetch('/api/requests/incoming/count?userId=' + session.user.id).then(res => res.json()).then(data => data.count || 0);
  }

  return {
    session,
    requestsCount
  };
};