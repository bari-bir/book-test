import { useEffect, useState } from "react"
import CloseImg from "./assets/images/close.png"
import "./assets/styles/app.scss"
import { MBTIInfo, TestAPI } from "./api/questionsApi"
import { App as AntApp, Button, Modal } from "antd"
import ResImg from "./assets/images/res-img.png"

type answerInfo = {
    id: string
    question: string
    answer: number
}

function App() {
    const { fetchData: fetchQuestionsData } = TestAPI("mbti")
    const { fetchData: fetchCreateAnsData } = TestAPI("answer")
    const [showRes, setShowRes] = useState<boolean>(false)
    const [answers, setAnswers] = useState<answerInfo[]>([])
    const [ans, setAns] = useState<string>("")
    const [info, setInfo] = useState<MBTIInfo>({
        id: "",
        title: "",
        questions: [],
        type: "",
        visible: 0,
    })

    useEffect(() => {
        fetchQuestionsData({}).then((res) => {
            if (res.result_code === 0) {
                setInfo(res.data)
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onAnswer = (answerData: answerInfo) => {
        if (isSelectAnswer(answerData.answer, answerData.id)) {
            setAnswers((answer) => answer.filter((ans) => ans.id !== answerData.id))
        } else if (answers.findIndex((item) => item.id === answerData.id) !== -1) {
            setAnswers(
                (answer) =>
                    (answer = answer.map((ans) => {
                        if (ans.id === answerData.id) {
                            return {
                                ...ans,
                                answer: answerData.answer,
                            }
                        } else {
                            return ans
                        }
                    })),
            )
        } else {
            setAnswers((answer) => [...answer, answerData])
        }
    }

    const isSelectAnswer = (ans: number, id: string) => {
        return answers.some((item) => item.id === id && item.answer === ans)
    }

    const procentAns = () => {
        return Math.floor((answers.length * 100) / info.questions.length)
    }

    const onFinish = () => {
        fetchCreateAnsData({
            questionTestId: "mbti",
            answers,
        }).then((res) => {
            if (res.result_code === 0) {
                setAnswers([])
                setAns(JSON.parse(JSON.stringify(res.data)))
                setShowRes(true)
            }
        })
    }

    const onCloseWin = () => {
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ key: "closeWin" }))
        }
    }

    return (
        <AntApp message={{ top: 30 }}>
            <div className="test-page">
                <div className="header">
                    <div className="head">
                        <h3 className="head-title">Personality Test</h3>
                        <span className="head-close" onClick={onCloseWin}>
                            <img src={CloseImg} alt="close-img" className="close-img" />
                        </span>
                    </div>
                    <div className="progress-block">
                        <div className="progress">
                            <span className="progress-line" style={{ width: procentAns() + "%" }}></span>
                        </div>
                        <p className="progress-precent-text">{procentAns()}%</p>
                    </div>
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
                                                className={`circle ${isSelectAnswer(ans, item.id) ? "active" : ""} ${i === 2 ? "small" : ""}`}></span>
                                        ))}
                                    </div>
                                    <p className="answer-text">No</p>
                                </div>
                            </div>
                        ))}
                </div>

                <Button type="primary" disabled={answers.length !== info.questions.length} className="btn-finish" onClick={onFinish}>
                    Finish
                </Button>
            </div>

            <Modal open={showRes} className="modal-res" onCancel={() => setShowRes(false)} footer={null} closeIcon={null}>
                <div className="res">
                    <span className="res-close" onClick={() => setShowRes(false)}>
                        <img src={CloseImg} alt="close-img" className="close-img" />
                    </span>
                    <div className="res-head">
                        <img src={ResImg} alt="res" className="res-img" />
                        <h3 className="res-head-title">Your Results</h3>
                    </div>
                    <p className="res-text">{ans}</p>
                </div>
            </Modal>
        </AntApp>
    )
}

export default App
