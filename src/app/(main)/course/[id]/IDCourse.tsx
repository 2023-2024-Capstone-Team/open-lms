"use client"
import Button from "@/components/Button"
import { getFunctions, httpsCallable } from "firebase/functions";


export default function IDCourse({
    title,
    completed,
    description,
    time,
    link,
    id
} : {
    title: string,
    completed: boolean | null, // null = not started, false = in progress, true = completed
    description: string,
    time: number,
    link: string,
    id: number
}) {

    const enroll = () => {
        return httpsCallable(getFunctions(), "courseEnroll")({ courseId: id })
            .then((result) => console.log(result))
            .catch((err) => { throw new Error(`Error enrolling in course: ${err}`) });
    };

    return (
        <main>
            <div className="flex flex-row border-4 rounded-2xl p-8">
                <div className="flex flex-col">
                    <div className="text-2xl font-bold">{title}</div>
                    <div className="mt-2 text-2xl">{description}</div>
                    <div className="flex flex-row space-x-4 mt-4">
                        <a href={link} target={"_blank"}>
                            <Button text="Go to course" onClick={() => {}} filled icon="link" />
                        </a>
                        <Button text="Enroll" onClick={enroll} icon="plus" />
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center ml-auto border-2 rounded-xl px-10 py-4 shadow-lg">
                    <div className="text-sm -mb-1">Minimum time:</div>
                    <div className="text-3xl">
                        {(Math.floor(time / 3600) + "").padStart(2, '0') + ":" + (Math.floor(time / 60) % 60 + "").padStart(2, '0') + ":" + (time % 60 + "").padStart(2, '0')}
                    </div>
                    <div className="text-sm mt-2 -mb-1">status:</div>
                    <div className="text-2xl"> {completed === null ? "Todo" : completed ? "Complete" : "In progress"}</div>
                </div>
            </div>
        </main>
    )
}
