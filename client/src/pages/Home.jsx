import BestSeller from "../components/layout/BestSeller";
import Hero from "../components/layout/Hero";
import Lastestcollection from "../components/layout/Lastestcollection";
import Newsletter from "../components/common/Newsletter";
import OurPolicy from "../components/layout/OurPolicy";

const Home = () => {
  return (
    <div>
      <Hero />
      <Lastestcollection />
      <BestSeller />
      <OurPolicy />
      <Newsletter />
    </div>
  );
};
export default Home;
