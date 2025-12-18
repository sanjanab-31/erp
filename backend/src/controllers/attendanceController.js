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
            // Bulk upsert
            const operations = attendanceData.map(record => ({
                updateOne: {
                    filter: { studentId: record.studentId, date: record.date },
                    update: {
                        $set: {
                            status: record.status,
                            markedAt: new Date(),
                            ...record
                        },
                        $setOnInsert: { id: Date.now() + Math.random() }
                    },
                    upsert: true
                }
            }));
            const result = await Attendance.bulkWrite(operations);
            return res.status(201).json({ success: true, data: result });
        }

        // Single upsert
        const { studentId, date } = attendanceData;

        // Ensure studentId and date are present for the filter
        if (!studentId || !date) {
            return res.status(400).json({ success: false, message: 'studentId and date are required' });
        }

        const newRecord = await Attendance.findOneAndUpdate(
            { studentId, date },
            {
                $set: {
                    ...attendanceData,
                    markedAt: new Date()
                },
                $setOnInsert: { id: Date.now() }
            },
            { upsert: true, new: true }
        );
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
        const { date } = req.query;
        let matchStage = {};
        if (date) {
            matchStage.date = date;
        }

        const stats = await Attendance.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const initialStats = { present: 0, absent: 0, late: 0, total: 0 };

        const formattedStats = stats.reduce((acc, curr) => {
            const key = curr._id.toLowerCase();
            if (acc.hasOwnProperty(key)) {
                acc[key] = curr.count;
            }
            acc.total += curr.count;
            return acc;
        }, initialStats);

        res.json({ success: true, data: formattedStats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
