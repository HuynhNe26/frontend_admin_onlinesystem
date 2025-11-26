import React, { useState, useEffect } from "react";
import "./create_exam.css";

export default function CreateExam() {
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState("");

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");

    const [difficulties, setDifficulties] = useState([]);
    const [selectedDiff, setSelectedDiff] = useState("");

    const [totalQues, setTotalQues] = useState("");
    const [duration, setDuration] = useState("");
    const [examName, setExamName] = useState("");

    // ------------------- Fetch departments -------------------
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await fetch(
                    "https://backend-onlinesystem.onrender.com/api/ad_exam/departments"
                );
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    setDepartments(data.data);
                }
            } catch (err) {
                console.error("Lỗi fetch departments:", err);
            }
        };
        fetchDepartments();
    }, []);

    // ------------------- Fetch classes khi chọn department -------------------
    useEffect(() => {
        if (!selectedDept) {
            setClasses([]);
            setSelectedClass("");
            return;
        }
        const fetchClasses = async () => {
            try {
                const res = await fetch(
                    `https://backend-onlinesystem.onrender.com/api/ad_exam/classrooms?id_department=${selectedDept}`
                );
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    setClasses(data.data);
                }
            } catch (err) {
                console.error("Lỗi fetch classes:", err);
                setClasses([]);
            }
        };
        fetchClasses();
    }, [selectedDept]);

    // ------------------- Fetch difficulties -------------------
    useEffect(() => {
        const fetchDifficulties = async () => {
            try {
                const res = await fetch(
                    "https://backend-onlinesystem.onrender.com/api/ad_exam/difficulties"
                );
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    setDifficulties(data.data);
                }
            } catch (err) {
                console.error("Lỗi fetch difficulties:", err);
            }
        };
        fetchDifficulties();
    }, []);

    // ------------------- Tạo đề thi -------------------
    const handleCreateExam = async () => {
        if (
            !selectedClass ||
            !selectedDiff ||
            !totalQues ||
            !duration ||
            !examName
        ) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const examData = {
            id_class: selectedClass,
            id_diff: selectedDiff,
            total_ques: totalQues,
            duration: duration,
            name_ex: examName,
            exam_cat: "draft", // nếu k cho chọn, mặc định là "draft"
        };

        try {
            const res = await fetch(
                "https://backend-onlinesystem.onrender.com/api/ad_exam/create",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(examData),
                }
            );
            const data = await res.json();
            if (data.success) {
                alert("Tạo đề thành công!");
                // reset form
                setExamName("");
                setSelectedClass("");
                setSelectedDiff("");
                setTotalQues("");
                setDuration("");
            } else {
                alert("Lỗi tạo đề: " + data.message);
            }
        } catch (err) {
            console.error("Lỗi tạo đề:", err);
        }
    };

    return (
        <div className="exam-container">
            <h2>Tạo đề thi</h2>
            <div className="exam-card">
                <label>Tiêu đề đề thi</label>
                <input
                    type="text"
                    placeholder="Nhập tên đề thi"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                />

                <label>Môn học</label>
                <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                    <option value="">Chọn môn học</option>
                    {departments.map((d) => (
                        <option key={d.id_department} value={d.id_department}>
                            {d.name_department}
                        </option>
                    ))}
                </select>

                <label>Lớp</label>
                <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    disabled={!selectedDept || classes.length === 0}
                >
                    <option value="">Chọn lớp</option>
                    {classes.map((c) => (
                        <option key={c.id_class} value={c.id_class}>
                            {c.class_name}
                        </option>
                    ))}
                </select>

                <label>Độ khó</label>
                <select
                    value={selectedDiff}
                    onChange={(e) => setSelectedDiff(e.target.value)}
                >
                    <option value="">Chọn độ khó</option>
                    {difficulties.map((d) => (
                        <option key={d.id_diff} value={d.id_diff}>
                            {d.difficulty}
                        </option>
                    ))}
                </select>

                <label>Số câu hỏi</label>
                <input
                    type="number"
                    min="1"
                    placeholder="Nhập số câu hỏi"
                    value={totalQues}
                    onChange={(e) => setTotalQues(e.target.value)}
                />

                <label>Thời gian làm bài (phút)</label>
                <input
                    type="number"
                    min="1"
                    placeholder="Nhập thời gian"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                />

                <button onClick={handleCreateExam}>Tạo đề thi</button>
            </div>
        </div>
    );
}
