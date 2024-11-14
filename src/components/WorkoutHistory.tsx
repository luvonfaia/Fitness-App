import React from 'react';
import { LineChart, TrendingUp } from 'lucide-react';
import { Workout } from '../lib/workoutService';

interface WorkoutHistoryProps {
  workout: Workout;
  history: Workout[];
  onClose: () => void;
}

export default function WorkoutHistory({ workout, history, onClose }: WorkoutHistoryProps) {
  const calculateProgress = () => {
    if (history.length < 2) return null;
    const oldestWeight = history[history.length - 1].weight;
    const latestWeight = history[0].weight;
    const progress = ((latestWeight - oldestWeight) / oldestWeight) * 100;
    return progress.toFixed(1);
  };

  const progress = calculateProgress();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <LineChart className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold">Progress History: {workout.exercise}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {progress && (
          <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span className="font-medium">
                Overall Progress: {progress}% in weight
              </span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reps
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((entry, index) => (
                <tr key={entry.id} className={index === 0 ? 'bg-green-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.weight}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.sets}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.reps}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}