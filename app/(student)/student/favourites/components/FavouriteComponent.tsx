import "./Main.css"
import React from 'react'
import { IoHeart } from "react-icons/io5";
import CourseCard from '@/app/components/CourseCard';
import CourseCardSkeleton from '@/app/components/mui/CourseCardSkeleton'
import { Typography } from '@mui/material'

export const EmptyFavourites = () => {
    return (
        <div className="w-full h-[40vh] flex flex-col justify-end items-center gap-4">
            <IoHeart style={{ fontSize: "120px" }} />
            <p className="w-full text-center text-2xl font-bold">No Items</p>
        </div>
    );
};

interface FavouriteComponentProps {
    data: any[];
    get_data: () => void;
    is_loading: boolean;
    set_is_loading: (loading: boolean) => void;
}

const FavouriteComponent: React.FC<FavouriteComponentProps> = ({
    data,
    get_data,
    is_loading,
    set_is_loading
}) => {
    if (is_loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[1, 2, 3].map((i) => (
                    <CourseCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (!data?.length) {
        return <EmptyFavourites />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.map((course, index) => (
                <CourseCard
                    key={course.course_id || index}
                    course={{
                        ...course,
                        display_price: course.display_price || course.course_price,
                        currency: course.currency || course.display_currency
                    }}
                    options={{
                        is_favourite: true,
                        onRefresh: get_data
                    }}
                />
            ))}
        </div>
    );
};

export default FavouriteComponent
