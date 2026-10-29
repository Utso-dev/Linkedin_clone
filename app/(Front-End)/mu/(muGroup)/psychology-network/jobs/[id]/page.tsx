import React from 'react'

function page({params}: {params: {id: string}}) {
    const networkType = params.id;
  return (
    <div>
        Network type to filter is {networkType}
    </div>
  )
}

export default page