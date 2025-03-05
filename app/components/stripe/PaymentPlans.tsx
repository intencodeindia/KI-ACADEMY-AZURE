import React, { FormEvent, useEffect, useState } from 'react'
import axios from "axios"
import { baseUrl, authorizationObj } from "../../utils/core"
import { CircularProgress } from "@mui/material"
import { get_plan_medium } from '@/app/(admin)/admin/plans/Main'
import { Button } from '@mui/material'
import CustomDialogue from '../mui/CustomDialogue'
import BillingForm from '../mui/BillingForm'
import StripeProvider from './StripeProvider'
import { appearance } from '@/app/utils/stripe'
import { loadStripe } from "@stripe/stripe-js";
import PayCard from '@/app/(web)/current-courses/components/courses-section/PayCard'
import { useSelector } from 'react-redux'
import AlertMUI from '../mui/AlertMUI'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const SinglePlan = ({ plan, set_is_form_open, set_single_plan }: any) => {
    const [is_loading, set_is_loading] = useState(false)

    return (
        <div className='w-[280px] flex flex-col justify-start items-start gap-2 p-4 rounded-lg border-2 border-gray-500'>
            <p className='w-full text-left font-bold text-xl text-gray-600'>{plan?.plan_name}</p>
            <div className='w-full flex justify-start items-end gap-2 text-gray-600'>
                <h2 className='text-3xl font-bold'>
                    {
                        plan?.plan_price ?
                            plan?.plan_price === "0.00" ? "Free" :
                                `$ ${plan?.plan_price}`
                            : "Free"
                    }
                </h2>
                <p className='text-xl capitalize'>/ {plan?.plan_duration} {get_plan_medium(plan?.plan_medium, plan?.plan_duration)}</p>
            </div>
            <p className='w-full text-left text-gray-500'>{plan?.plan_description}</p>
            <ul className='list-disc ml-4'>
                <li className="my-2">Courses Allowed: {plan?.courses_allowed}</li>
                <li className="my-2">Tutors Allowed: {plan?.tutors_allowed}</li>
                <li className="my-2">Storage : {plan?.storage_allowed} GB</li>
            </ul>
            <Button
                fullWidth
                color="secondary"
                variant="contained"
                disabled={is_loading}
                onClick={() => {
                    set_single_plan(plan)
                    set_is_form_open(true)
                }}
            >Select</Button>
        </div>
    )
}

const PaymentPlans = ({ set_show_plans, payment_secret, set_payment_secret, set_is_subscription }: any) => {

    const currentUser = useSelector((state: any) => state?.user)

    const [plans, set_plans] = useState([])
    const [single_plan, set_single_plan] = useState<any>(null)
    const [is_loading, set_is_loading] = useState(false)
    const [error_message, set_error_message] = useState("")
    const [success_message, set_success_message] = useState("")
    const [billing_data, set_billing_data] = useState<any>(null)
    const [is_form_open, set_is_form_open] = useState(false)

    useEffect(() => { get_plans() }, [])

    const get_plans = async () => {
        try {
            set_is_loading(true)
            const resp = await axios.get(`${baseUrl}/subscription-plans`, authorizationObj)
            set_is_loading(false)
            set_plans(resp?.data?.data)
        } catch (error) {
            // console.error(error)
            set_plans([])
        }
    }

    const get_client_secret = async (e: FormEvent) => {
        e.preventDefault()

        if (!billing_data?.address) {
            set_error_message("Address is required")
            setTimeout(() => set_error_message(""), 3000)
            return
        }

        if (!billing_data?.country) {
            set_error_message("Country is required")
            setTimeout(() => set_error_message(""), 3000)
            return
        }

        if (!billing_data?.state) {
            set_error_message("State is required")
            setTimeout(() => set_error_message(""), 3000)
            return
        }

        if (!billing_data?.city) {
            set_error_message("City is required")
            setTimeout(() => set_error_message(""), 3000)
            return
        }

        if (!billing_data?.postal_code) {
            set_error_message("Postal Code is required")
            setTimeout(() => set_error_message(""), 3000)
            return
        }
        try {
            set_is_loading(true)
            const client_secret_resp = await axios.post(`${baseUrl}/stripe/payment-intent`, {

                customer_address_line1: billing_data?.address,
                customer_country: billing_data?.country,
                customer_state: billing_data?.state,
                customer_city: billing_data?.city,
                customer_postal_code: billing_data?.postal_code,
                amount: +single_plan?.plan_price * 100,
                currency: "usd",
                customer_name: `${currentUser?.first_name} ${currentUser?.last_name}`,
                payment_method_types: ["card"],
                description: `Payment for Subscription Plan ${single_plan?.id}`,
                metadata: {
                    customer_id: currentUser?.institute_id
                },
                receipt_email: currentUser?.email,

            }, authorizationObj)
            set_is_loading(false)
            set_is_form_open(false)

            const client_secret = client_secret_resp?.data?.paymentIntent?.client_secret
            set_payment_secret(client_secret)

        } catch (error) {
            // console.error(error)
            set_is_form_open(false)
            set_is_loading(false)
            set_error_message("Something went wrong, please try later")
            setTimeout(() => set_error_message(""), 3000)
        }
    }

    const create_payment = async (price: any, currency: any, title: any, transactionId: string) => {
        if (!price || price?.trim() === "") return
        if (!currency || currency?.trim() === "") return
        if (!title || title?.trim() === "") return
        if (!transactionId) return

        const formData = new FormData()
        formData.append("amount", price)
        formData.append("currency", currency)
        formData.append("description", `Payment for ${title}`)
        formData.append("transaction_id", transactionId)
        formData.append("payment_method", 'card')

        try {
            const resp = await axios.post(`${baseUrl}/payment/process`, formData, authorizationObj)
            return resp?.data?.payment_id
        } catch (error) {
            // console.error(error)
            return ""
        }
    }

    const complete_payment = async (transactionId: string) => {
        if (!transactionId) return
        if (!currentUser?.institute_id) return
        if (!single_plan) return
        const paymentId: any = await create_payment(single_plan?.plan_proce, "usd", `Payment for plan ${single_plan?.id}`, transactionId)
        const formData = new FormData()

        formData.append("payment_id", paymentId)
        formData.append("plan_id", single_plan?.id)
        formData.append("is_trial", "false") // to be changed
        formData.append("institute_id", currentUser?.institute_id)

        const resp = await axios.post(`${baseUrl}/subscriptions/create`, formData, authorizationObj);
        if (resp?.data?.status > 299 || resp?.data?.status < 199) {
            set_error_message(resp?.data?.message)
            setTimeout(() => set_error_message(""), 3000);
            return
        }
        set_billing_data(null)
        set_is_subscription(true)
        set_is_form_open(false)
        set_payment_secret("")
        set_show_plans(false)

        set_success_message("Plan subscribed successfully")
        setTimeout(() => {
            set_success_message("")
        }, 3000);
    }

    return (
        <>
            {error_message && <AlertMUI text={error_message} status="error" />}
            {success_message && <AlertMUI text={success_message} status="success" />}
            <div className='w-full h-full flex justify-center items-center'>
                <CustomDialogue
                    open={is_form_open}
                    setOpen={set_is_form_open}
                    title="Billing Address"
                >
                    <BillingForm
                        billing_data={billing_data}
                        set_billing_data={set_billing_data}
                        get_client_secret={get_client_secret}
                        loading={is_loading}
                        set_loading={set_is_loading}
                    />
                </CustomDialogue>

                {
                    is_loading ? <CircularProgress /> :
                        payment_secret ?
                            <StripeProvider stripePromise={stripePromise} options={{ appearance, clientSecret: payment_secret }}>
                                <PayCard payment_secret={payment_secret} complete_payment={complete_payment} />
                            </StripeProvider> :
                            <div className='w-full h-full flex justify-center items-center flex-wrap gap-4 p-4'>
                                {plans?.map((plan: any, i: number) =>
                                    <SinglePlan
                                        key={i}
                                        plan={plan}
                                        set_is_form_open={set_is_form_open}
                                        set_single_plan={set_single_plan}
                                    />)}
                            </div>
                }
            </div>
        </>
    )
}

export default PaymentPlans