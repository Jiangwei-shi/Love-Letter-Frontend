import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
// import Link from 'next/link';
import {
    BrowserRouter as Router,
    Route,
    Routes,
} from 'react-router-dom';
// import { Welcome } from '@/components/Welcome/Welcome';
// import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import { makeStore } from '@/lib/store';

const store = makeStore();
export default function HomePage() {
  return (
      <StoreProvider store={store}>
          <Router>
              <Routes>
                  <Route path="/login" element={<Login/>} />
              </Routes>
          </Router>
      {/*<Welcome />*/}
      {/*<ColorSchemeToggle />*/}
      {/*    <Link href="/login">Go to Login</Link>*/}
      </StoreProvider>
  );
}
