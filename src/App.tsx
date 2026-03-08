import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  UserRound, 
  BarChart3, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  BrainCircuit,
  FileText,
  Search,
  Plus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { SAMPLE_DATA, PYTHON_GUIDE, StudentData } from './constants';

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'predictor' | 'analytics' | 'guide'>('overview');
  const [predictionInput, setPredictionInput] = useState<Partial<StudentData>>({
    gender: 'Male',
    age: 20,
    attendance: 75,
    previousMarks: 70,
    backlogs: 0,
    studyHours: 4,
  });
  const [predictionResult, setPredictionResult] = useState<{ risk: 'Low' | 'Medium' | 'High', probability: number } | null>(null);

  const stats = useMemo(() => {
    const total = SAMPLE_DATA.length;
    const dropouts = SAMPLE_DATA.filter(s => s.dropout).length;
    const avgAttendance = Math.round(SAMPLE_DATA.reduce((acc, s) => acc + s.attendance, 0) / total);
    const avgMarks = Math.round(SAMPLE_DATA.reduce((acc, s) => acc + s.previousMarks, 0) / total);
    
    return { total, dropouts, dropoutRate: Math.round((dropouts / total) * 100), avgAttendance, avgMarks };
  }, []);

  const chartData = useMemo(() => {
    const attendanceRanges = [
      { name: '0-50%', count: SAMPLE_DATA.filter(s => s.attendance <= 50).length },
      { name: '51-75%', count: SAMPLE_DATA.filter(s => s.attendance > 50 && s.attendance <= 75).length },
      { name: '76-100%', count: SAMPLE_DATA.filter(s => s.attendance > 75).length },
    ];

    const dropoutByGender = [
      { name: 'Male', dropout: SAMPLE_DATA.filter(s => s.gender === 'Male' && s.dropout).length },
      { name: 'Female', dropout: SAMPLE_DATA.filter(s => s.gender === 'Female' && s.dropout).length },
    ];

    const pieData = [
      { name: 'Retained', value: stats.total - stats.dropouts },
      { name: 'Dropout', value: stats.dropouts },
    ];

    return { attendanceRanges, dropoutByGender, pieData };
  }, [stats]);

  const handlePredict = () => {
    // Simple heuristic-based prediction for demo purposes
    let score = 0;
    if ((predictionInput.attendance || 0) < 60) score += 40;
    if ((predictionInput.backlogs || 0) > 2) score += 30;
    if ((predictionInput.previousMarks || 0) < 50) score += 20;
    if ((predictionInput.studyHours || 0) < 2) score += 10;

    const probability = Math.min(score, 100);
    let risk: 'Low' | 'Medium' | 'High' = 'Low';
    if (probability > 70) risk = 'High';
    else if (probability > 30) risk = 'Medium';

    setPredictionResult({ risk, probability });
  };

  return (
    <div className="min-h-screen flex bg-zinc-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col fixed h-full">
        <div className="p-6 border-bottom border-zinc-100">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <BrainCircuit size={24} />
            <span className="font-bold text-xl tracking-tight">EduPredict</span>
          </div>
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Dropout Analysis System</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Overview" 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
          />
          <SidebarItem 
            icon={<UserRound size={20} />} 
            label="Predictor" 
            active={activeTab === 'predictor'} 
            onClick={() => setActiveTab('predictor')} 
          />
          <SidebarItem 
            icon={<BarChart3 size={20} />} 
            label="Analytics" 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')} 
          />
          <SidebarItem 
            icon={<BookOpen size={20} />} 
            label="Project Guide" 
            active={activeTab === 'guide'} 
            onClick={() => setActiveTab('guide')} 
          />
        </nav>

        <div className="p-4 border-t border-zinc-100">
          <div className="bg-zinc-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-zinc-400 uppercase mb-2">Model Status</p>
            <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Random Forest Active
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 capitalize">{activeTab}</h1>
            <p className="text-zinc-500">Educational Data Mining for Student Success</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-50 transition-colors">
              <Search size={16} /> Search Records
            </button>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm">
              <Plus size={16} /> New Entry
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Students" value={stats.total} icon={<UserRound className="text-blue-500" />} />
                <StatCard label="Dropout Rate" value={`${stats.dropoutRate}%`} icon={<AlertCircle className="text-red-500" />} />
                <StatCard label="Avg. Attendance" value={`${stats.avgAttendance}%`} icon={<CheckCircle2 className="text-emerald-500" />} />
                <StatCard label="Avg. Marks" value={stats.avgMarks} icon={<BarChart3 className="text-amber-500" />} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <BarChart3 size={20} className="text-zinc-400" />
                    Attendance Distribution
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.attendanceRanges}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <PieChart size={20} className="text-zinc-400" />
                    Retention Overview
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData.pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartData.pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Recent Records Table */}
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Recent Student Records</h3>
                  <button className="text-sm text-emerald-600 font-medium hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 font-semibold">ID</th>
                        <th className="px-6 py-4 font-semibold">Gender</th>
                        <th className="px-6 py-4 font-semibold">Attendance</th>
                        <th className="px-6 py-4 font-semibold">Marks</th>
                        <th className="px-6 py-4 font-semibold">Backlogs</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {SAMPLE_DATA.slice(0, 5).map((student) => (
                        <tr key={student.id} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-zinc-900">{student.id}</td>
                          <td className="px-6 py-4 text-zinc-600">{student.gender}</td>
                          <td className="px-6 py-4 text-zinc-600">{student.attendance}%</td>
                          <td className="px-6 py-4 text-zinc-600">{student.previousMarks}</td>
                          <td className="px-6 py-4 text-zinc-600">{student.backlogs}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              student.dropout ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                            )}>
                              {student.dropout ? 'Dropout' : 'Retained'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'predictor' && (
            <motion.div 
              key="predictor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
                <h3 className="text-xl font-bold mb-6">Risk Prediction Tool</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Attendance (%)">
                      <input 
                        type="number" 
                        className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        value={predictionInput.attendance}
                        onChange={e => setPredictionInput({...predictionInput, attendance: parseInt(e.target.value)})}
                      />
                    </InputGroup>
                    <InputGroup label="Backlogs">
                      <input 
                        type="number" 
                        className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        value={predictionInput.backlogs}
                        onChange={e => setPredictionInput({...predictionInput, backlogs: parseInt(e.target.value)})}
                      />
                    </InputGroup>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Previous Marks">
                      <input 
                        type="number" 
                        className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        value={predictionInput.previousMarks}
                        onChange={e => setPredictionInput({...predictionInput, previousMarks: parseInt(e.target.value)})}
                      />
                    </InputGroup>
                    <InputGroup label="Study Hours/Day">
                      <input 
                        type="number" 
                        className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        value={predictionInput.studyHours}
                        onChange={e => setPredictionInput({...predictionInput, studyHours: parseInt(e.target.value)})}
                      />
                    </InputGroup>
                  </div>
                  <InputGroup label="Family Income">
                    <select 
                      className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white"
                      value={predictionInput.familyIncome}
                      onChange={e => setPredictionInput({...predictionInput, familyIncome: e.target.value as any})}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </InputGroup>
                  
                  <button 
                    onClick={handlePredict}
                    className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 mt-4 flex items-center justify-center gap-2"
                  >
                    <BrainCircuit size={20} /> Run Prediction Model
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {predictionResult ? (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                      "p-8 rounded-2xl border-2 flex flex-col items-center text-center",
                      predictionResult.risk === 'High' ? "bg-red-50 border-red-100" : 
                      predictionResult.risk === 'Medium' ? "bg-amber-50 border-amber-100" : 
                      "bg-emerald-50 border-emerald-100"
                    )}
                  >
                    <div className={cn(
                      "w-20 h-20 rounded-full flex items-center justify-center mb-4",
                      predictionResult.risk === 'High' ? "bg-red-100 text-red-600" : 
                      predictionResult.risk === 'Medium' ? "bg-amber-100 text-amber-600" : 
                      "bg-emerald-100 text-emerald-600"
                    )}>
                      {predictionResult.risk === 'High' ? <AlertCircle size={40} /> : <CheckCircle2 size={40} />}
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-1">Risk Assessment</h4>
                    <h2 className={cn(
                      "text-4xl font-black mb-2",
                      predictionResult.risk === 'High' ? "text-red-600" : 
                      predictionResult.risk === 'Medium' ? "text-amber-600" : 
                      "text-emerald-600"
                    )}>
                      {predictionResult.risk} Risk
                    </h2>
                    <p className="text-zinc-600 max-w-xs">
                      The model predicts a <strong>{predictionResult.probability}%</strong> likelihood of dropout based on the provided parameters.
                    </p>
                    
                    <div className="mt-8 w-full bg-white/50 p-4 rounded-xl text-left">
                      <h5 className="text-xs font-bold text-zinc-400 uppercase mb-3">Recommended Actions</h5>
                      <ul className="space-y-2">
                        {predictionResult.risk === 'High' ? (
                          <>
                            <li className="text-sm flex items-start gap-2 text-zinc-700">
                              <ChevronRight size={16} className="text-red-500 mt-0.5 shrink-0" />
                              Schedule immediate counseling session.
                            </li>
                            <li className="text-sm flex items-start gap-2 text-zinc-700">
                              <ChevronRight size={16} className="text-red-500 mt-0.5 shrink-0" />
                              Review financial aid eligibility.
                            </li>
                          </>
                        ) : (
                          <li className="text-sm flex items-start gap-2 text-zinc-700">
                            <ChevronRight size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                            Continue monitoring academic progress.
                          </li>
                        )}
                      </ul>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-1 bg-zinc-100 rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center p-12 text-zinc-400">
                    <BrainCircuit size={48} className="mb-4 opacity-20" />
                    <p className="text-center font-medium">Enter student data and run the model to see the risk assessment.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                  <h3 className="text-lg font-semibold mb-6">Dropout by Gender</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.dropoutByGender}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Bar dataKey="dropout" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={60} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                  <h3 className="text-lg font-semibold mb-6">Model Performance Comparison</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { name: 'LR', accuracy: 82, f1: 78 },
                        { name: 'DT', accuracy: 85, f1: 83 },
                        { name: 'RF', accuracy: 92, f1: 90 },
                        { name: 'SVM', accuracy: 88, f1: 85 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
                        <Line type="monotone" dataKey="f1" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'guide' && (
            <motion.div 
              key="guide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-2xl border border-zinc-200 shadow-sm max-w-4xl mx-auto"
            >
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-zinc-100">
                <FileText className="text-emerald-600" size={32} />
                <div>
                  <h2 className="text-2xl font-bold">Implementation Guide</h2>
                  <p className="text-zinc-500">Step-by-step tutorial for the Python ML project</p>
                </div>
              </div>
              <div className="markdown-body prose prose-zinc max-w-none">
                <Markdown>{PYTHON_GUIDE}</Markdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
        active 
          ? "bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100/50" 
          : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-zinc-50 rounded-lg">
          {icon}
        </div>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+2.5%</span>
      </div>
      <h3 className="text-zinc-500 text-sm font-medium mb-1">{label}</h3>
      <p className="text-2xl font-bold text-zinc-900">{value}</p>
    </div>
  );
}

function InputGroup({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}
