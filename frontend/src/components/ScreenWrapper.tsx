import Image from "next/image";

const ScreenWrapper = ({children}:{children:any}) => {

  return (
    <main
      className="bg-bgColor h-[100vh] w-full flex flex-col items-center justify-center"
    >
      <Image height={50} width={50} src="/assets/logo.svg" alt="" className="h-40 w-40" />
      {children}
    </main>
  );
};


export default ScreenWrapper;