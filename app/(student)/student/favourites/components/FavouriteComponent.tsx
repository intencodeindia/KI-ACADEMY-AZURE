import "./Main.css"
import React from 'react'
import { IoHeart } from "react-icons/io5";
import CourseCard from '@/app/components/CourseCard';
import CourseCardSkeleton from '@/app/components/mui/CourseCardSkeleton'
import { Typography } from '@mui/material'

export const EmptyFavourites = () => {
    return (
        <div className="container-fluid py-5">
            <div className="row justify-content-center">
                <div className="col-12 text-center">
                    <IoHeart style={{ fontSize: "120px" }} className="mb-4" />
                    <Typography variant="h4" component="h2" className="fw-bold">
                        No Items in Favourites
                    </Typography>
                </div>
            </div>
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
            <div className="row g-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="col-12 col-sm-6 col-lg-3">
                        <CourseCardSkeleton />
                    </div>
                ))}
            </div>
        );
    }

    if (!data?.length) {
        return <EmptyFavourites />;
    }

    return (
        <div className="row g-4">
            {data.map((course, index) => (
                <div key={course.course_id || index} className="col-12 col-sm-6 col-lg-3">
                    <CourseCard
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
                </div>
            ))}
        </div>
    );
};

export default FavouriteComponent
