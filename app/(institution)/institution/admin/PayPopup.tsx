"use client"

import FullScreenDialog from "@/app/components/mui/FullScreenDialogue";
import PaymentPlans from "@/app/components/stripe/PaymentPlans";
import { setSubscription } from "@/app/redux/user";
import { authorizationObj, baseUrl } from "@/app/utils/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface RootState {
  user: {
    institute_id: string
  }
}

export const PayPopup = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const currentUser = useSelector((state: RootState) => state?.user)
  const dispatch = useDispatch()
  const [is_subscription, set_is_subscription] = useState<null | boolean>(null)
  const [show_plans, set_show_plans] = useState(false)
  const [payment_secret, set_payment_secret] = useState("")

  useEffect(() => { get_subscription() }, [])

  const get_subscription = async () => {
    try {
      const resp = await axios.get(`${baseUrl}/subscriptions/institute/${currentUser?.institute_id}`, authorizationObj)
      if (resp?.data?.data && resp?.data?.data?.length && resp?.data?.data[0]) {
        set_is_subscription(true)
        set_show_plans(false)
        dispatch(setSubscription(resp?.data?.data[0]))
      } else {
        set_is_subscription(false)
        set_show_plans(true)
      }
    } catch (error) {
      // console.error(error)
    }
  }

  return (
    <>
      {
        is_subscription == false ?
          <FullScreenDialog
            open={show_plans}
            setOpen={set_show_plans}
            onClose={() => set_show_plans(true)}
            headerTitle={payment_secret ? "Subscribe plan" : "Choose a plan"}
          >
            <PaymentPlans
              set_show_plans={set_show_plans}
              payment_secret={payment_secret}
              set_payment_secret={set_payment_secret}
              set_is_subscription={set_is_subscription}
            />
          </FullScreenDialog>
          : children
      }
    </>
  );
}
