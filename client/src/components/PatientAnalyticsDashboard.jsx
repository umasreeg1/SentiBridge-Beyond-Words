import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell
} from 'recharts';
import { Activity, Calendar, Tag, Compass, CheckCircle2, Lock, ShieldCheck, Info, BarChart3 } from 'lucide-react';
import { fetchPatientAnalytics } from '../api';

export default function PatientAnalyticsDashboard({ patientId, patientName, hasApprovedSharing }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;

    if (!hasApprovedSharing) {
      setLoading(false);
      setError({ message: 'Patient has not authorized sharing reflection analytics with clinical providers.' });
      setAnalyticsData(null);
      return;
    }

    setLoading(true);
    setError(null);
    fetchPatientAnalytics(patientId)
      .then(data => {
        setAnalyticsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Analytics load error:', err);
        setError(err.data || { message: err.message });
        setLoading(false);
      });
  }, [patientId, hasApprovedSharing]);

  if (!hasApprovedSharing || error) {
    return (
      <div className="bg-white rounded-2xl border border-clinical-200 p-8 text-center space-y-4 max-w-2xl mx-auto shadow-sm my-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-clinical-900">Analytics Access Restricted</h3>
        <p className="text-xs text-clinical-600 leading-relaxed max-w-md mx-auto">
          {error?.message || "Patient has not authorized sharing reflection analytics with clinical providers."}
        </p>
        <div className="bg-clinical-50 border border-clinical-200 rounded-xl p-3 text-[11px] text-clinical-700 text-left max-w-md mx-auto">
          <strong>Privacy & Ethics Principle:</strong> Reflection analytics are derived exclusively from patient-approved submissions. Unapproved drafts do not generate clinician charts.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-clinical-200 p-12 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-clinical-600 font-medium">Calculating Patient Reflection Analytics...</p>
      </div>
    );
  }

  const { timelineData = [], topicDistribution = [], supportPrefsData = [], completionData = [] } = analyticsData || {};

  const COLORS = ['#0d9488', '#6366f1', '#a855f7', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-6">
      
      {/* Analytics Header Card */}
      <div className="bg-white rounded-2xl border border-clinical-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-clinical-900">
                Patient Progress & Reflection Analytics
              </h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Patient-Reported Metrics</span>
              </span>
            </div>
            <p className="text-xs text-clinical-500 mt-1">
              Visual overview derived strictly from {patientName}'s authorized pre-session reflection submissions.
            </p>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-xs text-indigo-900 max-w-xs">
            <div className="font-semibold flex items-center space-x-1 text-indigo-950">
              <Info className="w-3.5 h-3.5 text-indigo-600" />
              <span>Non-Diagnostic Disclaimer</span>
            </div>
            <p className="text-[11px] text-indigo-800 mt-0.5">
              Charts measure self-reported reflection frequency and topic choices, not medical clinical scores.
            </p>
          </div>
        </div>
      </div>

      {/* Grid 1: Activity Timeline & Section Completion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart A: Reflection Activity Timeline */}
        <div className="bg-white rounded-2xl border border-clinical-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-clinical-100 pb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm text-clinical-900">Reflection Submission Timeline</h3>
            </div>
            <span className="text-[11px] text-clinical-500">Completed Sessions</span>
          </div>

          {timelineData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis allowDecimals={false} domain={[0, 3]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="reflectionsCount" name="Reflections" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs text-clinical-500 italic py-8 text-center">Not enough historical reflection dates yet.</p>
          )}
        </div>

        {/* Chart B: Reflection Section Completion Breakdown */}
        <div className="bg-white rounded-2xl border border-clinical-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-clinical-100 pb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-sm text-clinical-900">Approved Section Sharing Status</h3>
            </div>
            <span className="text-[11px] text-clinical-500">% Authorized</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionData} margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="section" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="score" name="% Shared" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid 2: Patient-Selected Topic Distribution & Support Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart C: Patient-Selected Topic Distribution */}
        <div className="bg-white rounded-2xl border border-clinical-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-clinical-100 pb-3">
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-purple-600" />
              <h3 className="font-bold text-sm text-clinical-900">Self-Reported Focus Topics</h3>
            </div>
            <span className="text-[11px] text-clinical-500">Patient-Selected Categories</span>
          </div>

          {topicDistribution.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicDistribution} margin={{ top: 10, right: 30, left: 10, bottom: 35 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="topic" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-20} textAnchor="end" />
                  <YAxis domain={[0, 2]} allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="count" name="Frequency" fill="#8b5cf6" radius={[6, 6, 0, 0]}>
                    {topicDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs text-clinical-500 italic py-8 text-center">Topic preferences section excluded from patient sharing.</p>
          )}
        </div>

        {/* Chart D: Communication & Support Preferences */}
        <div className="bg-white rounded-2xl border border-clinical-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-clinical-100 pb-3">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-sm text-clinical-900">Stated Support Preferences</h3>
            </div>
            <span className="text-[11px] text-clinical-500">Preference Value</span>
          </div>

          {supportPrefsData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={supportPrefsData} margin={{ top: 10, right: 30, left: 40, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#475569' }} width={110} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="value" name="Preference Priority" fill="#0d9488" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs text-clinical-500 italic py-8 text-center">Support compass section excluded from patient sharing.</p>
          )}
        </div>

      </div>

    </div>
  );
}
