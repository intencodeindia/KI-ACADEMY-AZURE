'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import AlertMUI from '@/app/components/mui/AlertMUI';
import { baseUrl, authorizationObj } from '@/app/utils/core';
import { useSelector } from 'react-redux';

export default function PhonePeStatus() {
    const router = useRouter();
    const params = useParams();
    const { transactionId } = params;
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const currentUser = useSelector((state: any) => state?.user);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const storedTransaction = localStorage.getItem('phonepe_transaction');
                if (!storedTransaction) {
                    throw new Error('Transaction details not found');
                }

                // Create payment records and enroll courses
                const parsedTransaction = JSON.parse(storedTransaction);
                const courses = parsedTransaction.courses;

                for (const course of courses) {
                    try {
                        // Create payment record using the same format as Stripe
                        const paymentId = await create_payment(
                            course.price,
                            'INR',
                            course.title,
                            transactionId as string
                        );

                        // Create enrollment using the same format as Stripe
                        const enrollFormData = new FormData();
                        enrollFormData.append("user_id", currentUser?.user_id);
                        enrollFormData.append("course_id", course.id);
                        enrollFormData.append("payment_id", paymentId);

                        const resp = await axios.post(
                            `${baseUrl}/enrollment/enroll`,
                            enrollFormData,
                            authorizationObj
                        );

                        if (resp?.data?.status < 200 || resp?.data?.status > 299) {
                            throw new Error(resp?.data?.message || "Enrollment failed");
                        }
                    } catch (error) {
                        console.error('Error processing course:', course.id, error);
                        throw error;
                    }
                }

                router.push('/student/courses');
            } catch (error: any) {
                console.error('Payment verification error:', error);
                setError(error.message || 'Payment verification failed');
                setTimeout(() => router.push('/student/payment?error=payment-failed'), 3000);
            } finally {
                setLoading(false);
                localStorage.removeItem('phonepe_transaction');
            }
        };

        verifyPayment();
    }, [transactionId, router, currentUser]);

    // Helper function to create payment record (same as in Main.tsx)
    const create_payment = async (price: any, currency: any, title: any, transactionId: string) => {
        if (!price || price?.trim() === "") return "";
        if (!currency || currency?.trim() === "") return "";
        if (!title || title?.trim() === "") return "";

        const formData = new FormData();
        formData.append("amount", price);
        formData.append("currency", currency);
        formData.append("description", `Payment for ${title}`);
        formData.append("user_id", currentUser?.user_id);
        formData.append("payment_method", 'phonepe');
        formData.append("transaction_id", transactionId);

        try {
            const resp = await axios.post(`${baseUrl}/payment/process`, formData, authorizationObj);
            return resp?.data?.payment_id || "";
        } catch (error) {
            console.error('Error creating payment:', error);
            throw error;
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-center">
                {loading ? (
                    <>
                        <h1 className="text-2xl font-bold mb-4">Verifying Payment...</h1>
                        <p>Please wait while we confirm your payment.</p>
                    </>
                ) : error ? (
                    <AlertMUI text={error} status="error" />
                ) : null}
            </div>
        </div>
    );
} 