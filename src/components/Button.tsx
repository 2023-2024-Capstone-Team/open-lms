import Link from "next/link";

export default function Button({
    text,
    link="/"
} : {
    text: string,
    link: string
}) {
    return (
        <Link
            href={link}
            className="p-3 w-fit ml-4 border-[3px] border-red-800 rounded-lg duration-75 ease-out hover:px-4 cursor-pointer"
        >
            <div>{text}</div>
        </Link>
    )
}