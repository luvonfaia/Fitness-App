import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Plus, Edit2, Trash2, History } from 'lucide-react';
import WorkoutForm from './WorkoutForm';
import WorkoutHistory from './WorkoutHistory';
import { workoutService } from '../lib/workoutService';
import type { Workout } from '../lib/db';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [selectedDay, setSelectedDay] = useState('Sunday');
  const [showHistory, setShowHistory] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    async function fetchWorkouts() {
      if (user) {
        const userWorkouts = await workoutService.getWorkouts(user.id);
        setWorkouts(userWorkouts);
      }
    }
    fetchWorkouts();
  }, [user]);

  const handleAddWorkout = async (workout: Workout) => {
    if (user) {
      const newWorkout = await workoutService.addWorkout({
        ...workout,
        userId: user.id
      });
      setWorkouts([...workouts, newWorkout]);
      setShowForm(false);
    }
  };

  const handleEditWorkout = async (workout: Workout) => {
    await workoutService.updateWorkout(workout);
    setWorkouts(workouts.map((w) => (w.id === workout.id ? workout : w)));
    setSelectedWorkout(null);
    setShowForm(false);
  };

  const handleDeleteWorkout = async (id: number) => {
    if (user) {
      await workoutService.deleteWorkout(id, user.id);
      setWorkouts(workouts.filter((w) => w.id !== id));
    }
  };

  const handleShowHistory = async (workout: Workout) => {
    if (user) {
      const history = await workoutService.getWorkoutHistory(user.id, workout.exercise);
      setWorkoutHistory(history);
      setSelectedWorkout(workout);
      setShowHistory(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Fitness Tracker</h1>
        <button
          onClick={() => {
            setSelectedWorkout(null);
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Workout
        </button>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-md ${
              selectedDay === day
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {showForm && (
        <WorkoutForm
          onSubmit={selectedWorkout ? handleEditWorkout : handleAddWorkout}
          onCancel={() => {
            setShowForm(false);
            setSelectedWorkout(null);
          }}
          initialData={selectedWorkout}
        />
      )}

      {showHistory && selectedWorkout && (
        <WorkoutHistory
          workout={selectedWorkout}
          history={workoutHistory}
          onClose={() => {
            setShowHistory(false);
            setSelectedWorkout(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts
          .filter((workout) => workout.date === selectedDay)
          .map((workout) => (
            <div
              key={workout.id}
              className="bg-white rounded-lg shadow-md p-6 space-y-4"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">{workout.exercise}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleShowHistory(workout)}
                    className="text-gray-400 hover:text-indigo-500"
                    title="View History"
                  >
                    <History className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedWorkout(workout);
                      setShowForm(true);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteWorkout(workout.id!)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">Sets: {workout.sets}</p>
                <p className="text-gray-600">Reps: {workout.reps}</p>
                <p className="text-gray-600">Weight: {workout.weight}kg</p>
                {workout.notes && (
                  <p className="text-gray-600 italic">{workout.notes}</p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}