import { Link } from 'react-router-dom';

const MOCK_PROBLEMS = [
  { id: 1, title: 'Two Sum', difficulty: 'easy', tags: ['Arrays', 'Hash Table'], status: 'solved' },
  { id: 2, title: 'Valid Parentheses', difficulty: 'easy', tags: ['Stacks'], status: 'unsolved' },
  { id: 3, title: 'Merge Intervals', difficulty: 'medium', tags: ['Arrays', 'Sorting'], status: 'unsolved' },
];

export default function ProblemList() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Problems</h1>
        <p className="text-slate-400 mt-1">Select a challenge to level up your skills.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Difficulty</th>
              <th className="px-6 py-4 font-medium">Tags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {MOCK_PROBLEMS.map((prob) => (
              <tr key={prob.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  {prob.status === 'solved' ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      ✓
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-700" />
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-slate-200">
                  <Link to={`/problems/${prob.id}`} className="hover:text-indigo-400 transition-colors">
                    {prob.title}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                    prob.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    prob.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {prob.difficulty.charAt(0).toUpperCase() + prob.difficulty.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  {prob.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs">
                      {tag}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
