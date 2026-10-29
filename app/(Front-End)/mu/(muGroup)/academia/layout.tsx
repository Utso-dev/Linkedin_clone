import AcademiaLayout from "./_components/AvademiaLayout";

export default function layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AcademiaLayout>
            {children}
        </AcademiaLayout>
    );
}
