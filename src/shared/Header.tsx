import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/shared/ThemeToggle";

export const HeaderWithoutAuth = () => {
  return (
    <header className="bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <Image
                  className="h-8 w-8"
                  src="/favicon.ico"
                  alt="Logo"
                  width={32}
                  height={32}
                />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4 font-semibold">
            <Link className="hover:underline" href="/login">
              Login
            </Link>
            <Link className="hover:underline" href="/signup">
              Signup
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export const Header = () => {
  return (
    <header className="bg-white dark:bg-black">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end h-16">
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
