import { get_plan_medium } from '@/app/(admin)/admin/plans/Main'
import { capitalizeString } from '@/app/utils/functions'
import React from 'react'

export const Comp = ({ title, text }: any) => {
    return (
        <div className='w-full flex justify-start items-start gap-2 text-lg'>
            <p className='font-bold text-left'>{title}: </p>
            <p className='text-left'>{text}</p>
        </div>
    )
}

const ViewSubscription = ({ data }: any) => {
    return (
        <div className='w-full h-full flex flex-col justify-start items-start gap-4'>
            <Comp title="Plan" text={data?.plan_name} />
            <Comp title="Description" text={data?.plan_description} />
            <Comp title="Subscriber" text={data?.name} />
            <Comp title="Duration" text={`${data?.plan_duration} ${get_plan_medium(data?.plan_medium, data?.plan_duration)}`} />
            <Comp title="Status" text={capitalizeString(data?.status)} />
            <Comp title="Start Date" text={data?.start_date} />
            <Comp title="End Date" text={data?.end_date} />
            <Comp title="Payment Id" text={data?.payment_id || "N/A"} />
        </div>
    )
}

export default ViewSubscription