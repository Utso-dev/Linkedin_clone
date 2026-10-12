import IndustryHeroSection from "../../(pro-industry)/industry-profile/_component/IndustryHeroSection";


async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="">
      value of id is {id}
    </div>
  );
}

export default page;
