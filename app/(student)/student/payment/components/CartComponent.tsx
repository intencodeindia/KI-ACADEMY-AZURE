import "./Main.css"
import React from 'react'
import { IoCart } from "react-icons/io5";
import CourseCard from '@/app/components/CourseCard';
import CourseCardSkeleton from '@/app/components/mui/CourseCardSkeleton'

export const EmptyCart = () => {
    return (
        <div className="w-full h-[40vh] flex flex-col justify-end items-center gap-4">
            <IoCart style={{ fontSize: "120px" }} />
            <p className="w-full text-center text-2xl font-bold">No Items</p>
        </div>
    );
};

interface CartComponentProps {
    data: any[];
    get_data: () => void;
    is_loading: boolean;
    set_is_loading: (loading: boolean) => void;
}

const CartComponent: React.FC<CartComponentProps> = ({
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
        return <EmptyCart />;
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
                        is_cart: true,
                        onCartUpdate: get_data
                    }}
                />
            ))}
        </div>
    );
};

export default CartComponent
