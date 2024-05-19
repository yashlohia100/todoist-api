import { Schema, model } from 'mongoose';

const todoSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },

    isDone: {
      type: Boolean,
      default: false,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

todoSchema.pre(/^find/, function (next) {
  this.select('-__v');
  next();
});

const Todo = model('Todo', todoSchema);
export default Todo;
