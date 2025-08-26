import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { type CreateTaskRequest, type Empty, GenericResponse, TASK_SERVICE_NAME } from './proto/task.pb';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @GrpcMethod(TASK_SERVICE_NAME, 'CreateTask')
  async createTask(data: CreateTaskRequest): Promise<GenericResponse> {
    return this.tasksService.create(data);
  }

  @GrpcMethod(TASK_SERVICE_NAME, 'getAllTasks')
  async findAll(_: Empty) : Promise<GenericResponse>{
    return this.tasksService.getAllTasks();
  }

  @MessagePattern('findOneTask')
  findOne(@Payload() id: number) {
    return this.tasksService.findOne(id);
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
