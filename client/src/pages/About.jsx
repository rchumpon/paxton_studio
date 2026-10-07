import { assets } from "../assets/assets";
import Title from "../components/common/Title";
import Newsletter from "../components/common/Newsletter";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img className="w-full md:max-w-112.5" src={assets.about_img} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w2/4 text-secondary-foreground">
          <p className="text-muted/80">
            <span className="font-bold text-lg text-primary">
              Paxton Studio
            </span>{" "}
            was created from a passion for fashion and a desire to make online
            shopping simple, accessible, and enjoyable. Our goal is to provide
            customers with a modern platform where they can easily discover,
            explore, and shop for clothing from the comfort of their own home.
          </p>
          <p className="text-muted/80">
            We offer a carefully selected range of stylish, quality clothing for
            different tastes and everyday lifestyles. From essential basics to
            modern fashion pieces, Paxton Studio makes it easy to discover
            clothing you will love.
          </p>
          <b className="text-secondary-foreground">Our Mission</b>
          <p className="text-muted/80">
            Our mission at Paxton Studio is to make fashion simple, accessible,
            and enjoyable. We offer stylish, quality clothing at accessible
            prices while creating a seamless shopping experience for every
            customer.
          </p>
        </div>
      </div>
      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="flex flex-col gap-5 border border-border px-10 md:px-16 py-8 sm:py-20">
          <b>Quality Assurance:</b>
          <p className="text-muted/80">
            We carefully select quality clothing to ensure our customers receive
            stylish and reliable pieces they can enjoy every day.
          </p>
        </div>
        <div className="flex flex-col gap-5 border border-border px-10 md:px-16 py-8 sm:py-20">
          <b>Convenience:</b>
          <p className="text-muted/80">
            Our online store makes it simple to browse, discover, and shop for
            your favourite styles from anywhere.
          </p>
        </div>
        <div className="flex flex-col gap-5 border border-border px-10 md:px-16 py-8 sm:py-20">
          <b>Exceptional Customer Service:</b>
          <p className="text-muted/80">
            We are committed to providing friendly and helpful support to make
            every customer's shopping experience smooth and enjoyable.
          </p>
        </div>
      </div>
      <Newsletter />
    </div>
  );
};
export default About;
