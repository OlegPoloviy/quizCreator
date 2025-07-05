import {
  Controller,
  Get,
  Body,
  Post,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import {
  CreateQuizDto,
  SubmitQuizDto,
  UpdateQuizDto,
} from 'src/DTO/create-quiz.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  async getAllQuizzes() {
    return this.quizService.getAllQuizzes();
  }

  @Post('create')
  async createQuiz(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.createQuiz(createQuizDto);
  }

  @Get('/:id')
  async getQuizById(@Param('id') id: string) {
    return this.quizService.getQuizById(id);
  }

  @Delete('/:id')
  async deleteQuizById(@Param('id') id: string) {
    return this.quizService.deleteQuizById(id);
  }

  @Post('/submit')
  async submitQuizAnswers(@Body() submitQuizDto: SubmitQuizDto) {
    return this.quizService.submitQuizAnswers(submitQuizDto);
  }

  @Patch('/:id')
  async updateQuiz(
    @Param('id') id: string,
    @Body() updateQuizDto: UpdateQuizDto,
  ) {
    return this.quizService.updateQuiz(id, updateQuizDto);
  }
}
