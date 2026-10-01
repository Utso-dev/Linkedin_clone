import BasicUserActivity from "@/app/(Frond-End)/_components/adminDashboard/usermanagement/BasicUser/BasicUserActivity";
import { initialJobs } from "@/app/(Frond-End)/_components/adminDashboard/usermanagement/BasicUser/BasicUserDemoData";
import BasicUserDetails from "@/app/(Frond-End)/_components/adminDashboard/usermanagement/BasicUser/BasicUserDetails";
import Coverphoto from "@/public/images/admin/advertise1.png";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log("initialJobs:", initialJobs);

  const user = initialJobs.find((item) => item.id === Number(id));

  console.log("Selected User:", user);

  return (
    <div>
      <div className="w-full h-[225px] rounded-lg overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={Coverphoto.src}
          alt=""
        />
      </div>
      <div className="w-[480px] bg-white -mt-9 ml-5">
        <img src={user.img} alt="ald" />
      </div>
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <p className="text-lg text-headerColor font-semibold mt-2">
            {user.name}
          </p>
          <p>location</p>
          <p>Total Connection</p>
        </div>
        <div>
          <p className="text-grayColor1 text-[14px] font-semibold leading-[140%] tracking-[0.07px]">
            Company Name & <br /> Logo
          </p>
          <p className="text-grayColor1 text-[14px] font-semibold leading-[140%] tracking-[0.07px] mt-3">
            Graduated institution <br /> Name
          </p>
        </div>
      </div>

      <div className="my-8">
        <div className="w-full ">
          <p className="text-headerColor text-[20px] font-semibold leading-[130%] tracking-[0.1px]">
            About
          </p>
          <p className="text-descriptionColor text-[16px] font-normal leading-[150%] tracking-[0.08px] overflow-hidden text-ellipsis mt-4">
            I’m a UI/UX designer focused on creating intuitive, visually
            engaging, and user-centered digital experiences for websites and
            mobile applications. I specialize in transforming complex ideas into
            simple, functional, and aesthetically pleasing interfaces. Currently
            working as a freelance UI/UX designer, I collaborate with clients to
            design modern landing pages, SaaS dashbo
          </p>
        </div>
      </div>
      <div>
        <BasicUserDetails user={user} />
      </div>
      <div>
        <BasicUserActivity user={user} />
      </div>
    </div>
  );
}
