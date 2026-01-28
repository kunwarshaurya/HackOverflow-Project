import Navbar from "./Navbar"; // Changed from "./Navvbar"
import Sidebar from "./sidebar";
import useAuth from "../../hooks/useAuth";

const MainLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Top Navigation (Always visible) */}
      <Navbar />

      <div className="flex pt-16">
        {/* 2. Sidebar (Only visible if logged in) */}
        {isAuthenticated && (
          <aside className="w-64 fixed h-full z-10">
            <Sidebar />
          </aside>
        )}

        {/* 3. Main Content Area */}
        {/* If authenticated, push content to the right to make room for Sidebar */}
        <main
          className={`flex-1 p-6 transition-all duration-300 ${
            isAuthenticated ? "ml-64" : "ml-0"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;