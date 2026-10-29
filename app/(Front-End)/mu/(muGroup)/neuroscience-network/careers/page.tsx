// app/(Frond-End)/mu/[id]/(muGroup)/neuroscience-network/careers/page.tsx

import { CareersHeader, CareersList } from "./_components";
import { careersData } from "./_mock/careersData";

export default function NeuroscienceCareersPage() {
    return (
        <div className="flex w-full flex-col items-start gap-6 px-4 py-6 sm:max-w-2xl md:max-w-4xl md:gap-10 md:px-0 md:py-10 lg:max-w-6xl xl:max-w-360">
            <CareersHeader />
            <CareersList sections={careersData} />
        </div>
    );
}
