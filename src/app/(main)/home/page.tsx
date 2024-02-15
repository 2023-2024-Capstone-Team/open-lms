"use client";
import SearchBar from "@/components/SearchBar";
import AvailableCourse from "./AvailableCourse";
import EnrolledCourse from "./EnrolledCourse";
import { useAsync } from 'react-async-hook';
import { getFunctions, httpsCallable } from "firebase/functions";
import "../../../config/firebase";

export default function Home() {

    const courses = useAsync(httpsCallable(getFunctions(), 'getAvailableCourses'), []);

    const enrolledCourses = () => {
        if (courses.loading) {
            return <div>Loading...</div>;
        }
        if (courses.error) {
            return <div>Error loading courses</div>;
        }

        // @ts-ignore
        console.log(JSON.stringify(courses.result.data, null, 4));
        // @ts-ignore
        return courses.result.data
            .filter((course: any) => course.enrolled)
            .map((course: any, key: number) => (
                <EnrolledCourse
                    key={key}
                    title={course.name}
                    status={(!course.enrolled ? "Not enrolled" : (course.completed === null ? "Todo" : (course.completed === false ? "In progress" : "Completed")))}
                    description={course.description}
                    time={(course.minQuizTime >= 3600 ? Math.floor(course.minQuizTime / 3600) + "h " : "") + Math.floor(course.minQuizTime / 60) % 60 + "m"}
                    color={(course.completed === null ? "#468DF0" : (course.completed === false ? "#EEBD31" : "#47AD63"))}
                    id={course.id}
                />
            ));
    }

    const availableCourses = () => {
        if (courses.loading) {
            return <div>Loading...</div>;
        }
        if (courses.error) {
            return <div>Error loading courses</div>;
        }

        // @ts-ignore
        return courses.result.data
            .filter((course: any) => !course.enrolled)
            .map((course: any, key: number) => (
                <AvailableCourse
                    key={key}
                    title={course.name}
                    description={course.description}
                    id={course.id}
                />
            ));
    }

    return (
        <main className="flex justify-center pt-14">
            <div className="flex flex-col h-[80vh] bg-white w-[60%] p-16 rounded-2xl shadow-custom">
                <div className="text-2xl mb-8">My Enrolled Courses</div>
                <div className="flex flex-row flex-wrap justify-between overflow-y-scroll sm:no-scrollbar">
                    {enrolledCourses()}
                </div>
            </div>
            <div className="flex flex-col h-[80vh] bg-white w-[35%] ml-[5%] p-16 rounded-2xl shadow-custom">
                <div className="flex flex-row mb-8">
                    <div className="text-2xl mr-auto">Available Courses</div>
                    <SearchBar />
                </div>
                <div className="flex flex-col justify-between overflow-y-scroll sm:no-scrollbar">
                    {availableCourses()}
                </div>
            </div>
        </main>
    )
}
