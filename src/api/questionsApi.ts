import useApi from "../hooks/useApi"

type answerInfo = {
    id: string
    question: string
    answers: number[]
}

export type MBTIInfo = {
    id: string
    title: string
    questions: answerInfo[]
    type: string
    visible: number
}

interface ITest extends IResponse {
    data: MBTIInfo
}

export function TestAPI(url: string, method: string = "POST") {
    const { res, fetchData } = useApi<ITest>(`test/${url}`, method)

    return {
        res,
        fetchData,
    }
}
