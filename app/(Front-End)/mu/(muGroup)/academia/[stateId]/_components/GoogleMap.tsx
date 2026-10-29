"use client"

import { useEffect } from "react";

type GoogleMapProps = {
    state?: string;
    zoom?: number;
    query?: string; // optional custom search term, default "universities"
};

export default function GoogleMap({ state, zoom = 7, query = "universities" }: GoogleMapProps) {
    // Build search: e.g. "universities in California, USA"
    const searchTerm = `${query} in ${state}, USA`;
    const iframeSrc = `https://www.google.com/maps/d/embed?mid=1Xc4JHJWbJg8z4T8pcHJMUrIXXVnJI7c&ehbc=2E312F&z=${zoom}&output=embed`;

    useEffect(() => {
        console.log("GoogleMap iframeSrc updated:", iframeSrc);
    }, [iframeSrc])

    return (
        <div className="w-full h-full">
            <iframe
                src={iframeSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map of ${query} in ${state}`}
            />
        </div>
    );
}