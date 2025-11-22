import React, { useState, useEffect } from 'react';
import Loading from "../../components/loading/loading";
import "./create_exam.css";

export default function CreateExam() {
    const [loading, setLoading] = useState(false);

    // --- 1. Tạo đề ---
    const [examName, setExamName] = useState('');
    const [totalQues, setTotalQues] = useState(10);
    const [duration, setDuration] = useState(30);
    const [examId, setExamId] = useState(null);

    // Chọn môn, lớp, phân loại
    const [categories, setCategories] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [examTypes, setExamTypes] = useState([
        { value: 'practice', label: 'Luyện tập' },
        { value: 'test', label: 'Kiểm tra' },
        { value: 'final', label: 'Cuối kỳ' },
    ]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [selectedExamType, setSelectedExamType] = useState('practice');

    // --- 2. Thêm câu hỏi ---
    const [quesText, setQuesText] = useState('');
    const [ansA, setAnsA] = useState('');
    const [ansB, setAnsB] = useState('');
    const [ansC, setAnsC] = useState('');
    const [ansD, setAnsD] = useState('');
    const [correctAns, setCorrectAns] = useState('A');
    const [point, setPoint] = useState(1);
    const [explanation, setExplanation] = useState('');
    const [difficulty, setDifficulty] = useState(1);

    // --- 3. Danh sách câu hỏi ---
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);

    const API_BASE = "https://backend-onlinesystem.onrender.com/api/exam";

    // --- Load danh mục và lớp từ API (giả sử có endpoint) ---
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_BASE}/categories`);
                const data = await res.json();
                setCategories(data.categories);
            } catch (e) {
                console.log("Lỗi load categories:", e);
            }
        };

        const fetchClassrooms = async () => {
            try {
                const res = await fetch(`${API_BASE}/classrooms`);
                const data = await res.json();
                setClassrooms(data.classrooms);
            } catch (e) {
                console.log("Lỗi load classrooms:", e);
            }
        };

        fetchCategories();
        fetchClassrooms();
    }, []);

    // --- Tạo đề ---
    const handleCreateExam = async () => {
        if (!examName || !selectedCategory || !selectedClassroom) {
            alert("Vui lòng điền đầy đủ thông tin đề, chọn môn và lớp!");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/admin/exam`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name_ex: examName,
                    total_ques: totalQues,
                    duration,
                    id_user: 1, // admin ID
                    id_category: selectedCategory,
                    id_classroom: selectedClassroom,
                    exam_cat: selectedExamType
                })
            });
            const data = await response.json();
            setExamId(data.exam_id);
            alert("Tạo đề thành công!");
        } catch (e) {
            console.log(e);
            alert("Lỗi tạo đề!");
        } finally {
            setLoading(false);
        }
    };

    // --- Thêm câu hỏi ---
    const handleAddQuestion = async () => {
        if (!examId) {
            alert("Vui lòng tạo đề trước!");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/admin/question`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_category: selectedCategory,
                    ques_text: quesText,
                    ans_a: ansA,
                    ans_b: ansB,
                    ans_c: ansC,
                    ans_d: ansD,
                    correct_ans: correctAns,
                    point,
                    explanation,
                    id_diff: difficulty,
                    id_user: 1
                })
            });
            const data = await response.json();
            alert("Thêm câu hỏi thành công!");
            setQuesText(''); setAnsA(''); setAnsB(''); setAnsC(''); setAnsD('');
            setCorrectAns('A'); setPoint(1); setExplanation(''); setDifficulty(1);
            fetchExamQuestions();
        } catch (e) {
            console.log(e);
            alert("Lỗi thêm câu hỏi!");
        } finally {
            setLoading(false);
        }
    };

    // --- Lấy danh sách câu hỏi ---
    const fetchExamQuestions = async () => {
        if (!examId) return;
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/admin/exam/${examId}/questions`);
            const data = await response.json();
            setQuestions(data.questions);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    // --- Chọn câu hỏi ---
    const handleSelectQuestion = (id) => {
        if (selectedQuestions.includes(id)) {
            setSelectedQuestions(selectedQuestions.filter(q => q !== id));
        } else {
            setSelectedQuestions([...selectedQuestions, id]);
        }
    };

    const handleAddQuestionsToExam = async () => {
        if (!examId || selectedQuestions.length === 0) {
            alert("Chọn câu hỏi trước!");
            return;
        }
        setLoading(true);
        try {
            await fetch(`${API_BASE}/admin/exam/${examId}/questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question_ids: selectedQuestions })
            });
            alert("Cập nhật câu hỏi vào đề thành công!");
            setSelectedQuestions([]);
            fetchExamQuestions();
        } catch (e) {
            console.log(e);
            alert("Lỗi cập nhật câu hỏi!");
        } finally {
            setLoading(false);
        }
    };

    // --- Publish đề ---
    const handlePublishExam = async () => {
        if (!examId) {
            alert("Chưa tạo đề!");
            return;
        }
        setLoading(true);
        try {
            await fetch(`${API_BASE}/admin/exam/${examId}/publish`, {
                method: 'PATCH',
            });
            alert("Đề thi đã được publish!");
        } catch (e) {
            console.log(e);
            alert("Lỗi publish đề!");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="create-exam-container">
            <h1 className="page-title">Tạo Đề Thi</h1>
            <div className="create-exam-wrapper">

                {/* --- Form tạo đề --- */}
                <div className="exam-left">
                    <div className="exam-section">
                        <h2>Tạo đề thi</h2>
                        <label>Tên đề:</label>
                        <input placeholder="Nhập tên đề" value={examName} onChange={e => setExamName(e.target.value)} />

                        <label>Môn:</label>
                        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                            <option value="">Chọn môn</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>

                        <label>Lớp:</label>
                        <select value={selectedClassroom} onChange={e => setSelectedClassroom(e.target.value)}>
                            <option value="">Chọn lớp</option>
                            {classrooms.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>

                        <label>Phân loại:</label>
                        <select value={selectedExamType} onChange={e => setSelectedExamType(e.target.value)}>
                            {examTypes.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>

                        <label>Thời gian (phút):</label>
                        <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} />

                        <label>Tổng số câu:</label>
                        <input type="number" value={totalQues} onChange={e => setTotalQues(Number(e.target.value))} />

                        <button onClick={handleCreateExam}>Tạo đề</button>
                    </div>

                    {examId && (
                        <div className="exam-section">
                            <h2>Thêm câu hỏi</h2>
                            <input placeholder="Nội dung câu hỏi" value={quesText} onChange={e => setQuesText(e.target.value)} />
                            <input placeholder="Đáp án A" value={ansA} onChange={e => setAnsA(e.target.value)} />
                            <input placeholder="Đáp án B" value={ansB} onChange={e => setAnsB(e.target.value)} />
                            <input placeholder="Đáp án C" value={ansC} onChange={e => setAnsC(e.target.value)} />
                            <input placeholder="Đáp án D" value={ansD} onChange={e => setAnsD(e.target.value)} />
                            <input placeholder="Đáp án đúng (A/B/C/D)" value={correctAns} onChange={e => setCorrectAns(e.target.value)} />
                            <input type="number" placeholder="Điểm" value={point} onChange={e => setPoint(Number(e.target.value))} />
                            <input placeholder="Giải thích" value={explanation} onChange={e => setExplanation(e.target.value)} />
                            <input type="number" placeholder="Độ khó" value={difficulty} onChange={e => setDifficulty(Number(e.target.value))} />
                            <button onClick={handleAddQuestion}>Thêm câu hỏi</button>
                            <button onClick={handlePublishExam} style={{ marginTop: '10px', backgroundColor: 'green', color: 'white' }}>Publish đề</button>
                        </div>
                    )}
                </div>

                {/* --- Danh sách câu hỏi --- */}
                {examId && (
                    <div className="exam-right">
                        <div className="exam-section">
                            <h2>Danh sách câu hỏi trong đề</h2>
                            {questions.length === 0 ? (
                                <p>Chưa có câu hỏi</p>
                            ) : (
                                <table className="exam-table">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Nội dung</th>
                                            <th>Đáp án đúng</th>
                                            <th>Điểm</th>
                                            <th>Chọn</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {questions.map((q, index) => (
                                            <tr key={q.id_ques}>
                                                <td>{index + 1}</td>
                                                <td>{q.ques_text}</td>
                                                <td>{q.correct_ans}</td>
                                                <td>{q.point}</td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedQuestions.includes(q.id_ques)}
                                                        onChange={() => handleSelectQuestion(q.id_ques)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            <button onClick={handleAddQuestionsToExam}>Cập nhật câu hỏi vào đề</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
