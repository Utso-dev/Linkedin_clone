import Link from "next/link";

export default function ComingSoonCard() {
  return (
    <div>
      {/* Outer Card Container */}
      <div className="rounded-lg sm:rounded-xl bg-primaryColor/10 md:rounded-2xl lg:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 text-center space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="space-y-3">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-primaryColor">
            ADVERTISING OPPORTUNITIES
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1D1F2C]">
            Coming Soon!
          </h1>
        </div>

        {/* Content Paragraphs */}
        <div className="mx-auto mt-8 space-y-5 text-left text-base sm:text-lg leading-relaxed text-[#4A4C56]">
          <p>
            <span className="font-semibold text-primaryColor">
              Advertise with Mind Unite
            </span>{" "}
            and connect with a targeted audience of brain health professionals,
            researchers, academics, and industry experts.
          </p>

          <p>
            Whether you represent a university, research institution, private
            practice, healthcare organization, or industry partner, our
            advertising opportunities will help you promote your services,
            products, events, and professional opportunities to the right
            audience.
          </p>

          <p>
            <span className="font-semibold text-primaryColor">
              Mind Unite Advertising
            </span>{" "}
            is coming soon! We are working to bring you new ways to reach and
            engage with our growing professional community.
          </p>

          {/* Divider & Bottom Notice */}
          <div className="border-t border-[#DDE3EA] pt-5">
            <p className="text-[#4A4C56] leading-relaxed">
              Interested in advertising with us? Contact our team to discuss
              your advertising needs and explore available opportunities.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/mu/contact-us"
            className="inline-flex items-center justify-center rounded-full bg-primaryColor px-8 py-3 text-sm sm:text-base font-medium text-white shadow-sm transition-all active:scale-95"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}