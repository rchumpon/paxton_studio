import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { assets } from "../../assets/assets";
const Footer = () => {
  return (
    <div className="bg-linear-to-b from-background via-secondary to-background px-6 md:px-16 lg:px-24 xl:px-32">
      {/* Creates 3 columns using fractions of the available space: 3fr, 1fr, and 1fr. */}
      <div className="flex flex-col sm:grid grid-cols-[2fr_1fr_1fr] gap-14 mt-40 text-sm pt-10">
        <div>
          <img src={assets.Paxton_Logo} alt="" className="w-24 h-auto" />
          <p className="w-full md:w-2/3 text-muted mb-5">
            Discover modern styles, quality essentials, and timeless pieces made
            for everyday comfort.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-muted">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-muted">
            <li>+1-212-456-7890</li>
            <li>contact@paxton.studio.com</li>
          </ul>
          <div className="flex items-center gap-3 mt-6 mb-5">
            <a href="#">
              <FaFacebook className="w-5 h-5 hover:text-hover" />
            </a>
            <a href="#">
              <FaInstagram className="w-5 h-5 hover:text-hover" />
            </a>
            <a href="#">
              <FaXTwitter className="w-5 h-5 hover:text-hover" />
            </a>
          </div>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          © {new Date().getFullYear()} Paxton Studio - All rights reserved.
        </p>
      </div>
    </div>
  );
};
export default Footer;
