import {createAction, createReducer} from "redux-starter-kit";
import produce from "immer";

/** @payload [Stage] */
export const addStages = createAction('add/stages');

/** @payload { tasksIds, toStage, atIndex } */
export const moveTasks = createAction('move_tasks');

/** @payload [Task] */
export const addTasks = createAction('add/tasks');

/** @payload [Task] */
export const addNewTask = createAction('add_new_task');

/** @payload Number */
export const deleteTask = createAction('delete/task');

/** @payload { id: Number, task: Task } */
export const updateTask = createAction('update/task');

/** @payload [Tag] */
export const addTags = createAction('add/tags');

/** @payload [User] */
export const addUsers = createAction('add/users');

const initialState = {
  stages: {},
  tasks: {},
  tags: {},
  users: {}
};

const removeArrayElement = (arr, el) => {
  const index = arr.indexOf(el);
  if (index === -1) { return; }

  arr.splice(index, 1);
}

const reducer  = createReducer(initialState, {
  [addStages]: (state, action) => produce(state, draft => {
    const stages = action.payload;
    stages.forEach((stage) => {
      draft.stages[stage._id] = stage;
    });
  }),
  [moveTasks]: (state, action) => produce(state, draft => {
    const { taskIds, toStage, atIndex } = action.payload;

    for (const taskId of taskIds) { /* eslint-disable-line */
      const task = state.tasks[taskId];
      const stage = draft.stages[task.stage];
      removeArrayElement(stage.tasks, task._id);
    }

    draft.stages[toStage].tasks.splice(atIndex, 0, ...taskIds);
  }),

  [addTasks]: (state, action) => produce(state, draft => {
    const tasks = action.payload;
    tasks.forEach((task) => {
      draft.tasks[task._id] = task;
    });
  }),
  [addNewTask]: (state, action) => produce(state, draft => {
    const task = action.payload;
    draft.tasks[task._id] = task;
    draft.stages[task.stage].tasks.push(task._id);
  }),
  [deleteTask]: (state, action) => produce(state, draft => {
    const task = draft.tasks[action.payload];
    removeArrayElement(draft.stages[task.stage].tasks, task._id);
    delete draft.tasks[action.payload];
  }),
  [updateTask]: (state, action) => produce(state, draft => {
    const { id, task } = action.payload;

    const oldTask = draft.tasks[id];
    if (!oldTask) {
      return;
    }

    draft.tasks[action.payload.id] = {
      ...oldTask,
      ...task
    };
  }),

  [addTags]: (state, action) => produce(state, draft => {
    const tags = action.payload;
    tags.forEach((tag) => {
      draft.tags[tag._id] = tag;
    });
  }),

  [addUsers]: (state, action) => produce(state, draft => {
    const users = action.payload;
    users.forEach((user) => {
      draft.users[user._id] = user;
    });
  }),
});

export default reducer