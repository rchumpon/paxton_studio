import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import SearchBar from "../components/layout/SearchBar";
import Footer from "../components/layout/Footer";

const MainLayout = () => {
  return (
    <>
      <div className="bg-linear-to-b from-background/20 via-secondary to-background">
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
          <Navbar />
          <SearchBar />
        </div>
      </div>

      {/* Page Content */}
      <main className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
};
export default MainLayout;
