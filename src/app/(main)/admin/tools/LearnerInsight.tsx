import Link from "next/link";
import { LuExternalLink } from "react-icons/lu";
import { MdLink } from "react-icons/md";

export default function LearnerInsight({
    name,
    email,
    coursesEnrolled,
    coursesAttempted,
    coursesCompleted,
    id
} : {
    name: string,
    email: string,
    coursesEnrolled: number,
    coursesAttempted: number,
    coursesCompleted: number,
    id: number
}) {
    return (
        <tr key={id} className="border">
            <td className="border p-2">
                <Link href={"/admin/profile/"+id} className="flex flex-row items-center hover:opacity-60">
                    {name}
                    <LuExternalLink className="ml-1" color="rgb(153 27 27)"/>
                </Link>
            </td>
            <td className="border p-2">{email}</td>
            <td className="border p-2">{coursesEnrolled}</td>
            <td className="border p-2">{coursesAttempted}</td>
            <td className="border p-2">{coursesCompleted}</td>
        </tr>
    );
}