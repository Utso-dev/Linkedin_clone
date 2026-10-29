import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import React from "react";

export default function AdvertisementViewDetails({ job }: { job: any }) {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 ">
        <div className="h-[258px] w-[226px] ">
          {job?.advertisImage && (
            <img
              className="h-[258px] object-center "
              src={job.advertisImage}
              alt="Advertisement"
            />
          )}
        </div>
        <div className="gap-y-2">
          <h3 className="text-grayColor1  text-[20px] font-semibold leading-[130%] tracking-[0.1px] pb-2">
            {job.advertiser}
          </h3>
          <CustomBadge
            color={job.status === "Active" ? "active" : "red"}
            className="text-xs"
          >
            {job.status}
          </CustomBadge>
          <div className="flex flex-col space-y-2 mt-4">
            <p className="text-grayColor1  text-[14px] font-normal leading-[140%] tracking-[0.07px]">
              Industry:{" "}
              <span className="font-semibold text-sm">{job.industry}</span>
            </p>
            <p className="text-grayColor1  text-[14px] font-normal leading-[140%] tracking-[0.07px]">
              Impression:{" "}
              <span className="font-semibold text-sm">{job.impression}</span>
            </p>
            <p className="text-grayColor1  text-[14px] font-normal leading-[140%] tracking-[0.07px]">
              Clicks:{" "}
              <span className="font-semibold text-sm">{job.clicks}</span>
            </p>
            <p className="text-grayColor1  text-[14px] font-normal leading-[140%] tracking-[0.07px]">
              CTR:{" "}
              <span className="font-semibold text-sm font-Inter">
                {job.ctr}
              </span>
            </p>
            <p className="text-grayColor1  text-[14px] font-normal leading-[140%] tracking-[0.07px]">
              Joined:{" "}
              <span className="font-semibold text-sm">{job.joined}</span>
            </p>
          </div>
        </div>
      </div>
      <p className="mt-8 mb-0.5 text-grayColor1  text-base not-italic font-semibold leading-6 tracking-[0.08px] ">
        Description
      </p>
      <div className="border rounded-xl">
        <h4 className="p-4">{job?.desc}</h4>
      </div>
    </div>
  );
}
