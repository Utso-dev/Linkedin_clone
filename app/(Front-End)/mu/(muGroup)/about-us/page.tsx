import AboutUs from "@/app/(Front-End)/_components/mainPage/aboutUs/AboutUs";
import ConnectingExpertise from "@/app/(Front-End)/_components/mainPage/aboutUs/ConnectingExpertise";
import ContactUs from "@/app/(Front-End)/_components/mainPage/aboutUs/ContactUs";
import FAQ from "@/app/(Front-End)/_components/mainPage/aboutUs/Faq";
import VideoTutorial from "@/app/(Front-End)/_components/mainPage/aboutUs/VedioTutorial";
import WhoAre from "../../../_components/mainPage/aboutUs/WhoAre";

export default function page() {
  return (
    <div>
      <div>
        <AboutUs />
      </div>
      <div>
        <WhoAre />
      </div>
      <div>
        <ConnectingExpertise />
      </div>
      <div>{/* <MeetTheTeam /> */}</div>
      <div>
        <VideoTutorial />
      </div>
      <div>
        <FAQ />
      </div>
      <div>
        <ContactUs />
      </div>
    </div>
  );
}
