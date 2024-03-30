import Link from "next/link";
import { LuExternalLink } from "react-icons/lu";

export default function AdminInsight({
   name,
   email,
   coursesCreated,
   coursesPublished,
   id
} : {
    name: string,
    email: string,
    coursesCreated: number,
    coursesPublished: number,
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
            <td className="border p-2">{coursesCreated}</td>
            <td className="border p-2">{coursesPublished}</td>
        </tr>
    );
}