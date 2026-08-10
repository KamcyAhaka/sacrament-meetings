export { auth as proxy } from '@/auth';

export const config = {
  matcher: ['/meetings/new', '/meetings/:id/edit'],
};
