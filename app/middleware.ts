import { NextRequest, NextResponse } from 'next/server';
import { supabase } from './lib/supabaseClient';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('sb:token')?.value;
  const url = req.nextUrl.clone();

  if (!token) {
    if (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/admin')) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  const { data: profile } = await supabase.from<{ role: string }>('profiles').select('role').eq('id', user.id).single();

  if (!profile) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith('/admin') && profile.role !== 'admin') {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith('/dashboard') && profile.role === 'admin') {
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};