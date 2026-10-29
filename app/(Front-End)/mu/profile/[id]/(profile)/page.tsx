import ProfileHeroSection from "@/app/(Front-End)/_components/mainPage/profile/ProfileHeroSection";
import ProfileLockedContent from "@/app/(Front-End)/_components/mainPage/profile/ProfileLockedContent";

async function page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  return (
    <div className="space-y-6">
      <ProfileHeroSection userId={id} />
      <ProfileLockedContent userId={id} />
    </div>
  );
}
export default page;
