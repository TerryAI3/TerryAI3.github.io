import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Office from "./pages/Office";
import School from "./pages/School";
import About from "./pages/About";
import Cases from "./pages/Cases";
import CaseDetail from "./pages/CaseDetail";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import Admin from "./pages/Admin";
import AdminSeries from "./pages/AdminSeries";
import AdminProductImport from "./pages/AdminProductImport";
import AdminCases from "./pages/AdminCases";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Layout from "./components/Layout";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Layout>
      <Switch>
        <Route path={"/login"} component={Login} />
        <Route path={"/reset-password"} component={ResetPassword} />
        <Route path={"/"} component={Home} />
        <Route path={"/office"} component={Office} />
        <Route path={"/school"} component={School} />
        <Route path={"/about"} component={About} />
        <Route path={"/cases"} component={Cases} />
        <Route path={"/cases/:id"} component={CaseDetail} />
        <Route path={"/products"} component={Products} />
        <Route path={"/products/:id"} component={ProductDetail} />
        <Route path={"/admin"} component={Admin} />
        <Route path={"/admin/products"} component={AdminProducts} />
        <Route path={"/admin/categories"} component={AdminCategories} />
        <Route path={"/admin/series"} component={AdminSeries} />
        <Route path={"/admin/import"} component={AdminProductImport} />
        <Route path={"/admin/cases"} component={AdminCases} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
