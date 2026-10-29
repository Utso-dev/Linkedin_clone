import { neuroscienceFields } from "../_mock/neuroscienceData";
import { NeuroscienceHeader } from "../_components";
import { NeuroscienceFieldsList } from "../_components";

export default function NeuroscienceFieldsPage() {
    return (
        <div className="flex w-full flex-col items-start justify-end gap-6 px-4 py-6 sm:max-w-2xl md:max-w-4xl md:gap-10 md:px-0 md:py-10 lg:max-w-6xl xl:max-w-360">
            <NeuroscienceHeader />
            <NeuroscienceFieldsList fields={neuroscienceFields} />
        </div>
    );
}
