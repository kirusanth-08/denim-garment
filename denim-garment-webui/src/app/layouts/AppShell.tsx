import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { CartDrawer } from '../../features/cart/components/CartDrawer';
import { TopNav } from './TopNav';

export const AppShell = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen text-ink">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-5rem] top-[-4rem] h-52 w-52 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute right-[-6rem] top-24 h-72 w-72 rounded-full bg-forest/15 blur-3xl" />
        <div className="absolute bottom-[-4rem] left-1/3 h-48 w-48 rounded-full bg-accentSoft/30 blur-3xl" />
      </div>

      <TopNav onOpenCart={() => setCartOpen(true)} />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Outlet />
      </main>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};
