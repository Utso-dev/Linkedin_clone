import React from 'react'
import CustomApplyForm from '../../../jobs/_component/CustomApplyForm';

async function page({params}: {params: Promise<{id:string}>}) {
    const {id} = await params;
  return (
    <div>
      <CustomApplyForm jobId={id} />
    </div>
  )
}

export default page