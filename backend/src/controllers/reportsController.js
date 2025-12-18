import Student from '../models/studentmodel.js';
import Teacher from '../models/teachermodel.js';
import Fee from '../models/feeModel.js';
import Attendance from '../models/attendancemodel.js';
import ExamMarks from '../models/exammarksmodel.js';

export const getOverviewReport = async (req, res) => {
    try {
        const { classFilter } = req.query;
        const studentFilter = classFilter && classFilter !== 'All Classes' ? { class: classFilter } : {};

        const [
            totalStudents,
            totalTeachers,
            fees,
            attendanceStats
        ] = await Promise.all([
            Student.countDocuments(studentFilter),
            Teacher.countDocuments(),
            Fee.find(studentFilter ? { studentClass: classFilter } : {}),
            Attendance.aggregate([
                { $match: studentFilter ? { class: classFilter } : {} },
                { $group: { _id: null, avg: { $avg: "$status" } } } // Placeholder, need real attendance logic
            ])
        ]);

        // Calculate Revenue
        const totalRevenue = fees.reduce((acc, fee) => acc + (fee.paidAmount || 0), 0);
        const pendingFees = fees.filter(f => f.status !== 'Paid').reduce((acc, fee) => acc + (fee.remainingAmount || 0), 0);

        // Detailed Lists
        const detailedStudents = await Student.find(studentFilter);
        const detailedTeachers = await Teacher.find();
        const detailedPendingFees = fees.filter(f => f.status !== 'Paid');

        // Simple Random Attendance logic if DB is empty - FIX THIS LATER with real data
        const averageAttendance = 85;

        res.json({
            success: true,
            data: {
                totalStudents,
                totalTeachers,
                activeClasses: 12, // Dynamic later
                averageAttendance,
                totalRevenue,
                pendingFees,
                detailedStudents,
                detailedTeachers,
                detailedPendingFees
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAcademicReport = async (req, res) => {
    try {
        const { classFilter } = req.query;
        const studentFilter = classFilter && classFilter !== 'All Classes' ? { class: classFilter } : {};

        const students = await Student.find(studentFilter);

        // Enhance students with marks
        const studentIds = students.map(s => s.id);
        const marks = await ExamMarks.find({ studentId: { $in: studentIds } });

        const academicData = students.map(student => {
            const studentMarks = marks.filter(m => m.studentId === student.id);

            let totalScore = 0;
            let count = 0;

            studentMarks.forEach(m => {
                totalScore += (m.exam1 + m.exam2 + m.exam3) / 3;
                count++;
            });

            const avgMarks = count > 0 ? Math.round(totalScore / count) : 0;

            // Grade Calculation
            let grade = 'F';
            if (avgMarks >= 90) grade = 'A+';
            else if (avgMarks >= 80) grade = 'A';
            else if (avgMarks >= 70) grade = 'B+';
            else if (avgMarks >= 60) grade = 'B';
            else if (avgMarks >= 50) grade = 'C';
            else if (avgMarks >= 40) grade = 'D';

            return {
                name: student.name,
                class: student.class,
                marks: avgMarks,
                grade: grade
            };
        }).sort((a, b) => b.marks - a.marks);

        // Add Rank
        academicData.forEach((s, i) => s.rank = i + 1);

        const avgGrade = academicData.length > 0 ? academicData[0].grade : 'N/A';
        const passRate = academicData.length > 0
            ? Math.round((academicData.filter(s => s.marks >= 40).length / academicData.length) * 100)
            : 0;

        res.json({
            success: true,
            data: {
                students: academicData,
                averageGrade: avgGrade,
                passRate
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getFinancialReport = async (req, res) => {
    try {
        const { classFilter } = req.query;
        const filter = classFilter && classFilter !== 'All Classes' ? { studentClass: classFilter } : {};

        const fees = await Fee.find(filter).sort({ dueDate: 1 });

        const totalRevenue = fees.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
        const pendingAmount = fees.reduce((sum, f) => sum + (f.remainingAmount || 0), 0);
        const totalDue = totalRevenue + pendingAmount;

        const collectionRate = totalDue > 0 ? Math.round((totalRevenue / totalDue) * 100) : 0;

        res.json({
            success: true,
            data: {
                totalRevenue,
                pendingAmount,
                collectionRate,
                detailedFees: fees
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAttendanceReport = async (req, res) => {
    try {
        const { classFilter } = req.query;
        const studentFilter = classFilter && classFilter !== 'All Classes' ? { class: classFilter } : {};

        const students = await Student.find(studentFilter);

        // Here we ideally aggregate from specific attendance records
        // For now, if no attendance model details are available, we simulate or use what's available
        // Assuming Attendance model has 'studentId', 'status' ('Present', 'Absent'), 'date'

        // MOCKUP Logic until comprehensive attendance records exist
        const aggregatedAttendance = students.map(s => {
            // Check if we have real attendance logs, otherwise mock
            return {
                name: s.name,
                class: s.class,
                attendance: 85, // Default average
                present: 153,
                absent: 27
            };
        });

        res.json({
            success: true,
            data: {
                students: aggregatedAttendance,
                averageAttendance: 85,
                totalClasses: 180
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
