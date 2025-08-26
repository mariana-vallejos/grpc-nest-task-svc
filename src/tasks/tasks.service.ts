import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskRequest, GenericResponse, TaskList } from './proto/task.pb';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { USER_SERVICE_NAME, UserServiceClient } from './proto/user.pb';
import { type ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TasksService implements OnModuleInit {
  private userSvc: UserServiceClient;

  @Inject(USER_SERVICE_NAME)
  private readonly client: ClientGrpc;

  @InjectRepository(Task)
  private readonly repository: Repository<Task>;

  public onModuleInit() {
    this.userSvc = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async create(data: CreateTaskRequest): Promise<GenericResponse> {
    try {
      const user: GenericResponse = await firstValueFrom(
        this.userSvc.getUserById({ id: +data.createdBy }),
      );

      if (user.status >= HttpStatus.NOT_FOUND) {
        return { status: 404, error: 'User not found' };
      }

      const task = this.repository.create({
        title: data.title,
        description: data.description,
        completed: false,
        created_by: +data.createdBy,
      });

      const savedTask = await this.repository.save(task);

      const taskProto = {
        id: savedTask.id,
        title: savedTask.title,
        description: savedTask.description,
        completed: savedTask.completed,
        createdBy: +savedTask.created_by,
        createdAt: savedTask.created_at.toISOString(),
      };

      return { status: 201, task: taskProto };
    } catch (err) {
      return { status: 500, error: 'Internal server error: ' + err.message };
    }
  }

  async getAllTasks(): Promise<GenericResponse> {
    try {
      const tasks = await this.repository.find();

      const taskList: TaskList = {
        tasks: tasks.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          completed: t.completed,
          createdBy: t.created_by,
          createdAt: t.created_at.toISOString(),
        })),
      };

      return {
        status: 200,
        taskList,
      };
    } catch (error) {
      return {
        status: 500,
        error: 'Internal server error',
      };
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
