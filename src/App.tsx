import { useEffect, useState } from "react"
import CloseImg from "./assets/images/close.png"
import "./assets/styles/app.scss"
import { MBTIInfo, TestAPI } from "./api/questionsApi"
import { App as AntApp, Button, Modal } from "antd"

type answerInfo = {
    id: string
    question: string
    answer: number
}

function App() {
    const { fetchData: fetchQuestionsData } = TestAPI("mbti")
    const { fetchData: fetchCreateAnsData } = TestAPI("answer");
    const [showRes, setShowRes] = useState<boolean>(false);
    const [answers, setAnswers] = useState<answerInfo[]>([])
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
        } else {
            setAnswers((answer) => [...answer, answerData])
        }
    }

    const isSelectAnswer = (ans: number, id: string) => {
        return answers.some((item) => item.answer === ans &&  item.id === id)
    }

    const procentAns = () => {
        return Math.floor(answers.length * 100 /  info.questions.length);
    }

    const onFinish = () => {
        fetchCreateAnsData({
            questionTestId: "mbti", 
            answers,
        }).then(res => {
            if(res.result_code ===  0) {
                setShowRes(true);
            }
        })
    }

    const onCloseWin = () => {
        if(window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({key: "closeWin"}))
        }
    }

    return (
        <AntApp message={{ top: 30 }}>
            <div className="test-page">
                <div className="head">
                    <h3 className="head-title">Personality Test</h3>
                    <span className="head-close" onClick={onCloseWin}>
                        <img src={CloseImg} alt="close-img" className="close-img" />
                    </span>
                </div>
                <div className="progress-block">
                    <div className="progress">
                        <span className="progress-line" style={{width: procentAns() + "%"}}></span>
                    </div>
                    <p className="progress-precent-text" >{procentAns()}%</p>
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

                <Button type="primary" className="btn-finish" onClick={onFinish}>Finish</Button>
            </div>


            <Modal open={showRes} className="modal-res" onCancel={() => setShowRes(false)} footer={null}  closeIcon={null}>
                Great
            </Modal>
        </AntApp>
    )
}

export default App
