import React, { useState, useEffect } from 'react';
import Loading from "../../components/loading/loading";
import "./create_exam.css";

export default function CreateExam() {
    const [loading, setLoading] = useState(false);

    const [departments, setDepartments] = useState([]);
    const [classes, setClasses] = useState([]);
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [difficulties, setDifficulties] = useState([]);
    const [categories, setCategories] = useState([]);

    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [questionForm, setQuestionForm] = useState({
        ques_text: "",
        ans_a: "",
        ans_b: "",
        ans_c: "",
        ans_d: "",
        correct_ans: "",
        point: 1,
        explanation: ""
    });

    const [allQuestions, setAllQuestions] = useState([]);
    const [examForm, setExamForm] = useState({
        total_question: "",
        duration: "",
        exam_cat: "draft",
        start_time: "",
        end_time: "",
        questions: []
    });

    const [createdExamId, setCreatedExamId] = useState(null);

    // ----------------- FETCH INITIAL DATA -----------------
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [deptRes, diffRes, catRes] = await Promise.all([
                    fetch("https://backend-onlinesystem.onrender.com/api/exam/departments"),
                    fetch("https://backend-onlinesystem.onrender.com/api/exam/difficulties"),
                    fetch("https://backend-onlinesystem.onrender.com/api/exam/categories")
                ]);

                const deptData = await deptRes.json();
                const diffData = await diffRes.json();
                const catData = await catRes.json();

                setDepartments(deptData.success ? deptData.data : []);
                setDifficulties(diffData.success ? diffData.data : []);
                setCategories(catData.success ? catData.data : []);
            } catch (e) {
                console.error(e);
                alert("Lỗi lấy dữ liệu từ server");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ----------------- FETCH CLASSES WHEN DEPARTMENT CHANGES -----------------
    useEffect(() => {
        const fetchClassesByDept = async () => {
            if (!selectedDepartment) return setFilteredClasses([]);
            setLoading(true);
            try {
                const res = await fetch(`https://backend-onlinesystem.onrender.com/api/exam/classrooms?id_department=${selectedDepartment.id_department}`);
                const data = await res.json();
                setFilteredClasses(data.success ? data.data : []);
                setSelectedClass(null); // reset class when department changes
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchClassesByDept();
    }, [selectedDepartment]);

    if (loading) return <Loading />;

    // ----------------- CREATE QUESTION -----------------
    const handleCreateQuestion = async () => {
        const { ques_text, ans_a, ans_b, ans_c, ans_d, correct_ans } = questionForm;
        if (!ques_text || !ans_a || !ans_b || !ans_c || !ans_d || !correct_ans) {
            return alert("Vui lòng điền đầy đủ thông tin câu hỏi");
        }

        setLoading(true);
        try {
            const res = await fetch("https://backend-onlinesystem.onrender.com/api/exam/question/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...questionForm, point: Number(questionForm.point) })
            });
            const data = await res.json();
            if (data.success) {
                alert("Tạo câu hỏi thành công");
                setAllQuestions(prev => [...prev, { id_question: data.id_question, ...questionForm }]);
                setQuestionForm({ ques_text: "", ans_a: "", ans_b: "", ans_c: "", ans_d: "", correct_ans: "", point: 1, explanation: "" });
            } else {
                alert(data.message || "Tạo câu hỏi thất bại");
            }
        } catch (e) {
            console.error(e);
            alert("Lỗi server khi tạo câu hỏi");
        } finally {
            setLoading(false);
        }
    };

    // ----------------- CREATE EXAM -----------------
    const handleCreateExam = async () => {
        if (!selectedDepartment || !selectedClass || !selectedDifficulty || !selectedCategory ||
            !examForm.total_question || !examForm.duration) {
            return alert("Vui lòng chọn đầy đủ dữ liệu và điền thông tin đề thi");
        }

        setLoading(true);
        try {
            const formatDateTime = dt => dt.replace("T", " ");
            const payload = {
                id_department: selectedDepartment.id_department,
                id_class: selectedClass.id_class,
                id_diff: selectedDifficulty.id_diff,
                exam_cat: selectedCategory.key,
                total_question: Number(examForm.total_question),
                duration: Number(examForm.duration),
                start_time: examForm.start_time ? formatDateTime(examForm.start_time) : undefined,
                end_time: examForm.end_time ? formatDateTime(examForm.end_time) : undefined
            };

            const res = await fetch("https://backend-onlinesystem.onrender.com/api/exam/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                alert("Tạo đề thi thành công");
                setCreatedExamId(data.id_exam);
            } else {
                alert(data.message || "Tạo đề thi thất bại");
            }
        } catch (e) {
            console.error(e);
            alert("Lỗi server khi tạo đề thi");
        } finally {
            setLoading(false);
        }
    };

    // ----------------- ADD QUESTIONS TO EXAM -----------------
    const handleAddQuestions = async () => {
        if (!createdExamId) return alert("Chưa tạo đề thi");
        if (examForm.questions.length === 0) return alert("Chưa chọn câu hỏi nào");

        setLoading(true);
        try {
            const res = await fetch(`https://backend-onlinesystem.onrender.com/api/exam/${createdExamId}/add-questions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ questions: examForm.questions })
            });
            const data = await res.json();
            if (data.success) {
                alert("Gán câu hỏi thành công");
                setExamForm(prev => ({ ...prev, questions: [] }));
            } else {
                alert(data.message || "Gán câu hỏi thất bại");
            }
        } catch (e) {
            console.error(e);
            alert("Lỗi server khi gán câu hỏi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="manage-admin-container">
            <h1 className="page-title">Quản Lý Đề Thi</h1>

            {/* CREATE QUESTION */}
            <section>
                <h2>Tạo câu hỏi mới</h2>
                <input placeholder="Câu hỏi" value={questionForm.ques_text} onChange={e => setQuestionForm({ ...questionForm, ques_text: e.target.value })} />
                <input placeholder="A" value={questionForm.ans_a} onChange={e => setQuestionForm({ ...questionForm, ans_a: e.target.value })} />
                <input placeholder="B" value={questionForm.ans_b} onChange={e => setQuestionForm({ ...questionForm, ans_b: e.target.value })} />
                <input placeholder="C" value={questionForm.ans_c} onChange={e => setQuestionForm({ ...questionForm, ans_c: e.target.value })} />
                <input placeholder="D" value={questionForm.ans_d} onChange={e => setQuestionForm({ ...questionForm, ans_d: e.target.value })} />
                <input placeholder="Đáp án đúng" value={questionForm.correct_ans} onChange={e => setQuestionForm({ ...questionForm, correct_ans: e.target.value })} />
                <input placeholder="Điểm" type="number" value={questionForm.point} onChange={e => setQuestionForm({ ...questionForm, point: Number(e.target.value) })} />
                <input placeholder="Giải thích" value={questionForm.explanation} onChange={e => setQuestionForm({ ...questionForm, explanation: e.target.value })} />
                <button onClick={handleCreateQuestion}>Tạo câu hỏi</button>
            </section>

            {/* SELECT DATA */}
            <section>
                <h2>Chọn dữ liệu đề thi</h2>

                <div>
                    <h3>Phòng ban</h3>
                    {departments.map(d => (
                        <label key={d.id_department} style={{ display: 'block' }}>
                            <input type="radio" name="department" onChange={() => setSelectedDepartment(d)} checked={selectedDepartment === d} />
                            {d.name_department}
                        </label>
                    ))}
                </div>

                <div>
                    <h3>Lớp học</h3>
                    {filteredClasses.map(c => (
                        <label key={c.id_class} style={{ display: 'block' }}>
                            <input type="radio" name="class" onChange={() => setSelectedClass(c)} checked={selectedClass === c} />
                            {c.class_name}
                        </label>
                    ))}
                </div>

                <div>
                    <h3>Độ khó</h3>
                    {difficulties.map(d => (
                        <label key={d.id_diff} style={{ display: 'block' }}>
                            <input type="radio" name="difficulty" onChange={() => setSelectedDifficulty(d)} checked={selectedDifficulty === d} />
                            {d.difficulty}
                        </label>
                    ))}
                </div>

                <div>
                    <h3>Loại đề</h3>
                    {categories.map(c => (
                        <label key={c.key} style={{ display: 'block' }}>
                            <input type="radio" name="category" onChange={() => setSelectedCategory(c)} checked={selectedCategory === c} />
                            {c.label}
                        </label>
                    ))}
                </div>

                <input placeholder="Tổng câu hỏi" type="number" value={examForm.total_question} onChange={e => setExamForm({ ...examForm, total_question: e.target.value })} />
                <input placeholder="Thời gian (phút)" type="number" value={examForm.duration} onChange={e => setExamForm({ ...examForm, duration: e.target.value })} />

                {selectedCategory?.key === 'scheduled' && (
                    <>
                        <input type="datetime-local" value={examForm.start_time} onChange={e => setExamForm({ ...examForm, start_time: e.target.value })} />
                        <input type="datetime-local" value={examForm.end_time} onChange={e => setExamForm({ ...examForm, end_time: e.target.value })} />
                    </>
                )}

                <button onClick={handleCreateExam}>Tạo đề thi</button>
            </section>

            {/* ADD QUESTIONS */}
            {createdExamId && allQuestions.length > 0 && (
                <section>
                    <h2>Gán câu hỏi vào đề thi</h2>
                    {allQuestions.map(q => (
                        <label key={q.id_question} style={{ display: 'block', margin: '5px 0' }}>
                            <input type="checkbox" value={q.id_question} checked={examForm.questions.includes(q.id_question)}
                                onChange={e => {
                                    const val = Number(e.target.value);
                                    if (e.target.checked) setExamForm({ ...examForm, questions: [...examForm.questions, val] });
                                    else setExamForm({ ...examForm, questions: examForm.questions.filter(x => x !== val) });
                                }}
                            />
                            {q.ques_text}
                        </label>
                    ))}
                    <button onClick={handleAddQuestions}>Gán câu hỏi</button>
                </section>
            )}
        </div>
    );
}
