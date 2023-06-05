import { Inter } from "next/font/google";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useRouter } from "next/router";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <div className="w-3/12 flex justify-between">
        <Link href={"/agency/signin"} className="btn-primary-color-changing py-2 px-4 w-40 text-lg rounded-[26px]">
          Agency Login
        </Link>

        <Link href={"/user/signin"} className="btn-secondary-color-changing py-2 px-4 w-40 text-lg  rounded-[26px]">
          User Login
        </Link>  
      </div>
    </ScreenWrapper>
  );
}
