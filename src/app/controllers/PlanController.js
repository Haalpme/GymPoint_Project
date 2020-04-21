import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  // eslint-disable-next-line class-methods-use-this
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const planExist = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (planExist) {
      return res.status(400).json({ error: 'This plan already exists' });
    }
    const plan = await Plan.create(req.body);

    return res.json(plan);
  }

  // eslint-disable-next-line class-methods-use-this
  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['title', 'duration', 'price'],
    });

    return res.json(plans);
  }

  // eslint-disable-next-line class-methods-use-this
  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const { id } = req.params;
    const plans = await Plan.findByPk(id);

    const { title, duration, price } = await plans.update(req.body);

    return res.json({
      title,
      duration,
      price,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    await plan.destroy();

    return res.json({ msg: 'Plan has been deleted' });
  }
}

export default new PlanController();
