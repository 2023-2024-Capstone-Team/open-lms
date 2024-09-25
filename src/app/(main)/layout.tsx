"use client";
import Link from 'next/link';
import '../globals.css';
import { ApiEndpoints, callApi } from '@/config/firebase';
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from 'react';
import Button from "@/components/Button";
import { MdAdminPanelSettings, MdChevronLeft } from 'react-icons/md';
import TextField from '@/components/TextField';
import { useSession } from "@supabase/auth-helpers-react";
import { IoNotifications } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { FiTrash } from "react-icons/fi";

export default function LearnerLayout({ children }: { children: React.ReactNode }) {

    const router = useRouter();
    const session = useSession();

    if (document?.readyState === 'complete' && session === null) {
        router.push('/');
    }

    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [selectedLink, setSelectedLink] = useState('/admin/tools');

    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const popUpRef = useRef(null);
    const popUpBellRef = useRef(null);

    // Toggle pop-up on icon click
    const handleIconClick = (event) => {
        event.stopPropagation();
        setNotificationsOpen(!notificationsOpen);
    };

    // Close pop-up when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popUpRef.current && !popUpRef.current.contains(event.target) && popUpBellRef.current && !popUpBellRef.current.contains(event.target)) {
                setNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, [popUpRef, popUpBellRef]);



    const handleLinkClick = (path: string) => {
        setSelectedLink(path);
        router.push(path);
    };

    useEffect(() => {
       const role = session?.user?.user_metadata?.role;
        if (role === 'Admin' || role === 'Developer') {
            setIsAdmin(true);
        }
    }, [session]);

    const [showSupportForm, setShowSupportForm] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [showFooter, setShowFooter] = useState(false);

    const handleSubmitFeedback = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await callApi(ApiEndpoints.SendPlatformFeedback, { feedback });
            setFeedback('');
            setFeedbackSent(true);
        } catch (error) {
            console.error('Error sending feedback:', error);
        }
    };

    const handleSupportRequest = () => {
        setShowSupportForm(true);
    };

    const notifications = [
        {
            name: "New course available: Intro to Programming",
            link: '/course/1',
            date: "Sept. 22nd, 9:23 AM"
        },
        {
            name: "Your quiz results for Machine Learning Basics are ready for review",
            link: '/quiz/2',
            date: "Sept. 24th, 10:07 PM"
        }
    ];

    return (
        <html lang="en">
        <body className="h-[100vh] px-20 bg-gray-100 overflow-x-hidden">
            <div className="flex flex-row px-12 h-[13vh] items-center bg-white rounded-b-2xl shadow-custom">
                <Link href="/home" className="font-bold text-4xl flex items-center">
                    <img
                        src="/openlms.png"
                        alt="OpenLMS Logo"
                        className="h-10 w-auto mr-2"
                    />
                    OpenLMS
                </Link>
                <div className="flex ml-auto text-2xl">
                    <div className="relative">
                        <IoNotifications
                            ref={popUpBellRef}
                            className="mt-[6px] hover:opacity-75 duration-75 cursor-pointer"
                            onClick={(e) => handleIconClick(e)}
                        />
                        {notificationsOpen && (
                            <div
                                ref={popUpRef}
                                className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 border-gray-300 border-[1px]"
                            >
                                <div
                                    className="absolute right-2 -top-2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white border-[1px]"
                                />

                                {notifications.map((notification, index) =>
                                    <>
                                        <div>
                                            <div className="text-sm">
                                                {notification.name}
                                                {/*{notification.link}*/}
                                            </div>

                                            <div className="text-xs text-gray-500 flex justify-between">
                                                {notification.date}
                                                <FiTrash />
                                            </div>
                                        </div>

                                        {index !== notifications.length - 1 && <div className="border-[1px] rounded-xl"/>}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {isAdmin &&
                        <MdAdminPanelSettings
                            className="w-8 h-8 ml-6 hover:opacity-75 duration-75 cursor-pointer"
                            onClick={() => handleLinkClick('/admin/tools')}
                        />
                    }

                    <CgProfile
                        className="w-8 h-8 ml-6 hover:opacity-75 duration-75 cursor-pointer"
                        onClick={() => handleLinkClick('/profile')}
                    />
                </div>
            </div>

            <div className='flex h-[85vh] mt-[2vh] overflow-scroll rounded-2xl sm:no-scrollbar'>
                {children}
            </div>

            {showSupportForm && (
                <div
                    className="fixed flex justify-center items-center w-full h-full top-0 left-0 z-50 bg-white bg-opacity-50">
                    <div className="flex flex-col w-1/2 bg-white p-12 rounded-xl text-lg shadow-xl">
                        <div className="text-lg mb-2">Request platform support or report technical issues</div>
                        <TextField text={feedback} onChange={setFeedback} area placeholder="Type your message here..."/>
                        <form onSubmit={handleSubmitFeedback} className="flex flex-col justify-left">
                            <div className="flex flex-row ml-auto mt-4">
                                <Button text="Cancel" onClick={() => {
                                    setShowSupportForm(false);
                                    setFeedbackSent(false);
                                }} style="mr-4" />
                                <Button text="Submit" onClick={handleSubmitFeedback} filled/>
                            </div>
                            { feedbackSent && <p className="text-green-700 mt-4">Request sent successfully - platform admins will be in touch once your message is received!</p> }
                        </form>
                    </div>
                </div>
            )}

            <button 
                className={"fixed bg-gray-800 right-28 rounded-t-md duration-100 "+(showFooter ? "bottom-20" : "bottom-0")}
                onClick={() => setShowFooter(!showFooter)}
            >
                <MdChevronLeft color="white" className={showFooter ? "-rotate-90" : "rotate-90"} size={38} />
            </button>
            <footer className={"flex flex-row items-center fixed w-auto px-4 rounded-t-2xl h-20 left-20 right-20 shadow-custom bg-gray-800 duration-100 "+(showFooter ? "bottom-0" : "-bottom-20")}>
                <div className="flex flex-row justify-center">
                    <Link href="/Learner_Guide.pdf" target="_blank">
                        <Button text="Access Platform User Guide" onClick={() => {}} style="mr-4 text-sm" filled/>
                    </Link>
                    <Button text="Request Technical Support" onClick={handleSupportRequest} style="text-sm" filled/>
                </div>
                <span className="text-white ml-auto">&copy; {new Date().getFullYear()} OpenLMS. All rights reserved.</span>
            </footer>
        </body>
        </html>
    )
}
