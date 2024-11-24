import React from 'react'

export interface MultiSelectDropdownProps<T extends string> {
    label: string
    options: readonly T[]
    onClick: (option: T) => void
    checkedOptions: readonly T[]
}

// https://www.prudkohliad.com/articles/multi-select-dropdown-with-react-and-tailwind-css-2023-10-17
export function MultiSelectDropdown<T extends string>({ options, onClick, label, checkedOptions }: MultiSelectDropdownProps<T>) {
    return (
        <label className="relative">
            <input type="checkbox" className="hidden peer" />
            <div className="h-8 rounded-s bg-gray-200 px-4 flex flex-row align-middle gap-2">
                {label}
                <div className="w-6">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>

            <div className="absolute bg-white border transition-opacity opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto">
                <ul>
                    {options.map(option => (
                        <li key={option}>
                            <label className="flex whitespace-nowrap cursor-pointer px-2 py-1 transition-colors hover:bg-blue-100 [&:has(input:checked)]:bg-blue-200">
                                <input
                                    type="checkbox"
                                    value={option}
                                    onClick={() => onClick(option)}
                                    checked={!!checkedOptions.includes(option)}
                                    className="cursor-pointer"
                                />
                                <span className="ml-1">{option}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </label>
    );
}

export interface SearchInputProps {
    searchItem?: string
    setSearchItem: (searchItem: string) => void
}

export const SearchInput = ({ searchItem, setSearchItem, }: SearchInputProps) => (
    <div className='w-48 flex items-center rounded-md px-2'>
        <div className='w-4'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" /></svg>
        </div>
        <input className='w-full h-full px-4' placeholder="search" value={searchItem} onChange={(e) => setSearchItem(e.target.value ?? '')} />
    </div>

)

export const SearchBar = ({ children }: React.PropsWithChildren) => (
    <div className='flex w-full container mx-auto justify-center gap-8'>
        {children}
    </div>
)


