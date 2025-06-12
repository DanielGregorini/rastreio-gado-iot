import Image from "next/image";

export default function Custom404() {
  return (
    <main className="min-h-screen">
      <Image
        src="/404.png"
        alt="404 Not Found"
        width={500}
        height={500}
        className="mx-auto mt-20"
      />
    
    </main>
  );
}
