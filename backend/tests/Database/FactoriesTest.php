<?php

namespace Tests\Database;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;
use App\Models\User;
use App\Models\Project;
use App\Models\Board;
use App\Models\TaskList;
use App\Models\Task;

class FactoriesTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function user_factory_creates_user()
    {
        $user = User::factory()->create();

        $this->assertDatabaseHas('users', ['id' => $user->id]);
    }

    #[Test]
    public function project_factory_creates_project()
    {
        $project = Project::factory()->create();

        $this->assertDatabaseHas('projects', ['id' => $project->id]);
    }

    #[Test]
    public function board_factory_creates_board()
    {
        $board = Board::factory()->create();

        $this->assertDatabaseHas('boards', ['id' => $board->id]);
    }

    #[Test]
    public function task_list_factory_creates_task_list()
    {
        $taskList = TaskList::factory()->create();

        $this->assertDatabaseHas('task_lists', ['id' => $taskList->id]);
    }

    #[Test]
    public function task_factory_creates_task()
    {
        $task = Task::factory()->create();

        $this->assertDatabaseHas('tasks', ['id' => $task->id]);
    }
}
