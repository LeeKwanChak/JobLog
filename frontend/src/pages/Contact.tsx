import React from "react";
import { FaGithub, FaEnvelope, FaPhone } from "react-icons/fa";

const Contact: React.FC = () =>{
    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="text-center space-y-6">
                <h1 className="text-3xl font-semibold text-gray-700">Contact Me</h1>

                <div className="flex flex-col items-center space-y-4 text-gray-600 text-lg">
                    <a
                        href="https://github.com/LeeKwanChak"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 hover:text-black"
                    >
                        <FaGithub /> github.com/LeeKwanChak
                    </a>

                    <a
                        href="mailto:leechak330@gmail.com"
                        className="flex items-center gap-3 hover:text-black"
                    >
                        <FaEnvelope /> leechak330@gmail.com
                    </a>

                    <div className="flex items-center gap-3">
                        <FaPhone /> +852 98641802
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact


