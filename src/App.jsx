import { useState, useEffect } from "react";

export default function App() {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("pomodoro");
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [taskInput, setTaskInput] = useState("");

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsRunning(false);
            alert("Vaqt tugadi!");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
    setIsRunning(false);
    if (selectedMode === "pomodoro") setTime(25 * 60);
    if (selectedMode === "short") setTime(5 * 60);
    if (selectedMode === "long") setTime(15 * 60);
  };

  const displayTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const addTask = () => {
    if (taskInput.trim() !== "") {
      const newTasks = [...tasks, taskInput];
      setTasks(newTasks);
      setTaskInput("");
    }
  };

  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial" }}>
      <h1>Pomodoro Timer</h1>
      <div>
        <button onClick={() => handleModeChange("pomodoro")}>Pomodoro</button>
        <button onClick={() => handleModeChange("short")}>Short Break</button>
        <button onClick={() => handleModeChange("long")}>Long Break</button>
      </div>
      <div style={{ fontSize: "48px", margin: "20px 0" }}>{displayTime()}</div>
      <button onClick={() => setIsRunning(true)}>Boshlash</button>
      <button onClick={() => setIsRunning(false)}>To‘xtatish</button>
      <button onClick={() => handleModeChange(mode)}>Qayta o‘rnatish</button>
      <h2>Vazifalar</h2>
      <input
        type="text"
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        placeholder="Vazifani kiriting"
      />
      <button onClick={addTask}>Qo‘shish</button>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {task} <button onClick={() => deleteTask(index)}>O‘chirish</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
