import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();

  await prisma.quiz.create({
    data: {
      title: 'TypeScript and Modern JavaScript',
      questions: {
        create: [
          {
            title: 'Is TypeScript statically type-checked at runtime in the browser?',
            type: 'BOOLEAN',
            order: 0,
            correctAnswer: 'false',
            options: {
              create: [
                { text: 'True', isCorrect: false },
                { text: 'False', isCorrect: true },
              ],
            },
          },
          {
            title: 'Which keyword is used to declare a constant block-scoped variable?',
            type: 'INPUT',
            order: 1,
            correctAnswer: 'const',
          },
          {
            title: 'Which of the following are primitive data types in JavaScript?',
            type: 'CHECKBOX',
            order: 2,
            options: {
              create: [
                { text: 'string', isCorrect: true },
                { text: 'number', isCorrect: true },
                { text: 'boolean', isCorrect: true },
                { text: 'Array', isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.quiz.create({
    data: {
      title: 'Web Protocols and REST APIs',
      questions: {
        create: [
          {
            title: 'Does HTTP/2 support multiplexing requests over a single TCP connection?',
            type: 'BOOLEAN',
            order: 0,
            correctAnswer: 'true',
            options: {
              create: [
                { text: 'True', isCorrect: true },
                { text: 'False', isCorrect: false },
              ],
            },
          },
          {
            title: 'What HTTP status code represents a resource created successfully?',
            type: 'INPUT',
            order: 1,
            correctAnswer: '201',
          },
          {
            title: 'Which headers are valid Cross-Origin Resource Sharing (CORS) headers?',
            type: 'CHECKBOX',
            order: 2,
            options: {
              create: [
                { text: 'Access-Control-Allow-Origin', isCorrect: true },
                { text: 'Access-Control-Allow-Methods', isCorrect: true },
                { text: 'Access-Control-Allow-Headers', isCorrect: true },
                { text: 'X-CORS-Redirect', isCorrect: false },
              ],
            },
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
