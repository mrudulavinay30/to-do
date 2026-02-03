  const Todo = require('./task');

  // Create new task
  const createtask = async (req, res) => {
    try {
      const newTask = new Todo({ ...req.body, user: req.userId });

      const task = await newTask.save();
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Get all tasks (with optional filtering)
  // Get all tasks (with optional filtering and search)
  const showtasks = async (req, res) => {
    try {
      const { category, search } = req.query; // e.g. ?category=pending&search=meeting
      let filter = { user: req.userId };

      // Filter by completion status
      if (category === 'pending') filter.completed = false;
      if (category === 'completed') filter.completed = true;

      // Filter by task name (case-insensitive search)
      if (search) {
        filter.task = { $regex: search, $options: 'i' };
      }

      const tasks = await Todo.find(filter).sort({ createdAt: -1 });

      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  // Toggle task completion
  const toggletask = async (req, res) => {
    try {
      const task = await Todo.findById(req.params.id);
      if (!task) return res.status(404).json({ message: 'Task not found' });
      task.completed = !task.completed;
      await task.save();
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Delete task
  const deletetask = async (req, res) => {
    try {
      await Todo.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  const updatetask = async (req, res) => {
    try {
      const { task } = req.body;
      const updated = await Todo.findByIdAndUpdate(
        req.params.id,
        { task },
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ message: "Task not found" });
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  module.exports = { createtask, showtasks, toggletask, deletetask,updatetask };
