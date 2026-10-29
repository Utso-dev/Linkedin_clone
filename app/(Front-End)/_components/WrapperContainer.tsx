export default function WrapperContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-full grid container py-8! sm:py-12! md:py-16! lg:py-24! xl:py-[100px]!">
            {children}
        </div>
    )
}