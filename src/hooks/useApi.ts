import http from "../utils/axios"
import { useState } from "react"
// import { useAppDispatch } from "./useStore"
// import { setLoading, setError } from "../redux/features/mainSlice"
import { App } from "antd"

interface UseApiResult<T> {
    res: T | null
    fetchData: (body: unknown) => Promise<T>
}

const useApi = <T>(url: string, method: string = "POST"): UseApiResult<T> => {
    const { message } = App.useApp()
    // const dispatch = useAppDispatch()
    const [res, setRes] = useState<T | null>(null)

    const fetchData = async (body?: unknown): Promise<T> => {
        // dispatch(setLoading(true))
        return await http(url, {
            data: body,
            method,
        })
            .then((res) => {
                setRes(res.data)
                // dispatch(setError(null))
                if (res.data.result_code < 0) {
                    console.log("error")
                    message.error(res.data.result_msg)
                }
                return res.data
            })
            .catch((err) => {
                console.log(err)
                if (err.message === "refresh token faild") {
                    localStorage.setItem("token", "")
                    if (window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({ key: "500" }))
                    }
                    return
                }
                message.error(err.message.slice(0, 20))
                // dispatch(setError(err))
                setRes(null)
                return {
                    result_code: -1,
                    result_msg: err.message,
                }
            })
            .finally(() => {
                // dispatch(setLoading(false))
            })
    }
    return { res, fetchData }
}

export default useApi
