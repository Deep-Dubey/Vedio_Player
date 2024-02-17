// VideoPlayer.js

import React, { useState, useRef, useEffect } from "react";
import {
  FiPlay,
  FiPause,
  FiSkipForward,
  FiSkipBack,
  FiMaximize2,
  FiX,
} from "react-icons/fi";
import "./VideoPlayer.css";
import video1 from "./videos/video1.mp4";
import video2 from "./videos/video2.mp4";
import video3 from "./videos/video3.mp4";
import thumbnail1 from "./thumbnails/thumbnail1.jpg"; // Sample thumbnail image
import thumbnail2 from "./thumbnails/thumbnail2.jpg";
import thumbnail3 from "./thumbnails/thumbnail3.jpg";

const videos = [
  { id: 1, src: video1, title: "Video 1", thumbnail: thumbnail1 },
  { id: 2, src: video2, title: "Video 2", thumbnail: thumbnail2 },
  { id: 3, src: video3, title: "Video 3", thumbnail: thumbnail3 },
];

const playbackSpeeds = [0.5, 1, 1.5, 2]; // List of playback speeds

const VideoPlayer = () => {
  const [playlist, setPlaylist] = useState(videos);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [speed, setSpeed] = useState(1); // Initial playback speed
  const videoRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  const playPauseHandler = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const skipVideoHandler = (direction) => {
    if (direction === "forward") {
      setCurrentVideoIndex((prevIndex) =>
        prevIndex === playlist.length - 1 ? 0 : prevIndex + 1
      );
    } else {
      setCurrentVideoIndex((prevIndex) =>
        prevIndex === 0 ? playlist.length - 1 : prevIndex - 1
      );
    }
    setSpeed(1);
  };

  const volumeChangeHandler = (e) => {
    setVolume(e.target.value);
    videoRef.current.volume = e.target.value;
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().catch((err) => {
        console.log(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  const speedChangeHandler = (e) => {
    setSpeed(parseFloat(e.target.value));
    videoRef.current.playbackRate = parseFloat(e.target.value);
  };

  const endedHandler = () => {
    setIsPlaying(false);
    skipVideoHandler("forward");
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDrop = (e, index) => {
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const draggedItem = playlist[dragIndex];
    const newPlaylist = [...playlist];
    newPlaylist.splice(dragIndex, 1);
    newPlaylist.splice(index, 0, draggedItem);
    setPlaylist(newPlaylist);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="video-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          src={playlist[currentVideoIndex].src}
          onEnded={endedHandler}
          autoPlay
          controls
          style={{ width: "100%", height: "auto" }}
        />
        <div className="controls">
          <button onClick={playPauseHandler}>
            {isPlaying ? <FiPause /> : <FiPlay />}
          </button>
          <button onClick={() => skipVideoHandler("backward")}>
            <FiSkipBack />
          </button>
          <button onClick={() => skipVideoHandler("forward")}>
            <FiSkipForward />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={volumeChangeHandler}
          />
          <select value={speed} onChange={speedChangeHandler}>
            {playbackSpeeds.map((speedOption) => (
              <option key={speedOption} value={speedOption}>
                {speedOption}x
              </option>
            ))}
          </select>
          <button onClick={toggleFullScreen}>
            <FiMaximize2 />
          </button>
          <button onClick={() => setIsFullScreen(false)}>
            <FiX />
          </button>
        </div>
      </div>
      <div className="playlist" onDragOver={handleDragOver}>
        <ul>
          {playlist.map((video, index) => (
            <li
              key={video.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onClick={() => setCurrentVideoIndex(index)}
            >
              <img src={video.thumbnail} alt={`Thumbnail for ${video.title}`} />
              <span>{video.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoPlayer;
