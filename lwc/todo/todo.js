import { LightningElement, track, wire } from 'lwc';
import getTasks from '@salesforce/apex/ToDoListController.getTasks';
import {refreshApex} from '@salesforce/apex';
import insertTask from '@salesforce/apex/ToDoListController.insertTask';
import deleteTask from '@salesforce/apex/ToDoListController.deleteTask';

export default class Todo extends LightningElement {

    @track
    todoTasks = [];

    todoTasksResponse;

    newTask = '';

    updateNewTask(event){
        this.newTask = event.target.value;
    }

    addTaskToList(event){
        // * This code is used with apex wire linked with Todotask property
        // this.todoTasks.data.push({
        //     Id: this.todoTasks.data.length + 1,
        //     Subject: this.newTask
        // });

        insertTask({subject: this.newTask})
        .then(result => {
            console.log(result);
            this.todoTasks.push({
                id: this.todoTasks.length + 1,
                name: this.newTask,
                recordId: result.Id
            });
            this.newTask = '';
        }
        )
        .catch(error => console.log(error));

     
    }

    deleteTaskFromList(event){
        let idToDelete = event.target.name;
        let todoTasks = this.todoTasks;
        let todoTaskIndex;
        let recordIdToDelete;

        for(let i = 0; i<todoTasks.length; i++){
            if(idToDelete === todoTasks[i].id){
                todoTaskIndex = i;
            }
        }
        recordIdToDelete = todoTasks[todoTaskIndex].recordId;
        console.log(recordIdToDelete);
        deleteTask({recordId: recordIdToDelete})
        .then(result => {
            console.log(result);
            this.todoTasks.splice(todoTaskIndex, 1);
        })
        .catch(error => console.log(error));
        // todoTasks.splice(
        //     todoTasks.findIndex(function(todoTask) {
        //         return todoTask.id === idToDelete;
        //     })
        //     , 1
        // );

        // todoTasks.splice(todoTasks.findIndex(todoTask => todoTask.id === idToDelete), 1);

        console.log(JSON.stringify(this.todoTasks));
    }

    @wire(getTasks)
    getTodoTasks(response){
        this.todoTasksResponse = response;
        let data =  response.data;
        let error = response.error;

        if(data){
            console.log('data');
            console.log(data);
            this.todoTasks = [];
            data.forEach(task => {
                this.todoTasks.push({
                    id: this.todoTasks.length + 1,
                    name: task.Subject,
                    recordId: task.Id
                });
            });
        }else if(error){
            console.log('error');
            console.log(error);
        }
    }

    refreshTodoList(){
        refreshApex(this.todoTasksResponse);
    }


}

