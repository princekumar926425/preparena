import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index.tsx";
import DSASheet from "./pages/DSASheet.tsx";
import ProblemDetail from "./pages/ProblemDetail.tsx";
import Subjects from "./pages/Subjects.tsx";
import Contests from "./pages/Contests.tsx";
import NotFound from "./pages/NotFound.tsx";
import Aptitude from "./pages/Aptitude";
import Lecture from "./pages/Lecture";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Videos from "./pages/Videos";

import Signup from "./components/Signup";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>

      <div className="bg-background text-foreground min-h-screen transition-colors duration-300">

        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>

            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 🔐 PROTECTED ROUTES */}
            <Route path="/dsa" element={
              <ProtectedRoute>
                <DSASheet />
              </ProtectedRoute>
            } />

            <Route path="/problem/:id" element={
              <ProtectedRoute>
                <ProblemDetail />
              </ProtectedRoute>
            } />

            <Route path="/subjects" element={
              <ProtectedRoute>
                <Subjects />
              </ProtectedRoute>
            } />

            <Route path="/contests" element={
              <ProtectedRoute>
                <Contests />
              </ProtectedRoute>
            } />

            <Route path="/aptitude" element={
              <ProtectedRoute>
                <Aptitude />
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/lecture/:id" element={
              <ProtectedRoute>
                <Lecture />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />

            <Route path="/videos" element={
              <ProtectedRoute>
                <Videos />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>

      </div>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;