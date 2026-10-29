"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight, Pause, ArrowRight, ArrowLeft } from "lucide-react";

import { useGetAboutUsQuery } from "@/feature/slice/aboutUs/aboutUs";



export default function VideoTutorial() {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);


    const [showIframe, setShowIframe] = useState(false);


    const { data, error, isLoading } = useGetAboutUsQuery({});

    const vedio = data?.data?.videos || [];
    

    const [selectedVideo, setSelectedVideo] = useState<any>(null);

    useEffect(() => {
        if (vedio.length > 0) {
            setSelectedVideo(vedio[0]);
        }
    }, [vedio]);

    const togglePlay = () => {
        if (!videoRef.current) return;

        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleVideoSelect = (video: any) => {
        setSelectedVideo(video);
        setIsPlaying(false);
        setShowIframe(false); // ⬅️ NEW - notun video select korle abar thumbnail thk shuru hobe
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -280, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 280, behavior: "smooth" });
        }
    };

    return (
        <div className="w-full container">
            <div className=" mx-auto py-8 md:py-12 lg:py-25  ">
                {/* Header Section */}
                <div className="mb-12 flex flex-col justify-center items-center md:items-start">
                    <p className="text-primaryColor text-xl font-semibold  ">
                        Key Features
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-black mt-3">
                        Video Tutorial
                    </h2>
                    <p className="text-[#404040] mt-4 text-lg font-normal max-w-2xl">
                        Learn how to make the most of Mind Unite with our step-by-step video guide
                    </p>
                </div>

                {/* Main Video Player */}
                {/* Main Video Player */}
                <div className="relative rounded-sm overflow-hidden  mb-12 aspect-video bg-[#0A0A0A] group">
                    {selectedVideo && (
                        <>
                            {selectedVideo.source === "file" ? (
                                <video
                                    ref={videoRef}
                                    key={selectedVideo.file_url}
                                    src={selectedVideo.file_url}
                                    poster={selectedVideo.thumbnail_url}
                                    className="w-full h-full object-cover"
                                    controls
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                />
                            ) : showIframe ? (
                                <iframe
                                    key={selectedVideo.url}
                                    src={`${selectedVideo.url}${selectedVideo.url?.includes("?") ? "&" : "?"}autoplay=1`}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <Image
                                    src={selectedVideo.thumbnail_url}
                                    alt={selectedVideo.title}
                                    fill
                                    unoptimized
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </>
                    )}

                    {/* Play/Pause Overlay Button */}
                    {selectedVideo?.source === "file" && (
                        <button
                            onClick={togglePlay}
                            className={`absolute inset-0 flex items-center justify-center ${isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                                }`}
                        >
                            <div className="rounded-full p-5">
                                {isPlaying ? (
                                    <Pause className="w-10 h-10 text-white" />
                                ) : (
                                    <Play className="w-10 h-10 text-white fill-white" />
                                )}
                            </div>
                        </button>
                    )}

                    {/* Youtube Play Overlay Button */}
                    {selectedVideo?.source !== "file" && !showIframe && (
                        <button
                            onClick={() => setShowIframe(true)}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="rounded-full p-5">
                                <Play className="w-10 h-10 text-white fill-white" />
                            </div>
                        </button>
                    )}
                </div>

                {/* Carousel Section */}
                <div className="relative">
                    {/* Carousel Container */}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
                    >
                        {vedio.map((video) => (
                            <div
                                key={video.file_url || video.url}
                                onClick={() => handleVideoSelect(video)}
                                className={`shrink-0 w-50 md:w-65 bg-white rounded-sm overflow-hidden border-2 cursor-pointer transition-all duration-300  ${selectedVideo?.title === video.title
                                    ? "border-primaryColor "
                                    : "border-[#EDEDED] hover:border-primaryColor/50"
                                    }`}
                            >
                                {/* Thumbnail */}
                                <div className="relative group overflow-hidden">
                                    <Image
                                        src={video.thumbnail_url}
                                        alt={video.title}
                                        width={260}
                                        height={146}
                                        className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-110"
                                        unoptimized
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = `https://via.placeholder.com/260x146/1A1A1A/00B2FF?text=Video+${video.id}`;
                                        }}
                                    />

                                    {/* Play Icon Overlay on Hover */}
                                    {/* <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="bg-[#00B2FF] rounded-full p-3 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                            {selectedVideo.id === video.id && isPlaying ? (
                                                <Pause className="w-5 h-5 text-white" />
                                            ) : (
                                                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                            )}
                                        </div>
                                    </div> */}

                                    {/* Duration Badge */}
                                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg font-medium">
                                        {video.duration}
                                    </div>

                                    {/* Active Indicator */}
                                    {selectedVideo?.title === video.title && (
                                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primaryColor " />
                                    )}
                                </div>

                                {/* Video Info */}
                                <div className="p-4">
                                    <p className="text-[#0F0F0F] text-base font-semibold tracking-wide truncate">
                                        {video.title}
                                    </p>
                                    <p className="text-sm text-[#0F0F0F] font-semibold mt-1">
                                        {video.edition}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={scrollLeft}
                        className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 bg-white shadow-xl p-2 md:p-3 rounded-full border border-[#EDEDED] hover:bg-gray-50  transition-all z-10 hover:border-primaryColor"
                    >
                        <ArrowLeft size={22} className="text-headerColor md:w-6 md:h-6" />
                    </button>

                    <button
                        onClick={scrollRight}
                        className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 bg-white shadow-xl p-2 md:p-3 rounded-full border border-[#EDEDED] hover:bg-gray-50 hover:shadow-2xl transition-all z-10 hover:border-primaryColor"
                    >
                        <ArrowRight size={22} className="text-headerColor md:w-6 md:h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}