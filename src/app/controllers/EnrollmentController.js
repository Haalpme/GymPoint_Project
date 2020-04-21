import * as Yup from 'yup';
import { add, parseISO, format } from 'date-fns';
import us from 'date-fns/locale/en-US';
import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';
import Queue from '../../lib/Queue';
import EnrollmentMail from '../jobs/EnrollmentMail';

class EnrollmentController {
  // eslint-disable-next-line class-methods-use-this
  async store(req, res) {
    const schema = Yup.object().shape({
      student: Yup.string().required(),
      start_date: Yup.date().required(),
      plan: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { start_date, plan, student } = req.body;

    const formatedDate = parseISO(start_date);

    const plans = await Plan.findOne({
      where: { title: plan },
    });

    if (!plans) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    const students = await Student.findByPk(student);

    if (!students) {
      return res.status(400).json({ error: 'Invalid student selected' });
    }

    const newDate = add(formatedDate, { months: plans.duration });
    const mailStartingDate = format(formatedDate, ' dd MMMM yyyy', {
      locale: us,
    });
    const mailEndingDate = format(newDate, ' dd MMMM yyyy', { locale: us });

    const enrollment = await Enrollment.create({
      student_id: students.id,
      plan_id: plans.id,
      start_date,
      price: plans.price * plans.duration,
      end_date: newDate,
    });

    await Queue.add(EnrollmentMail.key, {
      students,
      mailEndingDate,
      mailStartingDate,
      plans,
    });

    return res.json(enrollment);
  }

  // eslint-disable-next-line class-methods-use-this
  async update(req, res) {
    const schema = Yup.object().shape({
      student: Yup.string().required(),
      start_date: Yup.date().required(),
      plan: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const { start_date, plan, student } = req.body;

    const formatedDate = parseISO(start_date);

    const plans = await Plan.findOne({
      where: { title: plan },
    });

    if (!plans) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    const students = await Student.findByPk(student);

    if (!students) {
      return res.status(400).json({ error: 'Invalid student selected' });
    }

    const newDate = add(formatedDate, { months: plans.duration });

    const enrollment = await Enrollment.findByPk(id);

    await enrollment.update({
      student_id: students.id,
      plan_id: plans.id,
      start_date,
      price: plans.price * plans.duration,
      end_date: newDate,
    });

    return res.json(enrollment);
  }

  // eslint-disable-next-line class-methods-use-this
  async index(req, res) {
    const enrollments = await Enrollment.findAll({
      attributes: ['student_id', 'plan_id', 'start_date', 'end_date'],
    });

    return res.json(enrollments);
  }

  // eslint-disable-next-line class-methods-use-this
  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id);

    enrollment.destroy();

    return res.json({ msg: 'The following enrollment has been deleted' });
  }
}

export default new EnrollmentController();
