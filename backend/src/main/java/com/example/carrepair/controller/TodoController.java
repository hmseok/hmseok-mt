package com.example.carrepair.controller;

import com.example.carrepair.domain.Todo;
import com.example.carrepair.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:3000")
public class TodoController {
    
    @Autowired
    private TodoService todoService;
    
    @GetMapping
    public List<Todo> getAllTodos() {
        return todoService.getAllTodos();
    }
    
    @GetMapping("/{id}")
    public Todo getTodoById(@PathVariable Long id) {
        return todoService.getTodoById(id);
    }
    
    @PostMapping
    public Todo createTodo(@RequestBody Todo todo) {
        return todoService.saveTodo(todo);
    }
    
    @PutMapping("/{id}")
    public Todo updateTodo(@PathVariable Long id, @RequestBody Todo todo) {
        todo.setId(id);
        return todoService.saveTodo(todo);
    }
    
    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
    }
} 