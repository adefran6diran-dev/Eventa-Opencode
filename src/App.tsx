import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from './store/appStore';
import { BottomNav } from './components/layout/BottomNav';
import { LoginPage } from './features/auth/LoginPage';
import { SignupPage } from './features/auth/SignupPage';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage';
import { HomePage } from './features/home/HomePage';
import { VendorsPage } from './features/vendors/VendorsPage';
import { BookingsPage } from './features/bookings/BookingsPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { VendorDashboardPage } from './features/vendor/VendorDashboardPage';
import { VendorRequestsPage } from './features/vendor/VendorRequestsPage';
import { VendorProfilePage } from './features/vendor/VendorProfilePage';
import { AdminDashboardPage } from './features/admin/AdminDashboardPage';
import { VendorApplyPage } from './features/apply/VendorApplyPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAppStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicLayout() {
  return (
    <div className="min-h-[100dvh] bg-obsidian mx-auto" style={{ maxWidth: 480 }}>
      <Outlet />
      <BottomNav role="client" />
    </div>
  );
}

function ClientLayout() {
  return (
    <div className="min-h-[100dvh] bg-obsidian mx-auto" style={{ maxWidth: 480 }}>
      <Outlet />
      <BottomNav role="client" />
    </div>
  );
}

function VendorLayout() {
  const user = useAppStore((s) => s.user);
  if (!user || user.role !== 'vendor') return <Navigate to="/login" replace />;
  return (
    <div className="min-h-[100dvh] bg-obsidian mx-auto" style={{ maxWidth: 480 }}>
      <Outlet />
      <BottomNav role="vendor" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#12121A',
            color: '#F8F4EC',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 8,
            fontSize: 13,
          },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot" element={<ForgotPasswordPage />} />
          <Route path="/apply" element={<VendorApplyPage />} />

          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/vendors" element={<VendorsPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <VendorLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<VendorDashboardPage />} />
            <Route path="/requests" element={<VendorRequestsPage />} />
            <Route path="/v-profile" element={<VendorProfilePage />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <div className="min-h-[100dvh] bg-obsidian mx-auto" style={{ maxWidth: 480 }}>
                  <AdminDashboardPage />
                </div>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
