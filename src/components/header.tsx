import React from 'react'


export const BackButton = () => (
    <div className='w-8 h-8 bg-white items-center justify-center flex rounded-md'>
        <div className='w-4 h-4'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><polygon points="3.828 9 9.899 2.929 8.485 1.515 0 10 .707 10.707 8.485 18.485 9.899 17.071 3.828 11 20 11 20 9 3.828 9" /></svg>
        </div>
    </div>
)


export const HomeButton = () => (
    <div className='w-8 h-8 bg-white items-center justify-center flex rounded-md'>
        <div className='w-4 h-4'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M8 20H3V10H0L10 0l10 10h-3v10h-5v-6H8v6z" /></svg>
        </div>
    </div>
)


export const HeaderLayout = ({children}: React.PropsWithChildren) => (
    <nav className='bg-slate-600 p-4'>
        <div className='flex w-full justify-center container mx-auto'>
            {children}
        </div>
    </nav>
)
