const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const createAssignment = async (req, res, next) => {
  try {
    const { title, description, instructions, course, dueDate, maxMarks, status } = req.body;

    const courseRecord = await Course.findById(course);
    if (!courseRecord) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (req.user.role !== 'mentor' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only mentors or admins can create assignments'
      });
    }

    const assignment = await Assignment.create({
      title,
      description,
      instructions,
      course,
      mentor: req.user._id,
      dueDate,
      maxMarks: maxMarks || 100,
      status: status || 'published'
    });

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

const getAssignments = async (req, res, next) => {
  try {
    const { courseId } = req.query;
    const query = { isActive: true };

    if (courseId) query.course = courseId;

    const assignments = await Assignment.find(query)
      .populate('course', 'title category')
      .populate('mentor', 'name email')
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      message: 'Assignments retrieved successfully',
      data: assignments
    });
  } catch (error) {
    next(error);
  }
};

const getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('course', 'title category')
      .populate('mentor', 'name email');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assignment retrieved successfully',
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

const updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    if (req.user.role !== 'admin' && assignment.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own assignment'
      });
    }

    Object.assign(assignment, req.body);
    await assignment.save();

    res.status(200).json({
      success: true,
      message: 'Assignment updated successfully',
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

const deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    if (req.user.role !== 'admin' && assignment.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own assignment'
      });
    }

    assignment.isActive = false;
    await assignment.save();

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully',
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

const submitAssignment = async (req, res, next) => {
  try {
    const { content, fileUrl } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment || !assignment.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found or inactive'
      });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: assignment.course,
      status: 'active'
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to submit an assignment'
      });
    }

    const now = new Date();
    const isLate = now > new Date(assignment.dueDate);

    const submission = await Submission.findOneAndUpdate(
      { assignment: assignment._id, student: req.user._id },
      {
        assignment: assignment._id,
        course: assignment.course,
        student: req.user._id,
        content: content || '',
        fileUrl: fileUrl || '',
        submittedAt: now,
        status: isLate ? 'late' : 'submitted'
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: isLate ? 'Assignment submitted late' : 'Assignment submitted successfully',
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

const getSubmissionsForAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    if (req.user.role !== 'mentor' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only mentors or admins can review submissions'
      });
    }

    const submissions = await Submission.find({ assignment: assignment._id })
      .populate('student', 'name email')
      .populate('course', 'title')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Submissions retrieved successfully',
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};

const gradeSubmission = async (req, res, next) => {
  try {
    const { grade, feedback } = req.body;

    const submission = await Submission.findById(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    const assignment = await Assignment.findById(submission.assignment);
    if (req.user.role !== 'admin' && assignment.mentor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only grade submissions for your own assignments'
      });
    }

    submission.grade = grade;
    submission.feedback = feedback || '';
    submission.status = 'graded';
    submission.reviewedBy = req.user._id;
    await submission.save();

    res.status(200).json({
      success: true,
      message: 'Submission graded successfully',
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

const getMySubmission = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .populate('assignment', 'title dueDate')
      .populate('course', 'title');

    res.status(200).json({
      success: true,
      message: 'My submissions retrieved successfully',
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getSubmissionsForAssignment,
  gradeSubmission,
  getMySubmission
};
