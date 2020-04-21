import Mail from '../../lib/Mail';

class EnrollmentMail {
  // eslint-disable-next-line class-methods-use-this
  get key() {
    return 'EnrollmentMail';
  }

  // eslint-disable-next-line class-methods-use-this
  async handle({ data }) {
    const { students, mailEndingDate, mailStartingDate, plans } = data;

    await Mail.sendMail({
      to: `${students.name} <${students.email}> `,
      subject: 'Enrollment have been created',
      template: 'enrollment',
      context: {
        student: students.name,
        start_date: mailStartingDate,
        plan: plans.title,
        end_date: mailEndingDate,
        price: plans.price * plans.duration,
      },
    });
  }
}

export default new EnrollmentMail();
