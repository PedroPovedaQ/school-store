"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  faRotateLeft,
  faRotateRight,
  faPause,
  faPlay,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MeditationPlayer = ({
  title,
  audioSrc,
  backgroundSrc,
  onClose,
  isVisible,
}: {
  title: string;
  audioSrc: string;
  backgroundSrc: string;
  onClose: () => void;
  isVisible: boolean;
}) => {
  const backgroundVideoRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const progressBarRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const audioPlayer = audioPlayerRef.current as any;

    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: title,
        artist: "Hero Store", // Set this to a suitable value
        album: "Meditation Sessions", // Set this to a suitable value
        artwork: [
          { src: "/bordered-logo.png", sizes: "512x512", type: "image/png" },
        ],
      });

      navigator.mediaSession.setActionHandler("play", function () {
        audioPlayer.play();
        setIsPlaying(true);
      });
      navigator.mediaSession.setActionHandler("pause", function () {
        audioPlayer.pause();
        setIsPlaying(false);
      });
    }

    const setAudioData = () => {
      setDuration(audioPlayer.duration);
      setCurrentTime(audioPlayer.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audioPlayer.currentTime);

    audioPlayer.addEventListener("loadeddata", setAudioData);
    audioPlayer.addEventListener("timeupdate", setAudioTime);

    return () => {
      audioPlayer.removeEventListener("loadeddata", setAudioData);
      audioPlayer.removeEventListener("timeupdate", setAudioTime);
    };
  }, []);

  const togglePlayPause = () => {
    const audioPlayer = audioPlayerRef.current as any;
    if (audioPlayer.paused) {
      audioPlayer.play();
      setIsPlaying(true);
    } else {
      audioPlayer.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (event: { target: { value: number } }) => {
    const audioPlayer = audioPlayerRef.current;
    const seekTime = ((audioPlayer as any).duration / 100) * event.target.value;
    (audioPlayer as any).currentTime = seekTime;
    setCurrentTime(seekTime); // Ensure currentTime state is updated when seeking
  };

  useEffect(() => {
    const progressBar = progressBarRef.current as any;
    const updateProgressBar = () => {
      if (progressBar && duration > 0) {
        progressBar.value = (currentTime / duration) * 100;
      }
    };

    updateProgressBar();
  }, [currentTime, duration]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="meditation-player">
      <button className="close-btn" onClick={onClose}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <video
        ref={backgroundVideoRef}
        muted
        autoPlay
        playsInline
        id="backgroundVideo"
        onEnded={() => (backgroundVideoRef.current as any)?.play()}
      >
        <source src={backgroundSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {isLoading ? (
        <div className="loading-spinner"></div> // Display loading spinner
      ) : (
        <div className="player-controls">
          <button
            id="seekBackwardBtn"
            className="seek-btn"
            onClick={() => ((audioPlayerRef as any).current.currentTime -= 15)}
          >
            <FontAwesomeIcon
              icon={faRotateLeft}
              className="text-white"
              size="lg"
              style={{ maxHeight: "50px" }}
            />
          </button>
          <div className="play-pause-wrapper">
            <button
              id="playPauseBtn"
              className="bg-gradient-to-br from-green-300 to-blue-500 play-pause-btn"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <FontAwesomeIcon
                  icon={faPause}
                  className="text-white"
                  size="lg"
                  style={{ zIndex: 2 }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faPlay}
                  className="text-white"
                  size="lg"
                  style={{ zIndex: 2 }}
                />
              )}
            </button>
            <div className="ripple-effect"></div>
          </div>

          <button
            id="seekForwardBtn"
            className="seek-btn"
            onClick={() => ((audioPlayerRef as any).current.currentTime += 15)}
          >
            <FontAwesomeIcon
              icon={faRotateRight}
              className="text-white"
              size="lg"
              style={{ maxHeight: "50px" }}
            />
          </button>

          <div className="seek-bar-container">
            <input
              type="range"
              ref={progressBarRef}
              value={(currentTime / duration) * 100 || 0}
              onChange={handleSeek as any}
              className="progress-bar"
            />
            <div className="time-display">
              <span>{formatTime(currentTime)}</span>
              <span>-{formatTime(duration - currentTime)}</span>
            </div>
          </div>
        </div>
      )}
      <div className="media-info">
        <span id="mediaTitle">{title}</span>
        <span id="mediaLength">{Math.ceil(duration / 60)} min</span>
      </div>
      <audio ref={audioPlayerRef} controls hidden>
        <source src={audioSrc} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default MeditationPlayer;
