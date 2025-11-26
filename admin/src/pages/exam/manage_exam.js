import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import Loading from "../../components/loading/loading"
import "./manage_exam.css";

export default function ManageExams() {
    const API = "https://backend-onlinesystem.onrender.com/api/ad_exam";
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [detail, setDetail] = useState(null); // { exam, questions }
    const [showModal, setShowModal] = useState(false);

    const fetchExams = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/manage_exams`);
            const data = await res.json();
            if (data.success) setExams(data.data);
            else alert("Lỗi lấy danh sách đề thi: " + data.message);
        } catch (err) {
            console.error(err);
            alert("Lỗi mạng hoặc server!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchExams(); }, []);

    const openDetail = async (id_ex) => {
        try {
            const res = await fetch(`${API}/exam_detail?id_ex=${id_ex}`);
            const data = await res.json();
            if (data.success) {
                setDetail(data.data);
                setShowModal(true);
            } else {
                alert("Lỗi xem chi tiết: " + data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi mạng hoặc server!");
        }
    };

    const handleDelete = async (id_ex) => {
        if (!window.confirm("Bạn có chắc muốn xóa đề này kèm các câu hỏi cô lập?")) return;

        try {
            const res = await fetch(`${API}/delete_exam`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_ex }), // chỉ gửi id_ex
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message); // dùng message từ BE
                setShowModal(false);
                setDetail(null);
                fetchExams();
            } else {
                alert("Lỗi xóa đề thi: " + data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi mạng hoặc server!");
        }
    };
    if (loading) return <Loading />
    return (
        <div className="manage-exams">
            <h2>Quản lý đề thi</h2>
            {loading && <p>Đang tải...</p>}
            {!loading && exams.length === 0 && <p>Chưa có đề thi nào.</p>}

            <table className="exam-table">
                <thead>
                    <tr>
                        <th>ID</th><th>Tên đề</th><th>Lớp</th><th>Độ khó</th>
                        <th>Số câu</th><th>Thời gian</th><th>Trạng thái</th><th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.map((ex) => (
                        <tr key={ex.id_ex}>
                            <td>{ex.id_ex}</td>
                            <td>{ex.name_ex}</td>
                            <td>{ex.class_name}</td>
                            <td>{ex.difficulty}</td>
                            <td>{ex.total_ques}</td>
                            <td>{ex.duration} phút</td>
                            <td>{ex.exam_cat}</td>
                            <td>
                                <button onClick={() => openDetail(ex.id_ex)}>Xem</button>
                                <button onClick={() => handleDelete(ex.id_ex, "keep_questions")}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && detail && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Đề #{detail.exam.id_ex}: {detail.exam.name_ex}</h3>
                        <p><b>Lớp:</b> {detail.exam.class_name} | <b>Độ khó:</b> {detail.exam.difficulty}</p>
                        <p><b>Thời gian:</b> {detail.exam.duration} phút | <b>Trạng thái:</b> {detail.exam.exam_cat}</p>

                        <h4>Câu hỏi trong đề</h4>
                        <ul className="question-list">
                            {detail.questions.map(q => (
                                <li key={q.id_ques}>
                                    <b>Q{q.id_ques}:</b> {q.ques_text}
                                    <div className="answers">
                                        <span><b>A:</b> {q.ans_a}</span>
                                        <span><b>B:</b> {q.ans_b}</span>
                                        <span><b>C:</b> {q.ans_c}</span>
                                        <span><b>D:</b> {q.ans_d}</span>
                                        <span><b>Đáp án:</b> {q.correct_ans}</span>
                                        <span><b>Điểm:</b> {q.point}</span>
                                    </div>
                                    {q.explanation && <div className="explain"><b>Giải thích:</b> {q.explanation}</div>}
                                </li>
                            ))}
                        </ul>

                        <div className="modal-actions">
                            <button onClick={() => handleDelete(detail.exam.id_ex, "delete_questions")}>
                                Xóa (kèm câu hỏi cô lập)
                            </button>
                            <button className="close" onClick={() => { setShowModal(false); setDetail(null); }}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}