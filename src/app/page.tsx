import { HeaderWithoutAuth } from "@/shared/Header";

export default function Home() {
  return (
    <>
      <HeaderWithoutAuth />
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <div className="flex w-full h-full items-center justify-between">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-bold">Welcome to our app</h1>
              <p className="text-sm text-muted-foreground">
                This is a simple app to demonstrate the use of Next.js and
                Tailwind CSS.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
