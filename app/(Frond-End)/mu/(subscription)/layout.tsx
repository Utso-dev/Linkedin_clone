import { headers } from "next/headers";


export default async function FrontEndLayout({
  children,
  
}: {
  children: React.ReactNode;
}) {

  return (
    <div>
      <div className="">
     
       
        <div>{children}</div>
      </div>
    </div>
  );
}
