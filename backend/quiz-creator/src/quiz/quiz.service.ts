import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateQuizDto,
  Quiz,
  SubmitQuizDto,
  UpdateQuizDto,
} from 'src/DTO/create-quiz.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllQuizzes() {
    return this.prisma.quiz.findMany({
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
    try {
      const { questions, ...quizData } = createQuizDto;
      const quiz = await this.prisma.quiz.create({
        data: {
          ...quizData,
          questions: {
            create: questions.map((q) => ({
              ...q,
              options: { create: q.options },
            })),
          },
        },
      });
      return quiz;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async getQuizById(id: string): Promise<Quiz> {
    try {
      const quiz = await this.prisma.quiz.findUnique({
        where: { id },
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      });

      return quiz;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteQuizById(id: string): Promise<void> {
    try {
      await this.prisma.quiz.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async submitQuizAnswers(submitQuizDto: SubmitQuizDto) {
    try {
      const attempt = await this.prisma.quizAttempt.create({
        data: {
          quizId: submitQuizDto.quizId,
        },
      });

      const answers = await Promise.all(
        submitQuizDto.answers.map((answer) =>
          this.prisma.questionAnswer.create({
            data: {
              attemptId: attempt.id,
              questionId: answer.questionId,
              textAnswer: answer.textAnswer,
              booleanAnswer: answer.booleanAnswer,
              selectedOptions: answer.selectedOptions || [],
            },
          }),
        ),
      );

      let totalScore = 0;
      let totalQuestions = 0;

      for (const answer of submitQuizDto.answers) {
        const question = await this.prisma.question.findUnique({
          where: { id: answer.questionId },
          include: { options: true },
        });

        if (question) {
          totalQuestions++;
          let questionScore = 0;

          switch (question.type) {
            case 'BOOLEAN': {
              const correct =
                question.options
                  .find((opt) => opt.isCorrect)
                  ?.text.toLowerCase() ===
                String(answer.booleanAnswer).toLowerCase();
              questionScore = correct ? 1 : 0;
              break;
            }
            case 'CHECKBOX': {
              const correctOptionIds = question.options
                .filter((opt) => opt.isCorrect)
                .map((opt) => opt.id);
              const selectedOptionIds = answer.selectedOptions || [];
              const numCorrectSelected = selectedOptionIds.filter((id) =>
                correctOptionIds.includes(id),
              ).length;
              const numTotalCorrect = correctOptionIds.length;
              const hasIncorrect = selectedOptionIds.some(
                (id) => !correctOptionIds.includes(id),
              );
              questionScore = hasIncorrect
                ? 0
                : numCorrectSelected / numTotalCorrect;
              break;
            }
            case 'INPUT': {
              if (!question.options || question.options.length === 0) {
                questionScore = 1;
              } else {
                const correct = question.options.some(
                  (opt) =>
                    opt.isCorrect &&
                    opt.text.trim().toLowerCase() ===
                      (answer.textAnswer || '').trim().toLowerCase(),
                );
                questionScore = correct ? 1 : 0;
              }
              break;
            }
          }

          totalScore += questionScore;
        }
      }

      const score =
        totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;

      const updatedAttempt = await this.prisma.quizAttempt.update({
        where: { id: attempt.id },
        data: {
          score,
          completedAt: new Date(),
        },
        include: {
          answers: {
            include: {
              question: {
                include: {
                  options: true,
                },
              },
            },
          },
        },
      });

      return updatedAttempt;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateQuiz(id: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    try {
      const quiz = await this.prisma.quiz.update({
        where: { id },
        data: {
          ...updateQuizDto,
          updatedAt: new Date(),
        },
      });
      return quiz;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
