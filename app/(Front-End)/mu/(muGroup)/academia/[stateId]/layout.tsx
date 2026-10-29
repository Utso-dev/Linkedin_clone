import StateLayout from "./_components/StateLayout";

export default function layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <StateLayout>
            {children}
        </StateLayout>
    );
}
