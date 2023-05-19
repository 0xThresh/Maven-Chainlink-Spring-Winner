const ScreenWrapper = ({children}:{children:any}) => {
    return (
        <main
          className='bg-bgColor h-[100vh] w-full flex flex-col items-center justify-center'
        >
          <img src="/assets/logo.svg" alt="" className='h-40 w-40' />
          {children}
        </main>
      )
}

export default ScreenWrapper