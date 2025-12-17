import Attendance from '../models/attendancemodel.js';

export const getAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const attendance = await Attendance.find({ date });
        res.json({ success: true, data: attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAttendanceByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const attendance = await Attendance.find({ studentId: Number(studentId) });
        res.json({ success: true, data: attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const markAttendance = async (req, res) => {
    try {
        // Handle single or bulk attendance
        const attendanceData = req.body;

        if (Array.isArray(attendanceData)) {
            // Bulk insert
            const records = attendanceData.map(record => ({
                id: Date.now() + Math.random(),
                ...record,
                markedAt: new Date()
            }));
            const result = await Attendance.insertMany(records);
            return res.status(201).json({ success: true, data: result });
        }

        // Single insert
        const newRecord = await Attendance.create({
            id: Date.now(),
            ...attendanceData,
            markedAt: new Date()
        });
        res.status(201).json({ success: true, data: newRecord });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        await Attendance.findOneAndDelete({ id });
        res.json({ success: true, message: 'Attendance record deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAttendanceStats = async (req, res) => {
    try {
        const stats = await Attendance.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Transform into a friendlier format { Present: 10, Absent: 2, ... }
        const formattedStats = stats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        res.json({ success: true, data: formattedStats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
