import { CardLogin } from "@/components/login-card";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function Page () {
  return (
    <section className="flex jusctify-center items-center h-screen">
      <Card className="flex flex-row items-center justify-center w-[80%] mx-auto h-fit shadow-xl">
      <Image 
        className="hidden md:flex"
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