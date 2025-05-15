import Image from "next/image"

export default function MiniAppHeader() {
  return (
    <div className="fixed top-0 left-0 right-0 bg-black border-b border-gray-800 p-4 z-50 shadow-lg">
      <div className="flex justify-center items-center h-32">
        <Image src="/images/moviemeter-logo.png" alt="MovieMeter" width={480} height={120} className="h-32 w-auto" />
      </div>
    </div>
  )
}
