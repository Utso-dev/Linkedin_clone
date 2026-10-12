import React from 'react'
import IndustryHeroSection from '../../(pro-industry)/industry-profile/_component/IndustryHeroSection';

async function layout({ children , params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="py-10 md:py-14 xl:py-20">
      <IndustryHeroSection userId={id} />
 
        {children}
    </div>
  )
}

export default layout