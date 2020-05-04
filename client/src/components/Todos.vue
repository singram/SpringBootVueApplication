<template>
<div>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand title" href="#">Todos (<v-icon class="m-1" name="brands/vuejs" /> + <v-icon class="m-1" name="brands/java" /> + <v-icon class="m-1" name="brands/font-awesome-alt" />)</a>
    <h1 class="email">{{userEmail}}</h1>
  </nav>
  <section class="todoapp">
    <div v-if="loading">
      <h1 class="loading">Loading...</h1>
    </div>
    <div v-else>
      <header class="header">
        New task
        <input class="new-todo" autofocus autocomplete="off"
            v-bind:placeholder="this.inputPlaceholder"
            v-model="newTodo"
            @keyup.enter="addTodo">
      </header>

      <div class="my-3 p-3 bg-white rounded box-shadow">
        <h6 class="border-bottom border-gray pb-2 mb-0">Todo (<strong>{{ remaining }}</strong> {{ remaining | pluralize }} left)</h6>
        <div v-for="todo in remainingTodos"
            class="todo media text-muted pt-3"
            v-bind:key="todo.id"
            v-bind:class="{ completed: todo.completed, editing: todo == editedTodo }">
          <img data-src="holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1" alt="" class="mr-2 rounded">
          <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
            <strong class="d-block text-gray-dark">@username</strong>
            <span class="view" v-show="todo != editedTodo">
              <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            </span>
            <input class="edit" type="text" v-model="todo.title" v-todo-focus="todo == editedTodo" v-show="todo == editedTodo" @blur="doneEdit(todo)" @keyup.enter="doneEdit(todo)" @keyup.esc="cancelEdit(todo)">
          </p>
          <v-icon class="m-2" @click="completeTodo(todo)" name="check" />
          <v-icon class="m-2" @click="removeTodo(todo)" name="regular/window-close" />
        </div>
        <small class="d-block text-right mt-3">
          <a href="#" @click="allDone()">All completed</a>
        </small>
      </div>

      <div class="my-3 p-3 bg-white rounded box-shadow">
        <h6 class="border-bottom border-gray pb-2 mb-0">Completed (<strong>{{ completed }}</strong> {{ completed | pluralize }})</h6>
        <div v-for="todo in completedTodos" class="todo media text-muted pt-3 completed" v-bind:key="todo.id" >
          <img data-src="holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1" alt="" class="mr-2 rounded">
          <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
            <strong class="d-block text-gray-dark">@username</strong>
            <span class="view">
              <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            </span>
          </p>
          <v-icon class="m-2" @click="undoCompletedTodo(todo)" name="trash-restore" />
        </div>
      </div>

    </div>
  </section>
  <div v-if="error" class="error" @click="handleErrorClick">
    ERROR: {{this.error}}
  </div>
</div>
</template>
<script>
// visibility filters
let filters = {
  all: function(todos) {
    return todos
  },
  active: function(todos) {
    return todos.filter(function(todo) {
      return !todo.completed
    })
  },
  completed: function(todos) {
    return todos.filter(function(todo) {
      return todo.completed
    })
  }
}
// app Vue instance
const Todos = {
  name: 'Todos',
  props: {
    activeUser: Object
  },
  // app initial state
  data: function() {
    return {
      todos: [],
      newTodo: '',
      editedTodo: null,
      visibility: 'all',
      loading: true,
      error: null,
    }
  },
  // Life cycle component hook
  // https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram
  mounted() {
    // inject some startup data
    this.todos = [{
      title: 'Drink coffee',
      completed: false
    }, {
      title: 'Write REST API',
      completed: false
    }, {
      title: 'Brush off VM',
      completed: true
    }];
    // hide the loading message
    this.loading = false;
  },
  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
    // Primary list of todo's displayed
    filteredTodos: function() {
      return filters[this.visibility](this.todos)
    },
    // Count of active todos remaining
    remaining: function() {
      return filters.active(this.todos).length
    },
    completed: function() {
      return filters.completed(this.todos).length
    },
    completedTodos: function() {
      return filters.completed(this.todos)
    },
    remainingTodos: function() {
      return filters.active(this.todos)
    },
    userEmail: function() {
      return this.activeUser ? this.activeUser.email : ''
    },
    inputPlaceholder: function() {
      return this.activeUser ? this.activeUser.given_name + ', what needs to be done?' : 'What needs to be done?'
    }
  },
  // https://vuejs.org/v2/guide/filters.html
  filters: {
    pluralize: function(n) {
      return n === 1 ? 'item' : 'items'
    }
  },
  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    addTodo: function() {
      var value = this.newTodo && this.newTodo.trim()
      if (!value) {
        return
      }
      this.todos.push({
        title: value,
        completed: false
      });
      this.newTodo = ''
    },
    setVisibility: function(vis) {
      this.visibility = vis
    },
    completeTodo(todo) {
      this.$log.info("Completing")
      todo.completed = true
    },
    undoCompletedTodo(todo) {
      this.$log.info("Uncompleting")
      todo.completed = false
    },
    removeTodo: function(todo) { // notice NOT using "=>" syntax
      this.$log.info("Removing!!!!")
      this.todos.splice(this.todos.indexOf(todo), 1)
    },
    allDone: function() {
      this.todos.forEach(function(todo) {
        todo.completed = true
      })
    },
    editTodo: function(todo) {
      this.$log.info("EDITING!!!!")
      this.beforeEditCache = todo.title
      this.editedTodo = todo
    },
    doneEdit: function(todo) {
      this.$log.info("DONE EDITING!!!!")
      if (!this.editedTodo) {
        return
      }
      this.editedTodo = null
      todo.title = todo.title.trim()
      if (!todo.title) {
        this.removeTodo(todo)
      }
    },
    cancelEdit: function(todo) {
      this.$log.info("CANCEL EDITING!!!!")
      this.editedTodo = null
      todo.title = this.beforeEditCache
    },
    removeCompleted: function() {
      this.todos = filters.active(this.todos)
    },
    handleErrorClick: function() {
      this.error = null;
    },
  },
  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // http://vuejs.org/guide/custom-directive.html
  directives: {
    'todo-focus': function(el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  }
}
export default Todos
</script>
<style>
[v-cloak] {
  display: none;
}
</style>
