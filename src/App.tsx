import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Inspiration from "./pages/Inspiration";
import Tipps from "./pages/Tipps";
import Profile from "./pages/Profile";
import Guides from "./pages/Guides";
import GuideDetail from "./pages/GuideDetail";
import GuidePostDetail from "./pages/GuidePostDetail";
import CreateGuidePost from "./pages/CreateGuidePost";
import CreateBlogPost from "./pages/CreateBlogPost";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import AdminReview from "./pages/AdminReview";
import AdminDestinations from "./pages/AdminDestinations";
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/inspiration" element={<Inspiration />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/guides/:id" element={<GuideDetail />} />
              <Route path="/guides/posts/:id" element={<GuidePostDetail />} />
              <Route path="/guides/create" element={<CreateGuidePost />} />
              <Route path="/admin/review" element={<AdminReview />} />
              <Route path="/admin/destinations" element={<AdminDestinations />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/create" element={<CreateBlogPost />} />
              <Route path="/tipps" element={<Tipps />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
