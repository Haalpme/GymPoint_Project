import * as Yup from 'yup';
import HelpOrders from '../models/HelpOrders';
import Student from '../models/Student';

class HelpOrdersStudentControllers {
  // eslint-disable-next-line class-methods-use-this
  async index(req, res) {
    const { id } = req.params;

    const helpOrder = await HelpOrders.findAll({
      where: { student_id: id },
      attributes: ['question', 'answer', 'answer_at'],
    });

    return res.json(helpOrder);
  }

  // eslint-disable-next-line class-methods-use-this
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const studentExists = await Student.findByPk(id);

    if (!studentExists) {
      return res.status(400).json({ error: 'student does not exist' });
    }

    const { question } = req.body;

    const helpOrder = await HelpOrders.create({
      question,
      student_id: id,
    });

    return res.json(helpOrder);
  }
}

export default new HelpOrdersStudentControllers();
