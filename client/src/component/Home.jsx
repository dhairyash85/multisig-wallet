import { ArrowRight, Bitcoin, Lock, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';


export default function Home() {
    const navigate = useNavigate(); 

    return (
        <div className="min-h-screen bg-white">
            
            <Nav />
            <main>
                <section className="w-full">
                    <div className=" grid lg:grid-cols-2 gap-6 px-4 md:px-32 mt-6">
                        <div className="flex flex-col justify-center space-y-8 pt-12">
                            <div className="inline-flex">
                                <button className="px-6 py-2 border border-[#E2F9F3] bg-[#E2F9F3] rounded-full flex items-center hover:bg-[#E2F9F3]"
                                onClick={()=>{navigate('/wallet')}}
                                >
                                    <span className="text-sm font-medium">Join Now</span>
                                    <div className="ml-2 h-4 w-4">
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </button>
                                <button className="px-6 py-2 border border-transparent rounded-full flex ml-2 bg-transparent hover:bg-gray-100">
                                    BUILD ON MULTISIG
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-5xl font-bold tracking-tighter sm:text-7xl">
                                    Build The MultiSIG
                                    <br />
                                    Wallet
                                </h1>
                                <p className="max-w-[600px] text-gray-500 md:text-xl lg:text-base xl:text-xl">
                                    We're Breaking Through Scalability Limits While
                                    <br />
                                    Keeping Security And Decentralization Intact.
                                </p>
                            </div>
                            <div className="overflow-hidden w-[500px]">
                                <div className="flex  gap-8">
                                    <div className="flex-shrink-0 p-6 bg-white border-2 rounded-3xl ">
                                        <Lock className="h-6 w-6 mb-2" />
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium">Security</h3>
                                            <p className="text-4xl font-bold">100%</p>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 p-6 bg-[#FFFD54] rounded-3xl border-none">
                                        <Bitcoin className="h-6 w-6 mb-2" />
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium">Transactions</h3>
                                            <p className="text-4xl font-bold">100K</p>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0 p-6 bg-white border-2 rounded-3xl">
                                        <Zap className="h-6 w-6 mb-2" />
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium">Faster Speeds</h3>
                                            <p className="text-4xl font-bold">10X</p>
                                        </div>
                                    </div>


                                </div>
                            </div>

                        </div>
                        <div className="relative h-full min-h-[600px] bg-[#FF90F4] rounded-[40px] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FF90F4] to-[#7FFFD4]">
                                <div className="absolute inset-0 grid place-items-center">
                                    <div className="relative w-96 h-96">
                                        {/* shapes */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#4A3AFF] rounded-full opacity-80 blur-sm animate-pulse" />
                                        <div className="absolute top-1/4 left-1/4 w-32 h-16 bg-[#FFE55C] rounded-xl transform rotate-45 opacity-80" />
                                        <div className="absolute bottom-1/4 right-1/4 w-32 h-16 bg-[#4A3AFF] rounded-xl transform -rotate-45 opacity-80" />
                                        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-[#7FFFD4] rounded-xl transform rotate-12 opacity-80" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div >
    )
}
