import "./Main.css";
import React from 'react';
import { IoCart } from "react-icons/io5";
import axios from 'axios';
import { authorizationObj, baseUrl, courseThumbnailPath } from '@/app/utils/core';
import Image from "next/image";
import DeleteIcon from '@mui/icons-material/Delete';
import defaultCourseImage from '../../../../../public/images/placeholder.png';

export const EmptyCart = () => {
    return (
        <div className="d-flex flex-column justify-content-end align-items-center h-100 py-5">
            <IoCart style={{ fontSize: "120px", color: "#6c757d" }} />
            <p className="text-center text-secondary fs-4 fw-bold mb-0">No Items</p>
        </div>
    );
};

interface CartComponentProps {
    data: any[];
    get_data: () => void;
    is_loading: boolean;
    set_is_loading: (loading: boolean) => void;
}

const CartComponent: React.FC<CartComponentProps> = ({ data, get_data, is_loading, set_is_loading }) => {
    const remove_from_cart = async (courseId: string) => {
        if (!courseId) return;
        
        try {
            set_is_loading(true);
            const response = await axios.delete(
                `${baseUrl}/cart/remove/${courseId}`, 
                {
                    ...authorizationObj,
                    timeout: 5000 // 5 seconds timeout
                }
            );
            
            if (response?.data?.status >= 200 && response?.data?.status < 300) {
                await get_data();
            }
        } catch (error: any) {
            console.error('Error removing from cart:', error?.message || 'Unknown error occurred');
        } finally {
            set_is_loading(false);
        }
    };

    if (is_loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!data?.length) {
        return <EmptyCart />;
    }

    return (
        <div className="cart-items">
            {data?.map((item: any) => {
                const imageUrl = item?.course_thumbnail
                    ? `${courseThumbnailPath}/${item.course_thumbnail}`
                    : defaultCourseImage.src;

                return (
                    <div key={item.course_id} className="card mb-3 border-0 shadow-sm">
                        <div className="row g-0">
                            <div className="col-md-3">
                                <div className="position-relative h-100" style={{ minHeight: '150px' }}>
                                    <Image
                                        src={imageUrl}
                                        alt={item.course_title || 'Course Image'}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="rounded-start img-fluid object-fit-cover p-2"
                                        priority={true}
                                        style={{
                                            backgroundColor: 'var(--bs-gray-100)'
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-9">
                                <div className="card-body h-100 d-flex flex-column justify-content-between border-0">
                                    <div>
                                        <h5 className="card-title fw-semibold mb-2">{item.course_title}</h5>
                                        <p className="card-text text-body-secondary mb-1">
                                            {item.currency} {item.display_price}
                                        </p>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <button
                                            className="btn btn-link text-danger p-2"
                                            onClick={() => remove_from_cart(item.course_id)}
                                            disabled={is_loading}
                                            aria-label="Remove from cart"
                                        >
                                            <DeleteIcon sx={{ fontSize: "16px" }} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CartComponent;