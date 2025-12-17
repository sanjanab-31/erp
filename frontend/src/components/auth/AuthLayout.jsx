import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen flex font-poppins bg-white">
            {}
            <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col justify-center items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 opacity-90"></div>
                {}
                <div className="relative z-10 flex flex-col items-center text-center px-12">
                    <div >
                        <img src="https://res.cloudinary.com/dfflvhcbx/image/upload/v1764820736/download-removebg-preview_i5gn9t.png" alt="" /> 
                    </div>
                    <h1 className="text-4xl font-bold text-white mt-8 mb-4 tracking-tight leading-tight text-center">
                        Sri Eshwar <br /> Course Management
                    </h1>
                    <p className="text-blue-100 text-lg max-w-md leading-relaxed text-center">
                        Your gateway to seamless learning and academic excellence.
                    </p>
                </div>

                {}
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            </div>

            {}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-1/2 xl:px-24 bg-white">
                <div className="mx-auto w-full max-w-sm lg:max-w-md">
                    <div className="text-center mb-10">
                        {}
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="w-20">
                                <img
                                    src="https://res.cloudinary.com/dfflvhcbx/image/upload/v1764820736/download-removebg-preview_i5gn9t.png"
                                    alt="Sri Eshwar Logo"
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>

                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight text-center">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="mt-2 text-base text-gray-600 font-medium text-center">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="mt-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
