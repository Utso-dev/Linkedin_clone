import contactImage from "@/public/contact.jpg";
import Image from "next/image";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";

function ContactPage() {
  return (
    <div className="">
      <div className=" relative">
        <Image
          src={contactImage}
          alt="contact image"
          width={2500}
          height={200}
          className=" w-full h-24 lg:h-auto"
        />
        <div className=" absolute top-1/2 left-1/2 -translate-1/2">
          <h2 className=" text-3xl lg:text-[72px] text-whiteColor font-medium">
            {" "}
            Contact us
          </h2>
        </div>
      </div>

      <div className=" bg-bgLightColor py-10 lg:py-20">
        <div className="  md:grid md:grid-cols-10 lg:grid-cols-12  ">
          <div className="hidden lg:block lg:col-span-1"></div>
          <div className=" col-span-4">
            <ContactInfo />
          </div>
          <div className=" col-span-6">
            <ContactForm />
          </div>
          <div className="hidden lg:block lg:col-span-1"></div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
