import StateDetails from "./_components/StateDetails"

export default async function page(props: { params: Promise<{ stateId: string }> }) {
    const params = await props.params
    const { stateId } = params
    return (
        <StateDetails id={stateId} />
    )
}
