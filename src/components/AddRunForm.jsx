import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ArrowRight,
  Calculator,
  RotateCcw,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';
import { timeStringToSeconds, secondsToPaceString } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

export default function AddRunForm({ onAddRun, onEditRun, onViewReport, onCancel, initialData, isViewOnly, isEditMode, hideHeader, isPublic }) {
  const navigate = useNavigate();
  const todayStr = new Date().toISOString().split('T')[0];

  const initialFormState = {
    name: '',
    date: todayStr,
    distance: '',
    avgPace: '',
    movingTime: '',
    elevationGain: '',
    type: 'Run',
  };

  const [formData, setFormData] = useState(initialData || initialFormState);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        ...initialFormState,
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const workoutTypes = ['Walk', 'Run'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCalculatePace = () => {
    const dist = parseFloat(formData.distance);
    const timeSec = timeStringToSeconds(formData.movingTime);

    if (!dist || dist <= 0) {
      setErrors((prev) => ({ ...prev, distance: 'Enter valid distance first' }));
      return;
    }
    if (!timeSec || timeSec <= 0) {
      setErrors((prev) => ({ ...prev, movingTime: 'Enter valid time (e.g., 25:30)' }));
      return;
    }

    const secPerKm = timeSec / dist;
    const computedPace = secondsToPaceString(secPerKm);
    setFormData((prev) => ({ ...prev, avgPace: computedPace }));
    setErrors((prev) => ({ ...prev, avgPace: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Run name is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.distance || isNaN(formData.distance) || Number(formData.distance) <= 0) {
      newErrors.distance = 'Please enter a valid positive distance';
    }
    if (!formData.avgPace.trim()) {
      newErrors.avgPace = "Avg pace is required (e.g., '6:14/km')";
    }
    if (!formData.movingTime.trim()) {
      newErrors.movingTime = "Moving time is required (e.g., '13:39' or '1:15:00')";
    }
    if (formData.elevationGain === '' || isNaN(formData.elevationGain) || Number(formData.elevationGain) < 0) {
      newErrors.elevationGain = 'Please enter elevation gain in meters (0 or more)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isViewOnly) return;

    if (!validate()) {
      return;
    }

    const runData = {
      id: isEditMode && formData.id ? formData.id : `run-${Date.now()}`,
      name: formData.name.trim(),
      date: formData.date,
      distance: parseFloat(formData.distance),
      avgPace: formData.avgPace.trim().includes('/km') 
        ? formData.avgPace.trim() 
        : `${formData.avgPace.trim()}/km`,
      movingTime: formData.movingTime.trim(),
      elevationGain: parseInt(formData.elevationGain, 10),
      type: formData.type || 'Run',
    };

    if (isEditMode && onEditRun) {
      await onEditRun(runData);
    } else if (onAddRun) {
      await onAddRun(runData);
    }

    if (isPublic) {
      navigate('/success');
      return;
    }

    setSuccessMessage(isEditMode ? `Run "${runData.name}" updated successfully!` : `Run "${runData.name}" recorded successfully!`);

    if (!isEditMode) {
      // Reset form
      setFormData({
        ...initialFormState,
        date: new Date().toISOString().split('T')[0],
      });
    }
    setErrors({});
  };

  const handleReset = () => {
    setFormData({
      ...initialFormState,
      date: new Date().toISOString().split('T')[0],
    });
    setErrors({});
    setSuccessMessage(null);
  };

  return (
    <div className="w-full px-1 sm:px-2 pb-2">
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-gray-100 gap-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-gray-700" />
              <span>{isViewOnly ? 'View Running Session' : isEditMode ? 'Edit Running Session' : 'Record New Running Session'}</span>
            </h3>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-900">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
          {onViewReport && (
            <button
              type="button"
              onClick={onViewReport}
              className="flex items-center space-x-1 text-xs font-semibold bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors shrink-0"
            >
              <span>View in Table</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Workout Category Tags */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
            Activity Category
          </label>
          <div className="flex flex-wrap gap-2">
            {workoutTypes.map((type) => (
              <button
                type="button"
                disabled={isViewOnly}
                key={type}
                onClick={() => setFormData((prev) => ({ ...prev, type }))}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  formData.type === type
                    ? 'bg-gray-900 text-white font-semibold shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${isViewOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Run Name */}
          <div>
            <label htmlFor="run-name" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="run-name"
              name="name"
              type="text"
              placeholder="e.g., Rohit"
              value={formData.name}
              onChange={handleChange}
              disabled={isViewOnly}
              className={`w-full rounded-lg bg-white border px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-gray-300 focus:border-gray-900 focus:ring-gray-200'
              } ${isViewOnly ? 'opacity-80 bg-gray-50' : ''}`}
            />
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
          </div>

          {/* Date Input */}
          <div>
            <label htmlFor="run-date" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Date <span className="text-rose-500">*</span>
            </label>
            <DatePicker
              id="run-date"
              selected={formData.date ? parseISO(formData.date) : null}
              onChange={(date) => {
                setFormData(prev => ({
                  ...prev,
                  date: date ? format(date, 'yyyy-MM-dd') : ''
                }));
                if (errors.date) setErrors(prev => ({ ...prev, date: null }));
              }}
              dateFormat="dd/MM/yyyy"
              disabled={isViewOnly}
              placeholderText="dd/MM/yyyy"
              wrapperClassName="w-full block"
              className={`w-full rounded-lg bg-white border px-3.5 py-2.5 text-sm text-gray-900 transition-all focus:outline-none focus:ring-2 ${
                errors.date
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-gray-300 focus:border-gray-900 focus:ring-gray-200'
              } ${isViewOnly ? 'opacity-80 bg-gray-50' : ''}`}
            />
            {errors.date && <p className="text-xs text-rose-600 mt-1">{errors.date}</p>}
          </div>

          {/* Distance in km */}
          <div>
            <label htmlFor="run-distance" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Distance (km) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="run-distance"
                name="distance"
                type="number"
                step="0.01"
                min="0.1"
                placeholder="e.g., 8.5 km"
                value={formData.distance}
                onChange={handleChange}
                disabled={isViewOnly}
                className={`w-full rounded-lg bg-white border px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 ${
                  errors.distance
                    ? 'border-rose-300 focus:ring-rose-200'
                    : 'border-gray-300 focus:border-gray-900 focus:ring-gray-200'
                } ${isViewOnly ? 'opacity-80 bg-gray-50' : ''}`}
              />
            </div>
            {errors.distance && <p className="text-xs text-rose-600 mt-1">{errors.distance}</p>}
          </div>

          {/* Moving Time */}
          <div>
            <label htmlFor="run-moving-time" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Moving Time <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="run-moving-time"
                name="movingTime"
                type="text"
                placeholder="e.g., 13:39 or 1:05:20"
                value={formData.movingTime}
                onChange={handleChange}
                disabled={isViewOnly}
                className={`w-full rounded-lg bg-white border px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 font-mono ${
                  errors.movingTime
                    ? 'border-rose-300 focus:ring-rose-200'
                    : 'border-gray-300 focus:border-gray-900 focus:ring-gray-200'
                } ${isViewOnly ? 'opacity-80 bg-gray-50' : ''}`}
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-gray-400">
                mm:ss
              </span>
            </div>
            {errors.movingTime && <p className="text-xs text-rose-600 mt-1">{errors.movingTime}</p>}
          </div>

          {/* Avg Pace */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="run-pace" className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                Avg Pace <span className="text-rose-500">*</span>
              </label>
              {!isViewOnly && (
                <button
                  type="button"
                  onClick={handleCalculatePace}
                  className="flex items-center space-x-1 text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
                  title="Calculate pace from distance and moving time"
                >
                  <Calculator className="w-3 h-3" />
                  <span>Auto Calc</span>
                </button>
              )}
            </div>
            <input
              id="run-pace"
              name="avgPace"
              type="text"
              placeholder="e.g., 6:14/km"
              value={formData.avgPace}
              onChange={handleChange}
              disabled={isViewOnly}
              className={`w-full rounded-lg bg-white border px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 font-mono ${
                errors.avgPace
                  ? 'border-rose-300 focus:ring-rose-200'
                  : 'border-gray-300 focus:border-gray-900 focus:ring-gray-200'
              } ${isViewOnly ? 'opacity-80 bg-gray-50' : ''}`}
            />
            {errors.avgPace && <p className="text-xs text-rose-600 mt-1">{errors.avgPace}</p>}
          </div>

          {/* Elevation Gain in m */}
          <div>
            <label htmlFor="run-elevation" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
              Elevation Gain (m) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="run-elevation"
                name="elevationGain"
                type="number"
                min="0"
                placeholder="e.g., 45 meters"
                value={formData.elevationGain}
                onChange={handleChange}
                disabled={isViewOnly}
                className={`w-full rounded-lg bg-white border px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 ${
                  errors.elevationGain
                    ? 'border-rose-300 focus:ring-rose-200'
                    : 'border-gray-300 focus:border-gray-900 focus:ring-gray-200'
                } ${isViewOnly ? 'opacity-80 bg-gray-50' : ''}`}
              />
            </div>
            {errors.elevationGain && <p className="text-xs text-rose-600 mt-1">{errors.elevationGain}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row-reverse items-center justify-start gap-3">
          {!isViewOnly && (
            <button
              id="submit-run-btn"
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-colors shadow-xs flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{isEditMode ? 'Save Changes' : 'Submit'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onCancel || handleReset}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <span>{isViewOnly ? 'Close' : 'Cancel'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
