import React from 'react'

function Background({ children, className }) {
    return (
        <div>
            <div className={` h-full min-h-[600px] bg-[#FF90F4] overflow-hidden rounded-[40px] mx-16 ${className}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF90F4] to-[#7FFFD4]">
                    <div className="absolute inset-0 flex justify-center items-center">
                        <div className="text-center">
                            {children}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Background