import { CardLogin } from "@/components/login-card";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function Page () {
  return (
    <section className="relative flex jusctify-center items-center h-screen">
       <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      <Card className="flex flex-row items-center justify-center w-[70%] container mx-auto h-fit shadow-xl backdrop-blur-sm p-8">
      <Image 
        className="hidden md:flex "
        src="/login-img.jpg"
        alt="logo"
        width={500}
        height={500}
      />
      <CardLogin /> 
      </Card>
    </section>
  )
}