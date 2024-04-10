import { useEffect, useState } from "react"
import CloseImg from "./assets/images/close.png"
import "./assets/styles/app.scss"
import { MBTIInfo, TestAPI } from "./api/questionsApi"
import { App as AntApp } from "antd"

type answerInfo = {
    id: string
    question: string
    answer: number
}

function App() {
    const [answer, setAnswer] = useState<answerInfo[]>([])
    const [info, setInfo] = useState<MBTIInfo>({
        id: "",
        title: "",
        questions: [],
        type: "",
        visible: 0,
    })
    const { fetchData: fetchQuestionsData } = TestAPI("mbti")

    const onAnswer = (answerData: answerInfo) => {
        setAnswer((answer) => [...answer, answerData])
    }

    const isSelectAnswer = (id: string) => {
        return answer.findIndex((item) => item.id === id) !== -1
    }

    useEffect(() => {
        fetchQuestionsData({}).then((res) => {
            if (res.result_code === 0) {
                setInfo(res.data)
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <AntApp message={{ top: 30 }}>
            <div className="test-page">
                <div className="head">
                    <h3 className="head-title">Personality Test</h3>
                    <span className="head-close">
                        <img src={CloseImg} alt="close-img" className="close-img" />
                    </span>
                </div>
                <div className="progress-block">
                    <div className="progress">
                        <span className="progress-line"></span>
                    </div>
                    <p className="progress-precent-text">50%</p>
                </div>

                <div className="question-wrapper">
                    {info.questions.length &&
                        info.questions.map((item) => (
                            <div className="question-block" key={item.id}>
                                <p className="question-text">{item.question}</p>

                                <div className="answer-block">
                                    <p className="answer-text">Yes</p>
                                    <div style={{ display: "flex", flexDirection: "row", gap: 15, alignItems: "center" }}>
                                        {item.answers.map((ans, i) => (
                                            <span
                                                key={i}
                                                onClick={() => onAnswer({ answer: ans, question: item.question, id: item.id })}
                                                className={`circle ${isSelectAnswer(item.id) ? "active" : i === 2 ? "small" : ""}`}></span>
                                        ))}
                                    </div>
                                    <p className="answer-text">No</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </AntApp>
    )
}

export default App
