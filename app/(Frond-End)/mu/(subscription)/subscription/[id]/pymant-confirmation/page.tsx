import SubscriptionOtpPayment from "@/app/(Frond-End)/mu/(subscription)/_component/SubscriptionOtpPayment";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <SubscriptionOtpPayment paymentId={id} />
    </div>
  );
}

export default page;
