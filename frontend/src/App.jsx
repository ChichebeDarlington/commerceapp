import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomePage from "./pages/Home2";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import { Toaster } from "react-hot-toast";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { useUserStore } from "./stores/useUserStore";
import CategoryPage from "./pages/Category";
import CartPage from "./pages/Cart";
import PurchaseSuccessPage from "./pages/PurchaseSuccess";
import PurchaseCancelPage from "./pages/PurchaseCancel";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/secret-dashboard",
        element: <Admin />,
      },
      {
        path: "/category/:category",
        element: <CategoryPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/purchase-success",
        element: <PurchaseSuccessPage />,
      },
      {
        path: "/purchase-cancel",
        element: <PurchaseCancelPage />,
      },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute top-0 left-1/2 translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top, rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%
          )]"
          ></div>
        </div>
      </div>

      <div className="relative z-50 pt-20">
        <RouterProvider router={router} />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
