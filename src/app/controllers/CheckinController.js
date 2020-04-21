import { sub } from 'date-fns';
import moment from 'moment';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  // eslint-disable-next-line class-methods-use-this
  async store(req, res) {
    const { id } = req.params;

    const studentExists = await Student.findByPk(id);

    if (!studentExists) {
      return res.status(400).json({ error: ' Incorrect student id' });
    }

    const pastDate = sub(new Date(), { days: 7 });

    const { rows } = await Checkin.findAndCountAll({
      where: { student_id: id },
    });
    /**
     * Check if the student has moren than 5 check in the past 7 days
     */
    let contador = 0;

    rows.forEach((element) => {
      const teste = moment(element.created_at).isBetween(pastDate, new Date());
      if (teste) {
        contador += 1;
      }
    });

    if (contador > 4) {
      return res.status(400).json({
        error: ' You have already checked in 5 times in the past 7 days',
      });
    }

    await Checkin.create({
      student_id: id,
    });

    return res.json({ msg: 'Success' });
  }

  // eslint-disable-next-line class-methods-use-this
  async index(req, res) {
    const { id } = req.params;
    const studentExists = await Student.findByPk(id);

    if (!studentExists) {
      return res.status(400).json({ error: ' Incorrect student id' });
    }
    const checkIns = await Checkin.findAll({
      where: { student_id: id },
    });
    return res.json(checkIns);
  }
}

export default new CheckinController();
