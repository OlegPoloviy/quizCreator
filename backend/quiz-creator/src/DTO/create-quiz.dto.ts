import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  MaxLength,
  MinLength,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum QuestionType {
  BOOLEAN = 'BOOLEAN',
  INPUT = 'INPUT',
  CHECKBOX = 'CHECKBOX',
}

export class Quiz {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateQuestionOptionDto {
  @IsString({ message: 'Option text must be a string' })
  @MinLength(1, { message: 'Option text cannot be empty' })
  @MaxLength(500, { message: 'Option text cannot exceed 500 characters' })
  text: string;

  @IsBoolean({ message: 'isCorrect must be a boolean' })
  isCorrect: boolean;

  @IsInt({ message: 'Order must be an integer' })
  @Min(1, { message: 'Order must be at least 1' })
  order: number;
}

export class CreateQuestionDto {
  @IsString({ message: 'Question text must be a string' })
  @MinLength(1, { message: 'Question text cannot be empty' })
  @MaxLength(1000, { message: 'Question text cannot exceed 1000 characters' })
  text: string;

  @IsEnum(QuestionType, { message: 'Invalid question type' })
  type: QuestionType;

  @IsInt({ message: 'Order must be an integer' })
  @Min(1, { message: 'Order must be at least 1' })
  order: number;

  @IsOptional()
  @IsBoolean({ message: 'Required must be a boolean' })
  required?: boolean = true;

  @IsOptional()
  @IsArray({ message: 'Options must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionOptionDto)
  @ArrayMinSize(1, {
    message: 'At least one option is required for choice questions',
  })
  @ArrayMaxSize(10, { message: 'Maximum 10 options allowed' })
  options?: CreateQuestionOptionDto[];
}

export class CreateQuizDto {
  @IsString({ message: 'Title must be a string' })
  @MinLength(1, { message: 'Title cannot be empty' })
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description?: string;

  @IsArray({ message: 'Questions must be an array' })
  @ArrayMinSize(1, { message: 'At least one question is required' })
  @ArrayMaxSize(50, { message: 'Maximum 50 questions allowed' })
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}

export class UpdateQuizDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MinLength(1, { message: 'Title cannot be empty' })
  @MaxLength(200, { message: 'Title cannot exceed 200 characters' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description?: string;
}

export class SubmitAnswerDto {
  @IsString({ message: 'Question ID must be a string' })
  questionId: string;

  @IsOptional()
  @IsString({ message: 'Text answer must be a string' })
  @MaxLength(1000, { message: 'Text answer cannot exceed 1000 characters' })
  textAnswer?: string;

  @IsOptional()
  @IsBoolean({ message: 'Boolean answer must be a boolean' })
  booleanAnswer?: boolean;

  @IsOptional()
  @IsArray({ message: 'Selected options must be an array' })
  @ArrayMaxSize(10, { message: 'Maximum 10 options can be selected' })
  selectedOptions?: string[];
}

export class SubmitQuizDto {
  @IsString({ message: 'Quiz ID must be a string' })
  quizId: string;

  @IsArray({ message: 'Answers must be an array' })
  @ValidateNested({ each: true })
  @Type(() => SubmitAnswerDto)
  answers: SubmitAnswerDto[];
}
