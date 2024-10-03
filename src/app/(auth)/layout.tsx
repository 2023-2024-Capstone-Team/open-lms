"use client";
import '../globals.css';
import { useSession } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {

    const router = useRouter();
    const session = useSession();

    if (session?.user) {
        router.push('/home');
    }

    return (
        <html lang="en">
            <body className="bg-gray-100">
                {children}
            </body>
        </html>
    )
}
