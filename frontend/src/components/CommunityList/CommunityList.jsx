// Renders the scrollable list of community cards in the sidebar.
// Shows loading and empty states when appropriate.

import CommunityCard from './CommunityCard';
import './CommunityList.css';

export default function CommunityList({ communities, loading, selectedId, onSelect }) {
  if (loading) {
    return <div className="list-placeholder">Loading communities…</div>;
  }

  if (communities.length === 0) {
    return (
      <div className="list-placeholder">
        No communities match your filters.
        <br />Try widening your search criteria.
      </div>
    );
  }

  return (
    <ul className="community-list">
      {communities.map((c) => (
        <CommunityCard
          key={c.id}
          community={c}
          selected={selectedId === c.id}
          onClick={() => onSelect(c.id)}
        />
      ))}
    </ul>
  );
}
