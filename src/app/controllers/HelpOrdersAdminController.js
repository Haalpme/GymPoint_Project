import * as Yup from 'yup';
import HelpOrders from '../models/HelpOrders';
import Student from '../models/Student';
import Queue from '../../lib/Queue';
import AnswerMail from '../jobs/AnswerMail';

class HelpOrdersAdminControllers {
  // eslint-disable-next-line class-methods-use-this
  async index(req, res) {
    const helpOrder = await HelpOrders.findAll({
      where: { answer: null },
      attributes: ['student_id', 'question', 'answer', 'answer_at'],
    });

    return res.json(helpOrder);
  }

  // eslint-disable-next-line class-methods-use-this
  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const helpOrderExists = await HelpOrders.findByPk(id);

    const { answer } = req.body;

    await helpOrderExists.update({
      answer,
      answer_at: new Date(),
    });

    const students = await Student.findByPk(helpOrderExists.student_id);

    await Queue.add(AnswerMail.key, {
      students,
      helpOrderExists,
      answer,
    });

    return res.json(helpOrderExists);
  }
}

export default new HelpOrdersAdminControllers();
