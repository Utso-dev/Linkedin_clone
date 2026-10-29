import ProfileEducationList from "../../_components/mainPage/profile/Education/ProfileEducationList";
import ProfileExpreance from "../../_components/mainPage/profile/expreance/ProfileExpreance";
import ProfileAbout from "../../_components/mainPage/profile/ProfileAbout";
import ProfileHeroSection from "../../_components/mainPage/profile/ProfileHeroSection";
import ProfilePostList from "../../_components/mainPage/profile/ProfilePostList";

function ProfilePages() {
  return (
    <div>
      <div className="space-y-6">
        <ProfileHeroSection />

        <div>
          <ProfileAbout />
          <ProfilePostList />
          <ProfileExpreance />
          <ProfileEducationList />
        </div>
      </div>
    </div>
  );
}

export default ProfilePages;
