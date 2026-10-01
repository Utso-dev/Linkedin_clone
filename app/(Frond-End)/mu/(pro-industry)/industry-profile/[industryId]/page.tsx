import IndustryHeroSection from "../_component/IndustryHeroSection";

async function page({ params }: { params: Promise<{ industryId: string }> }) {
  const { industryId } = await params;
  return (
    <div>
      <IndustryHeroSection userId={industryId} />
    </div>
  );
}

export default page;
