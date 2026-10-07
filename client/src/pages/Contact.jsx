import { assets } from "../assets/assets";
import Title from "../components/common/Title";
import Newsletter from "../components/common/Newsletter";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img src={assets.contact_us} alt="" className="w-full md:max-w-120" />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-primary">Our Store</p>
          <p className="text-muted/80">
            998 Suite 350 Rialto Building
            <br /> Collins Street, Melbourne VIC
          </p>
          <p className="text-muted/80">
            Tel: (+61) 1234 567 890 <br /> Email: contact@paxton.studio.com
          </p>
          <p className="font-semibold text-xl text-primary">
            Careers at Paxton Studio
          </p>
          <p className="text-muted/80">
            Learn more about our team and explore our current job opportunities.
          </p>
          <button className="border border-border px-8 py-4 text-sm rounded-lg hover:bg-secondary-foreground hover:text-secondary transition-all duration-500">
            Explore Jobs
          </button>
        </div>
      </div>
      <Newsletter />
    </div>
  );
};
export default Contact;
