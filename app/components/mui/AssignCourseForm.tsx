import { Tooltip } from '@mui/material';
import React from 'react';

const AssignCourseForm = ({ all_tutors, assigned_tutors, unAssign_course, assign_course }: any) => {

    const handleClick = (isAssigned: boolean, tutorId: string) => {
        if (isAssigned) {
            unAssign_course(tutorId)
        } else {
            assign_course(tutorId)
        }
    }

    return (
        <div className="w-full h-full flex flex-col justify-start items-start gap-2 overflow-y-auto">
            {all_tutors?.map((t: any) => {
                const isAssigned = assigned_tutors?.some((at: any) => at.assigned_to === t.user_id);

                return (
                    <div
                        key={t.user_id}
                        className="w-full flex justify-between items-center gap-2 cursor-pointer"
                    >
                        <p className="w-full text-left">{`${t?.first_name} ${t?.last_name}`}</p>
                        <div className="flex justify-end items-center gap-[2px]"
                            onClick={() => handleClick(isAssigned, t?.user_id)}
                        >
                            <p className={!isAssigned ? 'text-green-600' : 'text-red-600'}>
                                {isAssigned ? 'UnAssign' : 'Assign'}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AssignCourseForm;
