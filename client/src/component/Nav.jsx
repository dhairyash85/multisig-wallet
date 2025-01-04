import React from 'react'
import { useNavigate } from 'react-router-dom';

function Nav() {
    const navigate = useNavigate(); 

    return (
        <div  className=' mx-16'>
            <header className="px-4 lg:px-6 h-20 flex items-center">
                <a className="flex items-center justify-center" href="/">
                    <span className="text-2xl font-bold tracking-tighter">ISTE</span>
                </a>
                <nav className="ml-auto flex gap-6 items-center">
                    <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
                        Home
                    </a>
                    <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
                        About
                    </a>
                    <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
                        Technology
                    </a>
                    <button className="px-4 py-2 border border-gray-300 rounded-full bg-white hover:bg-gray-100"
                        onClick={() => { navigate("/wallet") }}
                    >
                        Join Now
                    </button>
                </nav>
            </header>
        </div>
    )
}

export default Nav