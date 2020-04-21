import Mail from '../../lib/Mail';

class AnswerMail {
  // eslint-disable-next-line class-methods-use-this
  get key() {
    return 'AnswerMail';
  }

  // eslint-disable-next-line class-methods-use-this
  async handle({ data }) {
    const { students, helpOrderExists, answer } = data;

    await Mail.sendMail({
      to: `${students.name} <${students.email}> `,
      subject: 'Help answered',
      template: 'answer',
      context: {
        student: students.name,
        question: helpOrderExists.question,
        answer,
      },
    });
  }
}

export default new AnswerMail();
