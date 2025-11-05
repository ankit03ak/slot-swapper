import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function EventForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const submit = (e) => {
  e.preventDefault();
  
  if (!title || !start || !end) {
    toast.error('Please fill in all fields');
    return;
  }
  
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  if (endDate <= startDate) {
    toast.error('End time must be after start time');
    return;
  }
  
  onCreate({ 
    title, 
    startTime: startDate.toISOString(), 
    endTime: endDate.toISOString() 
  });
  
  setTitle(''); 
  setStart(''); 
  setEnd('');
  
};


  return (
    <form onSubmit={submit} className="bg-white rounded-xl shadow-md p-6 mb-2 border border-gray-100">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
          <Plus className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Create New Event</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Title
          </label>
          <input 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" 
            placeholder="Enter event title" 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <input 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" 
              type="datetime-local" 
              value={start} 
              onChange={e => setStart(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <input 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" 
              type="datetime-local" 
              value={end} 
              onChange={e => setEnd(e.target.value)}
              required
            />
          </div>
        </div>

        <button 
          type='submit' 
          className="w-full md:w-auto px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <Plus/>
          <span>Add Event</span>
        </button>
      </div>
    </form>
  );
}