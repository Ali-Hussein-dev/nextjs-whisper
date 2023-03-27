import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import React from 'react';

const useRecorder = () => {
  const fetcher = async (audioFile) => {
    const formData = new FormData();
    formData.append('file', audioFile, 'audio.wav');
    return fetch('/api/whisper', {
      method: 'POST',
      body: formData,
    }).then((res) => res.json());
  };
  const recorderControls = useAudioRecorder();
  const { startRecording, stopRecording, recordingBlob, isRecording } =
    recorderControls;
  const [transcript, setTranscript] = React.useState(null);
  React.useEffect(() => {
    if (recordingBlob) {
      fetcher(recordingBlob)
        .then((res) => {
          setTranscript(res.text);
          return res;
        })
        .catch((err) => console.error(err));
    }
  }, [recordingBlob, isRecording]);
  return {
    startRecording,
    stopRecording,
    fetcher,
    isRecording,
    transcript,
  };
};

export default function Home() {
  const { startRecording, stopRecording, isRecording } = useRecorder();
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main>
        <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Recording...' : 'Record'}{' '}
        </button>
      </main>
    </div>
  );
}
