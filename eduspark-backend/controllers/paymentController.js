const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');

const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ student: req.user._id })
      .populate('course', 'title monthlyFee')
      .sort({ paymentDate: -1 });

    res.status(200).json({
      success: true,
      message: 'Payments retrieved successfully',
      data: payments
    });
  } catch (error) {
    next(error);
  }
};

const createMockPayment = async (req, res, next) => {
  try {
    const { enrollmentId, amount, billingMonth } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    if (req.user.role !== 'student' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only students or admins can create mock payments'
      });
    }

    const payment = await Payment.create({
      student: enrollment.student,
      enrollment: enrollment._id,
      course: enrollment.course,
      amount: amount || enrollment.monthlyFee,
      paymentDate: new Date(),
      paymentMethod: 'mock',
      transactionId: `MOCK-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      status: 'successful',
      billingMonth: billingMonth || new Date().toISOString().slice(0, 7)
    });

    enrollment.nextPaymentDate = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
    await enrollment.save();

    res.status(201).json({
      success: true,
      message: 'Mock payment processed successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentSummary = async (req, res, next) => {
  try {
    const payments = await Payment.find();

    const totalRevenue = payments.reduce((sum, payment) => {
      if (payment.status === 'successful') return sum + payment.amount;
      return sum;
    }, 0);

    const pending = payments.filter((payment) => payment.status === 'pending').length;
    const successful = payments.filter((payment) => payment.status === 'successful').length;

    res.status(200).json({
      success: true,
      message: 'Payment summary retrieved successfully',
      data: {
        totalRevenue,
        pending,
        successful,
        totalPayments: payments.length
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyPayments,
  createMockPayment,
  getPaymentSummary
};
