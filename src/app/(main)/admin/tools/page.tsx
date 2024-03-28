"use client"
import QuizToMark from "@/app/(main)/admin/tools/QuizToMark";
import ManageCourse from "@/app/(main)/admin/tools/ManageCourse";
import LearnerInsight from "@/app/(main)/admin/tools/LearnerInsight";
import CourseInsight from "@/app/(main)/admin/tools/CourseInsight";
import Button from "@/components/Button";
import {useRouter} from "next/navigation";
import { useState } from "react";
import { useAsync } from "react-async-hook";
import { callApi } from "@/config/firebase";
import TextField from "@/components/TextField";

export default function Tools() {

    const quizzesToMark = useAsync(() => callApi('getQuizzesToMark', {}), []);
    const courses = useAsync(() => callApi('getAvailableCourses', {}), []);
    const learnerInsights = useAsync(() => callApi('getUserReports', {}), []);
    const courseInsights = useAsync(() => callApi('getCourseReports', {}), []);

    const router = useRouter();
    const [search, setSearch] = useState("");

    const getQuizzesToMark = () => {
        if (quizzesToMark.loading) {
            return <div>Loading...</div>;
        }
        if (quizzesToMark.error) {
            return <div>Error loading quizzes to mark</div>;
        }

        return (
            <div className="flex flex-wrap w-full justify-between overflow-y-scroll gap-2 sm:no-scrollbar">
                { /* @ts-ignore */ }
                {quizzesToMark.result?.data && quizzesToMark.result.data.map((quiz, key) => (
                    <QuizToMark
                        key={key}
                        title={quiz.courseName}
                        date={new Date(quiz.timestamp * 1000).toLocaleString()}
                        learner={quiz.userName}
                        id={quiz.quizAttemptId}
                    />
                ))}
            </div>
        );
    }

    const getLearnerInsights = () => {
        if (learnerInsights.loading) {
            return <div>Loading...</div>;
        }
        if (!learnerInsights.result) {
            return <div>Error loading learner insights</div>;
        }

        return (
            <div className="flex flex-wrap justify-start overflow-y-scroll sm:no-scrollbar">
                <table className="border-collapse w-full mt-2">
                    <thead>
                        <tr className="border-b-2 border-black text-left">
                            <th rowSpan={2} colSpan={1}>
                                Name
                            </th>
                            <th rowSpan={2} colSpan={1}>
                                Email
                            </th>
                            <th className="py-1">Enrolled</th>
                            <th className="py-1">In Progress</th>
                            <th className="py-1">Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        { /* @ts-ignore */}
                        { learnerInsights.result.data.map((learner: any, key: number) => (
                            <LearnerInsight
                                key={key}
                                name={learner.name}
                                email={learner.email}
                                coursesEnrolled={learner.coursesEnrolled}
                                coursesAttempted={learner.coursesAttempted}
                                coursesCompleted={learner.coursesComplete}
                                id={learner.uid}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    const getCourseInsights = () => {
        if (courseInsights.loading) {
            return <div>Loading...</div>;
        }
        if (!courseInsights.result) {
            return <div>Error loading course insights</div>;
        }

        return (
            <div className="flex flex-wrap justify-start overflow-y-scroll sm:no-scrollbar">
                <table className="border-collapse w-full">
                    <thead>
                        <tr className="border-b-2 border-black text-left">
                            <th className="py-1">Course Name</th>
                            <th className="py-1">Learners Completed</th>
                            <th className="py-1">Average Completion Time</th>
                            <th className="py-1">Average Quiz Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        { /* @ts-ignore */}
                        { courseInsights.result.data
                        .filter((course: any) => course.name.toLowerCase().includes(search.toLowerCase()))
                        .map((course: any, key: number) => (
                            <CourseInsight courseData={course}/>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <main className="flex-col w-full justify-center items-center">
            {/* Quizzes to mark section */}
            <div className="flex flex-col h-fit max-h-full bg-white p-12 rounded-2xl shadow-custom mb-8">
                <div className="flex flex-row justify-between items-center mb-2">
                    <div className="flex flex-col">
                        <div className="text-lg mb-2">Quizzes To Mark</div>
                    </div>
                </div>
                <div className="flex flex-wrap justify-between overflow-y-scroll gap-2 sm:no-scrollbar">
                    {getQuizzesToMark()}
                </div>
            </div>

            {/* Course insights section */}
            <div className="flex flex-col h-fit max-h-full bg-white p-12 rounded-2xl shadow-custom mb-8">
                <div className="flex flex-row justify-end items-center mb-2 space-x-4">
                    <div className="flex flex-col mr-auto">
                        <div className="text-lg -mb-1">Course Insights</div>
                        <p className="mr-2 text-gray-500">Click on a course to manage course contents.</p>
                    </div>
                    <TextField 
                        placeholder="Search for a course..."
                        text={search}
                        onChange={setSearch}
                    />
                    <Button text="Create a Course" onClick={() => router.push('/admin/course/new')} filled />
                    <Button text="Download Course Reports" onClick={() => router.push('/home')}/>
                </div>
                {getCourseInsights()}
            </div>

            {/* Learner insights section */}
            <div className="flex flex-col h-fit max-h-full bg-white p-12 rounded-2xl shadow-custom">
                <div className="flex flex-row justify-end items-center">
                    <div className="flex flex-col mr-auto">
                        <div className="text-lg -mb-1">Learner Insights</div>
                        <p className="mr-2 text-gray-500">Click on a user to view individual data.</p>
                    </div>
                    <Button text="Invite new Learners" onClick={() => router.push('/home')}/>
                    <Button text="Download User Reports" onClick={() => router.push('/home')} style="ml-4"/>
                </div>
                {getLearnerInsights()}
            </div>

            <div className="h-4" />
        </main>
    )
}
