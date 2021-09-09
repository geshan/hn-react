import React, { useState, useEffect } from 'react';
import flagsmith from 'flagsmith';
import './App.css';

function App() {
  const [stories, setStories] = useState([]);
  const [message, setMessage] = useState('loading...');
  const [showStoryPoints, setShowStoryPoints] = useState(false);
  useEffect(() => {
    async function fetchNewsStories () {
      try {
        const data = await (await fetch('https://hn.algolia.com/api/v1/search_by_date?tags=front_page')).json();
        setStories(data.hits)
        const message = data.hits.length ? '' : 'No stories found';
        setMessage(message);
      } catch (err) {
        console.log(`err: ${err.mesasge}`, err);
        setMessage('could not fetch stories');
      }
    }
    fetchNewsStories();
    flagsmith.init({
      environmentID:"DRLDV3g6nJGkh4KZfaSS5c",
      cacheFlags: true,
      enableAnalytics: true,
      onChange: (oldFlags, params) => {
        setShowStoryPoints(flagsmith.hasFeature('show_story_points'));
      }
    });    
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Latest HN Stories</h2>
        {message}
        <div className="stories">
          {Array.isArray(stories) && stories.map(
            story => story.url && <h3><a href={story.url} target="_blank" rel="noreferrer">{story.title}</a> - by {story.author} {showStoryPoints ? '- points '+ story.points : ''}</h3>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
