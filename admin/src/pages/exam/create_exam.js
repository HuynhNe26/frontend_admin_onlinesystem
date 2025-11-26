import React, { useState, useEffect } from "react";
import "./create_exam.css";

export default function CreateExam() {
    const API = "https://backend-onlinesystem.onrender.com/api/ad_exam";

    // -------------------- STATES --------------------
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState("");

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");

    const [difficulties, setDifficulties] = useState([]);
    const [selectedDiff, setSelectedDiff] = useState("");

    const [totalQues, setTotalQues] = useState("");
    const [duration, setDuration] = useState("");
    const [examName, setExamName] = useState("");

    const [createdExamId, setCreatedExamId] = useState(null);

    // Form câu hỏi
    const [quesText, setQuesText] = useState("");
    const [ansA, setAnsA] = useState("");
    const [ansB, setAnsB] = useState("");
    const [ansC, setAnsC] = useState("");
    const [ansD, setAnsD] = useState("");
    const [correctAns, setCorrectAns] = useState("");
    const [point, setPoint] = useState(1);
    const [explanation, setExplanation] = useState("");

    const [addedQuestions, setAddedQuestions] = useState([]);
    const [showQuestionForm, setShowQuestionForm] = useState(true); // ✅ Mới: quản lý hiển thị form

    // -------------------- FETCH departments --------------------
    useEffect(() => {
        fetch(`${API}/departments`)
            .then(res => res.json())
            .then(data => { if (data.success) setDepartments(data.data); });
    }, []);

    // -------------------- FETCH classes --------------------
    useEffect(() => {
        if (!selectedDept) return;
        fetch(`${API}/classrooms?id_department=${selectedDept}`)
            .then(res => res.json())
            .then(data => { if (data.success) setClasses(data.data); });
    }, [selectedDept]);

    // -------------------- FETCH difficulties --------------------
    useEffect(() => {
        fetch(`${API}/difficulties`)
            .then(res => res.json())
            .then(data => { if (data.success) setDifficulties(data.data); });
    }, []);

    // ===================== TẠO ĐỀ =====================
    const handleCreateExam = async () => {
        if (!selectedClass || !selectedDiff || !totalQues || !duration || !examName) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const payload = {
            id_class: selectedClass,
            id_diff: selectedDiff,
            total_ques: totalQues,
            duration,
            name_ex: examName
        };

        const res = await fetch(`${API}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success) {
            alert("Tạo đề thành công!");
            setCreatedExamId(data.id_ex);
            setShowQuestionForm(true); // mở form thêm câu hỏi
        } else {
            alert("Lỗi tạo đề: " + data.message);
        }
    };

    // ===================== THÊM CÂU HỎI =====================
    const handleAddQuestion = async () => {
        if (!quesText || !ansA || !ansB || !ansC || !ansD || !correctAns) {
            alert("Điền đầy đủ câu hỏi!");
            return;
        }

        const qPayload = {
            ques_text: quesText.trim(),
            ans_a: ansA.trim(),
            ans_b: ansB.trim(),
            ans_c: ansC.trim(),
            ans_d: ansD.trim(),
            correct_ans: correctAns.trim(),
            point: parseFloat(point) || 1,
            explanation: explanation.trim()
        };

        try {
            // 1️⃣ Tạo câu hỏi
            const qRes = await fetch(`${API}/add_question`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(qPayload)
            });
            const qData = await qRes.json();
            if (!qData.success) {
                alert("Lỗi tạo câu hỏi: " + qData.message);
                return;
            }

            const id_ques = qData.id_ques;

            // 2️⃣ Gắn câu hỏi vào đề
            const exRes = await fetch(`${API}/add_exam_question`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_ex: createdExamId, id_ques })
            });
            const exData = await exRes.json();
            if (!exData.success) {
                alert("Lỗi gắn câu hỏi vào đề: " + exData.message);
                return;
            }

            // 3️⃣ Cập nhật danh sách câu hỏi FE
            setAddedQuestions(prev => [...prev, { id_ques, ques_text: quesText }]);

            // Clear form
            setQuesText(""); setAnsA(""); setAnsB(""); setAnsC(""); setAnsD("");
            setCorrectAns(""); setPoint(1); setExplanation("");

        } catch (err) {
            console.error(err);
            alert("Lỗi mạng hoặc server!");
        }
    };

    return (
        <div className="exam-container">
            <h2>Tạo đề thi</h2>

            {/* ---------------- FORM TẠO ĐỀ ---------------- */}
            {!createdExamId && (
                <div className="exam-card">
                    <label>Tiêu đề đề thi</label>
                    <input value={examName} onChange={e => setExamName(e.target.value)} />

                    <label>Môn học</label>
                    <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
                        <option value="">Chọn môn</option>
                        {departments.map(d => (
                            <option key={d.id_department} value={d.id_department}>{d.name_department}</option>
                        ))}
                    </select>

                    <label>Lớp</label>
                    <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                        <option value="">Chọn lớp</option>
                        {classes.map(c => (
                            <option key={c.id_class} value={c.id_class}>{c.class_name}</option>
                        ))}
                    </select>

                    <label>Độ khó</label>
                    <select value={selectedDiff} onChange={e => setSelectedDiff(e.target.value)}>
                        <option value="">Chọn độ khó</option>
                        {difficulties.map(d => (
                            <option key={d.id_diff} value={d.id_diff}>{d.difficulty}</option>
                        ))}
                    </select>

                    <label>Số câu hỏi</label>
                    <input type="number" value={totalQues} onChange={e => setTotalQues(e.target.value)} />

                    <label>Thời gian (phút)</label>
                    <input type="number" value={duration} onChange={e => setDuration(e.target.value)} />

                    <button onClick={handleCreateExam}>Tạo đề thi</button>
                </div>
            )}

            {createdExamId && showQuestionForm && (
                <div className="question-section">
                    <h3>Thêm câu hỏi vào đề #{createdExamId}</h3>

                    <div className="form-group">
                        <label>Nội dung câu hỏi</label>
                        <textarea
                            placeholder="Nhập câu hỏi..."
                            value={quesText}
                            onChange={e => setQuesText(e.target.value)}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Đáp án A</label>
                            <input
                                placeholder="A"
                                value={ansA}
                                onChange={e => setAnsA(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Đáp án B</label>
                            <input
                                placeholder="B"
                                value={ansB}
                                onChange={e => setAnsB(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Đáp án C</label>
                            <input
                                placeholder="C"
                                value={ansC}
                                onChange={e => setAnsC(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Đáp án D</label>
                            <input
                                placeholder="D"
                                value={ansD}
                                onChange={e => setAnsD(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Đáp án đúng</label>
                            <select value={correctAns} onChange={e => setCorrectAns(e.target.value)}>
                                <option value="">Chọn đáp án</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Điểm</label>
                            <input
                                type="number"
                                value={point}
                                min={0}
                                onChange={e => setPoint(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Giải thích (nếu có)</label>
                        <textarea
                            placeholder="Nhập giải thích..."
                            value={explanation}
                            onChange={e => setExplanation(e.target.value)}
                        />
                    </div>

                    <div className="form-actions">
                        <button className="btn-add" onClick={handleAddQuestion}>
                            Thêm câu hỏi
                        </button>
                        <button className="btn-close" onClick={() => setCreatedExamId(null)}>
                            Đóng
                        </button>
                    </div>

                    {addedQuestions.length > 0 && (
                        <div className="added-questions">
                            <h4>Danh sách câu hỏi đã thêm</h4>
                            <ul>
                                {addedQuestions.map(q => (
                                    <li key={q.id_ques}>• {q.ques_text}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
