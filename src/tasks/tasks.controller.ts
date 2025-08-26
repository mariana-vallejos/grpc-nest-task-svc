import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { type CompleteTaskRequest, type CreateTaskRequest, type Empty, GenericResponse, type GetTaskByIdRequest, TASK_SERVICE_NAME } from './proto/task.pb';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { status } from '@grpc/grpc-js';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @GrpcMethod(TASK_SERVICE_NAME, 'CreateTask')
  async createTask(data: CreateTaskRequest): Promise<GenericResponse> {
    const dto = plainToInstance(CreateTaskDto, { title: data.title, description: data.description, created_by: data.createdBy });
    const errors = await validate(dto);

    if (errors.length > 0) {
      const messages = errors
        .map((err) => Object.values(err.constraints || {}).join(', '))
        .join('; ');

      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: messages,
      });
    }

    return this.tasksService.create(data);
  }

  @GrpcMethod(TASK_SERVICE_NAME, 'getAllTasks')
  async findAll(_: Empty): Promise<GenericResponse> {
    return this.tasksService.getAllTasks();
  }

  @GrpcMethod(TASK_SERVICE_NAME, 'GetTaskById')
  getTaskById(data: GetTaskByIdRequest) {
    return this.tasksService.getTaskById(data);
  }

  @GrpcMethod(TASK_SERVICE_NAME, 'CompleteTask')
  completeTask(data: CompleteTaskRequest) {
    return this.tasksService.completeTask(data);
  }

  @MessagePattern('updateTask')
  update(@Payload() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(updateTaskDto.id, updateTaskDto);
  }

  @MessagePattern('removeTask')
  remove(@Payload() id: number) {
    return this.tasksService.remove(id);
  }
}
