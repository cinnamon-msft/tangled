import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="px-4 py-12 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Tangled
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Your personal crafts project tracker for knitting, crochet, and embroidery
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
        <Link
          to="/projects"
          className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-3">📋</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Projects</h2>
          <p className="text-gray-600">
            Track your current and completed crafting projects
          </p>
        </Link>
        <Link
          to="/materials"
          className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-3">🧵</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Materials</h2>
          <p className="text-gray-600">
            Manage your yarn stash and materials inventory
          </p>
        </Link>
        <Link
          to="/ideas"
          className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-3">💡</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ideas</h2>
          <p className="text-gray-600">
            Save project ideas and inspiration for the future
          </p>
        </Link>
      </div>
    </div>
  );
}
